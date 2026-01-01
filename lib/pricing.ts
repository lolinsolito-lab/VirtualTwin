// =============================================
// VIRTUALTWIN PRICING CONFIGURATION
// Founder vs Public Pricing Strategy
// =============================================

export type PlanTier = 'curioso' | 'esploratore' | 'pioniere' | 'conquistatore' | 'imperatore';

interface PlanPricing {
    // Display info
    name: string;
    displayName: string;
    tagline: string;
    popular?: boolean;

    // Founder pricing (limited spots, discounted)
    founderPrice: number;          // Monthly price for founders
    founderYearlyPrice: number;    // Yearly price for founders (extra discount)
    founderSpots: number;          // Total founder spots available
    founderDiscount: string;       // e.g. "40% OFF"

    // Public pricing (after founder spots filled)
    publicPrice: number;
    publicYearlyPrice: number;

    // Stripe IDs (to be filled when you create products in Stripe)
    stripe: {
        founder: {
            monthly: string;       // price_xxx
            yearly: string;
        };
        public: {
            monthly: string;
            yearly: string;
        };
        productId: string;         // prod_xxx
    };

    // Features & Limits
    features: string[];
    limits: {
        clones: number;
        messagesPerMonth: number;
        channels: number;
        teamMembers: number;
        analyticsRetentionDays: number;
        apiAccess: boolean;
        whiteLabel: boolean;
        prioritySupport: boolean;
    };

    // AI Configuration
    ai: {
        provider: 'gemini-flash' | 'gemini-pro' | 'gpt-4o' | 'gpt-4-turbo';
        maxTokensPerMessage: number;
        priority: 'standard' | 'high' | 'priority';
    };
}

// =============================================
// COMPLETE PRICING TABLE
// =============================================

export const PRICING: Record<PlanTier, PlanPricing> = {
    curioso: {
        name: 'curioso',
        displayName: 'Curioso',
        tagline: 'Per testare il potere dell\'AI',

        // FREE TIER - Same for Founder and Public
        founderPrice: 0,
        founderYearlyPrice: 0,
        founderSpots: 1000, // Unlimited practically
        founderDiscount: 'GRATIS',
        publicPrice: 0,
        publicYearlyPrice: 0,

        stripe: {
            founder: { monthly: '', yearly: '' }, // No Stripe for free
            public: { monthly: '', yearly: '' },
            productId: ''
        },

        features: [
            '14 giorni trial',
            '1 Clone AI',
            '100 msg/mese',
            '1 Canale (WhatsApp O Instagram)',
            'Watermark obbligatorio',
            'No analytics'
        ],
        limits: {
            clones: 1,
            messagesPerMonth: 100,
            channels: 1,
            teamMembers: 1,
            analyticsRetentionDays: 7,
            apiAccess: false,
            whiteLabel: false,
            prioritySupport: false
        },
        ai: {
            provider: 'gemini-flash',
            maxTokensPerMessage: 300,
            priority: 'standard'
        }
    },

    esploratore: {
        name: 'esploratore',
        displayName: 'Esploratore',
        tagline: 'Per chi inizia a scalare',

        // FOUNDER: €39/m (51% off from €79)
        founderPrice: 39,
        founderYearlyPrice: 390,    // 2 mesi gratis
        founderSpots: 200,
        founderDiscount: '51% OFF',

        // PUBLIC: €79/m (increases 12%/year)
        publicPrice: 79,
        publicYearlyPrice: 790,

        stripe: {
            founder: {
                monthly: 'price_1Skmly7141DXdb9vio4hVFWC',
                yearly: 'price_1Skmly7141DXdb9vxsEJIXtL'
            },
            public: {
                monthly: 'price_1Skmlz7141DXdb9vpHqQF2xn',
                yearly: 'price_1Skmlz7141DXdb9vgkcFBRzL'
            },
            productId: 'prod_TiDCLxRBKttFVH'
        },

        features: [
            '1 Clone AI',
            '1.000 msg/mese',
            '1 Canale',
            'Analytics Base',
            'Email Support <48h',
            'No watermark'
        ],
        limits: {
            clones: 1,
            messagesPerMonth: 1000,
            channels: 1,
            teamMembers: 1,
            analyticsRetentionDays: 30,
            apiAccess: false,
            whiteLabel: false,
            prioritySupport: false
        },
        ai: {
            provider: 'gemini-flash',
            maxTokensPerMessage: 500,
            priority: 'standard'
        }
    },

    pioniere: {
        name: 'pioniere',
        displayName: 'Pioniere',
        tagline: 'Il più scelto dai professionisti',
        popular: true,

        // FOUNDER: €97/m (51% off from €197)
        founderPrice: 97,
        founderYearlyPrice: 970,
        founderSpots: 150,
        founderDiscount: '51% OFF',

        // PUBLIC: €197/m (increases 12%/year)
        publicPrice: 197,
        publicYearlyPrice: 1970,

        stripe: {
            founder: {
                monthly: 'price_1Skmlz7141DXdb9vmLZHunyX',
                yearly: 'price_1Skmm07141DXdb9vBq8MTI93'
            },
            public: {
                monthly: 'price_1Skmm07141DXdb9v4FqBWPee',
                yearly: 'price_1Skmm07141DXdb9vCRq2nVV2'
            },
            productId: 'prod_TiDCIhY2imgXqH'
        },

        features: [
            '1 Clone AI',
            '5.000 msg/mese',
            '3 Canali (WA + IG + Messenger)',
            'A/B Testing (20% traffico)',
            'Analytics Pro',
            'Email Support <24h'
        ],
        limits: {
            clones: 1,
            messagesPerMonth: 5000,
            channels: 3,
            teamMembers: 3,
            analyticsRetentionDays: 90,
            apiAccess: false,
            whiteLabel: false,
            prioritySupport: false
        },
        ai: {
            provider: 'gemini-pro',
            maxTokensPerMessage: 800,
            priority: 'high'
        }
    },

    conquistatore: {
        name: 'conquistatore',
        displayName: 'Conquistatore',
        tagline: 'Per chi domina il mercato',

        // FOUNDER: €197/m (50% off from €397)
        founderPrice: 197,
        founderYearlyPrice: 1970,
        founderSpots: 50,
        founderDiscount: '50% OFF',

        // PUBLIC: €397/m (increases 12%/year)
        publicPrice: 397,
        publicYearlyPrice: 3970,

        stripe: {
            founder: {
                monthly: 'price_1Skmm17141DXdb9v12abIA2S',
                yearly: 'price_1Skmm17141DXdb9v6pux6HK3'
            },
            public: {
                monthly: 'price_1Skmm27141DXdb9vtAyRoIcl',
                yearly: 'price_1Skmm27141DXdb9vUsKSJ6xT'
            },
            productId: 'prod_TiDCJozKNAbDKi'
        },

        features: [
            '3 Cloni AI',
            '20.000 msg/mese',
            '3 Canali / clone',
            'GPT-4o 💎 (premium AI)',
            'API Access (rate limit 20K)',
            'Priority Support <12h',
            'Analytics Advanced + Export',
            'Integrazioni Zapier/Make'
        ],
        limits: {
            clones: 3,
            messagesPerMonth: 20000,
            channels: 9,
            teamMembers: 10,
            analyticsRetentionDays: 365,
            apiAccess: true,
            whiteLabel: false,
            prioritySupport: true
        },
        ai: {
            provider: 'gpt-4o',
            maxTokensPerMessage: 1000,
            priority: 'priority'
        }
    },

    imperatore: {
        name: 'imperatore',
        displayName: 'Imperatore',
        tagline: 'L\'impero digitale definitivo',

        // FOUNDER: €595/m (25% off from €797)
        founderPrice: 595,
        founderYearlyPrice: 5950,
        founderSpots: 25,
        founderDiscount: '25% OFF',

        // PUBLIC: €797/m (increases 12%/year)
        publicPrice: 797,
        publicYearlyPrice: 7970,

        stripe: {
            founder: {
                monthly: 'price_1Skmm37141DXdb9vCpw491HD',
                yearly: 'price_1Skmm37141DXdb9vBrtVu81f'
            },
            public: {
                monthly: 'price_1Skmm37141DXdb9vr31wFjdb',
                yearly: 'price_1Skmm47141DXdb9v2VnWEyyo'
            },
            productId: 'prod_TiDCIxUh9DXQ3S'
        },

        features: [
            '10 Cloni AI (agency mode)',
            '50.000 msg/mese',
            'Canali illimitati',
            'GPT-4 Turbo 🧠 (max quality)',
            'White-label completo',
            'API Priority',
            'Account Manager dedicato',
            'Priority Support <6h',
            'Onboarding 2h incluso'
        ],
        limits: {
            clones: 10,
            messagesPerMonth: 50000, // 50K limit (was unlimited)
            channels: 999,
            teamMembers: 50,
            analyticsRetentionDays: 730, // 2 years
            apiAccess: true,
            whiteLabel: true,
            prioritySupport: true
        },
        ai: {
            provider: 'gpt-4-turbo',
            maxTokensPerMessage: 1500,
            priority: 'priority'
        }
    }
};

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Get the appropriate price based on founder availability
 */
export function getPriceForPlan(
    plan: PlanTier,
    isFounderSpotAvailable: boolean,
    billing: 'monthly' | 'yearly'
): number {
    const pricing = PRICING[plan];

    if (isFounderSpotAvailable) {
        return billing === 'monthly' ? pricing.founderPrice : pricing.founderYearlyPrice;
    }
    return billing === 'monthly' ? pricing.publicPrice : pricing.publicYearlyPrice;
}

/**
 * Get Stripe Price ID based on founder status
 */
export function getStripePriceId(
    plan: PlanTier,
    isFounder: boolean,
    billing: 'monthly' | 'yearly'
): string {
    const pricing = PRICING[plan];
    const tier = isFounder ? 'founder' : 'public';
    return pricing.stripe[tier][billing];
}

/**
 * Calculate savings for founder vs public
 */
export function getFounderSavings(plan: PlanTier, billing: 'monthly' | 'yearly'): {
    savingsAmount: number;
    savingsPercent: number;
} {
    const pricing = PRICING[plan];
    const founderPrice = billing === 'monthly' ? pricing.founderPrice : pricing.founderYearlyPrice;
    const publicPrice = billing === 'monthly' ? pricing.publicPrice : pricing.publicYearlyPrice;

    const savingsAmount = publicPrice - founderPrice;
    const savingsPercent = Math.round((savingsAmount / publicPrice) * 100);

    return { savingsAmount, savingsPercent };
}

/**
 * Get total potential Founder revenue if all spots filled
 */
export function getTotalFounderPotentialMRR(): number {
    return Object.values(PRICING).reduce((total, plan) => {
        return total + (plan.founderPrice * plan.founderSpots);
    }, 0);
}

// Total MRR if all founder spots filled:
// Curioso: 1000 × €0 = €0
// Esploratore: 200 × €39 = €7,800
// Pioniere: 150 × €97 = €14,550
// Conquistatore: 50 × €197 = €9,850
// Imperatore: 25 × €397 = €9,925
// TOTAL FOUNDER MRR POTENTIAL: €42,125/month 🚀

export type { PlanPricing };
