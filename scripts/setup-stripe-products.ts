/**
 * Stripe Products Setup Script
 * 
 * Run this ONCE to create all VirtualTwin pricing products in Stripe
 * 
 * Usage: npx ts-node scripts/setup-stripe-products.ts
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any,
});

interface PlanConfig {
    name: string;
    description: string;
    founderMonthly: number;
    founderYearly: number;
    publicMonthly: number;
    publicYearly: number;
    features: string[];
}

const PLANS: Record<string, PlanConfig> = {
    esploratore: {
        name: 'Esploratore',
        description: 'Per chi inizia il viaggio. 1,000 messaggi/mese.',
        founderMonthly: 2300, // €23
        founderYearly: 22080, // €184/year (€23 x 8 months = 32% off)
        publicMonthly: 3900, // €39
        publicYearly: 37440, // €312/year
        features: ['1 Clone AI', '1,000 messaggi/mese', 'WhatsApp', 'Email support'],
    },
    pioniere: {
        name: 'Pioniere',
        description: 'Per imprenditori seri. 5,000 messaggi/mese.',
        founderMonthly: 5800, // €58
        founderYearly: 55680, // €464/year
        publicMonthly: 9700, // €97
        publicYearly: 93120, // €776/year
        features: ['3 Cloni AI', '5,000 messaggi/mese', 'WhatsApp + Instagram', 'Priority support', 'Analytics'],
    },
    conquistatore: {
        name: 'Conquistatore',
        description: 'Per dominare il mercato. 20,000 messaggi/mese.',
        founderMonthly: 11800, // €118
        founderYearly: 113280, // €944/year
        publicMonthly: 19700, // €197
        publicYearly: 189120, // €1,576/year
        features: ['10 Cloni AI', '20,000 messaggi/mese', 'Tutti i canali', 'GPT-4 Priority', 'White-label', 'Dedicated support'],
    },
    imperatore: {
        name: 'Imperatore',
        description: 'Per imperi. Messaggi illimitati.',
        founderMonthly: 23800, // €238
        founderYearly: 228480, // €1,904/year
        publicMonthly: 39700, // €397
        publicYearly: 381120, // €3,176/year
        features: ['Cloni illimitati', 'Messaggi illimitati', 'GPT-4 Turbo', 'API Access', 'Custom integrations', '24/7 VIP support'],
    },
};

async function createStripeProducts() {
    console.log('🚀 Creating Stripe products for VirtualTwin...\n');

    const results: Record<string, any> = {};

    for (const [planKey, config] of Object.entries(PLANS)) {
        console.log(`\n📦 Creating product: ${config.name}...`);

        // Create the product
        const product = await stripe.products.create({
            name: `VirtualTwin ${config.name}`,
            description: config.description,
            metadata: {
                plan_key: planKey,
                features: config.features.join(', '),
            },
        });

        console.log(`   ✅ Product created: ${product.id}`);

        // Create Founder Monthly Price
        const founderMonthly = await stripe.prices.create({
            product: product.id,
            unit_amount: config.founderMonthly,
            currency: 'eur',
            recurring: { interval: 'month' },
            metadata: {
                plan_key: planKey,
                pricing_type: 'founder',
                billing_cycle: 'monthly',
            },
            nickname: `${config.name} Founder Monthly`,
        });
        console.log(`   💰 Founder Monthly: ${founderMonthly.id} (€${config.founderMonthly / 100}/mo)`);

        // Create Founder Yearly Price
        const founderYearly = await stripe.prices.create({
            product: product.id,
            unit_amount: config.founderYearly,
            currency: 'eur',
            recurring: { interval: 'year' },
            metadata: {
                plan_key: planKey,
                pricing_type: 'founder',
                billing_cycle: 'yearly',
            },
            nickname: `${config.name} Founder Yearly`,
        });
        console.log(`   💰 Founder Yearly: ${founderYearly.id} (€${config.founderYearly / 100}/yr)`);

        // Create Public Monthly Price
        const publicMonthly = await stripe.prices.create({
            product: product.id,
            unit_amount: config.publicMonthly,
            currency: 'eur',
            recurring: { interval: 'month' },
            metadata: {
                plan_key: planKey,
                pricing_type: 'public',
                billing_cycle: 'monthly',
            },
            nickname: `${config.name} Public Monthly`,
        });
        console.log(`   💰 Public Monthly: ${publicMonthly.id} (€${config.publicMonthly / 100}/mo)`);

        // Create Public Yearly Price
        const publicYearly = await stripe.prices.create({
            product: product.id,
            unit_amount: config.publicYearly,
            currency: 'eur',
            recurring: { interval: 'year' },
            metadata: {
                plan_key: planKey,
                pricing_type: 'public',
                billing_cycle: 'yearly',
            },
            nickname: `${config.name} Public Yearly`,
        });
        console.log(`   💰 Public Yearly: ${publicYearly.id} (€${config.publicYearly / 100}/yr)`);

        results[planKey] = {
            productId: product.id,
            prices: {
                founderMonthly: founderMonthly.id,
                founderYearly: founderYearly.id,
                publicMonthly: publicMonthly.id,
                publicYearly: publicYearly.id,
            },
        };
    }

    console.log('\n\n✅ ALL PRODUCTS CREATED!\n');
    console.log('📋 Copy these Price IDs to your lib/pricing.ts:\n');
    console.log(JSON.stringify(results, null, 2));

    // Generate the config file content
    console.log('\n\n📄 UPDATE lib/pricing.ts with:\n');
    console.log('export const STRIPE_PRICE_IDS = {');
    for (const [planKey, data] of Object.entries(results)) {
        console.log(`    ${planKey}: {`);
        console.log(`        founder: {`);
        console.log(`            monthly: '${data.prices.founderMonthly}',`);
        console.log(`            yearly: '${data.prices.founderYearly}',`);
        console.log(`        },`);
        console.log(`        public: {`);
        console.log(`            monthly: '${data.prices.publicMonthly}',`);
        console.log(`            yearly: '${data.prices.publicYearly}',`);
        console.log(`        },`);
        console.log(`    },`);
    }
    console.log('};');

    return results;
}

// Run the script
createStripeProducts()
    .then(() => {
        console.log('\n🎉 Done! Your Stripe products are ready.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
