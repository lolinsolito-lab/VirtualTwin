// =============================================
// VIRTUALTWIN OVERAGE PRICING
// Extra capacity beyond base tier limits
// =============================================

export interface OveragePackage {
    amount: number;
    price: number;        // €/month
    description: string;
}

export interface TierOverage {
    channels?: OveragePackage[];
    conversations?: OveragePackage[];
    clones?: OveragePackage[];
}

// Overage pricing configuration
export const OVERAGE_PRICING: Record<string, TierOverage> = {
    conquistatore: {
        channels: [
            { amount: 5, price: 20, description: '+5 canali' },
            { amount: 10, price: 35, description: '+10 canali (sconto 12%)' },
            { amount: 20, price: 60, description: '+20 canali (sconto 25%)' },
        ],
        conversations: [
            { amount: 5000, price: 30, description: '+5.000 conversazioni' },
        ],
    },
    imperatore: {
        channels: [
            { amount: 10, price: 50, description: '+10 canali' },
            { amount: 25, price: 100, description: '+25 canali (sconto 20%)' },
        ],
        clones: [
            { amount: 5, price: 50, description: '+5 cloni' },
        ],
        conversations: [
            { amount: 50000, price: 30, description: '+50.000 conversazioni' },
            { amount: 100000, price: 50, description: '+100.000 conversazioni (sconto 16%)' },
        ],
    },
};

// Hard caps per tier (absolute maximums)
export const HARD_CAPS = {
    conquistatore: {
        channels: 30,
        clones: 5,  // No overage for clones on this tier
    },
    imperatore: {
        channels: 50,
        clones: 25,
    },
    sovereignty: {
        channels: -1,  // Unlimited (custom)
        clones: -1,
    },
};

/**
 * Calculate total channel limit including overage
 */
export function getTotalChannelLimit(
    tier: string,
    overagePackages: number = 0,
    packageSize: number = 5
): number {
    const hardCap = HARD_CAPS[tier as keyof typeof HARD_CAPS]?.channels;
    if (hardCap === -1) return 999; // Unlimited

    const baseLimit = tier === 'conquistatore' ? 10 : tier === 'imperatore' ? 25 : 0;
    const overageAmount = overagePackages * packageSize;

    return Math.min(baseLimit + overageAmount, hardCap || baseLimit);
}

/**
 * Check if user can add more channels
 */
export function canAddChannel(
    tier: string,
    currentChannels: number,
    purchasedOverage: number = 0
): { allowed: boolean; upgradeNeeded: boolean; message: string } {
    const totalLimit = getTotalChannelLimit(tier, purchasedOverage);
    const hardCap = HARD_CAPS[tier as keyof typeof HARD_CAPS]?.channels || 0;

    if (currentChannels < totalLimit) {
        return { allowed: true, upgradeNeeded: false, message: '' };
    }

    if (currentChannels >= hardCap && hardCap !== -1) {
        return {
            allowed: false,
            upgradeNeeded: true,
            message: `Hai raggiunto il limite massimo di ${hardCap} canali per il tier ${tier}. Passa a un tier superiore.`
        };
    }

    return {
        allowed: false,
        upgradeNeeded: false,
        message: `Hai raggiunto il limite di ${totalLimit} canali. Acquista canali extra per continuare.`
    };
}

/**
 * Calculate overage cost
 */
export function calculateOverageCost(
    tier: string,
    type: 'channels' | 'conversations' | 'clones',
    packages: number
): number {
    const tierOverage = OVERAGE_PRICING[tier]?.[type];
    if (!tierOverage || !tierOverage[0]) return 0;

    return tierOverage[0].price * packages;
}
