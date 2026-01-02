// =============================================
// 👑 VIRTUALTWIN IMPERIAL PRICING
// €1M Revenue Path Strategy
// Founder (Lifetime Lock) + Public (Escalating)
// =============================================

export type PlanTier = 'curioso' | 'esploratore' | 'pioniere' | 'conquistatore' | 'imperatore';
export type PricingTier = 'founder' | 'public';

// =============================================
// 💰 IMPERIAL PRICES - THE €1M STRATEGY
// =============================================

export const IMPERIAL_PRICES = {
    // FOUNDER: Lifetime locked prices (153 spots)
    founder: {
        esploratore: 39,      // Entry level
        pioniere: 147,        // ⭐ BESTSELLER (+51% margin)
        conquistatore: 347,   // Agency tier
        imperatore: 697,      // 👑 Enterprise
    },
    // PUBLIC: Post-founder prices (Apr 2026+)
    public_2026: {
        esploratore: 79,
        pioniere: 297,        // 2× Founder
        conquistatore: 697,   // 2× Founder
        imperatore: 1197,     // 1.7× Founder
    },
    // PUBLIC 2027: +15% YoY increase
    public_2027: {
        esploratore: 89,
        pioniere: 347,
        conquistatore: 797,
        imperatore: 1347,
    },
    // PUBLIC 2030: Final target
    public_2030: {
        esploratore: 119,
        pioniere: 497,
        conquistatore: 1097,
        imperatore: 1797,
    },
} as const;

// =============================================
// 🔐 PLAN LIMITS (Critical for Cost Protection)
// =============================================

export const PLAN_LIMITS = {
    curioso: {
        clones: 1,
        messagesPerMonth: 100,
        channels: 1,
        teamMembers: 1,
        analyticsRetentionDays: 7,
        apiAccess: false,
        apiRatePerMinute: 0,
        whiteLabel: false,
        prioritySupport: false,
        aiProvider: 'gemini-flash' as const,
        maxTokensPerMessage: 300,
    },
    esploratore: {
        clones: 1,
        messagesPerMonth: 1000,
        channels: 1,
        teamMembers: 1,
        analyticsRetentionDays: 30,
        apiAccess: false,
        apiRatePerMinute: 0,
        whiteLabel: false,
        prioritySupport: false,
        aiProvider: 'gemini-flash' as const,
        maxTokensPerMessage: 500,
    },
    pioniere: {
        clones: 1,
        messagesPerMonth: 5000,
        channels: 3,
        teamMembers: 2,
        analyticsRetentionDays: 90,
        apiAccess: false,
        apiRatePerMinute: 0,
        whiteLabel: false,
        prioritySupport: false,
        aiProvider: 'gemini-pro' as const,
        maxTokensPerMessage: 1000,
    },
    conquistatore: {
        clones: 3,
        messagesPerMonth: 20000,
        channels: 9,
        teamMembers: 5,
        analyticsRetentionDays: 180,
        apiAccess: true,
        apiRatePerMinute: 60,
        whiteLabel: false,
        prioritySupport: true,
        aiProvider: 'gpt-4o' as const,
        maxTokensPerMessage: 2000,
    },
    imperatore: {
        clones: 10,
        messagesPerMonth: 50000,  // Soft limit
        channels: -1,              // Unlimited
        teamMembers: 20,
        analyticsRetentionDays: 365,
        apiAccess: true,
        apiRatePerMinute: 300,
        whiteLabel: true,
        prioritySupport: true,
        aiProvider: 'gpt-4-turbo' as const,
        maxTokensPerMessage: 4000,
    },
} as const;

// =============================================
// 🎫 STRIPE PRICE IDs - IMPERIAL STRATEGY
// Created: 2 Gennaio 2026
// =============================================

export const STRIPE_PRICES = {
    founder: {
        esploratore: {
            monthly: 'price_1Sl7lM7141DXdb9veGYbHSWE',  // €39
            yearly: 'price_IMPERIAL_FOUNDER_ESPLORATORE_Y',
        },
        pioniere: {
            monthly: 'price_1Sl7lN7141DXdb9vtRbfQuCs',  // €147
            yearly: 'price_IMPERIAL_FOUNDER_PIONIERE_Y',
        },
        conquistatore: {
            monthly: 'price_1Sl7lN7141DXdb9vlpkY114O',  // €347
            yearly: 'price_IMPERIAL_FOUNDER_CONQUISTATORE_Y',
        },
        imperatore: {
            monthly: 'price_1Sl7lO7141DXdb9vuNgZoKKQ',  // €697
            yearly: 'price_IMPERIAL_FOUNDER_IMPERATORE_Y',
        },
    },
    public: {
        esploratore: {
            monthly: 'price_1Sl7lP7141DXdb9vru3cdm3O',  // €79
            yearly: 'price_IMPERIAL_PUBLIC_ESPLORATORE_Y',
        },
        pioniere: {
            monthly: 'price_1Sl7lP7141DXdb9vZKdx4eCE',  // €297
            yearly: 'price_IMPERIAL_PUBLIC_PIONIERE_Y',
        },
        conquistatore: {
            monthly: 'price_1Sl7lQ7141DXdb9vdLOjIhXf',  // €697
            yearly: 'price_IMPERIAL_PUBLIC_CONQUISTATORE_Y',
        },
        imperatore: {
            monthly: 'price_1Sl7lQ7141DXdb9vawSyDQdV',  // €1197
            yearly: 'price_IMPERIAL_PUBLIC_IMPERATORE_Y',
        },
    },
} as const;

// =============================================
// 🎯 FOUNDER PROGRAM CONFIGURATION
// =============================================

export const FOUNDER_CONFIG = {
    totalSpots: 153,
    deadline: new Date('2026-03-31T23:59:59'),
    benefits: [
        'Prezzo bloccato LIFETIME',
        'Badge Legacy Founder',
        'Accesso a tutte le future feature',
        'Priority Support Tier 0',
        'Early Beta Testing',
    ],
};

// =============================================
// 📊 PLAN DISPLAY INFO
// =============================================

export const PLAN_DISPLAY = {
    curioso: {
        name: 'Curioso',
        tagline: 'Per testare il potere dell\'AI',
        icon: '🔍',
        popular: false,
    },
    esploratore: {
        name: 'Esploratore',
        tagline: 'Per chi inizia a scalare',
        icon: '⚡',
        popular: false,
    },
    pioniere: {
        name: 'Pioniere',
        tagline: 'Il piano più scelto',
        icon: '🚀',
        popular: true,
    },
    conquistatore: {
        name: 'Conquistatore',
        tagline: 'Per agenzie e power users',
        icon: '💎',
        popular: false,
    },
    imperatore: {
        name: 'Imperatore',
        tagline: 'Il trono digitale',
        icon: '👑',
        popular: false,
    },
} as const;

// =============================================
// 🛠️ HELPER FUNCTIONS
// =============================================

/**
 * Get the Stripe Price ID for a plan
 */
export function getStripePriceId(
    plan: PlanTier,
    isFounder: boolean = true,
    billing: 'monthly' | 'yearly' = 'monthly'
): string {
    if (plan === 'curioso') return ''; // Free tier

    const tier = isFounder ? 'founder' : 'public';
    const priceConfig = STRIPE_PRICES[tier][plan as Exclude<PlanTier, 'curioso'>];

    if (!priceConfig) {
        console.error(`No price config for ${tier}/${plan}`);
        return '';
    }

    return priceConfig[billing];
}

/**
 * Get the display price for a plan
 */
export function getDisplayPrice(
    plan: PlanTier,
    isFounder: boolean = true
): number {
    if (plan === 'curioso') return 0;

    const prices = isFounder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_2026;
    return prices[plan as Exclude<PlanTier, 'curioso'>] || 0;
}

/**
 * Get the plan limits
 */
export function getPlanLimits(plan: PlanTier) {
    return PLAN_LIMITS[plan];
}

/**
 * Check if user can create more clones
 */
export function canCreateClone(currentClones: number, plan: PlanTier): boolean {
    const limit = PLAN_LIMITS[plan].clones;
    return currentClones < limit;
}

/**
 * Check if user has messages remaining
 */
export function hasMessagesRemaining(usedMessages: number, plan: PlanTier): boolean {
    const limit = PLAN_LIMITS[plan].messagesPerMonth;
    return usedMessages < limit;
}

/**
 * Get the remaining messages for a plan
 */
export function getRemainingMessages(usedMessages: number, plan: PlanTier): number {
    const limit = PLAN_LIMITS[plan].messagesPerMonth;
    return Math.max(0, limit - usedMessages);
}

/**
 * Check if plan has API access
 */
export function hasApiAccess(plan: PlanTier): boolean {
    return PLAN_LIMITS[plan].apiAccess;
}

/**
 * Get API rate limit per minute
 */
export function getApiRateLimit(plan: PlanTier): number {
    return PLAN_LIMITS[plan].apiRatePerMinute;
}

/**
 * Get the AI provider for a plan
 */
export function getAiProvider(plan: PlanTier): string {
    return PLAN_LIMITS[plan].aiProvider;
}

/**
 * Calculate founder savings vs public over 5 years
 */
export function calculateFounderSavings(plan: Exclude<PlanTier, 'curioso'>): number {
    const founderMonthly = IMPERIAL_PRICES.founder[plan];
    const publicMonthly = IMPERIAL_PRICES.public_2026[plan];
    const monthlyDiff = publicMonthly - founderMonthly;
    return monthlyDiff * 60; // 5 years = 60 months
}

/**
 * Get founder discount percentage
 */
export function getFounderDiscount(plan: Exclude<PlanTier, 'curioso'>): number {
    const founder = IMPERIAL_PRICES.founder[plan];
    const public26 = IMPERIAL_PRICES.public_2026[plan];
    return Math.round(((public26 - founder) / public26) * 100);
}

// =============================================
// 🔄 LEGACY COMPATIBILITY
// (For existing code that uses old structure)
// =============================================

interface LegacyPlanPricing {
    name: string;
    displayName: string;
    tagline: string;
    popular?: boolean;
    founderPrice: number;
    founderYearlyPrice: number;
    founderSpots: number;
    founderDiscount: string;
    publicPrice: number;
    publicYearlyPrice: number;
    stripe: {
        founder: { monthly: string; yearly: string };
        public: { monthly: string; yearly: string };
        productId: string;
    };
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
    ai: {
        provider: string;
        maxTokensPerMessage: number;
        priority: string;
    };
}

// Legacy PRICING object for backward compatibility
export const PRICING: Record<PlanTier, LegacyPlanPricing> = {
    curioso: {
        name: 'curioso',
        displayName: 'Curioso',
        tagline: 'Per testare il potere dell\'AI',
        founderPrice: 0,
        founderYearlyPrice: 0,
        founderSpots: 1000,
        founderDiscount: 'GRATIS',
        publicPrice: 0,
        publicYearlyPrice: 0,
        stripe: {
            founder: { monthly: '', yearly: '' },
            public: { monthly: '', yearly: '' },
            productId: ''
        },
        features: ['14 giorni trial', '1 Clone AI', '100 msg/mese', '1 Canale', 'Watermark'],
        limits: PLAN_LIMITS.curioso,
        ai: {
            provider: PLAN_LIMITS.curioso.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.curioso.maxTokensPerMessage,
            priority: 'standard'
        }
    },
    esploratore: {
        name: 'esploratore',
        displayName: 'Esploratore',
        tagline: 'Per chi inizia a scalare',
        founderPrice: IMPERIAL_PRICES.founder.esploratore,
        founderYearlyPrice: IMPERIAL_PRICES.founder.esploratore * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('esploratore')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.esploratore,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.esploratore * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.esploratore,
            public: STRIPE_PRICES.public.esploratore,
            productId: 'prod_imperial_esploratore'
        },
        features: ['1 Clone AI', '1.000 msg/mese', '1 Canale', 'Analytics Base', 'Email Support <48h'],
        limits: PLAN_LIMITS.esploratore,
        ai: {
            provider: PLAN_LIMITS.esploratore.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.esploratore.maxTokensPerMessage,
            priority: 'standard'
        }
    },
    pioniere: {
        name: 'pioniere',
        displayName: 'Pioniere',
        tagline: 'Il piano più scelto',
        popular: true,
        founderPrice: IMPERIAL_PRICES.founder.pioniere,
        founderYearlyPrice: IMPERIAL_PRICES.founder.pioniere * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('pioniere')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.pioniere,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.pioniere * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.pioniere,
            public: STRIPE_PRICES.public.pioniere,
            productId: 'prod_imperial_pioniere'
        },
        features: ['1 Clone AI', '5.000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro', 'Email Support <24h'],
        limits: PLAN_LIMITS.pioniere,
        ai: {
            provider: PLAN_LIMITS.pioniere.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.pioniere.maxTokensPerMessage,
            priority: 'standard'
        }
    },
    conquistatore: {
        name: 'conquistatore',
        displayName: 'Conquistatore',
        tagline: 'Per agenzie e power users',
        founderPrice: IMPERIAL_PRICES.founder.conquistatore,
        founderYearlyPrice: IMPERIAL_PRICES.founder.conquistatore * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('conquistatore')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.conquistatore,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.conquistatore * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.conquistatore,
            public: STRIPE_PRICES.public.conquistatore,
            productId: 'prod_imperial_conquistatore'
        },
        features: ['3 Cloni AI', '20.000 msg/mese', 'API Access (60 req/min)', '9 Canali', 'Priority Support <12h'],
        limits: PLAN_LIMITS.conquistatore,
        ai: {
            provider: PLAN_LIMITS.conquistatore.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.conquistatore.maxTokensPerMessage,
            priority: 'high'
        }
    },
    imperatore: {
        name: 'imperatore',
        displayName: 'Imperatore',
        tagline: 'Il trono digitale',
        founderPrice: IMPERIAL_PRICES.founder.imperatore,
        founderYearlyPrice: IMPERIAL_PRICES.founder.imperatore * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('imperatore')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.imperatore,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.imperatore * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.imperatore,
            public: STRIPE_PRICES.public.imperatore,
            productId: 'prod_imperial_imperatore'
        },
        features: ['10 Cloni AI', '50K msg/mese', 'White-label', 'Account Manager', 'API Priority (300 req/min)', 'Priority Support <6h'],
        limits: PLAN_LIMITS.imperatore,
        ai: {
            provider: PLAN_LIMITS.imperatore.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.imperatore.maxTokensPerMessage,
            priority: 'priority'
        }
    }
};

// =============================================
// 📐 REVENUE PROJECTIONS (For Reference)
// =============================================

export const REVENUE_PROJECTIONS = {
    q1_2026_founder: {
        esploratore: { count: 50, price: 39, mrr: 1950 },
        pioniere: { count: 60, price: 147, mrr: 8820 },
        conquistatore: { count: 30, price: 347, mrr: 10410 },
        imperatore: { count: 13, price: 697, mrr: 9061 },
        total_mrr: 30241,
        total_arr: 362892, // €363K ✅ 6 cifre!
    },
    q4_2026_mixed: {
        founder_mrr: 30241,
        public_mrr: 35430,
        total_mrr: 65671,
        total_arr: 788052, // €788K
    },
    q4_2027_scale: {
        total_mrr: 115686,
        total_arr: 1388232, // €1.38M ✅ 7 cifre!
    },
} as const;
