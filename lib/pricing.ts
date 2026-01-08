// =============================================
// 👑 VIRTUALTWIN IMPERIAL PRICING
// €1M Revenue Path Strategy
// Founder (Lifetime Lock) + Public (Escalating)
// =============================================

export type PlanTier = 'curioso' | 'solopreneur' | 'entrepreneur' | 'conquistatore' | 'imperatore' | 'sovereignty';
export type PricingTier = 'founder' | 'public';

// =============================================
// 🔗 STRIPE PRICE ID MAPPING
// Maps new tier names to existing Stripe Price IDs
// =============================================

// Legacy tier names mapped to Stripe Price IDs
const STRIPE_LEGACY_MAP = {
    solopreneur: 'aspirante',      // solopreneur maps to aspirante Stripe product
    entrepreneur: 'pioniere',       // entrepreneur maps to pioniere Stripe product
} as const;

// =============================================
// 💰 IMPERIAL PRICES - THE €1M STRATEGY
// =============================================

export const IMPERIAL_PRICES = {
    // FOUNDER GENESIS: Lifetime locked prices (20 spots per wave)
    founder: {
        solopreneur: 49,      // Entry-level permanent
        entrepreneur: 147,     // ⭐ BESTSELLER
        conquistatore: 347,    // Agency tier
        imperatore: 697,       // 👑 Enterprise
    },
    // PUBLIC Q1 2026: Jan-Mar (current /start prices)
    public_2026: {
        solopreneur: 49,       // Same price (no founder discount)
        entrepreneur: 697,     // ~5× Founder
        conquistatore: 1197,   // ~3.5× Founder
        imperatore: 1997,      // ~3× Founder
    },
    // PUBLIC Q2 2026: Apr-Jun (+€50 each tier)
    public_2027: {
        entrepreneur: 747,
        conquistatore: 1297,
        imperatore: 2097,
    },
    // PUBLIC Q3+ 2026: Jul+ (final tier for comparison display)
    public_2030: {
        entrepreneur: 797,
        conquistatore: 1397,
        imperatore: 2197,
    },
} as const;

// =============================================
// 🔐 PLAN LIMITS (Critical for Cost Protection)
// =============================================

export const PLAN_LIMITS = {
    curioso: {
        clones: 1,
        messagesPerMonth: 100,
        channels: 0,
        teamMembers: 1,
        analyticsRetentionDays: 7,
        apiAccess: false,
        apiRatePerMinute: 0,
        whiteLabel: false,
        prioritySupport: false,
        aiProvider: 'gemini-flash' as const,
        maxTokensPerMessage: 300,
    },
    solopreneur: {
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
    entrepreneur: {
        clones: 3,
        messagesPerMonth: 5000,
        channels: 3,
        teamMembers: 3,
        analyticsRetentionDays: 90,
        apiAccess: false,
        apiRatePerMinute: 0,
        whiteLabel: false,
        prioritySupport: true,
        aiProvider: 'gemini-pro' as const,
        maxTokensPerMessage: 800,
    },
    conquistatore: {
        clones: 5,
        messagesPerMonth: 20000,
        channels: 999,
        teamMembers: 10,
        analyticsRetentionDays: 365,
        apiAccess: true,
        apiRatePerMinute: 60,
        whiteLabel: false,
        prioritySupport: true,
        aiProvider: 'gpt-4o' as const,
        maxTokensPerMessage: 1000,
    },
    imperatore: {
        clones: 15,
        messagesPerMonth: 100000,
        channels: -1,
        teamMembers: 50,
        analyticsRetentionDays: 730,
        apiAccess: true,
        apiRatePerMinute: 300,
        whiteLabel: true,
        prioritySupport: true,
        aiProvider: 'gpt-4-turbo' as const,
        maxTokensPerMessage: 2000,
    },
    sovereignty: {
        clones: 999,
        messagesPerMonth: 999999,
        channels: -1,
        teamMembers: 999,
        analyticsRetentionDays: 9999,
        apiAccess: true,
        apiRatePerMinute: 1000,
        whiteLabel: true,
        prioritySupport: true,
        aiProvider: 'gpt-4-turbo' as const,
        maxTokensPerMessage: 4000,
    },
} as const;

// =============================================
// 🎫 STRIPE PRICE IDs - IMPERIAL STRATEGY
// Note: Using legacy mapping for backward compatibility
// =============================================

export const STRIPE_PRICES = {
    founder: {
        solopreneur: {
            monthly: 'price_1SlyfV7141DXdb9v9WiLhhS0',  // €49
            yearly: '',
        },
        entrepreneur: {
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
        solopreneur: {
            monthly: 'price_1SlyfV7141DXdb9v9WiLhhS0',  // €49 - Same as founder
            yearly: '',
        },
        entrepreneur: {
            monthly: 'price_1Sl7lP7141DXdb9vZKdx4eCE',  // €697
            yearly: 'price_IMPERIAL_PUBLIC_PIONIERE_Y',
        },
        conquistatore: {
            monthly: 'price_1Sl7lQ7141DXdb9vdLOjIhXf',  // €1197
            yearly: 'price_IMPERIAL_PUBLIC_CONQUISTATORE_Y',
        },
        imperatore: {
            monthly: 'price_1Sl7lQ7141DXdb9vawSyDQdV',  // €1997
            yearly: 'price_IMPERIAL_PUBLIC_IMPERATORE_Y',
        },
    },
} as const;

// =============================================
// 🎯 FOUNDER PROGRAM CONFIGURATION
// Wave 1: Genesis (Ultra-Exclusive)
// =============================================

export const FOUNDER_CONFIG = {
    currentWave: 'genesis' as const,
    totalSpots: 20,
    deadline: new Date('2026-03-31T23:59:59'),

    waves: {
        genesis: { spots: 20, priceMultiplier: 1.0 },
        pioneer: { spots: 30, priceMultiplier: 1.34 },
        elite: { spots: 50, priceMultiplier: 1.68 },
    },

    benefits: [
        'Prezzo bloccato LIFETIME',
        'Badge Genesis Founder 🏆',
        'Accesso a tutte le future feature',
        'Priority Support Tier 0',
        'Early Beta Testing',
        'Gruppo Telegram VIP Esclusivo',
    ],
};

// =============================================
// 📊 PLAN DISPLAY INFO
// =============================================

export const PLAN_DISPLAY = {
    curioso: {
        name: 'Curioso',
        tagline: 'Prova gratuita 14 giorni',
        icon: '🔍',
        popular: false,
    },
    solopreneur: {
        name: 'Solopreneur',
        tagline: 'Per freelancer e coach in P.IVA',
        icon: '⚡',
        popular: false,
    },
    entrepreneur: {
        name: 'Entrepreneur',
        tagline: 'Il più scelto dai professionisti (68%)',
        icon: '🚀',
        popular: true,
    },
    conquistatore: {
        name: 'Conquistatore',
        tagline: 'Per PMI e agenzie Scale-Up',
        icon: '💎',
        popular: false,
    },
    imperatore: {
        name: 'Imperatore',
        tagline: 'Enterprise White-Label',
        icon: '👑',
        popular: false,
    },
    sovereignty: {
        name: 'Sovereignty',
        tagline: 'Partnership Strategica',
        icon: '🌐',
        popular: false,
    },
} as const;

// =============================================
// 🛠️ HELPER FUNCTIONS
// =============================================

type PaidPlanTier = Exclude<PlanTier, 'curioso' | 'sovereignty'>;

/**
 * Get the Stripe Price ID for a plan
 */
export function getStripePriceId(
    plan: PlanTier,
    isFounder: boolean = true,
    billing: 'monthly' | 'yearly' = 'monthly'
): string {
    if (plan === 'curioso' || plan === 'sovereignty') return '';

    const tier = isFounder ? 'founder' : 'public';
    const priceConfig = STRIPE_PRICES[tier][plan as PaidPlanTier];

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
    if (plan === 'curioso' || plan === 'sovereignty') return 0;

    const prices = isFounder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_2026;
    return prices[plan as PaidPlanTier] || 0;
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
export function calculateFounderSavings(plan: PaidPlanTier): number {
    const founderMonthly = IMPERIAL_PRICES.founder[plan];
    const publicMonthly = IMPERIAL_PRICES.public_2026[plan];
    const monthlyDiff = publicMonthly - founderMonthly;
    return monthlyDiff * 60; // 5 years = 60 months
}

/**
 * Get founder discount percentage
 */
export function getFounderDiscount(plan: PaidPlanTier): number {
    const founder = IMPERIAL_PRICES.founder[plan];
    const public26 = IMPERIAL_PRICES.public_2026[plan];
    return Math.round(((public26 - founder) / public26) * 100);
}

// =============================================
// 🔄 LEGACY COMPATIBILITY
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
    limits: typeof PLAN_LIMITS[keyof typeof PLAN_LIMITS];
    ai: {
        provider: string;
        maxTokensPerMessage: number;
        priority: string;
    };
}

export const PRICING: Record<PlanTier, LegacyPlanPricing> = {
    curioso: {
        name: 'curioso',
        displayName: 'Curioso',
        tagline: 'Prova gratuita 14 giorni',
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
        features: ['14 giorni trial', '1 Clone AI', '100 msg totali', '0 Canali', 'Watermark'],
        limits: PLAN_LIMITS.curioso,
        ai: {
            provider: PLAN_LIMITS.curioso.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.curioso.maxTokensPerMessage,
            priority: 'standard'
        }
    },
    solopreneur: {
        name: 'solopreneur',
        displayName: 'Solopreneur',
        tagline: 'Per freelancer e coach in P.IVA',
        founderPrice: 49,
        founderYearlyPrice: 490,
        founderSpots: 0,
        founderDiscount: 'Entry-level',
        publicPrice: 49,
        publicYearlyPrice: 490,
        stripe: {
            founder: STRIPE_PRICES.founder.solopreneur,
            public: STRIPE_PRICES.public.solopreneur,
            productId: 'prod_solopreneur'
        },
        features: ['1 Clone AI', '1.000 msg/mese', '1 Canale', 'Template 15 settori', 'Corso Academy', 'Community', 'Email Support'],
        limits: PLAN_LIMITS.solopreneur,
        ai: {
            provider: PLAN_LIMITS.solopreneur.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.solopreneur.maxTokensPerMessage,
            priority: 'standard'
        }
    },
    entrepreneur: {
        name: 'entrepreneur',
        displayName: 'Entrepreneur',
        tagline: 'Il più scelto dai professionisti (68%)',
        popular: true,
        founderPrice: IMPERIAL_PRICES.founder.entrepreneur,
        founderYearlyPrice: IMPERIAL_PRICES.founder.entrepreneur * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('entrepreneur')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.entrepreneur,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.entrepreneur * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.entrepreneur,
            public: STRIPE_PRICES.public.entrepreneur,
            productId: 'prod_entrepreneur'
        },
        features: ['3 Cloni AI', '5.000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro', 'Email Support <24h'],
        limits: PLAN_LIMITS.entrepreneur,
        ai: {
            provider: PLAN_LIMITS.entrepreneur.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.entrepreneur.maxTokensPerMessage,
            priority: 'high'
        }
    },
    conquistatore: {
        name: 'conquistatore',
        displayName: 'Conquistatore',
        tagline: 'Per PMI e agenzie Scale-Up',
        founderPrice: IMPERIAL_PRICES.founder.conquistatore,
        founderYearlyPrice: IMPERIAL_PRICES.founder.conquistatore * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('conquistatore')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.conquistatore,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.conquistatore * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.conquistatore,
            public: STRIPE_PRICES.public.conquistatore,
            productId: 'prod_conquistatore'
        },
        features: ['5 Cloni AI', '20.000 msg/mese', 'API Access (60 req/min)', 'Canali Illimitati', 'Priority Support <12h'],
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
        tagline: 'Enterprise White-Label',
        founderPrice: IMPERIAL_PRICES.founder.imperatore,
        founderYearlyPrice: IMPERIAL_PRICES.founder.imperatore * 10,
        founderSpots: 153,
        founderDiscount: `${getFounderDiscount('imperatore')}% OFF`,
        publicPrice: IMPERIAL_PRICES.public_2026.imperatore,
        publicYearlyPrice: IMPERIAL_PRICES.public_2026.imperatore * 10,
        stripe: {
            founder: STRIPE_PRICES.founder.imperatore,
            public: STRIPE_PRICES.public.imperatore,
            productId: 'prod_imperatore'
        },
        features: ['15 Cloni AI', '100K msg/mese', 'White-label', 'Account Manager', 'API Priority (300 req/min)', 'Priority Support <6h'],
        limits: PLAN_LIMITS.imperatore,
        ai: {
            provider: PLAN_LIMITS.imperatore.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.imperatore.maxTokensPerMessage,
            priority: 'priority'
        }
    },
    sovereignty: {
        name: 'sovereignty',
        displayName: 'Sovereignty',
        tagline: 'Partnership Strategica',
        founderPrice: 0,
        founderYearlyPrice: 0,
        founderSpots: 0,
        founderDiscount: 'CUSTOM',
        publicPrice: 0,
        publicYearlyPrice: 0,
        stripe: {
            founder: { monthly: '', yearly: '' },
            public: { monthly: '', yearly: '' },
            productId: ''
        },
        features: ['Cloni Custom', 'Messaggi Custom', 'White-label', 'Dedicated Account Manager', 'API Custom', 'SLA Custom'],
        limits: PLAN_LIMITS.sovereignty,
        ai: {
            provider: PLAN_LIMITS.sovereignty.aiProvider,
            maxTokensPerMessage: PLAN_LIMITS.sovereignty.maxTokensPerMessage,
            priority: 'priority'
        }
    }
};

// =============================================
// 📐 REVENUE PROJECTIONS (For Reference)
// =============================================

export const REVENUE_PROJECTIONS = {
    q1_2026_founder: {
        solopreneur: { count: 50, price: 49, mrr: 2450 },
        entrepreneur: { count: 60, price: 147, mrr: 8820 },
        conquistatore: { count: 30, price: 347, mrr: 10410 },
        imperatore: { count: 13, price: 697, mrr: 9061 },
        total_mrr: 30741,
        total_arr: 368892,
    },
    q4_2026_mixed: {
        founder_mrr: 30741,
        public_mrr: 35430,
        total_mrr: 66171,
        total_arr: 794052,
    },
    q4_2027_scale: {
        total_mrr: 115686,
        total_arr: 1388232,
    },
} as const;
