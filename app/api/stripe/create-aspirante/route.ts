import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

/**
 * TEMP: Create Aspirante Stripe Product
 * DELETE after running once
 */
export async function POST() {
    try {
        const stripe = getStripe();

        // Create Product
        const product = await stripe.products.create({
            name: 'VirtualTwin Aspirante',
            description: 'Piano entry-level - 1 Clone AI, 500 msg/mese, Template, Corso, Community',
            metadata: {
                plan_tier: 'aspirante',
                messages_limit: '500'
            }
        });

        // Create Price (€49/month)
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 4900,  // €49
            currency: 'eur',
            recurring: {
                interval: 'month'
            },
            metadata: {
                plan_tier: 'aspirante'
            }
        });

        return NextResponse.json({
            success: true,
            product_id: product.id,
            price_id: price.id,
            message: `✅ Created! Replace "price_ASPIRANTE_49" with: ${price.id}`
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
