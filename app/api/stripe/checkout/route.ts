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
        const body = await req.json();

        // Support both old format {plan, billing, userId} and new format {priceId, tier}
        const { plan, billing = 'monthly', userId, isFounder = false, priceId: directPriceId, tier } = body;

        // Scenario A: Direct priceId provided (new format from homepage/start)
        if (directPriceId) {
            console.log(`[Checkout] Direct priceId mode: ${directPriceId}, tier: ${tier || 'public'}`);

            // Validate priceId format
            if (!directPriceId.startsWith('price_')) {
                return NextResponse.json(
                    { error: 'Invalid Stripe price ID format' },
                    { status: 400 }
                );
            }

            // Create session with direct priceId
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: directPriceId, quantity: 1 }],
                metadata: {
                    userId,
                    plan: tier === 'aspirante' ? 'aspirante' : (plan || tier), // Ensure plan is set
                    tier: tier || 'public',
                    isFounder: (tier === 'founder').toString(),
                    source: 'direct_priceId_checkout'
                },
                subscription_data: {
                    trial_period_days: 14,
                    metadata: {
                        userId,
                        plan: tier === 'aspirante' ? 'aspirante' : (plan || tier),
                        tier: tier || 'public',
                        isFounder: (tier === 'founder').toString(),
                    },
                },
                success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/dashboard/onboarding?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/?canceled=true`,
                allow_promotion_codes: true,
                billing_address_collection: 'auto',
            });

            return NextResponse.json({
                sessionId: session.id,
                url: session.url,
            });
        }

        // Scenario B: Legacy format with plan name (old format for backward compatibility)
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

        // SMART LOGIC: If isFounder is true, check if waves are still available
        let finalIsFounder = isFounder;
        if (isFounder && plan !== 'aspirante') {
            const { getCurrentWave } = await import('@/lib/waves');
            const currentWave = await getCurrentWave();
            if (!currentWave) {
                console.warn(`[Checkout] User requested Founder for ${plan} but all waves sold out. Falling back to public.`);
                finalIsFounder = false;
            }
        }

        // Get the appropriate Stripe price ID
        const priceId = getStripePriceId(plan as PlanTier, finalIsFounder, billing);

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
                isFounder: finalIsFounder.toString(),
            },
            subscription_data: {
                trial_period_days: 14,
                metadata: {
                    userId,
                    plan,
                    isFounder: finalIsFounder.toString(),
                },
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/dashboard/onboarding?success=true&session_id={CHECKOUT_SESSION_ID}`,
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
