import { NextResponse } from 'next/server';
import { parseIncomingMessage, processChannelMessage, sendMessage } from '@/lib/channels';
import { supabase } from '@/lib/supabase';
import { findOrCreateConversation, saveMessage, getConversationHistory } from '@/lib/whatsapp';

/**
 * Instagram Direct Messages Webhook
 */

// GET: Webhook verification (required by Meta)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('[Instagram] Webhook verified');
        return new Response(challenge, { status: 200 });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// POST: Receive messages
export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // Acknowledge immediately (Meta requires fast response)
        processInstagramMessage(payload);

        // Return 200 immediately, process in background
        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('[Instagram] Webhook Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

async function processInstagramMessage(payload: any) {
    try {
        // Parse the incoming message
        const message = parseIncomingMessage('instagram', payload);
        if (!message || !message.text) {
            console.log('[Instagram] No text message to process');
            return;
        }

        // Get page ID from payload to identify user
        const pageId = payload.entry?.[0]?.id;
        if (!pageId) return;

        // Find user by Instagram page ID
        const { data: channel } = await supabase
            .from('channels')
            .select('user_id')
            .eq('page_id', pageId)
            .eq('channel_type', 'instagram')
            .single();

        if (!channel) {
            console.error('[Instagram] No user found for page:', pageId);
            return;
        }

        const userId = channel.user_id;

        // 🏛️ Sovereign Hub: Find or create conversation
        const conversation = await findOrCreateConversation(
            userId,
            message.senderId,
            message.senderName || 'Instagram User',
            'instagram'
        );

        // Save inbound message
        await saveMessage(conversation.id, 'inbound', message.text, false);

        // Get conversation history
        const history = await getConversationHistory(conversation.id);

        // Get bot settings from profile
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('business_name, business_sector, ai_tone')
            .eq('id', userId)
            .single();

        const botSettings = {
            business_context: `Assistente AI di ${userProfile?.business_name || 'VirtualTwin'}. Settore: ${userProfile?.business_sector || 'Generale'}. Tono: ${userProfile?.ai_tone || 'professionale'}.`
        };

        // Process with AI
        const aiResponse = await processChannelMessage(
            userId,
            conversation.id,
            message,
            history,
            botSettings
        );

        // Save outbound message
        if (aiResponse.reply) {
            await saveMessage(conversation.id, 'outbound', aiResponse.reply, true);
        }

        console.log(`[Instagram] Processed message from ${message.senderId}`);

    } catch (error) {
        console.error('[Instagram] Processing Error:', error);
    }
}
