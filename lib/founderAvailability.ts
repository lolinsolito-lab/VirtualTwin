import { supabase } from './supabase';

// Founder spots configuration per plan
export const FOUNDER_LIMITS = {
    curioso: 1000,      // Free tier - unlimited practically
    esploratore: 200,   // €39/m - 200 Founder spots
    pioniere: 150,      // €97/m - 150 Founder spots
    conquistatore: 50,  // €197/m - 50 Founder spots
    imperatore: 25,     // €397/m - 25 Founder spots (most exclusive)
} as const;

export type PlanName = keyof typeof FOUNDER_LIMITS;

export interface PlanAvailability {
    plan: PlanName;
    founderLimit: number;
    foundersSold: number;
    foundersRemaining: number;
    isSoldOut: boolean;
    percentSold: number;
}

/**
 * Get real-time availability for all plans
 * Now reads from profiles table (is_founder + plan_tier)
 */
export async function getPlanAvailability(): Promise<Record<PlanName, PlanAvailability>> {
    try {
        // Count Founders per plan from profiles table
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('plan_tier')
            .eq('is_founder', true)
            .in('subscription_status', ['active', 'trialing']);

        if (error) {
            console.error('Error fetching profiles:', error);
            return getDefaultAvailability();
        }

        // Count profiles per plan
        const counts: Record<string, number> = {};
        (profiles || []).forEach((profile) => {
            const plan = profile.plan_tier?.toLowerCase() as PlanName;
            if (plan) {
                counts[plan] = (counts[plan] || 0) + 1;
            }
        });

        // Build availability object
        const availability: Record<PlanName, PlanAvailability> = {} as Record<PlanName, PlanAvailability>;

        for (const [plan, limit] of Object.entries(FOUNDER_LIMITS)) {
            const sold = counts[plan] || 0;
            const remaining = Math.max(0, limit - sold);

            availability[plan as PlanName] = {
                plan: plan as PlanName,
                founderLimit: limit,
                foundersSold: sold,
                foundersRemaining: remaining,
                isSoldOut: remaining === 0,
                percentSold: Math.round((sold / limit) * 100),
            };
        }

        return availability;
    } catch (err) {
        console.error('Error in getPlanAvailability:', err);
        return getDefaultAvailability();
    }
}

/**
 * Get availability for a single plan
 */
export async function getSinglePlanAvailability(planName: PlanName): Promise<PlanAvailability> {
    const all = await getPlanAvailability();
    return all[planName];
}

/**
 * Check if a specific plan is sold out
 */
export async function isPlanSoldOut(planName: PlanName): Promise<boolean> {
    const availability = await getSinglePlanAvailability(planName);
    return availability.isSoldOut;
}

/**
 * Get total Founder spots remaining across all plans
 */
export async function getTotalFoundersRemaining(): Promise<number> {
    const availability = await getPlanAvailability();
    return Object.values(availability).reduce((sum, plan) => sum + plan.foundersRemaining, 0);
}

/**
 * Get the next available founder number (1-1000)
 */
export async function getNextFounderNumber(): Promise<number> {
    const { data, error } = await supabase
        .from('profiles')
        .select('founder_number')
        .not('founder_number', 'is', null)
        .order('founder_number', { ascending: false })
        .limit(1);

    if (error || !data || data.length === 0) {
        return 1; // First founder
    }

    return (data[0].founder_number || 0) + 1;
}

/**
 * Default availability when database is unavailable
 */
function getDefaultAvailability(): Record<PlanName, PlanAvailability> {
    const availability: Record<PlanName, PlanAvailability> = {} as Record<PlanName, PlanAvailability>;

    for (const [plan, limit] of Object.entries(FOUNDER_LIMITS)) {
        availability[plan as PlanName] = {
            plan: plan as PlanName,
            founderLimit: limit,
            foundersSold: 0,
            foundersRemaining: limit,
            isSoldOut: false,
            percentSold: 0,
        };
    }

    return availability;
}

/**
 * Hook-friendly version for client components
 */
export const founderAvailabilityApi = {
    getAll: getPlanAvailability,
    getSingle: getSinglePlanAvailability,
    isSoldOut: isPlanSoldOut,
    getTotalRemaining: getTotalFoundersRemaining,
    getNextNumber: getNextFounderNumber,
};
