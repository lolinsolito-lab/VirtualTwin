const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Manual env parsing (no dotenv dependency)
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createSetupPremium() {
    try {
        console.log('🚀 Creating VirtualTwin Setup Premium product...');
        console.log('Using key:', process.env.STRIPE_SECRET_KEY?.substring(0, 12) + '...');

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

        console.log('');
        console.log('='.repeat(40));
        console.log('COPY THESE IDs TO stripeConfig.ts:');
        console.log('='.repeat(40));
        console.log('PRODUCT_ID:', product.id);
        console.log('PROMO_PRICE_ID:', promoPrice.id);
        console.log('REGULAR_PRICE_ID:', regularPrice.id);
        console.log('='.repeat(40));

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.raw) {
            console.error('Details:', error.raw.message);
        }
    }
}

createSetupPremium();
