import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin as supabase } from '@/lib/supabase';

/**
 * Claim Account API
 * POST /api/auth/claim-account
 * 
 * Sets password for a user created by Stripe Webhook without requiring email link.
 */
export async function POST(req: Request) {
    try {
        const { sessionId, password } = await req.json();

        if (!sessionId || !password) {
            return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
        }

        const stripe = getStripe();

        // 1. Verify Stripe Session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
            return NextResponse.json({ error: 'Pagamento non verificato' }, { status: 403 });
        }

        const email = session.customer_email || session.customer_details?.email;

        if (!email) {
            return NextResponse.json({ error: 'Email non trovata nella sessione' }, { status: 404 });
        }

        // 2. Find User in Supabase
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return NextResponse.json({ error: 'Utente non ancora creato. Attendi 5 secondi e riprova.' }, { status: 404 });
        }

        // 3. Update User Password & Meta
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password: password,
            email_confirm: false, // Force email confirmation after onboarding
            user_metadata: { ...user.user_metadata, claimed_at: new Date().toISOString() }
        });

        if (updateError) {
            console.error('[Claim Account] Update error:', updateError);
            return NextResponse.json({ error: 'Errore durante l\'aggiornamento dell\'account' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            email,
            message: 'Account attivato con successo. Procedi al login automatico.'
        });

    } catch (error: any) {
        console.error('[Claim Account] Unexpected error:', error);
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}
