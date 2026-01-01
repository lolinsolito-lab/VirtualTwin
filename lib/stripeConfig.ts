// =============================================
// VIRTUALTWIN STRIPE CONFIGURATION
// Founder vs Public Price IDs
// =============================================

/**
 * Stripe Price IDs - Replace with real IDs from Stripe Dashboard
 * 
 * How to create in Stripe:
 * 1. Go to Stripe Dashboard > Products
 * 2. Create product: "VirtualTwin [Plan Name]"
 * 3. Add 2 prices: Founder (monthly) & Public (monthly)
 * 4. Copy the price_xxx IDs here
 */
export const STRIPE_PRICES = {
    // Esploratore - €39 Founder / €79 Public
    esploratore: {
        founder: {
            monthly: 'price_1Skmly7141DXdb9vio4hVFWC', // €39/mese
            yearly: 'price_1Skmly7141DXdb9vxsEJIXtL'   // €390/anno
        },
        public: {
            monthly: 'price_1SkuNK7141DXdb9vnuksKZoM', // €79/mese
            yearly: 'price_REPLACE_ESP_PUBLIC_YEARLY'    // €790/anno
        }
    },

    // Pioniere - €97 Founder / €197 Public
    pioniere: {
        founder: {
            monthly: 'price_1Skmlz7141DXdb9vmLZHunyX', // €97/mese
            yearly: 'price_1Skmm07141DXdb9vBq8MTI93'   // €970/anno
        },
        public: {
            monthly: 'price_1SkuNK7141DXdb9vHGmkpykY', // €197/mese
            yearly: 'price_REPLACE_PIO_PUBLIC_YEARLY'    // €1970/anno
        }
    },

    // Conquistatore - €197 Founder / €397 Public
    conquistatore: {
        founder: {
            monthly: 'price_1Skmm17141DXdb9v12abIA2S', // €197/mese
            yearly: 'price_1Skmm17141DXdb9v6pux6HK3'   // €1970/anno
        },
        public: {
            monthly: 'price_1SkuNL7141DXdb9vhUAWY9Gx', // €397/mese
            yearly: 'price_REPLACE_CON_PUBLIC_YEARLY'    // €3970/anno
        }
    },

    // Imperatore - €595 Founder / €797 Public
    imperatore: {
        founder: {
            monthly: 'price_1SkuNJ7141DXdb9vRRIjNvaC', // €595/mese
            yearly: 'price_REPLACE_IMP_FOUNDER_YEARLY'    // €5950/anno
        },
        public: {
            monthly: 'price_1SkuNM7141DXdb9vdHmn0Dvw', // €797/mese
            yearly: 'price_REPLACE_IMP_PUBLIC_YEARLY'    // €7970/anno
        }
    }
} as const;

export type PlanTier = keyof typeof STRIPE_PRICES;
export type PricingType = 'founder' | 'public';
export type BillingInterval = 'monthly' | 'yearly';

/**
 * Get Stripe Price ID based on plan, founder status, and billing
 */
export function getStripePriceId(
    plan: PlanTier,
    isFounder: boolean,
    billing: BillingInterval = 'monthly'
): string {
    const type: PricingType = isFounder ? 'founder' : 'public';
    return STRIPE_PRICES[plan][type][billing];
}

/**
 * Get display prices for UI
 */
export const DISPLAY_PRICES = {
    esploratore: { founder: 39, public: 79, yearly_founder: 390, yearly_public: 790 },
    pioniere: { founder: 97, public: 197, yearly_founder: 970, yearly_public: 1970 },
    conquistatore: { founder: 197, public: 397, yearly_founder: 1970, yearly_public: 3970 },
    imperatore: { founder: 595, public: 797, yearly_founder: 5950, yearly_public: 7970 }
} as const;

/**
 * Founder spots configuration
 */
export const FOUNDER_CONFIG = {
    totalSpots: 153,
    deadline: '2026-03-31T23:59:59',
    lifetimeLock: true
} as const;
