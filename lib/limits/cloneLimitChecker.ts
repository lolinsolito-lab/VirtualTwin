/**
 * Clone Limit Checker
 * 
 * Enforces clone limits per tier, similar to messageLimitChecker
 * 
 * Limits:
 * - Curioso: 1 clone
 * - Solopreneur: 1 clone
 * - Entrepreneur: 1 clone
 * - Conquistatore: 3 clones
 * - Imperatore: 15 clones
 * - Sovereignty: unlimited (999)
 */

import { supabase } from '@/lib/supabase';
import { PLAN_LIMITS, PlanTier } from '@/lib/pricing';

// =============================================
// TYPES
// =============================================

export interface CloneLimitCheck {
    canCreate: boolean;
    currentCount: number;
    limit: number;
    remaining: number;
    tier: PlanTier;
    upgradeNeeded: boolean;
    nextTier: PlanTier | null;
}

// Tier upgrade path
const TIER_UPGRADE_PATH: Record<PlanTier, PlanTier | null> = {
    'curioso': 'solopreneur',
    'solopreneur': 'entrepreneur',
    'entrepreneur': 'conquistatore',
    'conquistatore': 'imperatore',
    'imperatore': 'sovereignty',
    'sovereignty': null,
};

// =============================================
// MAIN FUNCTIONS
// =============================================

/**
 * Check if user can create another clone
 */
export async function checkCloneLimit(userId: string): Promise<CloneLimitCheck> {
    // Get user profile with tier
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('plan_tier, is_founder')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        console.error('[CloneLimit] Profile not found:', userId);
        return {
            canCreate: false,
            currentCount: 0,
            limit: 1,
            remaining: 0,
            tier: 'curioso',
            upgradeNeeded: true,
            nextTier: 'solopreneur'
        };
    }

    const tier = (profile.plan_tier || 'curioso') as PlanTier;
    const limit = PLAN_LIMITS[tier]?.clones || 1;

    // Count existing clones for user
    const { count } = await supabase
        .from('clones')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);

    const currentCount = count || 0;
    const remaining = Math.max(0, limit - currentCount);
    const canCreate = currentCount < limit;
    const upgradeNeeded = !canCreate;
    const nextTier = upgradeNeeded ? TIER_UPGRADE_PATH[tier] : null;

    return {
        canCreate,
        currentCount,
        limit,
        remaining,
        tier,
        upgradeNeeded,
        nextTier
    };
}

/**
 * Get clone usage display string
 */
export function formatCloneUsage(current: number, limit: number): string {
    if (limit === 999 || limit < 0) {
        return `${current} / ∞`;
    }
    return `${current} / ${limit}`;
}

/**
 * Get upgrade message for clone limit
 */
export function getCloneUpgradeMessage(tier: PlanTier): string {
    const nextTier = TIER_UPGRADE_PATH[tier];
    if (!nextTier) {
        return 'Hai raggiunto il massimo numero di cloni disponibili.';
    }

    const nextLimit = PLAN_LIMITS[nextTier]?.clones || 1;
    const tierLabels: Record<PlanTier, string> = {
        'curioso': 'Curioso',
        'solopreneur': 'Solopreneur',
        'entrepreneur': 'Entrepreneur',
        'conquistatore': 'Conquistatore',
        'imperatore': 'Imperatore',
        'sovereignty': 'Sovereignty'
    };

    return `Upgrade a ${tierLabels[nextTier]} per ottenere fino a ${nextLimit} cloni.`;
}

/**
 * Check clone limit for API routes
 * Returns error response if limit exceeded
 */
export async function enforceCloneLimit(userId: string): Promise<{
    allowed: boolean;
    error?: string;
    statusCode?: number;
}> {
    const check = await checkCloneLimit(userId);

    if (!check.canCreate) {
        return {
            allowed: false,
            error: `Limite cloni raggiunto (${check.currentCount}/${check.limit}). ${getCloneUpgradeMessage(check.tier)}`,
            statusCode: 403
        };
    }

    return { allowed: true };
}
