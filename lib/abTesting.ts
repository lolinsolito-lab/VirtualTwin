// =============================================
// VIRTUALTWIN A/B TESTING
// Limited to 20% traffic for Pioniere plan
// =============================================

/**
 * A/B Testing traffic percentage by plan
 * Pioniere: 20% (cost-optimized)
 * Conquistatore+: 100% (full access)
 */
export const AB_TEST_TRAFFIC = {
    curioso: 0,         // No A/B testing
    esploratore: 0,     // No A/B testing
    pioniere: 0.20,     // 20% only
    conquistatore: 1.0, // 100%
    imperatore: 1.0     // 100%
} as const;

export type PlanTier = keyof typeof AB_TEST_TRAFFIC;

/**
 * Simple hash function for consistent bucketing
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Determine if this conversation should run A/B test
 * Uses consistent hashing so same conversation always gets same result
 */
export function shouldRunABTest(
    conversationId: string,
    plan: PlanTier
): boolean {
    const trafficPercentage = AB_TEST_TRAFFIC[plan] || 0;

    if (trafficPercentage === 0) return false;
    if (trafficPercentage === 1) return true;

    // Use hash for consistent bucketing
    const hash = hashString(conversationId);
    const bucket = (hash % 100) / 100;

    return bucket < trafficPercentage;
}

/**
 * Get which variant to show
 */
export function getABVariant(conversationId: string): 'A' | 'B' {
    const hash = hashString(conversationId);
    return hash % 2 === 0 ? 'A' : 'B';
}

/**
 * A/B Test result tracking
 */
export interface ABTestResult {
    conversationId: string;
    variant: 'A' | 'B';
    convertedToLead: boolean;
    responseTime: number;
    userSatisfaction?: number;
}

/**
 * Calculate A/B test winner based on conversion rate
 */
export function calculateWinner(results: ABTestResult[]): {
    winner: 'A' | 'B' | 'tie';
    variantAConversion: number;
    variantBConversion: number;
    confidence: number;
} {
    const variantA = results.filter(r => r.variant === 'A');
    const variantB = results.filter(r => r.variant === 'B');

    const aConversions = variantA.filter(r => r.convertedToLead).length;
    const bConversions = variantB.filter(r => r.convertedToLead).length;

    const aRate = variantA.length > 0 ? aConversions / variantA.length : 0;
    const bRate = variantB.length > 0 ? bConversions / variantB.length : 0;

    // Simple confidence calculation (need more samples for statistical significance)
    const totalSamples = results.length;
    const confidence = Math.min(100, Math.round((totalSamples / 100) * 100));

    let winner: 'A' | 'B' | 'tie' = 'tie';
    if (Math.abs(aRate - bRate) > 0.05) { // 5% difference threshold
        winner = aRate > bRate ? 'A' : 'B';
    }

    return {
        winner,
        variantAConversion: Math.round(aRate * 100),
        variantBConversion: Math.round(bRate * 100),
        confidence
    };
}
