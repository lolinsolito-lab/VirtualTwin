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
        esploratore: number;
        pioniere: number;
        conquistatore: number;
    };
    stripePriceIds: {
        esploratore: string;
        pioniere: string;
        conquistatore: string;
    };
}

export interface PublicPricing {
    id: string;
    startDate: string;
    endDate: string;
    prices: {
        esploratore: number;
        pioniere: number;
        conquistatore: number;
    };
    stripePriceIds: {
        esploratore: string;
        pioniere: string;
        conquistatore: string;
    };
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
            esploratore: 39,
            pioniere: 147,
            conquistatore: 347
        },
        stripePriceIds: {
            esploratore: 'price_genesis_esploratore',
            pioniere: 'price_1QcexNKkKlvbXgKiVpLj5VVS',
            conquistatore: 'price_1QcexzKkKlvbXgKihZ5h58aR'
        }
    },
    {
        id: 'pioneer',
        name: 'Pioneer',
        nameFull: 'Pioneer Founder Wave',
        spots: 20,
        startDate: '2026-04-01',
        endDate: '2026-06-30',
        prices: {
            esploratore: 59,
            pioniere: 197,
            conquistatore: 447
        },
        stripePriceIds: {
            // TODO: Creare prodotti Pioneer in Stripe
            esploratore: 'price_pioneer_esploratore',
            pioniere: 'price_pioneer_pioniere',
            conquistatore: 'price_pioneer_conquistatore'
        }
    },
    {
        id: 'elite',
        name: 'Elite',
        nameFull: 'Elite Founder Wave',
        spots: 20,
        startDate: '2026-07-01',
        endDate: '2026-09-30',
        prices: {
            esploratore: 79,
            pioniere: 247,
            conquistatore: 547
        },
        stripePriceIds: {
            // TODO: Creare prodotti Elite in Stripe
            esploratore: 'price_elite_esploratore',
            pioniere: 'price_elite_pioniere',
            conquistatore: 'price_elite_conquistatore'
        }
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
            esploratore: 297,
            pioniere: 697,
            conquistatore: 1197
        },
        stripePriceIds: {
            esploratore: 'price_1Qd0i5KkKlvbXgKiXQzOhfN8',
            pioniere: 'price_1Qd0idKkKlvbXgKiAwfhLKYi',
            conquistatore: 'price_1Qd0j6KkKlvbXgKilBW8PMOP'
        }
    },
    {
        id: 'q2_2026',
        startDate: '2026-04-01',
        endDate: '2026-06-30',
        prices: {
            esploratore: 347,
            pioniere: 747,
            conquistatore: 1297
        },
        stripePriceIds: {
            // TODO: Creare prodotti Q2 in Stripe
            esploratore: 'price_q2_esploratore',
            pioniere: 'price_q2_pioniere',
            conquistatore: 'price_q2_conquistatore'
        }
    },
    {
        id: 'q3_2026',
        startDate: '2026-07-01',
        endDate: '2026-12-31',
        prices: {
            esploratore: 397,
            pioniere: 797,
            conquistatore: 1397
        },
        stripePriceIds: {
            // TODO: Creare prodotti Q3 in Stripe
            esploratore: 'price_q3_esploratore',
            pioniere: 'price_q3_pioniere',
            conquistatore: 'price_q3_conquistatore'
        }
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
