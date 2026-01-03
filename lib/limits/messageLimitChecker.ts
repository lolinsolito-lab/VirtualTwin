/**
 * Message Limit Checker - Intelligent Upsell System
 * 
 * 4-level status: ok | warning | critical | exceeded
 * Notification control: only send once per threshold, then at intervals
 */

import { supabase } from '@/lib/supabase';

// =============================================
// TYPES & CONSTANTS
// =============================================

export type LimitStatus = 'ok' | 'warning' | 'critical' | 'exceeded';

export interface LimitCheck {
    status: LimitStatus;
    used: number;
    limit: number;
    percentage: number;
    remaining: number;
    shouldBlock: boolean;
    shouldNotifyOwner: boolean;
    nextTier: TierUpgrade | null;
}

export interface TierUpgrade {
    name: string;
    limit: number;
    price: number;
    priceId: string;
}

// Tier limits (messages per month)
export const TIER_LIMITS: Record<string, number> = {
    'curioso': 100,
    'esploratore': 500,
    'pioniere': 2000,
    'conquistatore': 5000,
    'imperatore': 50000,
};

// Upgrade paths
export const TIER_UPGRADES: Record<string, TierUpgrade> = {
    'curioso': {
        name: 'Esploratore',
        limit: 500,
        price: 147,
        priceId: 'price_1QcewtKkKlvbXgKiJGXE3YtN'
    },
    'esploratore': {
        name: 'Pioniere',
        limit: 2000,
        price: 347,
        priceId: 'price_1QcexNKkKlvbXgKiVpLj5VVS'
    },
    'pioniere': {
        name: 'Conquistatore',
        limit: 5000,
        price: 697,
        priceId: 'price_1QcexzKkKlvbXgKihZ5h58aR'
    },
    'conquistatore': {
        name: 'Imperatore',
        limit: 50000,
        price: 1497,
        priceId: 'price_imperatore'
    },
};

// Notification intervals (hours)
const NOTIFICATION_INTERVALS = {
    warning: null,    // Only once (null = never resend)
    critical: 12,     // Every 12 hours
    exceeded: 6,      // Every 6 hours
};

// =============================================
// MAIN FUNCTIONS
// =============================================

/**
 * Calculate limit status from usage percentage
 */
export function getMessageLimitStatus(used: number, limit: number): LimitStatus {
    const percentage = (used / limit) * 100;

    if (percentage >= 100) return 'exceeded';
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'ok';
}

/**
 * Check message limit for a user
 * Returns status, usage info, and whether to notify/block
 */
export async function checkMessageLimit(userId: string): Promise<LimitCheck> {
    // Get user profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
            subscription_tier,
            is_founder,
            messages_used_this_month,
            limit_warning_sent_at,
            limit_critical_sent_at,
            limit_exceeded_sent_at
        `)
        .eq('id', userId)
        .single();

    if (error || !profile) {
        console.error('[LimitCheck] Profile not found:', userId);
        // Default to allow (fail open)
        return {
            status: 'ok',
            used: 0,
            limit: 100,
            percentage: 0,
            remaining: 100,
            shouldBlock: false,
            shouldNotifyOwner: false,
            nextTier: null
        };
    }

    const tier = profile.subscription_tier || 'curioso';

    // Founders get unlimited
    if (profile.is_founder) {
        return {
            status: 'ok',
            used: profile.messages_used_this_month || 0,
            limit: 999999,
            percentage: 0,
            remaining: 999999,
            shouldBlock: false,
            shouldNotifyOwner: false,
            nextTier: null
        };
    }

    const limit = TIER_LIMITS[tier] || 100;
    const used = profile.messages_used_this_month || 0;
    const percentage = (used / limit) * 100;
    const remaining = Math.max(0, limit - used);
    const status = getMessageLimitStatus(used, limit);

    // Check if should notify
    const shouldNotifyOwner = await shouldSendNotification(
        status,
        profile.limit_warning_sent_at,
        profile.limit_critical_sent_at,
        profile.limit_exceeded_sent_at
    );

    // Update notification timestamp if sending
    if (shouldNotifyOwner) {
        await updateNotificationTimestamp(userId, status);
    }

    return {
        status,
        used,
        limit,
        percentage,
        remaining,
        shouldBlock: status === 'exceeded',
        shouldNotifyOwner,
        nextTier: TIER_UPGRADES[tier] || null
    };
}

/**
 * Determine if we should send a notification based on status and last sent time
 */
async function shouldSendNotification(
    status: LimitStatus,
    warningSentAt: string | null,
    criticalSentAt: string | null,
    exceededSentAt: string | null
): Promise<boolean> {
    if (status === 'ok') return false;

    const now = Date.now();

    switch (status) {
        case 'warning':
            // Only send once (when first hitting 75%)
            return !warningSentAt;

        case 'critical':
            if (!criticalSentAt) return true;
            const hoursSinceCritical = (now - new Date(criticalSentAt).getTime()) / (1000 * 60 * 60);
            return hoursSinceCritical >= NOTIFICATION_INTERVALS.critical!;

        case 'exceeded':
            if (!exceededSentAt) return true;
            const hoursSinceExceeded = (now - new Date(exceededSentAt).getTime()) / (1000 * 60 * 60);
            return hoursSinceExceeded >= NOTIFICATION_INTERVALS.exceeded!;

        default:
            return false;
    }
}

/**
 * Update notification timestamp in database
 */
async function updateNotificationTimestamp(userId: string, status: LimitStatus): Promise<void> {
    // Only update for statuses that have notification fields
    if (status === 'ok') return;

    const timestampFields: Record<'warning' | 'critical' | 'exceeded', string> = {
        warning: 'limit_warning_sent_at',
        critical: 'limit_critical_sent_at',
        exceeded: 'limit_exceeded_sent_at',
    };

    const timestampField = timestampFields[status];

    await supabase
        .from('profiles')
        .update({ [timestampField]: new Date().toISOString() })
        .eq('id', userId);
}

/**
 * Increment message usage counter
 */
export async function incrementMessageUsage(userId: string): Promise<void> {
    await supabase.rpc('increment_message_usage', { p_user_id: userId });
}

/**
 * Reset monthly usage (called on subscription payment)
 */
export async function resetMonthlyUsage(userId: string): Promise<void> {
    await supabase.rpc('reset_monthly_usage', { p_user_id: userId });
}

/**
 * Add bonus messages (for upgrades, referrals)
 */
export async function addBonusMessages(userId: string, bonus: number): Promise<void> {
    await supabase.rpc('add_bonus_messages', { p_user_id: userId, p_bonus: bonus });
}

/**
 * Get auto-reply message for blocked state
 */
export function getBlockedAutoReply(businessName?: string): string {
    const name = businessName || 'VirtualTwin';
    return `Ciao! 👋

Grazie per il tuo messaggio.

Il nostro assistente automatico è momentaneamente in pausa.

Un membro del team ti risponderà personalmente entro 24 ore.

Grazie per la pazienza! 🙏

${name}`;
}

/**
 * Calculate estimated loss if user waits for reset
 * Used in upgrade messaging
 */
export function calculatePotentialLoss(
    dailyMessages: number,
    daysUntilReset: number,
    avgLeadValue: number = 80
): number {
    // Assume 30% of messages convert to leads
    const estimatedLeads = dailyMessages * 0.3 * daysUntilReset;
    return Math.floor(estimatedLeads * avgLeadValue);
}

/**
 * Get upgrade URL with pre-filled tier
 */
export function getUpgradeUrl(nextTier: TierUpgrade): string {
    return `https://virtualtwin.vercel.app/dashboard/billing?upgrade=${nextTier.priceId}&tier=${nextTier.name.toLowerCase()}`;
}
