import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { OVERAGE_PRICING, HARD_CAPS } from '@/lib/overage-pricing';

/**
 * Overage Checkout API
 * POST /api/overage/checkout
 * 
 * Creates a Stripe Checkout session for purchasing extra capacity
 */

// Stripe Price IDs for overage packages
// TODO: Replace with real Stripe Price IDs from dashboard
const OVERAGE_PRICE_IDS: Record<string, Record<string, string[]>> = {
    conquistatore: {
        channels: [
            'price_overage_conq_channels_5',    // +5 canali €20
            'price_overage_conq_channels_10',   // +10 canali €35
            'price_overage_conq_channels_20',   // +20 canali €60
        ],
        conversations: [
            'price_overage_conq_conv_5000',     // +5000 conv €30
        ],
    },
    imperatore: {
        channels: [
            'price_overage_imp_channels_10',    // +10 canali €50
            'price_overage_imp_channels_25',    // +25 canali €100
        ],
        clones: [
            'price_overage_imp_clones_5',       // +5 cloni €50
        ],
        conversations: [
            'price_overage_imp_conv_50000',     // +50K conv €30
            'price_overage_imp_conv_100000',    // +100K conv €50
        ],
    },
};

export async function POST(req: NextRequest) {
    try {
        const { type, packageIndex } = await req.json();

        // Validate input
        if (!type || packageIndex === undefined) {
            return NextResponse.json(
                { error: 'Missing type or packageIndex' },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get auth token from header
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, plan_tier, stripe_customer_id, overage_channels, overage_clones')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Validate tier eligibility
        const tier = profile.plan_tier;
        if (!['conquistatore', 'imperatore'].includes(tier)) {
            return NextResponse.json(
                { error: 'Overage packages only available for Conquistatore and Imperatore tiers' },
                { status: 403 }
            );
        }

        // Get package details
        const tierOverage = OVERAGE_PRICING[tier];
        const packages = tierOverage?.[type as keyof typeof tierOverage];

        if (!packages || !packages[packageIndex]) {
            return NextResponse.json(
                { error: 'Invalid package selection' },
                { status: 400 }
            );
        }

        const selectedPackage = packages[packageIndex];

        // Check hard caps
        const hardCap = HARD_CAPS[tier as keyof typeof HARD_CAPS]?.[type as keyof (typeof HARD_CAPS)['conquistatore']];
        if (hardCap !== -1 && hardCap !== undefined) {
            const currentOverage = type === 'channels' ? (profile.overage_channels || 0) :
                type === 'clones' ? (profile.overage_clones || 0) : 0;
            const baseLimit = tier === 'conquistatore' ? 10 : 25;
            const afterPurchase = baseLimit + currentOverage + selectedPackage.amount;

            if (afterPurchase > hardCap) {
                return NextResponse.json(
                    { error: `Would exceed hard cap of ${hardCap}. Upgrade to higher tier.` },
                    { status: 400 }
                );
            }
        }

        // Get Stripe Price ID
        const priceId = OVERAGE_PRICE_IDS[tier]?.[type]?.[packageIndex];
        if (!priceId) {
            return NextResponse.json(
                { error: 'Price not configured for this package' },
                { status: 500 }
            );
        }

        // Create Stripe Checkout Session
        const stripe = getStripe();

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: profile.stripe_customer_id || undefined,
            customer_email: !profile.stripe_customer_id ? user.email : undefined,
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            metadata: {
                userId: user.id,
                overageType: type,
                overageAmount: String(selectedPackage.amount),
                packageIndex: String(packageIndex),
                tier: tier,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/channels?overage=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/channels?overage=canceled`,
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });

    } catch (error: any) {
        console.error('[Overage Checkout] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
