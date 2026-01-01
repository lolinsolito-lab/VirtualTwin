import { NextResponse } from 'next/server';
import { parseIncomingMessage, processChannelMessage, sendMessage } from '@/lib/channels';
import { supabase } from '@/lib/supabase';
import { findOrCreateLead, findOrCreateConversation, saveMessage, getConversationHistory } from '@/lib/whatsapp';

/**
 * Facebook Messenger Webhook
 * 
 * Setup in Meta Developer Console:
 * 1. Create a Facebook App with Messenger API
 * 2. Add webhook subscription for 'messages' field
 * 3. Set verify token in env as META_WEBHOOK_VERIFY_TOKEN
 */

// GET: Webhook verification (required by Meta)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('[Messenger] Webhook verified');
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// POST: Receive messages
export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // Acknowledge immediately (Meta requires fast response)
        const responsePromise = processMessengerMessage(payload);

        // Return 200 immediately, process in background
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[Messenger] Webhook Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

async function processMessengerMessage(payload: any) {
    try {
        // Parse the incoming message
        const message = parseIncomingMessage('messenger', payload);
        if (!message || !message.text) {
            console.log('[Messenger] No text message to process');
            return;
        }

        // Get page ID from payload to identify tenant
        const pageId = payload.entry?.[0]?.id;
        if (!pageId) return;

        // Find tenant by Facebook page ID
        const { data: channel } = await supabase
            .from('channels')
            .select('tenant_id')
            .eq('page_id', pageId)
            .eq('channel_type', 'messenger')
            .single();

        if (!channel) {
            console.error('[Messenger] No tenant found for page:', pageId);
            return;
        }

        const tenantId = channel.tenant_id;

        // Find or create lead
        const lead = await findOrCreateLead(tenantId, message.senderId, message.senderName || 'Facebook User');

        // Find or create conversation
        const conversation = await findOrCreateConversation(tenantId, lead.id);

        // Save inbound message
        await saveMessage(conversation.id, 'inbound', message.text, false);

        // Get conversation history
        const history = await getConversationHistory(conversation.id);

        // Get bot settings
        const { data: botSettings } = await supabase
            .from('settings_bot')
            .select('*')
            .eq('tenant_id', tenantId)
            .single();

        // Process with AI
        const aiResponse = await processChannelMessage(
            tenantId,
            lead.id,
            conversation.id,
            message,
            history,
            botSettings
        );

        // Save outbound message
        if (aiResponse.reply) {
            await saveMessage(conversation.id, 'outbound', aiResponse.reply, true);
        }

        console.log(`[Messenger] Processed message from ${message.senderId}`);

    } catch (error) {
        console.error('[Messenger] Processing Error:', error);
    }
}
