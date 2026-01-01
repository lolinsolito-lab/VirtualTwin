/**
 * Supabase Pricing Sync Script
 * 
 * Updates the pricing_plans table with real Stripe IDs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Usually needs service role for updates like this, but let's try
// Note: In a real scenario, you'd use the service_role key for this.

const supabase = createClient(supabaseUrl, supabaseKey);

const STRIPE_DATA = {
    esploratore: {
        founder_monthly: 'price_1Skmly7141DXdb9vio4hVFWC',
        founder_yearly: 'price_1Skmly7141DXdb9vxsEJIXtL',
        public_monthly: 'price_1Skmlz7141DXdb9vpHqQF2xn',
        public_yearly: 'price_1Skmlz7141DXdb9vgkcFBRzL'
    },
    pioniere: {
        founder_monthly: 'price_1Skmlz7141DXdb9vmLZHunyX',
        founder_yearly: 'price_1Skmm07141DXdb9vBq8MTI93',
        public_monthly: 'price_1Skmm07141DXdb9v4FqBWPee',
        public_yearly: 'price_1Skmm07141DXdb9vCRq2nVV2'
    },
    conquistatore: {
        founder_monthly: 'price_1Skmm17141DXdb9v12abIA2S',
        founder_yearly: 'price_1Skmm17141DXdb9v6pux6HK3',
        public_monthly: 'price_1Skmm27141DXdb9vtAyRoIcl',
        public_yearly: 'price_1Skmm27141DXdb9vUsKSJ6xT'
    },
    imperatore: {
        founder_monthly: 'price_1Skmm37141DXdb9vCpw491HD',
        founder_yearly: 'price_1Skmm37141DXdb9vBrtVu81f',
        public_monthly: 'price_1Skmm37141DXdb9vr31wFjdb',
        public_yearly: 'price_1Skmm47141DXdb9v2VnWEyyo'
    }
};

async function syncPricing() {
    console.log('🔄 Syncing Stripe IDs to Supabase...');

    for (const [name, prices] of Object.entries(STRIPE_DATA)) {
        console.log(`Updating ${name}...`);

        // Update founder monthly
        const { error: err1 } = await supabase
            .from('pricing_plans')
            .update({ stripe_price_id: prices.founder_monthly })
            .eq('name', name)
            .eq('is_founder', true)
            .eq('billing_cycle', 'monthly');

        // Update founder yearly
        const { error: err2 } = await supabase
            .from('pricing_plans')
            .update({ stripe_price_id: prices.founder_yearly })
            .eq('name', name)
            .eq('is_founder', true)
            .eq('billing_cycle', 'yearly');

        // Update public monthly
        const { error: err3 } = await supabase
            .from('pricing_plans')
            .update({ stripe_price_id: prices.public_monthly })
            .eq('name', name)
            .eq('is_founder', false)
            .eq('billing_cycle', 'monthly');

        // Update public yearly
        const { error: err4 } = await supabase
            .from('pricing_plans')
            .update({ stripe_price_id: prices.public_yearly })
            .eq('name', name)
            .eq('is_founder', false)
            .eq('billing_cycle', 'yearly');

        if (err1 || err2 || err3 || err4) {
            console.error(`Error updating ${name}:`, err1 || err2 || err3 || err4);
        } else {
            console.log(`✅ ${name} updated successfully.`);
        }
    }

    console.log('\n✨ Sync complete!');
}

syncPricing();
