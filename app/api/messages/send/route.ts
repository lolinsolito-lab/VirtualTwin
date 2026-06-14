import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage, saveMessage, findOrCreateConversation, getUserChannelCredentials } from '@/lib/whatsapp';
import { authenticateRequest } from '@/lib/apiAuth';

export async function POST(req: Request) {
    try {
        // 🔐 Require authenticated session
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const { phone, message, userId, conversationId } = await req.json();

        if (!phone || !message || !userId) {
            return NextResponse.json({ error: 'Missing parameters: phone, message and userId are required.' }, { status: 400 });
        }

        // 🔐 Ensure the authenticated user matches the request userId
        if (auth.user.id !== userId) {
            return NextResponse.json({ error: 'Non puoi inviare messaggi per conto di altri utenti.' }, { status: 403 });
        }

        // 1. Recupera credenziali utente
        const credentials = await getUserChannelCredentials(userId);

        if (!credentials) {
            return NextResponse.json({ error: 'WhatsApp credentials not found' }, { status: 404 });
        }

        // 2. Invia il messaggio via WhatsApp (360dialog)
        const success = await sendWhatsAppMessage(phone, message, credentials.apiKey);

        if (!success) {
            return NextResponse.json({ error: 'Failed to send message via WhatsApp' }, { status: 500 });
        }

        // 3. Sovereign Hub: Manage conversation
        let activeConvId = conversationId;
        if (!activeConvId) {
            const conv = await findOrCreateConversation(userId, phone, 'Contatto Manuale');
            activeConvId = conv.id;
        }

        // 4. Salva il messaggio nel database come 'outbound'
        await saveMessage(activeConvId, 'outbound', message, false);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API Messages Send] Error:', error);
        return NextResponse.json({ error: error.message || 'Errore interno del server' }, { status: 500 });
    }
}
