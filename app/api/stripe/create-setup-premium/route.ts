import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

/**
 * TEMPORARY ENDPOINT - Delete after use
 * Creates VirtualTwin Setup Premium product and prices
 * 
 * POST /api/stripe/create-setup-premium
 * 
 * Returns the created product and price IDs
 */
export async function POST(req: NextRequest) {
    try {
        const stripe = getStripe();

        // Security: Simple token check (remove after use)
        const { secret } = await req.json();
        if (secret !== 'virtualtwin-create-setup-2026') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('🚀 Creating VirtualTwin Setup Premium product...');

        // Create the product
        const product = await stripe.products.create({
            name: 'VirtualTwin Setup Premium',
            description: 'Configurazione completa Done-For-You in 48h con call strategica 1:1, training personalità, integrazione canali, importazione knowledge base.',
            metadata: {
                type: 'addon',
                category: 'setup'
            }
        });

        console.log('✅ Product created:', product.id);

        // Create promo price (€99)
        const promoPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: 9900, // €99 in cents
            currency: 'eur',
            metadata: {
                type: 'promo',
                regularPrice: '297'
            }
        });

        console.log('✅ Promo price created:', promoPrice.id, '- €99');

        // Create regular price (€297) for future use
        const regularPrice = await stripe.prices.create({
            product: product.id,
            unit_amount: 29700, // €297 in cents
            currency: 'eur',
            metadata: {
                type: 'regular'
            }
        });

        console.log('✅ Regular price created:', regularPrice.id, '- €297');

        return NextResponse.json({
            success: true,
            productId: product.id,
            promoPriceId: promoPrice.id,  // Use this for €99 checkout
            regularPriceId: regularPrice.id  // Use this for €297 checkout
        });

    } catch (error: any) {
        console.error('❌ Stripe Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
