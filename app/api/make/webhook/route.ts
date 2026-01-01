import { NextResponse } from 'next/server';

/**
 * Make.com Imperium Trigger Endpoint
 * 
 * Riceve notifiche di eventi da Make.com (es. richiesta follow-up)
 * e può essere usato come fonte per scenari Make (es. lead sync).
 */
export async function POST(req: Request) {
    try {
        const { event, data, secret } = await req.json();

        // Semplice validazione del secret (opzionale, configurabile via env)
        if (process.env.MAKE_WEBHOOK_SECRET && secret !== process.env.MAKE_WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
        }

        switch (event) {
            case 'LEAD_SYNC':
                // Make.com può richiedere la lista dei lead per sincronizzazione
                // In un caso reale, qui si farebbe una query a Supabase
                console.log('[Make.com] Lead Sync Requested:', data);
                return NextResponse.json({ success: true, message: 'Sync acknowledged' });

            case 'FOLLOW_UP':
                // Make.com segnala che un lead necessita di follow-up
                console.log('[Make.com] Follow-up Triggered for Lead:', data.leadId);
                // Qui si potrebbe invocare la logica di invio messaggio
                return NextResponse.json({ success: true, message: 'Follow-up queued' });

            default:
                return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Make Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET: Risponde a Make.com per verificare che l'endpoint sia attivo
 */
export async function GET() {
    return NextResponse.json({
        status: 'active',
        service: 'VirtualTwin Imperium',
        events_supported: ['LEAD_SYNC', 'FOLLOW_UP']
    });
}
