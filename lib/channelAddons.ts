/**
 * Channel Add-ons Configuration
 * 
 * Defines premium channel add-ons that can be purchased
 * to unlock additional channels beyond tier limits
 */

export interface ChannelAddon {
    id: string;
    name: string;
    description: string;
    channelType: string;
    monthlyPrice: number;  // in EUR
    yearlyPrice: number;   // in EUR (discounted)
    minTier: 'solopreneur' | 'entrepreneur' | 'conquistatore' | 'imperatore';
    availableFrom: string; // When this add-on becomes available
    features: string[];
    stripePriceId?: string;       // Monthly price ID
    stripeYearlyPriceId?: string; // Yearly price ID
    isActive: boolean;
}

export const CHANNEL_ADDONS: Record<string, ChannelAddon> = {
    telegram: {
        id: 'addon_telegram',
        name: 'Telegram Bot Pro',
        description: 'Connetti il tuo bot Telegram per assistenza clienti automatizzata',
        channelType: 'telegram',
        monthlyPrice: 19,
        yearlyPrice: 190, // ~2 mesi gratis
        minTier: 'conquistatore',
        availableFrom: '2026-04-01', // Pioneer Wave
        features: [
            'Bot Telegram illimitato',
            'Risposte AI personalizzate',
            'Notifiche in tempo reale',
            'Integrazione con CRM'
        ],
        isActive: true
    },
    webchat: {
        id: 'addon_webchat',
        name: 'Webchat Premium',
        description: 'Widget AI avanzato da integrare nel tuo sito web',
        channelType: 'webchat',
        monthlyPrice: 39,
        yearlyPrice: 390, // ~2 mesi gratis
        minTier: 'imperatore',
        availableFrom: '2026-04-01', // Pioneer Wave
        features: [
            'Widget personalizzabile',
            'AI conversazionale avanzata',
            'Lead capture automatico',
            'Analytics integrati',
            'White-label (no branding)'
        ],
        isActive: true
    },
    linkedin: {
        id: 'addon_linkedin',
        name: 'LinkedIn Direct AI',
        description: 'Espandi il tuo network B2B con messaggi AI automatizzati',
        channelType: 'linkedin',
        monthlyPrice: 59,
        yearlyPrice: 590, // ~2 mesi gratis
        minTier: 'imperatore',
        availableFrom: '2026-07-01', // Q3 2026
        features: [
            'Outreach automatizzato',
            'Follow-up intelligenti',
            'Lead scoring B2B',
            'Integrazione Sales Navigator',
            'Compliance-safe messaging'
        ],
        isActive: true
    },
    tiktok: {
        id: 'addon_tiktok',
        name: 'TikTok Shop AI',
        description: 'Interagisci con la tua audience creator e vendi',
        channelType: 'tiktok',
        monthlyPrice: 49,
        yearlyPrice: 490, // ~2 mesi gratis
        minTier: 'imperatore',
        availableFrom: '2026-10-01', // Q4 2026
        features: [
            'Risposte DM automatiche',
            'Integrazione TikTok Shop',
            'Lead capture da commenti',
            'Analytics creator',
            'Cross-posting automation'
        ],
        isActive: true
    }
};

/**
 * Check if user can access a channel add-on based on their tier
 */
export function canAccessChannelAddon(
    userTier: string,
    addonKey: string
): { canAccess: boolean; reason?: string } {
    const addon = CHANNEL_ADDONS[addonKey];
    if (!addon) {
        return { canAccess: false, reason: 'Add-on non trovato' };
    }

    const tierOrder = ['curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore', 'sovereignty'];
    const userTierIndex = tierOrder.indexOf(userTier);
    const requiredTierIndex = tierOrder.indexOf(addon.minTier);

    if (userTierIndex < requiredTierIndex) {
        return {
            canAccess: false,
            reason: `Richiede almeno il tier ${addon.minTier}`
        };
    }

    // Check if addon is available yet
    const now = new Date();
    const availableDate = new Date(addon.availableFrom);
    if (now < availableDate) {
        return {
            canAccess: false,
            reason: `Disponibile da ${addon.availableFrom}`
        };
    }

    return { canAccess: true };
}

/**
 * Get price for channel addon
 */
export function getChannelAddonPrice(addonKey: string, yearly: boolean = false): number {
    const addon = CHANNEL_ADDONS[addonKey];
    if (!addon) return 0;
    return yearly ? addon.yearlyPrice : addon.monthlyPrice;
}
