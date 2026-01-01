import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { PRICING, getStripePriceId, PlanTier } from '@/lib/pricing';

/**
 * Create Stripe Checkout Session
 * POST /api/stripe/checkout
 * 
 * Body: { plan: PlanTier, billing: 'monthly' | 'yearly', userId: string, isFounder?: boolean }
 */
export async function POST(req: NextRequest) {
    try {
        const stripe = getStripe();
        const { plan, billing = 'monthly', userId, isFounder = false } = await req.json();

        // Validate plan
        if (!plan || !PRICING[plan as PlanTier]) {
            return NextResponse.json(
                { error: 'Invalid plan selected' },
                { status: 400 }
            );
        }

        // Free tier doesn't need checkout
        if (plan === 'curioso') {
            return NextResponse.json(
                { error: 'Free tier does not require payment' },
                { status: 400 }
            );
        }

        // Get user email from Supabase
        let customerEmail = '';
        if (userId) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('email, full_name')
                .eq('id', userId)
                .single();

            if (profile?.email) {
                customerEmail = profile.email;
            }
        }

        // Get the appropriate Stripe price ID
        const priceId = getStripePriceId(plan as PlanTier, isFounder, billing);

        if (!priceId || priceId.includes('placeholder')) {
            return NextResponse.json(
                { error: 'Stripe prices not configured. Please contact support.' },
                { status: 500 }
            );
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: customerEmail || undefined,
            client_reference_id: userId,
            metadata: {
                userId,
                plan,
                billing,
                isFounder: isFounder.toString(),
            },
            subscription_data: {
                metadata: {
                    userId,
                    plan,
                    isFounder: isFounder.toString(),
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/dashboard/billing?canceled=true`,
            allow_promotion_codes: true,
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
