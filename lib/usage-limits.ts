// =============================================
// VIRTUALTWIN USAGE LIMITS
// Anti-abuse rate limiting and tier limits
// =============================================

export interface TierLimits {
    maxClones: number;
    maxConversations: number;
    maxChannels: number;
    resetPeriod: 'monthly' | 'custom' | null;
    overageAllowed?: boolean;
}

// Tier limits configuration — nomi allineati con pricing.ts
export const TIER_LIMITS: Record<string, TierLimits> = {
    curioso: {
        maxClones: 1,
        maxConversations: 100,    // TOTALI, non mensili (trial)
        maxChannels: 0,
        resetPeriod: null         // No reset, one-time limit
    },
    solopreneur: {
        maxClones: 1,
        maxConversations: 1000,
        maxChannels: 1,
        resetPeriod: 'monthly'
    },
    entrepreneur: {
        maxClones: 3,             // ✅ FIXED: allineato col marketing (era 1)
        maxConversations: 5000,
        maxChannels: 3,
        resetPeriod: 'monthly'
    },
    conquistatore: {
        maxClones: 5,
        maxConversations: 20000,
        maxChannels: 999,
        resetPeriod: 'monthly'
    },
    imperatore: {
        maxClones: 15,
        maxConversations: 100000,
        maxChannels: 999,
        resetPeriod: 'monthly',
        overageAllowed: true  // Può comprare extra
    },
    sovereignty: {
        maxClones: 999,           // Custom negoziato
        maxConversations: 999999, // Custom negoziato
        maxChannels: 999,
        resetPeriod: 'custom'     // Gestito manualmente
    }
};


// Get tier limits
export function getTierLimits(tier: string): TierLimits {
    return TIER_LIMITS[tier] || TIER_LIMITS.curioso;
}

// Check if user can create more clones
export function canCreateClone(tier: string, currentClones: number): boolean {
    const limits = getTierLimits(tier);
    return currentClones < limits.maxClones;
}

// Check if user can send more messages
export function canSendMessage(tier: string, currentUsage: number): boolean {
    const limits = getTierLimits(tier);
    return currentUsage < limits.maxConversations;
}

// Check if user can connect more channels
export function canConnectChannel(tier: string, currentChannels: number): boolean {
    const limits = getTierLimits(tier);
    return currentChannels < limits.maxChannels;
}

// Get reset date for monthly limits
export function getResetDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

// Calculate overage for enterprise tiers
export function calculateOverageCost(excess: number): number {
    const blocksOf50k = Math.ceil(excess / 50000);
    return blocksOf50k * 30; // €30 per blocco da 50k
}
