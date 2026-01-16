import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Add-ons API - Full CRUD with automatic Stripe sync
 * 
 * GET /api/admin/addons - List all addons
 * POST /api/admin/addons - Create new addon (+ Stripe Product/Prices)
 * PUT /api/admin/addons - Update addon
 * DELETE /api/admin/addons - Deactivate addon
 */

// GET - List all addons
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get('active') === 'true';

        let query = supabaseAdmin
            .from('addons')
            .select('*')
            .order('display_order', { ascending: true });

        if (activeOnly) {
            query = query.eq('is_active', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ addons: data });
    } catch (error: any) {
        console.error('[Addons API] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new addon with automatic Stripe sync
export async function POST(req: NextRequest) {
    try {
        const stripe = getStripe();
        const body = await req.json();

        const {
            name,
            description,
            icon = 'gift',
            promo_price, // in cents
            regular_price, // in cents
            features = [],
            available_for_tiers = ['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'],
            pre_selected_for = ['entrepreneur', 'conquistatore', 'imperatore'],
            is_recommended = true,
            display_order = 0
        } = body;

        // Validate required fields
        if (!name || !promo_price || !regular_price) {
            return NextResponse.json(
                { error: 'Missing required fields: name, promo_price, regular_price' },
                { status: 400 }
            );
        }

        console.log(`[Addons API] Creating addon: ${name}`);

        // 1. Create Stripe Product
        const product = await stripe.products.create({
            name: `VirtualTwin ${name}`,
            description: description || `${name} add-on for VirtualTwin`,
            metadata: {
                type: 'addon',
                source: 'admin_panel'
            }
        });

        console.log(`[Addons API] ✅ Stripe Product created: ${product.id}`);

        // 2. Create Promo Price
        const promoPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: promo_price,
            currency: 'eur',
            metadata: {
                type: 'promo',
                regular_price: regular_price.toString()
            }
        });

        console.log(`[Addons API] ✅ Promo Price created: ${promoPrice.id} (€${promo_price / 100})`);

        // 3. Create Regular Price
        const regularPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: regular_price,
            currency: 'eur',
            metadata: {
                type: 'regular'
            }
        });

        console.log(`[Addons API] ✅ Regular Price created: ${regularPrice.id} (€${regular_price / 100})`);

        // 4. Save to Supabase with Stripe IDs
        const { data: addon, error: dbError } = await supabaseAdmin
            .from('addons')
            .insert({
                name,
                description,
                icon,
                promo_price,
                regular_price,
                stripe_product_id: product.id,
                stripe_promo_price_id: promoPrice.id,
                stripe_regular_price_id: regularPrice.id,
                features: typeof features === 'string' ? JSON.parse(features) : features,
                available_for_tiers,
                pre_selected_for,
                is_recommended,
                is_active: true,
                display_order
            })
            .select()
            .single();

        if (dbError) throw dbError;

        console.log(`[Addons API] ✅ Addon saved to DB: ${addon.id}`);

        return NextResponse.json({
            success: true,
            addon,
            stripe: {
                productId: product.id,
                promoPriceId: promoPrice.id,
                regularPriceId: regularPrice.id
            }
        });

    } catch (error: any) {
        console.error('[Addons API] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update addon
export async function PUT(req: NextRequest) {
    try {
        const stripe = getStripe();
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing addon id' }, { status: 400 });
        }

        // Get current addon
        const { data: currentAddon, error: fetchError } = await supabaseAdmin
            .from('addons')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !currentAddon) {
            return NextResponse.json({ error: 'Addon not found' }, { status: 404 });
        }

        // If price changed, create new Stripe prices
        let newPromoPriceId = currentAddon.stripe_promo_price_id;
        let newRegularPriceId = currentAddon.stripe_regular_price_id;

        if (updates.promo_price && updates.promo_price !== currentAddon.promo_price) {
            const newPromoPrice = await stripe.prices.create({
                product: currentAddon.stripe_product_id,
                unit_amount: updates.promo_price,
                currency: 'eur',
                metadata: { type: 'promo', version: 'updated' }
            });
            newPromoPriceId = newPromoPrice.id;

            // Archive old price
            await stripe.prices.update(currentAddon.stripe_promo_price_id, { active: false });
        }

        if (updates.regular_price && updates.regular_price !== currentAddon.regular_price) {
            const newRegularPrice = await stripe.prices.create({
                product: currentAddon.stripe_product_id,
                unit_amount: updates.regular_price,
                currency: 'eur',
                metadata: { type: 'regular', version: 'updated' }
            });
            newRegularPriceId = newRegularPrice.id;

            // Archive old price
            await stripe.prices.update(currentAddon.stripe_regular_price_id, { active: false });
        }

        // Update Stripe product name/description if changed
        if (updates.name || updates.description) {
            await stripe.products.update(currentAddon.stripe_product_id, {
                name: updates.name ? `VirtualTwin ${updates.name}` : undefined,
                description: updates.description || undefined
            });
        }

        // Update Supabase
        const { data: updatedAddon, error: updateError } = await supabaseAdmin
            .from('addons')
            .update({
                ...updates,
                stripe_promo_price_id: newPromoPriceId,
                stripe_regular_price_id: newRegularPriceId,
                features: updates.features ?
                    (typeof updates.features === 'string' ? JSON.parse(updates.features) : updates.features)
                    : undefined
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, addon: updatedAddon });

    } catch (error: any) {
        console.error('[Addons API] PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Soft delete (deactivate) addon
export async function DELETE(req: NextRequest) {
    try {
        const stripe = getStripe();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing addon id' }, { status: 400 });
        }

        // Get addon to archive Stripe product
        const { data: addon } = await supabaseAdmin
            .from('addons')
            .select('stripe_product_id')
            .eq('id', id)
            .single();

        if (addon?.stripe_product_id) {
            // Archive Stripe product (can't delete, but can archive)
            await stripe.products.update(addon.stripe_product_id, { active: false });
        }

        // Soft delete in Supabase
        const { error } = await supabaseAdmin
            .from('addons')
            .update({ is_active: false })
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Addon deactivated' });

    } catch (error: any) {
        console.error('[Addons API] DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
