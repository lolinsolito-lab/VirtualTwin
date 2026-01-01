// Quick Stripe Setup Script - Run with: node scripts/createStripeProducts.js
const Stripe = require('stripe');

const stripe = new Stripe('sk_test_51SkkBn7141DXdb9vacsZFiGoEHcExpBwOVR6TUxXal04eOW36EGGS4rdF7aNZVlFZVEb9IgtJeplMTRIzPlKjDGM00Eb8qjeK5');

const productsToCreate = [
    { name: 'VirtualTwin Imperatore Founder', amount: 59500, plan: 'imperatore', tier: 'founder' },
    { name: 'VirtualTwin Esploratore', amount: 7900, plan: 'esploratore', tier: 'public' },
    { name: 'VirtualTwin Pioniere', amount: 19700, plan: 'pioniere', tier: 'public' },
    { name: 'VirtualTwin Conquistatore', amount: 39700, plan: 'conquistatore', tier: 'public' },
    { name: 'VirtualTwin Imperatore', amount: 79700, plan: 'imperatore', tier: 'public' }
];

async function createProducts() {
    console.log('🚀 Creating 5 Stripe Products...\n');

    const results = [];

    for (const p of productsToCreate) {
        try {
            const product = await stripe.products.create({
                name: p.name,
                metadata: { plan: p.plan, tier: p.tier }
            });

            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: p.amount,
                currency: 'eur',
                recurring: { interval: 'month' }
            });

            console.log(`✅ ${p.name}: ${price.id}`);
            results.push({ name: p.name, priceId: price.id, plan: p.plan, tier: p.tier });
        } catch (err) {
            console.log(`❌ ${p.name}: ${err.message}`);
        }
    }

    console.log('\n📋 Copy these Price IDs to lib/stripeConfig.ts:\n');
    results.forEach(r => console.log(`${r.plan}_${r.tier}: '${r.priceId}'`));
}

createProducts();
