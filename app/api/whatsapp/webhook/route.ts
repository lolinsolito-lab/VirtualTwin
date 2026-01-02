
import { NextResponse } from 'next/server';
import {
    verifyWhatsAppSignature,
    extractMessageData,
    getTenantByWabaId,
    findOrCreateLead,
    findOrCreateConversation,
    saveMessage,
    getLastMessages,
    sendWhatsAppMessage,
    downloadWhatsAppMedia
} from '@/lib/whatsapp';
import { processConversation } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const headers = req.headers;

        // 1. Validazione
        if (!verifyWhatsAppSignature(payload, headers)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Estrazione dati
        const { phone, text, fullName, type, mediaId, mimeType } = extractMessageData(payload);

        if (!phone) {
            return NextResponse.json({ success: true, message: 'Invalid payload' });
        }

        let mediaBuffer: Buffer | undefined = undefined;
        if (mediaId && (type === 'voice' || type === 'audio' || type === 'image')) {
            const downloaded = await downloadWhatsAppMedia(mediaId);
            if (downloaded) mediaBuffer = downloaded as Buffer;
        }

        // 3. Identificazione Tenant (Multi-tenancy)
        // Nota: In produzione il WABA ID viene dal payload di 360dialog
        const wabaId = payload.metadata?.display_phone_number || 'default';
        const tenantId = await getTenantByWabaId(wabaId);

        if (!tenantId) {
            console.error(`Tenant not found for WABA ID: ${wabaId}`);
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
        }

        // 4. Lead & Conversation management
        const lead = await findOrCreateLead(tenantId, phone, fullName || 'Contatto WhatsApp');
        const conversation = await findOrCreateConversation(tenantId, lead.id);

        // 5. Log messaggio Inbound
        await saveMessage(conversation.id, 'inbound', text);

        // 6. Recupero contesto e Bot Settings
        const history = await getLastMessages(conversation.id);
        const { data: botSettings } = await supabase
            .from('settings_bot')
            .select('*')
            .eq('tenant_id', tenantId)
            .single();

        const businessContext = botSettings ?
            `Nome Bot: ${botSettings.bot_name}. Tono: ${botSettings.tone}. Info Business: ${JSON.stringify(botSettings.business_info)}` :
            "VirtualTwin Sovereign AI - Automazione WhatsApp d'Elite";

        // 7. Orchestrazione AI (Gemini 2.0)
        const aiResponse = await processConversation(history, text || "", businessContext, mediaBuffer, mimeType);

        // 8. CRM Auto-update basato su AI Insights
        if (aiResponse.insights) {
            const updateData: any = {};
            if (aiResponse.insights.suggestedStage) {
                // Logica per mappare lo stage name stringa a un UUID reale nella pipeline
                const { data: stage } = await supabase
                    .from('pipeline_stages')
                    .select('id')
                    .eq('tenant_id', tenantId)
                    .ilike('name', `%${aiResponse.insights.suggestedStage}%`)
                    .limit(1)
                    .single();

                if (stage) updateData.stage_id = stage.id;
            }

            if (Object.keys(updateData).length > 0) {
                await supabase.from('leads').update(updateData).eq('id', lead.id);
            }

            // Aggiorna Lead Details
            await supabase.from('lead_details').upsert({
                lead_id: lead.id,
                desires: aiResponse.insights.desires,
                problems: aiResponse.insights.problems,
                budget_range: aiResponse.insights.budgetRange,
                updated_at: new Date().toISOString()
            }, { onConflict: 'lead_id' });
        }

        // 9. Invio risposta WhatsApp
        await sendWhatsAppMessage(phone, aiResponse.reply);

        // 10. Log messaggio Outbound
        await saveMessage(conversation.id, 'outbound', aiResponse.reply, true);

        // 11. Azioni Speciali (Notifiche / Automazioni)
        if (aiResponse.shouldNotifyOwner) {
            console.log(`[ALERTA ELITE] Lead caldissimo rilevato: ${phone}`);
            // Qui triggereremmo Resend o un Webhook Make.com
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
