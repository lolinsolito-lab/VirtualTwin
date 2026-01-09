import { NextResponse } from 'next/server';
import { getUserChannelCredentials, sendWhatsAppMessage, saveMessage } from '@/lib/whatsapp';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { phone, message, userId, conversationId } = await req.json();

        if (!phone || !message || !userId) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Recupera credenziali utente
        const credentials = await getUserChannelCredentials(userId);

        if (!credentials) {
            return NextResponse.json({ error: 'WhatsApp credentials not found' }, { status: 404 });
        }

        // 2. Invia messaggio via 360Dialog
        const success = await sendWhatsAppMessage(phone, message, credentials.apiKey);

        if (!success) {
            return NextResponse.json({ error: 'Failed to send message via WhatsApp' }, { status: 500 });
        }

        // 3. Salva messaggio nel DB se abbiamo conversationId
        if (conversationId) {
            await saveMessage(conversationId, 'outbound', message, false); // aiGenerated = false
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API Send] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
