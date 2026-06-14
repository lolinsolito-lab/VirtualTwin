/**
 * Seed Channel Add-ons API
 * 
 * POST /api/admin/seed-channel-addons
 * Creates Stripe products and prices, then saves to DB
 */

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { CHANNEL_ADDONS } from '@/lib/channelAddons';
import { authenticateAdminRequest } from '@/lib/apiAuth';

export async function POST(req: Request) {
    try {
        // Verify admin (in production, add proper auth)
        const auth = await authenticateAdminRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const results = [];

        for (const [key, addon] of Object.entries(CHANNEL_ADDONS)) {
            console.log(`[Seed] Creating channel addon: ${addon.name}`);

            // 1. Create Stripe Product
            const product = await stripe.products.create({
                name: addon.name,
                description: addon.description,
                metadata: {
                    type: 'channel_addon',
                    channel_type: addon.channelType,
                    addon_id: addon.id,
                    min_tier: addon.minTier
                }
            });

            // 2. Create Monthly Price
            const monthlyPrice = await stripe.prices.create({
                product: product.id,
                unit_amount: addon.monthlyPrice * 100, // Convert to cents
                currency: 'eur',
                recurring: { interval: 'month' },
                metadata: {
                    addon_id: addon.id,
                    billing_period: 'monthly'
                }
            });

            // 3. Create Yearly Price
            const yearlyPrice = await stripe.prices.create({
                product: product.id,
                unit_amount: addon.yearlyPrice * 100,
                currency: 'eur',
                recurring: { interval: 'year' },
                metadata: {
                    addon_id: addon.id,
                    billing_period: 'yearly'
                }
            });

            // 4. Save to DB
            const { data: dbAddon, error } = await supabase
                .from('addons')
                .upsert({
                    id: addon.id,
                    name: addon.name,
                    description: addon.description,
                    icon: addon.channelType,
                    product_type: 'channel_addon',
                    promo_price: addon.monthlyPrice * 100, // Store in cents
                    regular_price: addon.monthlyPrice * 100,
                    stripe_product_id: product.id,
                    stripe_promo_price_id: monthlyPrice.id,
                    stripe_regular_price_id: yearlyPrice.id,
                    features: addon.features,
                    available_for_tiers: ['conquistatore', 'imperatore', 'sovereignty'],
                    pre_selected_for: [],
                    is_active: addon.isActive,
                    is_recommended: false,
                    display_order: Object.keys(CHANNEL_ADDONS).indexOf(key),
                    delivery_url: null,
                    delivery_instructions: `Canale ${addon.name} ora disponibile nella sezione Canali`,
                    metadata: {
                        channel_type: addon.channelType,
                        min_tier: addon.minTier,
                        available_from: addon.availableFrom
                    }
                }, { onConflict: 'id' })
                .select()
                .single();

            if (error) {
                console.error(`[Seed] DB Error for ${addon.name}:`, error);
            }

            results.push({
                addon: addon.name,
                stripe_product_id: product.id,
                stripe_monthly_price_id: monthlyPrice.id,
                stripe_yearly_price_id: yearlyPrice.id,
                db_saved: !error,
                db_id: dbAddon?.id
            });

            console.log(`[Seed] ✅ Created ${addon.name}: ${monthlyPrice.id}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Channel add-ons seeded successfully',
            results
        });

    } catch (error: any) {
        console.error('[Seed] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to seed channel add-ons' },
            { status: 500 }
        );
    }
}

// GET - List current channel add-ons from DB
export async function GET(req: Request) {
    try {
        const auth = await authenticateAdminRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const { data: addons, error } = await supabase
            .from('addons')
            .select('*')
            .eq('product_type', 'channel_addon')
            .order('display_order');

        if (error) throw error;

        return NextResponse.json({ addons });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
