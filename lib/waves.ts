/**
 * Wave Pricing System
 * 
 * Gestisce le wave Founder (Genesis → Pioneer → Elite)
 * e i prezzi pubblici time-based per /start
 */

// =============================================
// TYPES
// =============================================

export interface Wave {
    id: string;
    name: string;
    nameFull: string;
    spots: number;
    startDate: string;
    endDate: string;
    prices: {
        curioso: number;
        esploratore: number;
        pioniere: number;
        conquistatore: number;
        imperatore: number;
    };
    stripePriceIds: {
        curioso: string;
        esploratore: string;
        pioniere: string;
        conquistatore: string;
        imperatore: string;
    };
    tier: 'founder' | 'public';
}

export interface PublicPricing {
    id: string;
    startDate: string;
    endDate: string;
    prices: {
        curioso: number;
        esploratore: number;
        pioniere: number;
        conquistatore: number;
        imperatore: number;
    };
    stripePriceIds: {
        curioso: string;
        esploratore: string;
        pioniere: string;
        conquistatore: string;
        imperatore: string;
    };
    tier: 'founder' | 'public';
}

// =============================================
// WAVE CONFIGURATION
// =============================================

export const WAVES: Wave[] = [
    {
        id: 'genesis',
        name: 'Genesis',
        nameFull: 'Genesis Founder Wave',
        spots: 20,
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        prices: {
            curioso: 0,
            esploratore: 39,
            pioniere: 147,
            conquistatore: 347,
            imperatore: 697
        },
        stripePriceIds: {
            curioso: 'free_tier_placeholder',
            esploratore: 'price_1SlX717141DXdb9vzAEbFLdY',
            pioniere: 'price_1SlX727141DXdb9vdgRHbxrD',
            conquistatore: 'price_1SlX727141DXdb9vCKAM0WCi',
            imperatore: 'price_1SlX737141DXdb9vTmQmgd9Z'
        },
        tier: 'founder'
    },
    {
        id: 'pioneer',
        name: 'Pioneer',
        nameFull: 'Pioneer Founder Wave',
        spots: 20,
        startDate: '2026-04-01',
        endDate: '2026-06-30',
        prices: {
            curioso: 0,
            esploratore: 59,
            pioniere: 197,
            conquistatore: 447,
            imperatore: 897
        },
        stripePriceIds: {
            curioso: 'free_tier_placeholder',
            esploratore: 'price_1SlX747141DXdb9v7RaiL2FW',
            pioniere: 'price_1SlX747141DXdb9vj97oU4F2',
            conquistatore: 'price_1SlX757141DXdb9vVTtcw0qw',
            imperatore: 'price_1SlX767141DXdb9vJQLtn9s2'
        },
        tier: 'founder'
    },
    {
        id: 'elite',
        name: 'Elite',
        nameFull: 'Elite Founder Wave',
        spots: 20,
        startDate: '2026-07-01',
        endDate: '2026-09-30',
        prices: {
            curioso: 0,
            esploratore: 79,
            pioniere: 247,
            conquistatore: 547,
            imperatore: 1097
        },
        stripePriceIds: {
            curioso: 'free_tier_placeholder',
            esploratore: 'price_1SlX767141DXdb9vQ1NBwZHT',
            pioniere: 'price_1SlX777141DXdb9vMSBYuzHB',
            conquistatore: 'price_1SlX777141DXdb9v37XSqeR6',
            imperatore: 'price_1SlX787141DXdb9vhn2fJpVx'
        },
        tier: 'founder'
    }
];

// =============================================
// PUBLIC PRICING (Time-Based)
// =============================================

export const PUBLIC_PRICING: PublicPricing[] = [
    {
        id: 'q1_2026',
        startDate: '2026-01-01',
        endDate: '2026-03-31',
        prices: {
            curioso: 0,
            esploratore: 297,
            pioniere: 697,
            conquistatore: 1197,
            imperatore: 1997
        },
        stripePriceIds: {
            curioso: 'free_tier_placeholder',
            esploratore: 'price_1SlX787141DXdb9vqXSlofaP',
            pioniere: 'price_1SlX797141DXdb9vfjEhb8Al',
            conquistatore: 'price_1SlX7A7141DXdb9vf3zLKG2q',
            imperatore: 'price_1SlX7A7141DXdb9vbmrUZY5i'
        },
        tier: 'public'
    },
    {
        id: 'q2_2026',
        startDate: '2026-04-01',
        endDate: '2026-06-30',
        prices: {
            curioso: 0,
            esploratore: 347,
            pioniere: 747,
            conquistatore: 1297,
            imperatore: 2097
        },
        stripePriceIds: {
            curioso: 'free_tier_placeholder',
            esploratore: 'price_1SlX7B7141DXdb9vI5yHtSLp',
            pioniere: 'price_1SlX7C7141DXdb9vuq79oTiz',
            conquistatore: 'price_1SlX7C7141DXdb9v0gpSYRNU',
            imperatore: 'price_1SlX7D7141DXdb9vLhuoEr4g'
        },
        tier: 'public'
    },
    {
        id: 'q3_2026',
        startDate: '2026-07-01',
        endDate: '2026-12-31',
        prices: {
            curioso: 0,
            esploratore: 397,
            pioniere: 797,
            conquistatore: 1397,
            imperatore: 2197
        },
        stripePriceIds: {
            curioso: 'free_tier_placeholder',
            esploratore: 'price_1SlX7D7141DXdb9vjK0CGHD6',
            pioniere: 'price_1SlX7E7141DXdb9v63Co4hK7',
            conquistatore: 'price_1SlX7F7141DXdb9vk4Jz7Ulf',
            imperatore: 'price_1SlX7F7141DXdb9ve9Dk9yQm'
        },
        tier: 'public'
    }
];

// =============================================
// HELPER FUNCTIONS
// =============================================

/**
 * Get current date for comparisons
 */
function getCurrentDate(): Date {
    return new Date();
}

/**
 * Get number of founders sold (from Supabase)
 * This should be called on the server side
 */
export async function getFoundersSold(): Promise<number> {
    // Import dynamically to avoid client-side issues
    const { supabase } = await import('@/lib/supabase');

    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_founder', true);

    return count || 0;
}

/**
 * Get current active wave based on spots sold
 */
export async function getCurrentWave(): Promise<Wave | null> {
    const foundersSold = await getFoundersSold();

    let cumulativeSpots = 0;

    for (const wave of WAVES) {
        cumulativeSpots += wave.spots;

        if (foundersSold < cumulativeSpots) {
            return wave;
        }
    }

    // All waves sold out
    return null;
}

/**
 * Get wave by ID
 */
export function getWaveById(waveId: string): Wave | undefined {
    return WAVES.find(w => w.id === waveId);
}

/**
 * Get remaining spots for current wave
 */
export async function getCurrentWaveSpotsRemaining(): Promise<number> {
    const foundersSold = await getFoundersSold();
    const currentWave = await getCurrentWave();

    if (!currentWave) return 0;

    // Calculate cumulative spots before current wave
    let spotsBeforeCurrentWave = 0;
    for (const wave of WAVES) {
        if (wave.id === currentWave.id) break;
        spotsBeforeCurrentWave += wave.spots;
    }

    const spotsUsedInCurrentWave = foundersSold - spotsBeforeCurrentWave;
    return currentWave.spots - spotsUsedInCurrentWave;
}

/**
 * Get next wave after current
 */
export async function getNextWave(): Promise<Wave | null> {
    const currentWave = await getCurrentWave();

    if (!currentWave) return null;

    const currentIndex = WAVES.findIndex(w => w.id === currentWave.id);

    if (currentIndex < WAVES.length - 1) {
        return WAVES[currentIndex + 1];
    }

    return null;
}

/**
 * Get current public pricing based on date
 */
export function getCurrentPublicPricing(): PublicPricing {
    const now = getCurrentDate();

    for (const pricing of PUBLIC_PRICING) {
        const start = new Date(pricing.startDate);
        const end = new Date(pricing.endDate);

        if (now >= start && now <= end) {
            return pricing;
        }
    }

    // Default to latest pricing if beyond all periods
    return PUBLIC_PRICING[PUBLIC_PRICING.length - 1];
}

/**
 * Get next public pricing (for urgency messaging)
 */
export function getNextPublicPricing(): PublicPricing | null {
    const current = getCurrentPublicPricing();
    const currentIndex = PUBLIC_PRICING.findIndex(p => p.id === current.id);

    if (currentIndex < PUBLIC_PRICING.length - 1) {
        return PUBLIC_PRICING[currentIndex + 1];
    }

    return null;
}

/**
 * Get display pricing (Smart logic: Founder if available, else Public)
 */
export async function getDisplayPricing(): Promise<{
    prices: Record<string, number>;
    stripePriceIds: Record<string, string>;
    tier: 'founder' | 'public';
    waveName?: string;
    spotsRemaining?: number;
}> {
    const currentWave = await getCurrentWave();

    if (currentWave) {
        return {
            prices: currentWave.prices,
            stripePriceIds: currentWave.stripePriceIds,
            tier: 'founder',
            waveName: currentWave.name,
            spotsRemaining: await getCurrentWaveSpotsRemaining()
        };
    }

    // Fallback to Public
    const publicPricing = getCurrentPublicPricing();
    return {
        prices: publicPricing.prices,
        stripePriceIds: publicPricing.stripePriceIds,
        tier: 'public'
    };
}

/**
 * Calculate days until price increase
 */
export function getDaysUntilPriceIncrease(): number {
    const current = getCurrentPublicPricing();
    const endDate = new Date(current.endDate);
    const now = getCurrentDate();

    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
}

/**
 * Get wave start date formatted
 */
export function getWaveStartDateFormatted(wave: Wave): string {
    const date = new Date(wave.startDate);
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Check if all founder waves are sold out
 */
export async function areAllWavesSoldOut(): Promise<boolean> {
    const currentWave = await getCurrentWave();
    return currentWave === null;
}

/**
 * Get total founder spots across all waves
 */
export function getTotalFounderSpots(): number {
    return WAVES.reduce((total, wave) => total + wave.spots, 0);
}

/**
 * Detect when a new wave opens (called after each Founder purchase)
 * Returns info about wave transition if it just happened
 */
export async function detectWaveOpening(): Promise<{
    waveJustOpened: boolean;
    prevWave: Wave | null;
    newWave: Wave | null;
    spotsAvailable: number;
} | null> {
    const foundersSold = await getFoundersSold();

    // Check if we just crossed a wave boundary
    let cumulativeSpots = 0;

    for (let i = 0; i < WAVES.length; i++) {
        const wave = WAVES[i];

        // Did we just fill the previous wave?
        // E.g., if Genesis has 20 spots and foundersSold = 20, Pioneer just opened
        if (foundersSold === cumulativeSpots && i > 0) {
            return {
                waveJustOpened: true,
                prevWave: WAVES[i - 1],
                newWave: wave,
                spotsAvailable: wave.spots
            };
        }

        cumulativeSpots += wave.spots;
    }

    return null;
}

/**
 * Get wave by ID helper
 */
export function getWaveByIdSafe(waveId: string): Wave | undefined {
    return WAVES.find(w => w.id === waveId);
}
