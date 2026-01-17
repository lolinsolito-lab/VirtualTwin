/**
 * Channel Add-on Checker
 * 
 * Checks if a user has purchased a channel add-on
 * and can access premium channels
 */

import { supabase } from '@/lib/supabase';
import { PLAN_LIMITS, PlanTier } from '@/lib/pricing';
import { CHANNEL_ADDONS, canAccessChannelAddon } from '@/lib/channelAddons';

export interface ChannelAccessCheck {
    hasAccess: boolean;
    reason: string;
    isPurchased: boolean;
    isIncludedInTier: boolean;
    purchaseRequired: boolean;
    addonPrice?: number;
    purchaseUrl?: string;
}

/**
 * Check if user can access a specific channel
 * This considers:
 * 1. Tier-included channels (WA, IG, FB)
 * 2. Purchased add-ons
 * 3. Channel limits
 */
export async function checkChannelAccess(
    userId: string,
    channelType: string
): Promise<ChannelAccessCheck> {
    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_tier, is_founder')
        .eq('id', userId)
        .single();

    if (!profile) {
        return {
            hasAccess: false,
            reason: 'Profilo non trovato',
            isPurchased: false,
            isIncludedInTier: false,
            purchaseRequired: true
        };
    }

    const tier = (profile.plan_tier || 'curioso') as PlanTier;

    // 1. Check if channel is included in base tier (WA, IG, FB)
    const baseChannels = ['whatsapp', 'instagram', 'messenger'];
    if (baseChannels.includes(channelType)) {
        const channelLimit = PLAN_LIMITS[tier]?.channels || 0;
        if (channelLimit > 0) {
            return {
                hasAccess: true,
                reason: 'Incluso nel tuo tier',
                isPurchased: false,
                isIncludedInTier: true,
                purchaseRequired: false
            };
        } else {
            return {
                hasAccess: false,
                reason: 'Upgrade tier per accedere ai canali',
                isPurchased: false,
                isIncludedInTier: false,
                purchaseRequired: true
            };
        }
    }

    // 2. Check if premium channel add-on is purchased
    const addon = CHANNEL_ADDONS[channelType];
    if (!addon) {
        return {
            hasAccess: false,
            reason: 'Canale non disponibile',
            isPurchased: false,
            isIncludedInTier: false,
            purchaseRequired: false
        };
    }

    // Check tier requirement
    const tierCheck = canAccessChannelAddon(tier, channelType);
    if (!tierCheck.canAccess) {
        return {
            hasAccess: false,
            reason: tierCheck.reason || 'Tier insufficiente',
            isPurchased: false,
            isIncludedInTier: false,
            purchaseRequired: true,
            addonPrice: addon.monthlyPrice
        };
    }

    // Check if user has purchased this add-on
    const { data: purchase } = await supabase
        .from('user_addons')
        .select('id, status, purchased_at')
        .eq('user_id', userId)
        .eq('addon_id', addon.id)
        .eq('status', 'active')
        .single();

    if (purchase) {
        return {
            hasAccess: true,
            reason: 'Add-on acquistato',
            isPurchased: true,
            isIncludedInTier: false,
            purchaseRequired: false
        };
    }

    // 3. Not purchased - require purchase
    return {
        hasAccess: false,
        reason: `Richiede add-on ${addon.name}`,
        isPurchased: false,
        isIncludedInTier: false,
        purchaseRequired: true,
        addonPrice: addon.monthlyPrice,
        purchaseUrl: `/dashboard/billing?addon=${addon.id}`
    };
}

/**
 * Get all channel accesses for a user
 */
export async function getUserChannelAccesses(userId: string): Promise<Record<string, ChannelAccessCheck>> {
    const channels = ['whatsapp', 'instagram', 'messenger', 'telegram', 'webchat', 'linkedin', 'tiktok'];
    const accesses: Record<string, ChannelAccessCheck> = {};

    for (const channel of channels) {
        accesses[channel] = await checkChannelAccess(userId, channel);
    }

    return accesses;
}

/**
 * Count user's active channels
 */
export async function countUserActiveChannels(userId: string): Promise<number> {
    const { count } = await supabase
        .from('channels')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);

    return count || 0;
}

/**
 * Check if user can add another channel based on tier limit
 */
export async function canAddMoreChannels(userId: string): Promise<{
    canAdd: boolean;
    current: number;
    limit: number;
    overage: number;
}> {
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_tier, overage_channels')
        .eq('id', userId)
        .single();

    if (!profile) {
        return { canAdd: false, current: 0, limit: 0, overage: 0 };
    }

    const tier = (profile.plan_tier || 'curioso') as PlanTier;
    const baseLimit = PLAN_LIMITS[tier]?.channels || 0;
    const overageChannels = profile.overage_channels || 0;
    const totalLimit = baseLimit === -1 ? 999 : baseLimit + overageChannels;

    const currentCount = await countUserActiveChannels(userId);

    return {
        canAdd: currentCount < totalLimit,
        current: currentCount,
        limit: totalLimit,
        overage: overageChannels
    };
}
