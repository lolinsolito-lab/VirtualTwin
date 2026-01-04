/**
 * Create Stripe Product and Price for Aspirante Plan
 * Run: node scripts/create-aspirante-stripe.js
 */

const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createAspiranteProduct() {
    try {
        console.log('🚀 Creating Stripe Product: VirtualTwin Aspirante...\n');

        // Step 1: Create Product
        const product = await stripe.products.create({
            name: 'VirtualTwin Aspirante',
            description: 'Piano entry-level per iniziare il tuo impero digitale - 1 Clone AI, 500 msg/mese, Template settore, Corso 6 video, Community',
            metadata: {
                plan_tier: 'aspirante',
                messages_limit: '500',
                clones_limit: '1',
                features: 'templates,course,community'
            }
        });

        console.log('✅ Product Created:');
        console.log(`   ID: ${product.id}`);
        console.log(`   Name: ${product.name}\n`);

        // Step 2: Create Recurring Price (€49/month)
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 4900,  // €49.00 in cents
            currency: 'eur',
            recurring: {
                interval: 'month',
                interval_count: 1
            },
            metadata: {
                plan_tier: 'aspirante',
                display_name: 'Aspirante Monthly'
            }
        });

        console.log('✅ Price Created:');
        console.log(`   ID: ${price.id}`);
        console.log(`   Amount: €${price.unit_amount / 100}/month\n`);

        // Output for easy copy-paste
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 COPY THIS PRICE ID:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n   ${price.id}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        console.log('\n✅ Success! Replace "price_ASPIRANTE_49" with the Price ID above in:');
        console.log('   - lib/pricing.ts');
        console.log('   - components/sections/PricingUltimate.tsx');
        console.log('   - app/start/page.tsx');
        console.log('   - app/dashboard/billing/page.tsx\n');

        return { product, price };

    } catch (error) {
        console.error('❌ Error creating Stripe product:', error.message);
        process.exit(1);
    }
}

// Run the script
createAspiranteProduct()
    .then(() => {
        console.log('🎉 Aspirante Stripe setup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
