import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { SETUP_PREMIUM } from '@/lib/stripeConfig';

/**
 * Create Stripe Checkout Session for Setup Premium (One-time payment)
 * POST /api/stripe/setup-premium-checkout
 * 
 * Body: { userId?: string, email?: string }
 * 
 * This is a separate checkout for the Setup Premium €99 add-on
 */
export async function POST(req: NextRequest) {
    try {
        const stripe = getStripe();
        const body = await req.json();
        const { userId, email } = body;

        console.log('[Setup Premium Checkout] Creating session...');

        // Create one-time payment session for Setup Premium
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{
                price: SETUP_PREMIUM.promoPriceId, // €99 promo price
                quantity: 1,
            }],
            customer_email: email || undefined,
            client_reference_id: userId,
            metadata: {
                userId,
                product: 'setup_premium',
                type: 'addon',
                source: 'setup_premium_checkout'
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/dashboard/onboarding?setup_success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/start?setup_canceled=true`,
            allow_promotion_codes: true,
        });

        console.log('[Setup Premium Checkout] Session created:', session.id);

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });

    } catch (error: any) {
        console.error('[Setup Premium Checkout] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
