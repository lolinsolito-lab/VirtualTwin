// scripts/createImperialStripeProducts.js
// 👑 Imperial 6-Figure Strategy - Stripe Product Creation
// Execute with: node scripts/createImperialStripeProducts.js

const Stripe = require('stripe');

// ⚠️ ATTENZIONE: Usa la tua chiave segreta test/live
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_XXX');

// 💰 IMPERIAL PRICING - The €1M Revenue Path
const IMPERIAL_PRODUCTS = [
    // ========== FOUNDER TIER (Lifetime Lock) ==========
    {
        name: 'VirtualTwin Esploratore - Founder',
        description: 'Entry level AI Clone. 1 Clone, 1K msg/mese, 1 Canale. Prezzo bloccato LIFETIME.',
        tier: 'founder',
        plan: 'esploratore',
        price: 3900, // €39.00 in centesimi
        features: ['1 Clone AI', '1,000 msg/mese', '1 Canale', 'Email Support <48h'],
        limits: { clones: 1, messages: 1000, channels: 1, apiAccess: false }
    },
    {
        name: 'VirtualTwin Pioniere - Founder',
        description: 'Il piano più popolare. 1 Clone, 5K msg/mese, 3 Canali, A/B Test. BESTSELLER.',
        tier: 'founder',
        plan: 'pioniere',
        price: 14700, // €147.00 ⭐ BESTSELLER
        features: ['1 Clone AI', '5,000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro'],
        limits: { clones: 1, messages: 5000, channels: 3, apiAccess: false }
    },
    {
        name: 'VirtualTwin Conquistatore - Founder',
        description: 'Per agenzie e power users. 3 Cloni, 20K msg/mese, API Access.',
        tier: 'founder',
        plan: 'conquistatore',
        price: 34700, // €347.00
        features: ['3 Cloni AI', '20,000 msg/mese', 'API Access 60 req/min', 'Priority Support <12h'],
        limits: { clones: 3, messages: 20000, channels: 9, apiAccess: true, apiRate: 60 }
    },
    {
        name: 'VirtualTwin Imperatore - Founder',
        description: 'Il trono digitale. 10 Cloni, 50K msg/mese, White-label, Account Manager.',
        tier: 'founder',
        plan: 'imperatore',
        price: 69700, // €697.00 👑
        features: ['10 Cloni AI', '50K msg/mese', 'White-label', 'Account Manager', 'API 300 req/min'],
        limits: { clones: 10, messages: 50000, channels: -1, apiAccess: true, apiRate: 300 }
    },

    // ========== PUBLIC TIER (Post-Founder, Apr 2026+) ==========
    {
        name: 'VirtualTwin Esploratore - Public',
        description: 'Entry level AI Clone. 1 Clone, 1K msg/mese, 1 Canale.',
        tier: 'public',
        plan: 'esploratore',
        price: 7900, // €79.00
        features: ['1 Clone AI', '1,000 msg/mese', '1 Canale', 'Email Support <48h'],
        limits: { clones: 1, messages: 1000, channels: 1, apiAccess: false }
    },
    {
        name: 'VirtualTwin Pioniere - Public',
        description: 'Il piano più popolare. 1 Clone, 5K msg/mese, 3 Canali, A/B Test.',
        tier: 'public',
        plan: 'pioniere',
        price: 29700, // €297.00
        features: ['1 Clone AI', '5,000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro'],
        limits: { clones: 1, messages: 5000, channels: 3, apiAccess: false }
    },
    {
        name: 'VirtualTwin Conquistatore - Public',
        description: 'Per agenzie e power users. 3 Cloni, 20K msg/mese, API Access.',
        tier: 'public',
        plan: 'conquistatore',
        price: 69700, // €697.00
        features: ['3 Cloni AI', '20,000 msg/mese', 'API Access 60 req/min', 'Priority Support <12h'],
        limits: { clones: 3, messages: 20000, channels: 9, apiAccess: true, apiRate: 60 }
    },
    {
        name: 'VirtualTwin Imperatore - Public',
        description: 'Il trono digitale. 10 Cloni, 50K msg/mese, White-label, Account Manager.',
        tier: 'public',
        plan: 'imperatore',
        price: 119700, // €1,197.00 👑
        features: ['10 Cloni AI', '50K msg/mese', 'White-label', 'Account Manager', 'API 300 req/min'],
        limits: { clones: 10, messages: 50000, channels: -1, apiAccess: true, apiRate: 300 }
    },
];

async function createImperialProducts() {
    console.log('\n👑 IMPERIAL 6-FIGURE STRATEGY - STRIPE SETUP\n');
    console.log('='.repeat(60));

    const results = {
        founder: {},
        public: {}
    };

    for (const product of IMPERIAL_PRODUCTS) {
        try {
            console.log(`\n📦 Creating: ${product.name}...`);

            // Crea prodotto
            const stripeProduct = await stripe.products.create({
                name: product.name,
                description: product.description,
                metadata: {
                    tier: product.tier,
                    plan: product.plan,
                    clones: String(product.limits.clones),
                    messages: String(product.limits.messages),
                    channels: String(product.limits.channels),
                    apiAccess: String(product.limits.apiAccess),
                    apiRate: String(product.limits.apiRate || 0),
                }
            });

            // Crea prezzo mensile
            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: product.price,
                currency: 'eur',
                recurring: { interval: 'month' },
                metadata: {
                    tier: product.tier,
                    plan: product.plan,
                }
            });

            // Salva risultato
            results[product.tier][product.plan] = {
                productId: stripeProduct.id,
                priceId: stripePrice.id,
                price: product.price / 100,
            };

            console.log(`   ✅ Product ID: ${stripeProduct.id}`);
            console.log(`   ✅ Price ID: ${stripePrice.id}`);
            console.log(`   💰 Price: €${product.price / 100}/mese`);

        } catch (error) {
            console.error(`   ❌ Error creating ${product.name}:`, error.message);
        }
    }

    // Output finale
    console.log('\n' + '='.repeat(60));
    console.log('\n🎯 SUMMARY - Copy these to lib/pricing.ts:\n');

    console.log('// FOUNDER PRICES (Lifetime Lock)');
    for (const [plan, data] of Object.entries(results.founder)) {
        console.log(`STRIPE_PRICE_FOUNDER_${plan.toUpperCase()}: '${data.priceId}', // €${data.price}`);
    }

    console.log('\n// PUBLIC PRICES (Post-Founder)');
    for (const [plan, data] of Object.entries(results.public)) {
        console.log(`STRIPE_PRICE_PUBLIC_${plan.toUpperCase()}: '${data.priceId}', // €${data.price}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n👑 Imperial Setup Complete! Ready for €1M Revenue Path.\n');

    return results;
}

// Esegui
createImperialProducts()
    .then(results => {
        console.log('\n📋 Full Results JSON:\n');
        console.log(JSON.stringify(results, null, 2));
    })
    .catch(console.error);
