/**
 * Stripe Cleanup & Setup Script
 * 
 * 1. Archives ALL existing VirtualTwin products
 * 2. Creates fresh products for Waves + Public pricing
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any,
});

// =============================================
// STEP 1: ARCHIVE ALL EXISTING PRODUCTS
// =============================================

async function archiveAllProducts() {
    console.log('🧹 STEP 1: Archiving existing products...\n');

    let hasMore = true;
    let startingAfter: string | undefined;
    let archivedCount = 0;

    while (hasMore) {
        const products: Stripe.ApiList<Stripe.Product> = await stripe.products.list({
            limit: 100,
            starting_after: startingAfter,
            active: true
        });

        for (const product of products.data) {
            if (product.name.includes('VirtualTwin')) {
                try {
                    // First archive all prices for this product
                    const prices = await stripe.prices.list({ product: product.id });
                    for (const price of prices.data) {
                        if (price.active) {
                            await stripe.prices.update(price.id, { active: false });
                            console.log(`  📦 Archived price: ${price.nickname || price.id}`);
                        }
                    }

                    // Then archive the product
                    await stripe.products.update(product.id, { active: false });
                    console.log(`  ✅ Archived: ${product.name}`);
                    archivedCount++;
                } catch (error: any) {
                    console.log(`  ⚠️ Could not archive ${product.name}: ${error.message}`);
                }
            }
        }

        hasMore = products.has_more;
        if (products.data.length > 0) {
            startingAfter = products.data[products.data.length - 1].id;
        }
    }

    console.log(`\n✅ Archived ${archivedCount} products\n`);
}

// =============================================
// STEP 2: CREATE NEW PRODUCTS
// =============================================

const FOUNDER_WAVES = {
    genesis: {
        name: 'Genesis',
        plans: {
            esploratore: { price: 39, messages: 1000 },
            pioniere: { price: 147, messages: 5000 },
            conquistatore: { price: 347, messages: 20000 },
            imperatore: { price: 697, messages: 50000 }
        }
    },
    pioneer: {
        name: 'Pioneer',
        plans: {
            esploratore: { price: 59, messages: 1000 },
            pioniere: { price: 197, messages: 5000 },
            conquistatore: { price: 447, messages: 20000 },
            imperatore: { price: 897, messages: 50000 }
        }
    },
    elite: {
        name: 'Elite',
        plans: {
            esploratore: { price: 79, messages: 1000 },
            pioniere: { price: 247, messages: 5000 },
            conquistatore: { price: 547, messages: 20000 },
            imperatore: { price: 1097, messages: 50000 }
        }
    }
};

const PUBLIC_QUARTERS = {
    q1_2026: {
        name: 'Q1 2026',
        plans: {
            esploratore: { price: 297, messages: 500 },
            pioniere: { price: 697, messages: 2000 },
            conquistatore: { price: 1197, messages: 5000 },
            imperatore: { price: 1997, messages: 50000 }
        }
    },
    q2_2026: {
        name: 'Q2 2026',
        plans: {
            esploratore: { price: 347, messages: 500 },
            pioniere: { price: 747, messages: 2000 },
            conquistatore: { price: 1297, messages: 5000 },
            imperatore: { price: 2097, messages: 50000 }
        }
    },
    q3_2026: {
        name: 'Q3 2026',
        plans: {
            esploratore: { price: 397, messages: 500 },
            pioniere: { price: 797, messages: 2000 },
            conquistatore: { price: 1397, messages: 5000 },
            imperatore: { price: 2197, messages: 50000 }
        }
    }
};

const PLAN_NAMES: Record<string, string> = {
    esploratore: 'Esploratore',
    pioniere: 'Pioniere',
    conquistatore: 'Conquistatore',
    imperatore: 'Imperatore'
};

async function createNewProducts() {
    console.log('\n🚀 STEP 2: Creating new products...\n');

    const results: {
        founder: Record<string, Record<string, string>>;
        public: Record<string, Record<string, string>>;
    } = { founder: {}, public: {} };

    // FOUNDER PRODUCTS
    console.log('📦 FOUNDER WAVES:\n');

    for (const [waveKey, wave] of Object.entries(FOUNDER_WAVES)) {
        console.log(`\n🌊 ${wave.name} Wave:`);
        results.founder[waveKey] = {};

        for (const [planKey, plan] of Object.entries(wave.plans)) {
            const productName = `VirtualTwin ${PLAN_NAMES[planKey]} - ${wave.name} Founder`;

            try {
                const product = await stripe.products.create({
                    name: productName,
                    description: `${plan.messages.toLocaleString()} msg/mese - Founder ${wave.name}`,
                    metadata: { app: 'virtualtwin', tier: 'founder', wave: waveKey, plan: planKey }
                });

                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: plan.price * 100,
                    currency: 'eur',
                    recurring: { interval: 'month' },
                    nickname: `${wave.name} ${PLAN_NAMES[planKey]}`,
                    metadata: { tier: 'founder', wave: waveKey, plan: planKey }
                });

                results.founder[waveKey][planKey] = price.id;
                console.log(`  ✅ ${PLAN_NAMES[planKey]}: €${plan.price} → ${price.id}`);
            } catch (error: any) {
                console.error(`  ❌ ${PLAN_NAMES[planKey]}: ${error.message}`);
            }
        }
    }

    // PUBLIC PRODUCTS
    console.log('\n\n📦 PUBLIC PRICING:\n');

    for (const [quarterKey, quarter] of Object.entries(PUBLIC_QUARTERS)) {
        console.log(`\n📅 ${quarter.name}:`);
        results.public[quarterKey] = {};

        for (const [planKey, plan] of Object.entries(quarter.plans)) {
            const productName = `VirtualTwin ${PLAN_NAMES[planKey]} - Public ${quarter.name}`;

            try {
                const product = await stripe.products.create({
                    name: productName,
                    description: `${plan.messages.toLocaleString()} msg/mese - Public ${quarter.name}`,
                    metadata: { app: 'virtualtwin', tier: 'public', quarter: quarterKey, plan: planKey }
                });

                const price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: plan.price * 100,
                    currency: 'eur',
                    recurring: { interval: 'month' },
                    nickname: `Public ${quarter.name} ${PLAN_NAMES[planKey]}`,
                    metadata: { tier: 'public', quarter: quarterKey, plan: planKey }
                });

                results.public[quarterKey][planKey] = price.id;
                console.log(`  ✅ ${PLAN_NAMES[planKey]}: €${plan.price} → ${price.id}`);
            } catch (error: any) {
                console.error(`  ❌ ${PLAN_NAMES[planKey]}: ${error.message}`);
            }
        }
    }

    return results;
}

// =============================================
// MAIN
// =============================================

async function main() {
    console.log('='.repeat(60));
    console.log('🏛️  VIRTUALTWIN STRIPE SETUP');
    console.log('='.repeat(60) + '\n');

    // Step 1: Archive old
    await archiveAllProducts();

    // Step 2: Create new
    const results = await createNewProducts();

    // Step 3: Output for lib/waves.ts
    console.log('\n\n' + '='.repeat(60));
    console.log('📋 COPY TO lib/waves.ts:');
    console.log('='.repeat(60) + '\n');

    // Genesis
    console.log('// Genesis Wave stripePriceIds:');
    console.log(`esploratore: '${results.founder.genesis?.esploratore}',`);
    console.log(`pioniere: '${results.founder.genesis?.pioniere}',`);
    console.log(`conquistatore: '${results.founder.genesis?.conquistatore}',`);
    console.log(`imperatore: '${results.founder.genesis?.imperatore}'`);

    // Pioneer
    console.log('\n// Pioneer Wave stripePriceIds:');
    console.log(`esploratore: '${results.founder.pioneer?.esploratore}',`);
    console.log(`pioniere: '${results.founder.pioneer?.pioniere}',`);
    console.log(`conquistatore: '${results.founder.pioneer?.conquistatore}',`);
    console.log(`imperatore: '${results.founder.pioneer?.imperatore}'`);

    // Elite
    console.log('\n// Elite Wave stripePriceIds:');
    console.log(`esploratore: '${results.founder.elite?.esploratore}',`);
    console.log(`pioniere: '${results.founder.elite?.pioniere}',`);
    console.log(`conquistatore: '${results.founder.elite?.conquistatore}',`);
    console.log(`imperatore: '${results.founder.elite?.imperatore}'`);

    // Q1
    console.log('\n// Q1 2026 stripePriceIds:');
    console.log(`esploratore: '${results.public.q1_2026?.esploratore}',`);
    console.log(`pioniere: '${results.public.q1_2026?.pioniere}',`);
    console.log(`conquistatore: '${results.public.q1_2026?.conquistatore}',`);
    console.log(`imperatore: '${results.public.q1_2026?.imperatore}'`);

    // Q2
    console.log('\n// Q2 2026 stripePriceIds:');
    console.log(`esploratore: '${results.public.q2_2026?.esploratore}',`);
    console.log(`pioniere: '${results.public.q2_2026?.pioniere}',`);
    console.log(`conquistatore: '${results.public.q2_2026?.conquistatore}',`);
    console.log(`imperatore: '${results.public.q2_2026?.imperatore}'`);

    // Q3
    console.log('\n// Q3 2026 stripePriceIds:');
    console.log(`esploratore: '${results.public.q3_2026?.esploratore}',`);
    console.log(`pioniere: '${results.public.q3_2026?.pioniere}',`);
    console.log(`conquistatore: '${results.public.q3_2026?.conquistatore}',`);
    console.log(`imperatore: '${results.public.q3_2026?.imperatore}'`);

    console.log('\n\n✅ DONE! Copy the Price IDs above to lib/waves.ts');
}

main().catch(console.error);
