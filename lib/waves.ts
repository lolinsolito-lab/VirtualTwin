/**
 * Wave Pricing System - CLEANED UP
 * 
 * Gestisce le wave Founder (Genesis → Pioneer → Elite)
 * e i prezzi pubblici time-based
 * 
 * TIERS (NEW NAMES):
 * - solopreneur (€49 fisso fino 2027, poi €59)
 * - entrepreneur (Tier 3 - €147 founder / €697+ public)
 * - conquistatore (Tier 4 - €347 founder / €1197+ public)
 * - imperatore (Tier 5 - €697 founder / €1997+ public)
 * 
 * Prezzi pubblici aumentano ogni 6 MESI
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
        solopreneur: number;
        entrepreneur: number;
        conquistatore: number;
        imperatore: number;
    };
    stripePriceIds: {
        solopreneur: string;
        entrepreneur: string;
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
        solopreneur: number;
        entrepreneur: number;
        conquistatore: number;
        imperatore: number;
    };
    stripePriceIds: {
        solopreneur: string;
        entrepreneur: string;
        conquistatore: string;
        imperatore: string;
    };
    tier: 'public';
}

// =============================================
// FOUNDER WAVE CONFIGURATION
// 3 Waves, 20 spots each, Lifetime Price Lock
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
            solopreneur: 49,
            entrepreneur: 147,
            conquistatore: 347,
            imperatore: 697
        },
        stripePriceIds: {
            solopreneur: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            entrepreneur: 'price_1SlX727141DXdb9vdgRHbxrD',
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
            solopreneur: 49,
            entrepreneur: 197,
            conquistatore: 447,
            imperatore: 897
        },
        stripePriceIds: {
            solopreneur: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            entrepreneur: 'price_1SlX747141DXdb9vj97oU4F2',
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
            solopreneur: 49,
            entrepreneur: 247,
            conquistatore: 547,
            imperatore: 1097
        },
        stripePriceIds: {
            solopreneur: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            entrepreneur: 'price_1SlX777141DXdb9vMSBYuzHB',
            conquistatore: 'price_1SlX777141DXdb9v37XSqeR6',
            imperatore: 'price_1SlX787141DXdb9vhn2fJpVx'
        },
        tier: 'founder'
    }
];

// =============================================
// PUBLIC PRICING (Time-Based, +€50-100 ogni 6 MESI)
// =============================================

export const PUBLIC_PRICING: PublicPricing[] = [
    {
        id: 'h1_2026',
        startDate: '2026-01-01',
        endDate: '2026-06-30',
        prices: {
            solopreneur: 49,
            entrepreneur: 697,
            conquistatore: 1197,
            imperatore: 1997
        },
        stripePriceIds: {
            solopreneur: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            entrepreneur: 'price_1SlX797141DXdb9vfjEhb8Al',
            conquistatore: 'price_1SlX7A7141DXdb9vf3zLKG2q',
            imperatore: 'price_1SlX7A7141DXdb9vbmrUZY5i'
        },
        tier: 'public'
    },
    {
        id: 'h2_2026',
        startDate: '2026-07-01',
        endDate: '2026-12-31',
        prices: {
            solopreneur: 49,
            entrepreneur: 797,
            conquistatore: 1397,
            imperatore: 2197
        },
        stripePriceIds: {
            solopreneur: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            entrepreneur: 'price_1SlX7E7141DXdb9v63Co4hK7',
            conquistatore: 'price_1SlX7F7141DXdb9vk4Jz7Ulf',
            imperatore: 'price_1SlX7F7141DXdb9ve9Dk9yQm'
        },
        tier: 'public'
    },
    {
        id: 'h1_2027',
        startDate: '2027-01-01',
        endDate: '2027-06-30',
        prices: {
            solopreneur: 59,  // Increases to €59 in 2027
            entrepreneur: 897,
            conquistatore: 1597,
            imperatore: 2397
        },
        stripePriceIds: {
            solopreneur: 'price_1SngGX7141DXdb9vy68hlCYh',
            entrepreneur: 'price_1SngGX7141DXdb9voR7HhjDv',
            conquistatore: 'price_1SngGY7141DXdb9vyAw2V9Qs',
            imperatore: 'price_1SngGY7141DXdb9veg2cSplv'
        },
        tier: 'public'
    }
];

// =============================================
// HELPER FUNCTIONS
// =============================================

function getCurrentDate(): Date {
    return new Date();
}

export function isPreLaunch(): boolean {
    const launchDate = new Date('2026-02-01T00:00:00');
    return getCurrentDate() < launchDate;
}

export function getDaysUntilLaunch(): number {
    const launchDate = new Date('2026-02-01T00:00:00');
    const now = getCurrentDate();
    if (now >= launchDate) return 0;
    const diff = launchDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getTimeUntilLaunch(): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} {
    const launchDate = new Date('2026-02-01T00:00:00');
    const now = getCurrentDate();
    if (now >= launchDate) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const diff = launchDate.getTime() - now.getTime();
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
}

export async function getFoundersSold(): Promise<number> {
    const { supabase } = await import('@/lib/supabase');
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_founder', true);
    return count || 0;
}

export async function getWaitlistCount(): Promise<number> {
    const { supabase } = await import('@/lib/supabase');
    // Count users who registered but haven't subscribed yet (waitlist)
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_founder', false)
        .is('stripe_subscription_id', null);
    return count || 0;
}

export async function getCurrentWave(): Promise<Wave | null> {
    const foundersSold = await getFoundersSold();
    const now = getCurrentDate();
    let cumulativeSpots = 0;

    for (const wave of WAVES) {
        cumulativeSpots += wave.spots;
        const spotsFull = foundersSold >= cumulativeSpots;
        const timeExpired = now > new Date(wave.endDate);
        const notStarted = now < new Date(wave.startDate);
        const isFirstWave = wave.id === 'genesis';
        const allowPreLaunch = isFirstWave && isPreLaunch();

        if (spotsFull || timeExpired || (notStarted && !allowPreLaunch)) {
            continue;
        }
        return wave;
    }
    return null;
}

export function getWaveById(waveId: string): Wave | undefined {
    return WAVES.find(w => w.id === waveId);
}

export async function getCurrentWaveSpotsRemaining(): Promise<number> {
    const foundersSold = await getFoundersSold();
    const currentWave = await getCurrentWave();
    if (!currentWave) return 0;

    let spotsBeforeCurrentWave = 0;
    for (const wave of WAVES) {
        if (wave.id === currentWave.id) break;
        spotsBeforeCurrentWave += wave.spots;
    }
    const spotsUsedInCurrentWave = foundersSold - spotsBeforeCurrentWave;
    return currentWave.spots - spotsUsedInCurrentWave;
}

export async function getNextWave(): Promise<Wave | null> {
    const currentWave = await getCurrentWave();
    if (!currentWave) return null;
    const currentIndex = WAVES.findIndex(w => w.id === currentWave.id);
    if (currentIndex < WAVES.length - 1) {
        return WAVES[currentIndex + 1];
    }
    return null;
}

export function getCurrentPublicPricing(): PublicPricing {
    const now = getCurrentDate();
    for (const pricing of PUBLIC_PRICING) {
        const start = new Date(pricing.startDate);
        const end = new Date(pricing.endDate);
        if (now >= start && now <= end) {
            return pricing;
        }
    }
    return PUBLIC_PRICING[PUBLIC_PRICING.length - 1];
}

export function getNextPublicPricing(): PublicPricing | null {
    const current = getCurrentPublicPricing();
    const currentIndex = PUBLIC_PRICING.findIndex(p => p.id === current.id);
    if (currentIndex < PUBLIC_PRICING.length - 1) {
        return PUBLIC_PRICING[currentIndex + 1];
    }
    return null;
}

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
    const publicPricing = getCurrentPublicPricing();
    return {
        prices: publicPricing.prices,
        stripePriceIds: publicPricing.stripePriceIds,
        tier: 'public'
    };
}

export function getDaysUntilPriceIncrease(): number {
    const current = getCurrentPublicPricing();
    const endDate = new Date(current.endDate);
    const now = getCurrentDate();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

export function getWaveStartDateFormatted(wave: Wave): string {
    const date = new Date(wave.startDate);
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export async function areAllWavesSoldOut(): Promise<boolean> {
    const currentWave = await getCurrentWave();
    return currentWave === null;
}

export function getTotalFounderSpots(): number {
    return WAVES.reduce((total, wave) => total + wave.spots, 0);
}

export async function detectWaveOpening(): Promise<{
    waveJustOpened: boolean;
    prevWave: Wave | null;
    newWave: Wave | null;
    spotsAvailable: number;
} | null> {
    const foundersSold = await getFoundersSold();
    let cumulativeSpots = 0;

    for (let i = 0; i < WAVES.length; i++) {
        const wave = WAVES[i];
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

export function getWaveByIdSafe(waveId: string): Wave | undefined {
    return WAVES.find(w => w.id === waveId);
}
