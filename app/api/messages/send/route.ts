
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWhatsAppMessage, saveMessage, findOrCreateConversation } from '@/lib/whatsapp';

export async function POST(req: Request) {
    try {
        const { leadId, message, tenantId } = await req.json();

        if (!leadId || !message || !tenantId) {
            return NextResponse.json({ error: 'Dati mancanti: leadId, message e tenantId sono richiesti.' }, { status: 400 });
        }

        // 1. Recupera i dettagli del lead (numero di telefono)
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('phone_number')
            .eq('id', leadId)
            .single();

        if (leadError || !lead) {
            return NextResponse.json({ error: 'Lead non trovato.' }, { status: 404 });
        }

        // 2. Trova o crea la conversazione
        const conversation = await findOrCreateConversation(tenantId, leadId);

        // 3. Invia il messaggio via WhatsApp (360dialog)
        const sent = await sendWhatsAppMessage(lead.phone_number, message);

        if (!sent) {
            throw new Error('Errore durante l\'invio del messaggio WhatsApp via 360dialog.');
        }

        // 4. Salva il messaggio nel database come 'outbound' (manuale, non generato da AI)
        await saveMessage(conversation.id, 'outbound', message, false);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Manual Send Error:', error);
        return NextResponse.json({ error: error.message || 'Errore interno del server' }, { status: 500 });
    }
}
