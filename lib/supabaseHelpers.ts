// =============================================
// VIRTUALTWIN SUPABASE HELPERS
// Helper functions for Sovereign Economics
// 👑 Imperial Strategy Runtime Enforcement
// =============================================

import { supabase } from './supabase';
import { PLAN_LIMITS, type PlanTier } from './pricing';

export type { PlanTier };

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    plan: PlanTier;
    plan_tier: 'founder' | 'public';
    is_founder: boolean;
    founder_joined_at: string | null;
    trial_started_at: string | null;
    trial_ends_at: string | null;
    is_trial_active: boolean;
    monthly_messages_used: number;
    monthly_api_requests: number;
    usage_reset_at: string;
    api_key: string | null;
    api_enabled: boolean;
}

export interface PlanLimits {
    plan: PlanTier;
    tier: 'founder' | 'public';
    price_eur: number;
    max_clones: number;
    max_messages_monthly: number;
    max_channels: number;
    api_enabled: boolean;
    api_rate_limit_per_minute: number | null;
    a_b_testing_enabled: boolean;
    a_b_testing_traffic_percent: number;
    fair_use_soft_limit: number | null;
    fair_use_hard_limit: number | null;
}

/**
 * Get user profile with their plan limits
 */
export async function getUserWithLimits(userId: string): Promise<{ user: UserProfile; limits: typeof PLAN_LIMITS[PlanTier] }> {
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (userError || !user) {
        throw new Error(`User not found: ${userError?.message}`);
    }

    const planTier = (user.plan_tier || user.plan || 'curioso') as PlanTier;
    const limits = PLAN_LIMITS[planTier];

    return { user: user as UserProfile, limits };
}

/**
 * 🔐 CHECK CLONE LIMIT - Critical for cost protection
 */
export async function checkCloneLimit(userId: string): Promise<{
    allowed: boolean;
    currentClones: number;
    maxClones: number;
    message?: string;
}> {
    const { user, limits } = await getUserWithLimits(userId);

    // Count current clones
    const { count, error } = await supabase
        .from('clones')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (error) {
        console.error('Error counting clones:', error);
        return { allowed: false, currentClones: 0, maxClones: limits.clones, message: 'Errore nel conteggio cloni' };
    }

    const currentClones = count || 0;
    const maxClones = limits.clones;

    if (currentClones >= maxClones) {
        return {
            allowed: false,
            currentClones,
            maxClones,
            message: `Hai raggiunto il limite di ${maxClones} clone${maxClones > 1 ? 's' : ''} per il piano ${user.plan_tier || user.plan}. Upgrade per avere più cloni.`
        };
    }

    return {
        allowed: true,
        currentClones,
        maxClones
    };
}

/**
 * 🔐 CHECK MESSAGE LIMIT - Critical for AI cost protection
 */
export async function checkMessageLimit(userId: string): Promise<{
    allowed: boolean;
    reason?: 'trial_expired' | 'limit_reached';
    message?: string;
    remaining?: number;
    used?: number;
    limit?: number;
}> {
    const { user, limits } = await getUserWithLimits(userId);

    // Check trial expiry for Curioso
    if (user.plan === 'curioso' && user.trial_ends_at) {
        const trialExpired = new Date(user.trial_ends_at) < new Date();
        if (trialExpired) {
            return {
                allowed: false,
                reason: 'trial_expired',
                message: 'Trial scaduto. Scegli un piano Sovereign per continuare.'
            };
        }
    }

    const used = user.monthly_messages_used || 0;
    const limit = limits.messagesPerMonth;

    // Check monthly limit
    if (used >= limit) {
        return {
            allowed: false,
            reason: 'limit_reached',
            message: `Hai raggiunto il limite di ${limit.toLocaleString()} messaggi/mese. Upgrade per continuare.`,
            used,
            limit
        };
    }

    return {
        allowed: true,
        remaining: limit - used,
        used,
        limit
    };
}

/**
 * 🔐 CHECK API ACCESS - For Conquistatore/Imperatore only
 */
export async function checkApiAccess(userId: string): Promise<{
    allowed: boolean;
    rateLimit: number;
    message?: string;
}> {
    const { user, limits } = await getUserWithLimits(userId);

    if (!limits.apiAccess) {
        return {
            allowed: false,
            rateLimit: 0,
            message: `API access non disponibile per il piano ${user.plan_tier || user.plan}. Upgrade a Conquistatore o Imperatore.`
        };
    }

    return {
        allowed: true,
        rateLimit: limits.apiRatePerMinute
    };
}

/**
 * Increment message usage counter
 */
export async function incrementMessageUsage(userId: string): Promise<void> {
    const { data: user } = await supabase
        .from('profiles')
        .select('usage_reset_at, monthly_messages_used')
        .eq('id', userId)
        .single();

    if (!user) return;

    const lastReset = new Date(user.usage_reset_at || new Date());
    const now = new Date();

    // Reset if new month
    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        await supabase
            .from('profiles')
            .update({
                monthly_messages_used: 1,
                usage_reset_at: now.toISOString()
            })
            .eq('id', userId);
    } else {
        await supabase
            .from('profiles')
            .update({
                monthly_messages_used: (user.monthly_messages_used || 0) + 1
            })
            .eq('id', userId);
    }
}

/**
 * Increment API usage counter (for rate limiting)
 */
export async function incrementApiUsage(userId: string): Promise<void> {
    const { data: user } = await supabase
        .from('profiles')
        .select('usage_reset_at, monthly_api_requests')
        .eq('id', userId)
        .single();

    if (!user) return;

    const lastReset = new Date(user.usage_reset_at || new Date());
    const now = new Date();

    if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        await supabase
            .from('profiles')
            .update({
                monthly_api_requests: 1,
                usage_reset_at: now.toISOString()
            })
            .eq('id', userId);
    } else {
        await supabase
            .from('profiles')
            .update({
                monthly_api_requests: (user.monthly_api_requests || 0) + 1
            })
            .eq('id', userId);
    }
}

/**
 * Log API usage for tracking and billing
 */
export async function logApiUsage(
    userId: string,
    endpoint: string,
    method: string,
    tokensUsed: number,
    costEur: number
): Promise<void> {
    await supabase
        .from('api_usage_logs')
        .insert({
            user_id: userId,
            endpoint,
            method,
            tokens_used: tokensUsed,
            cost_eur: costEur
        });
}

/**
 * Get monthly API usage stats
 */
export async function getMonthlyApiUsage(userId: string): Promise<{
    totalRequests: number;
    totalTokens: number;
    totalCostEur: number;
}> {
    const { data, error } = await supabase
        .rpc('get_monthly_api_usage', { p_user_id: userId });

    if (error || !data || data.length === 0) {
        return { totalRequests: 0, totalTokens: 0, totalCostEur: 0 };
    }

    const row = data[0];
    return {
        totalRequests: Number(row.total_requests) || 0,
        totalTokens: Number(row.total_tokens) || 0,
        totalCostEur: Number(row.total_cost_eur) || 0
    };
}

/**
 * Check if trial is expired
 */
export async function isTrialExpired(userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .rpc('is_trial_expired', { p_user_id: userId });

    if (error) return false;
    return data === true;
}

/**
 * Get trial days remaining
 */
export async function getTrialDaysRemaining(userId: string): Promise<number> {
    const { data: profile } = await supabase
        .from('profiles')
        .select('trial_ends_at')
        .eq('id', userId)
        .single();

    if (!profile?.trial_ends_at) return 0;

    const endsAt = new Date(profile.trial_ends_at);
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();

    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Get founder count for availability tracking
 */
export async function getFounderCount(): Promise<number> {
    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_founder', true);

    if (error) return 0;
    return count || 0;
}

/**
 * Get remaining founder spots
 */
export async function getFounderSpotsLeft(): Promise<number> {
    const TOTAL_FOUNDER_SPOTS = 153;
    const currentCount = await getFounderCount();
    return Math.max(0, TOTAL_FOUNDER_SPOTS - currentCount);
}

/**
 * Mark user as Founder
 */
export async function markAsFounder(userId: string): Promise<void> {
    await supabase
        .from('profiles')
        .update({
            is_founder: true,
            founder_joined_at: new Date().toISOString(),
            plan_tier: 'founder'
        })
        .eq('id', userId);
}

/**
 * Generate API key for user (Conquistatore/Imperatore only)
 */
export async function generateApiKey(userId: string): Promise<string | null> {
    // First check if user has API access
    const { allowed, message } = await checkApiAccess(userId);
    if (!allowed) {
        throw new Error(message);
    }

    const key = `vtw_${crypto.randomUUID().replace(/-/g, '')}`;

    await supabase
        .from('profiles')
        .update({
            api_key: key,
            api_enabled: true
        })
        .eq('id', userId);

    return key;
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string): Promise<{
    messagesUsed: number;
    messagesLimit: number;
    messagesPercent: number;
    clonesUsed: number;
    clonesLimit: number;
    apiRequestsUsed: number;
    apiRateLimit: number;
    trialDaysLeft: number;
}> {
    const { user, limits } = await getUserWithLimits(userId);

    // Count clones
    const { count: clonesCount } = await supabase
        .from('clones')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const trialDaysLeft = await getTrialDaysRemaining(userId);

    return {
        messagesUsed: user.monthly_messages_used || 0,
        messagesLimit: limits.messagesPerMonth,
        messagesPercent: Math.round(((user.monthly_messages_used || 0) / limits.messagesPerMonth) * 100),
        clonesUsed: clonesCount || 0,
        clonesLimit: limits.clones,
        apiRequestsUsed: user.monthly_api_requests || 0,
        apiRateLimit: limits.apiRatePerMinute,
        trialDaysLeft
    };
}

