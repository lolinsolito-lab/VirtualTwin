
import { NextResponse } from 'next/server';
import {
    verifyWhatsAppSignature,
    extractMessageData,
    getCredentialsByWabaId,
    findOrCreateLead,
    findOrCreateConversation,
    saveMessage,
    getLastMessages,
    sendWhatsAppMessage,
    downloadWhatsAppMedia
} from '@/lib/whatsapp';
import { processConversation } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

// Limiti messaggi per tier
const TIER_LIMITS: Record<string, number> = {
    'curioso': 100,
    'esploratore': 500,
    'pioniere': 2000,
    'conquistatore': 5000,
    'imperatore': 50000,
};

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const headers = req.headers;

        // 1. Validazione payload
        if (!verifyWhatsAppSignature(payload, headers)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Estrazione dati messaggio
        const { phone, text, fullName, type, mediaId, mimeType } = extractMessageData(payload);

        if (!phone) {
            return NextResponse.json({ success: true, message: 'Invalid payload' });
        }

        // 3. Identificazione Utente/Tenant dal WABA ID
        const wabaId = payload.metadata?.display_phone_number ||
            payload.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id ||
            'default';

        const tenantData = await getCredentialsByWabaId(wabaId);

        if (!tenantData) {
            console.error(`[360Dialog] Nessun utente trovato per WABA ID: ${wabaId}`);
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        const { userId, credentials } = tenantData;

        // 4. Controllo Limiti Tier
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier, is_founder, messages_used')
            .eq('id', userId)
            .single();

        if (profile) {
            const tier = profile.subscription_tier || 'curioso';
            const limit = profile.is_founder ? 999999 : (TIER_LIMITS[tier] || 100);
            const used = profile.messages_used || 0;

            if (used >= limit) {
                console.warn(`[360Dialog] ⚠️ Limite messaggi raggiunto per user ${userId} (${used}/${limit})`);

                // Nome del lead per personalizzazione
                const leadName = fullName ? fullName.split(' ')[0] : '';
                const greeting = leadName ? `Ciao ${leadName}! 👋` : 'Ciao! 👋';

                // Messaggio marketing per upgrade intelligente
                const upgradeMessage = `${greeting}

Grazie per il tuo messaggio! 🙏

Il nostro assistente AI è temporaneamente in pausa per questo mese. Ma non ti lasciamo senza risposta!

🗓️ *Prenota una chiamata gratuita con Michael*, il nostro fondatore:
👉 https://calendly.com/virtualtwin/consulenza

Oppure scrivi a support@virtualtwin.app e ti risponderemo entro 24h.

A presto! ✨`;

                await sendWhatsAppMessage(phone, upgradeMessage, credentials.apiKey);
                return NextResponse.json({ success: true, message: 'Limit reached' });
            }
        }

        // 5. Download Media (se presente)
        let mediaBuffer: Buffer | undefined = undefined;
        if (mediaId && (type === 'voice' || type === 'audio' || type === 'image')) {
            const downloaded = await downloadWhatsAppMedia(mediaId, credentials.apiKey);
            if (downloaded) mediaBuffer = downloaded as Buffer;
        }

        // 6. Lead & Conversation management
        const lead = await findOrCreateLead(userId, phone, fullName || 'Contatto WhatsApp');
        const conversation = await findOrCreateConversation(userId, lead.id);

        // 7. Log messaggio Inbound
        await saveMessage(conversation.id, 'inbound', text);

        // 8. Recupero contesto e AI Settings
        const history = await getLastMessages(conversation.id);

        // Recupera personalità AI e FAQs dell'utente
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('business_name, business_sector, ai_tone')
            .eq('id', userId)
            .single();

        const { data: faqs } = await supabase
            .from('clone_faqs')
            .select('question, answer')
            .eq('user_id', userId)
            .eq('is_active', true);

        // Costruisci contesto business personalizzato
        let businessContext = `VirtualTwin AI Assistant`;
        if (userProfile) {
            businessContext = `Assistente AI di ${userProfile.business_name || 'VirtualTwin'}. `;
            businessContext += `Settore: ${userProfile.business_sector || 'Generale'}. `;
            businessContext += `Tono: ${userProfile.ai_tone || 'professionale'}. `;
        }
        if (faqs && faqs.length > 0) {
            businessContext += `\n\nFAQ:\n`;
            faqs.forEach(faq => {
                businessContext += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
            });
        }

        // 9. Orchestrazione AI (Gemini 2.0)
        const aiResponse = await processConversation(history, text || "", businessContext, mediaBuffer, mimeType);

        // 10. Invio risposta WhatsApp con API key dell'utente
        await sendWhatsAppMessage(phone, aiResponse.reply, credentials.apiKey);

        // 11. Log messaggio Outbound
        await saveMessage(conversation.id, 'outbound', aiResponse.reply, true);

        // 12. Incrementa contatore messaggi usati
        if (profile) {
            await supabase
                .from('profiles')
                .update({ messages_used: (profile.messages_used || 0) + 1 })
                .eq('id', userId);
        }

        // 13. Azioni Speciali (Notifiche Owner)
        if (aiResponse.shouldNotifyOwner) {
            console.log(`[ALERTA ELITE] Lead caldissimo rilevato: ${phone}`);
            // TODO: Trigger email via Resend o webhook Make.com
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Handler per la verifica del webhook (necessario per 360Dialog/Meta)
export async function GET(req: Request) {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    // 360Dialog/Meta Webhook Verification
    if (mode === 'subscribe') {
        const verifyToken = process.env.D360_WEBHOOK_SECRET || 'virtualtwin_sovereign';

        if (token === verifyToken) {
            console.log('[360Dialog] ✅ Webhook verificato con successo');
            return new Response(challenge, { status: 200 });
        } else {
            console.warn('[360Dialog] ❌ Token di verifica non valido');
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return NextResponse.json({
        status: 'Sovereign Webhook Active',
        timestamp: new Date().toISOString()
    });
}

