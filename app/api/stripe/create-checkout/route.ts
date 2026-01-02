// app/api/stripe/create-checkout/route.ts
// 👑 Imperial Strategy - Direct checkout without requiring authentication
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { PRICING, getStripePriceId, IMPERIAL_PRICES, FOUNDER_CONFIG, type PlanTier } from '@/lib/pricing';
import { getFounderSpotsLeft } from '@/lib/supabaseHelpers';

/**
 * Create Stripe Checkout Session (No Auth Required)
 * POST /api/stripe/create-checkout
 * 
 * Body: { plan: PlanTier, tier: 'founder' | 'public' }
 * 
 * 👑 Imperial Checkout-First Flow:
 * 1. User selects plan on /founder page
 * 2. Redirects to Stripe Checkout (NO LOGIN REQUIRED)
 * 3. Stripe collects email + payment
 * 4. Webhook creates user account automatically
 * 5. User receives email to set password
 */
export async function POST(req: Request) {
    try {
        const stripe = getStripe();
        const { plan, tier: requestedTier = 'founder' } = await req.json();

        // Validate plan
        if (!plan || !PRICING[plan as PlanTier]) {
            return NextResponse.json(
                { error: 'Piano non valido' },
                { status: 400 }
            );
        }

        // Free tier doesn't need checkout
        if (plan === 'curioso') {
            return NextResponse.json(
                { error: 'Il piano Curioso è gratuito. Registrati direttamente!' },
                { status: 400 }
            );
        }

        // Check if founder spots are still available
        let tier = requestedTier;
        if (requestedTier === 'founder') {
            const spotsLeft = await getFounderSpotsLeft();
            if (spotsLeft <= 0) {
                // Auto-switch to public if no founder spots left
                tier = 'public';
                console.log(`[Create Checkout] No founder spots left, switching to public tier`);
            }
        }

        const isFounder = tier === 'founder';

        // Get the appropriate Stripe price ID from Imperial pricing
        const priceId = getStripePriceId(plan as PlanTier, isFounder, 'monthly');

        if (!priceId || priceId.includes('IMPERIAL_') || priceId.includes('REPLACE')) {
            console.error(`[Create Checkout] Invalid priceId for ${plan}/${tier}:`, priceId);
            return NextResponse.json(
                { error: 'Prezzi Stripe non configurati. Esegui scripts/createImperialStripeProducts.js prima.' },
                { status: 500 }
            );
        }

        // Get display price for logging
        const displayPrice = isFounder
            ? IMPERIAL_PRICES.founder[plan as keyof typeof IMPERIAL_PRICES.founder]
            : IMPERIAL_PRICES.public_2026[plan as keyof typeof IMPERIAL_PRICES.public_2026];

        console.log(`[Create Checkout] Plan: ${plan}, Tier: ${tier}, Price: €${displayPrice}, PriceId: ${priceId}`);

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
            // 14-day trial for all plans
            subscription_data: {
                trial_period_days: 14,
                metadata: {
                    plan,
                    tier,
                    isFounder: isFounder.toString(),
                },
            },
            // Stripe will collect customer email
            billing_address_collection: 'auto',
            allow_promotion_codes: true,
            metadata: {
                plan,
                tier,
                isFounder: isFounder.toString(),
                source: 'imperial_checkout_flow',
                displayPrice: displayPrice.toString(),
            },
            // Success/Cancel URLs
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/welcome?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/founder?canceled=true`,
        });

        console.log(`[Create Checkout] ✅ Session created: ${session.id}`);

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
            tier, // Return actual tier used (in case it was auto-switched)
        });

    } catch (error: any) {
        console.error('[Create Checkout] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Errore durante la creazione del checkout' },
            { status: 500 }
        );
    }
}
