// =============================================
// VIRTUALTWIN FAIR USE POLICY
// Imperatore plan usage monitoring and limits
// =============================================

import { supabase } from './supabase';

// Fair Use thresholds for Imperatore plan
export const FAIR_USE_LIMITS = {
    INCLUDED: 50000,      // 50K included in plan
    SOFT_LIMIT: 100000,   // 100K - throttling starts
    HARD_LIMIT: 250000    // 250K - block + Account Manager
} as const;

export type FairUseStatus =
    | 'normal'
    | 'high_usage'
    | 'soft_limit'
    | 'throttled'
    | 'hard_limit_exceeded';

export interface FairUseResult {
    allowed: boolean;
    status: FairUseStatus;
    usage: number;
    limit: number;
    delay_ms?: number;
    message?: string;
    action?: 'none' | 'alert_am' | 'warn_user' | 'throttle' | 'block';
}

/**
 * Check Fair Use Policy status for Imperatore users
 */
export async function checkFairUse(
    userId: string,
    monthlyUsage: number
): Promise<FairUseResult> {
    // Get user plan
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_tier')
        .eq('id', userId)
        .single();

    // Only Imperatore has Fair Use Policy
    if (profile?.plan_tier?.toLowerCase() !== 'imperatore') {
        return {
            allowed: true,
            status: 'normal',
            usage: monthlyUsage,
            limit: 0,
            action: 'none'
        };
    }

    // 0-50K: Normal usage
    if (monthlyUsage <= FAIR_USE_LIMITS.INCLUDED) {
        return {
            allowed: true,
            status: 'normal',
            usage: monthlyUsage,
            limit: FAIR_USE_LIMITS.INCLUDED,
            action: 'none'
        };
    }

    // 50K-75K: High usage - alert Account Manager at 75%
    if (monthlyUsage <= 75000) {
        const shouldAlert = monthlyUsage >= 70000 && monthlyUsage % 5000 === 0;
        return {
            allowed: true,
            status: 'high_usage',
            usage: monthlyUsage,
            limit: FAIR_USE_LIMITS.SOFT_LIMIT,
            action: shouldAlert ? 'alert_am' : 'none'
        };
    }

    // 75K-100K: Soft limit - warn user
    if (monthlyUsage <= FAIR_USE_LIMITS.SOFT_LIMIT) {
        return {
            allowed: true,
            status: 'soft_limit',
            usage: monthlyUsage,
            limit: FAIR_USE_LIMITS.SOFT_LIMIT,
            action: 'warn_user',
            message: `Hai utilizzato ${(monthlyUsage / 1000).toFixed(0)}K messaggi. Stai raggiungendo il limite Fair Use.`
        };
    }

    // 100K-250K: Throttling - 2s delay per response
    if (monthlyUsage <= FAIR_USE_LIMITS.HARD_LIMIT) {
        return {
            allowed: true,
            status: 'throttled',
            usage: monthlyUsage,
            limit: FAIR_USE_LIMITS.HARD_LIMIT,
            delay_ms: 2000,
            action: 'throttle',
            message: 'Fair Use Policy: risposte rallentate. Il tuo Account Manager ti contatterà.'
        };
    }

    // >250K: Hard block
    return {
        allowed: false,
        status: 'hard_limit_exceeded',
        usage: monthlyUsage,
        limit: FAIR_USE_LIMITS.HARD_LIMIT,
        action: 'block',
        message: 'Fair Use Policy: limite raggiunto (250K msg/mese). Il tuo Account Manager ti contatterà entro 24h per piano Enterprise.'
    };
}

/**
 * Get usage percentage for UI display
 */
export function getUsagePercentage(usage: number, plan: string): number {
    const limits: Record<string, number> = {
        curioso: 100,
        solopreneur: 1000,
        entrepreneur: 5000,
        conquistatore: 20000,
        imperatore: 100000,
        sovereignty: 999999,
    };

    const limit = limits[plan.toLowerCase()] || 1000;
    return Math.round((usage / limit) * 100);
}


/**
 * Get usage bar color based on percentage
 */
export function getUsageColor(percentage: number): string {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-500';
    if (percentage < 90) return 'bg-orange-500';
    return 'bg-red-500';
}

/**
 * Format usage for display
 */
export function formatUsage(usage: number): string {
    if (usage >= 1000) {
        return `${(usage / 1000).toFixed(1)}K`;
    }
    return String(usage);
}
