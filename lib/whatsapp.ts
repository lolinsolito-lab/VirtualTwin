
import { supabase } from './supabase';
import { ChatHistoryItem } from './types';

// 360Dialog API Configuration
const D360_BASE_URL = 'https://waba.360dialog.io/v1';

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
 */
export async function downloadWhatsAppMedia(mediaId: string): Promise<Buffer | null> {
    const apiKey = process.env.D360_API_KEY;

    if (!apiKey) {
        console.error('[360Dialog] D360_API_KEY non configurata');
        return null;
    }

    try {
        const response = await fetch(`${D360_BASE_URL}/media/${mediaId}`, {
            headers: {
                'D360-API-KEY': apiKey
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
 */
export async function sendWhatsAppMessage(phone: string, text: string): Promise<boolean> {
    const apiKey = process.env.D360_API_KEY;

    if (!apiKey) {
        console.error('[360Dialog] D360_API_KEY non configurata');
        return false;
    }

    try {
        // Normalizza numero telefono (rimuovi + e spazi)
        const normalizedPhone = phone.replace(/[^\d]/g, '');

        const response = await fetch(`${D360_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'D360-API-KEY': apiKey,
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
