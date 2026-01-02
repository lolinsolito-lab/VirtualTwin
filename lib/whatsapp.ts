
import { supabase } from './supabase';
import { ChatHistoryItem } from './types';

// 360Dialog API Configuration
const D360_BASE_URL = 'https://waba.360dialog.io/v1';

// Interface per credenziali canale
interface ChannelCredentials {
    apiKey: string;
    wabaId: string;
    phoneNumberId: string;
}

/**
 * Recupera le credenziali WhatsApp dell'utente dal database
 * Questo permette multi-tenancy: ogni utente ha le proprie credenziali
 */
export async function getUserChannelCredentials(userId: string): Promise<ChannelCredentials | null> {
    const { data, error } = await supabase
        .from('channels')
        .select('api_key, page_id, phone_number')
        .eq('user_id', userId)
        .eq('channel_type', 'whatsapp')
        .eq('is_active', true)
        .single();

    if (error || !data || !data.api_key) {
        console.warn(`[360Dialog] Nessuna credenziale trovata per user ${userId}`);
        return null;
    }

    return {
        apiKey: data.api_key,
        wabaId: data.page_id || '',
        phoneNumberId: data.phone_number || ''
    };
}

/**
 * Recupera le credenziali a partire dal WABA ID (per webhook incoming)
 */
export async function getCredentialsByWabaId(wabaId: string): Promise<{ userId: string; credentials: ChannelCredentials } | null> {
    const { data, error } = await supabase
        .from('channels')
        .select('user_id, api_key, page_id, phone_number')
        .eq('page_id', wabaId)
        .eq('channel_type', 'whatsapp')
        .eq('is_active', true)
        .single();

    if (error || !data || !data.api_key) {
        // Fallback: prova con env vars (per development/testing)
        const envApiKey = process.env.D360_API_KEY;
        if (envApiKey) {
            console.log('[360Dialog] Usando fallback env vars');
            return {
                userId: 'system',
                credentials: {
                    apiKey: envApiKey,
                    wabaId: process.env.D360_WABA_ID || '',
                    phoneNumberId: process.env.D360_PHONE_NUMBER_ID || ''
                }
            };
        }
        return null;
    }

    return {
        userId: data.user_id,
        credentials: {
            apiKey: data.api_key,
            wabaId: data.page_id || '',
            phoneNumberId: data.phone_number || ''
        }
    };
}

/**
 * Verifica la firma di 360dialog per sicurezza webhook
 * In produzione: validare X-Hub-Signature se configurato
 */
export function verifyWhatsAppSignature(payload: any, headers: Headers) {
    // 360Dialog non richiede signature verification obbligatoria
    // ma possiamo validare che il payload abbia la struttura attesa
    if (!payload || (!payload.messages && !payload.statuses)) {
        console.warn('[360Dialog] Payload non valido ricevuto');
        return false;
    }
    return true;
}

/**
 * Estrae i dati essenziali dal payload di 360dialog
 */
export function extractMessageData(payload: any) {
    // Struttura 360dialog standard
    const message = payload.messages?.[0];
    const contact = payload.contacts?.[0];

    return {
        phone: message?.from,
        text: message?.text?.body,
        fullName: contact?.profile?.name,
        messageId: message?.id,
        type: message?.type, // voice, image, video, text
        mediaId: message?.voice?.id || message?.image?.id || message?.video?.id,
        mimeType: message?.voice?.mime_type || message?.image?.mime_type
    };
}

/**
 * Scarica un file media da 360dialog
 * @param mediaId - ID del media da scaricare
 * @param apiKey - (Opzionale) API key dell'utente. Se non fornita, usa env var
 */
export async function downloadWhatsAppMedia(mediaId: string, apiKey?: string): Promise<Buffer | null> {
    const finalApiKey = apiKey || process.env.D360_API_KEY;

    if (!finalApiKey) {
        console.error('[360Dialog] Nessuna API key disponibile per download media');
        return null;
    }

    try {
        const response = await fetch(`${D360_BASE_URL}/media/${mediaId}`, {
            headers: {
                'D360-API-KEY': finalApiKey
            }
        });

        if (!response.ok) {
            console.error(`[360Dialog] Errore download media: ${response.status}`);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);

    } catch (error) {
        console.error('[360Dialog] Errore download media:', error);
        return null;
    }
}

/**
 * Identifica il tenant (cliente VirtualTwin) dal numero di telefono ricevente (WABA ID)
 */
export async function getTenantByWabaId(wabaId: string) {
    const { data, error } = await supabase
        .from('channels')
        .select('tenant_id')
        .eq('account_id', wabaId)
        .single();

    if (error || !data) return null;
    return data.tenant_id;
}

/**
 * Trova o crea un lead nel CRM basato sul numero di telefono
 */
export async function findOrCreateLead(tenantId: string, phone: string, fullName: string) {
    // Cerca lead esistente
    const { data: existingLead } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('phone_number', phone)
        .single();

    if (existingLead) return existingLead;

    // Crea nuovo lead se non esiste
    const { data: newLead, error } = await supabase
        .from('leads')
        .insert([{
            tenant_id: tenantId,
            phone_number: phone,
            full_name: fullName,
            source: 'whatsapp'
        }])
        .select()
        .single();

    if (error) throw error;
    return newLead;
}

/**
 * Trova o crea una conversazione per il lead
 */
export async function findOrCreateConversation(tenantId: string, leadId: string) {
    const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('lead_id', leadId)
        .single();

    if (existingConv) return existingConv;

    const { data: newConv, error } = await supabase
        .from('conversations')
        .insert([{
            tenant_id: tenantId,
            lead_id: leadId,
            channel_type: 'whatsapp'
        }])
        .select()
        .single();

    if (error) throw error;
    return newConv;
}

/**
 * Salva un messaggio nel database (inbound/outbound)
 */
export async function saveMessage(convId: string, direction: 'inbound' | 'outbound', content: string, aiGenerated = false) {
    await supabase
        .from('messages')
        .insert([{
            conversation_id: convId,
            direction,
            content,
            ai_generated: aiGenerated
        }]);

    // Aggiorna timestamp ultima attività conversazione
    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', convId);
}

/**
 * Recupera lo storico recente della conversazione per l'AI
 */
export async function getLastMessages(convId: string, limit = 10): Promise<ChatHistoryItem[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('direction, content')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error || !data) return [];

    return data.reverse().map(m => ({
        role: m.direction === 'inbound' ? 'user' : 'assistant',
        content: m.content
    }));
}

/**
 * Invia un messaggio via 360dialog API
 * @param phone - Numero telefono destinatario
 * @param text - Testo del messaggio
 * @param apiKey - (Opzionale) API key dell'utente. Se non fornita, usa env var
 */
export async function sendWhatsAppMessage(phone: string, text: string, apiKey?: string): Promise<boolean> {
    // Usa l'API key fornita o fallback a env var
    const finalApiKey = apiKey || process.env.D360_API_KEY;

    if (!finalApiKey) {
        console.error('[360Dialog] Nessuna API key disponibile (né parametro né env var)');
        return false;
    }

    try {
        // Normalizza numero telefono (rimuovi + e spazi)
        const normalizedPhone = phone.replace(/[^\d]/g, '');

        const response = await fetch(`${D360_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'D360-API-KEY': finalApiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: normalizedPhone,
                type: 'text',
                text: { body: text }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`[360Dialog] Errore invio: ${response.status} - ${errorData}`);
            return false;
        }

        const result = await response.json();
        console.log(`[360Dialog] ✅ Messaggio inviato a ${phone}:`, result.messages?.[0]?.id);
        return true;

    } catch (error) {
        console.error('[360Dialog] Errore invio messaggio:', error);
        return false;
    }
}

/**
 * Trigger Make.com Webhook per eventi critici
 * 
 * Chiamare questa funzione dopo:
 * - Nuovo lead qualificato
 * - Cambio di stage nella pipeline
 * - Lead con alto valore rilevato
 */
export async function triggerMakeWebhook(
    eventType: 'NEW_LEAD' | 'STAGE_CHANGE' | 'HIGH_VALUE' | 'FOLLOW_UP_NEEDED',
    leadData: {
        id: string;
        fullName: string;
        phone: string;
        stage?: string;
        estimatedValue?: number;
    }
) {
    const webhookUrl = process.env.MAKE_OUTBOUND_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('[Make.com] Outbound webhook non configurato. Evento ignorato:', eventType);
        return false;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: eventType,
                timestamp: new Date().toISOString(),
                lead: leadData
            })
        });

        if (!response.ok) {
            throw new Error(`Make.com returned status ${response.status}`);
        }

        console.log(`[Make.com] Evento ${eventType} inviato per lead ${leadData.fullName}`);
        return true;

    } catch (error) {
        console.error('[Make.com] Errore invio webhook:', error);
        return false;
    }
}

// Alias for backward compatibility
export const getConversationHistory = getLastMessages;
