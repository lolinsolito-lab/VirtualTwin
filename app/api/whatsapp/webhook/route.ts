
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
import {
    checkMessageLimit,
    incrementMessageUsage,
    getBlockedAutoReply,
    LimitStatus
} from '@/lib/limits/messageLimitChecker';
import { sendLimitNotificationEmail } from '@/lib/emails/limitEmails';

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

        // 4. 🎯 CHECK MESSAGE LIMIT (Intelligent Upsell System)
        const limitCheck = await checkMessageLimit(userId);

        console.log(`[Limits] User ${userId}: ${limitCheck.status} (${limitCheck.used}/${limitCheck.limit} = ${Math.round(limitCheck.percentage)}%)`);

        // 4a. Get owner profile for notifications
        const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('email, full_name, business_name, subscription_tier')
            .eq('id', userId)
            .single();

        // 4b. Send notification email if needed
        if (limitCheck.shouldNotifyOwner && ownerProfile && limitCheck.nextTier) {
            console.log(`[Limits] 📧 Sending ${limitCheck.status} notification to ${ownerProfile.email}`);

            await sendLimitNotificationEmail(limitCheck.status, {
                userName: ownerProfile.full_name || 'there',
                userEmail: ownerProfile.email,
                used: limitCheck.used,
                limit: limitCheck.limit,
                remaining: limitCheck.remaining,
                tier: ownerProfile.subscription_tier || 'curioso',
                nextTier: limitCheck.nextTier,
                businessName: ownerProfile.business_name
            });
        }

        // 4c. 🔴 IF EXCEEDED - Block and send pause message
        if (limitCheck.shouldBlock) {
            console.warn(`[Limits] ❌ BLOCKED: User ${userId} exceeded limit (${limitCheck.used}/${limitCheck.limit})`);

            // Send pause message to lead
            const leadName = fullName ? fullName.split(' ')[0] : '';
            const pauseMessage = getBlockedAutoReply(ownerProfile?.business_name);

            await sendWhatsAppMessage(phone, pauseMessage, credentials.apiKey);

            // Log blocked message
            const lead = await findOrCreateLead(userId, phone, fullName || 'Contatto WhatsApp');
            const conversation = await findOrCreateConversation(userId, lead.id);

            await saveMessage(conversation.id, 'inbound', text || '[message blocked - limit exceeded]');
            await saveMessage(conversation.id, 'outbound', '[AUTO] Limite raggiunto - messaggio pausa inviato', true);

            return NextResponse.json({
                success: true,
                blocked: true,
                reason: 'Message limit exceeded',
                status: limitCheck.status
            });
        }

        // 🟢 UNDER LIMIT - Process normally

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

        // 12. 📊 INCREMENT MESSAGE USAGE (dopo risposta riuscita)
        await incrementMessageUsage(userId);
        console.log(`[Limits] ✅ Incremented usage for ${userId}: ${limitCheck.used + 1}/${limitCheck.limit}`);

        // 13. Log status for monitoring
        if (limitCheck.status !== 'ok') {
            console.log(`[Limits] ⚠️ User ${userId} in ${limitCheck.status.toUpperCase()} status after this message`);
        }

        // 14. Azioni Speciali (Notifiche Owner per lead caldi)
        if (aiResponse.shouldNotifyOwner) {
            console.log(`[ALERTA ELITE] Lead caldissimo rilevato: ${phone}`);
            // TODO: Trigger email via Resend
        }

        return NextResponse.json({
            success: true,
            limitStatus: limitCheck.status,
            usage: `${limitCheck.used + 1}/${limitCheck.limit}`
        });

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
