// app/api/stripe/verify-session/route.ts
// Verify Stripe Checkout session after payment
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

/**
 * Verify Stripe Checkout Session
 * GET /api/stripe/verify-session?session_id=xxx
 * 
 * Called from /welcome page to verify payment was successful
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID mancante' },
                { status: 400 }
            );
        }

        const stripe = getStripe();

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'customer'],
        });

        // Check if payment was successful
        if (session.payment_status !== 'paid' && session.status !== 'complete') {
            // Trial subscriptions might not be 'paid' yet
            if (session.status !== 'complete') {
                return NextResponse.json(
                    { error: 'Pagamento non completato' },
                    { status: 400 }
                );
            }
        }

        const customerEmail = session.customer_email ||
            (session.customer_details?.email) ||
            'email@esempio.com';

        return NextResponse.json({
            success: true,
            customer_email: customerEmail,
            plan: session.metadata?.plan || 'pioniere',
            tier: session.metadata?.tier || 'founder',
            isFounder: session.metadata?.isFounder === 'true',
            status: session.status,
            paymentStatus: session.payment_status,
        });

    } catch (error: any) {
        console.error('[Verify Session] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Errore nella verifica della sessione' },
            { status: 500 }
        );
    }
}
