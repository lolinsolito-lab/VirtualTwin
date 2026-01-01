import Stripe from 'stripe';

// Lazy initialization to prevent build errors when env vars are not available
let _stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
    if (!_stripe) {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            console.warn('STRIPE_SECRET_KEY not defined - using placeholder');
            // Return a placeholder that will fail at runtime but not at build time
        }
        _stripe = new Stripe(secretKey || 'sk_placeholder_for_build', {
            apiVersion: '2024-12-18.acacia' as any,
            appInfo: {
                name: 'VirtualTwin Sovereign',
                version: '0.1.0',
            },
        });
    }
    return _stripe;
};

// Export for backward compatibility - lazy proxy
export const stripe = new Proxy({} as Stripe, {
    get(_, prop) {
        return (getStripe() as any)[prop];
    }
});

export const STRIPE_PLANS = {
    FREE: 'free',
    STARTER: 'price_starter_id', // Placeholder - User will replace with real IDs
    PRO: 'price_pro_id',
    AGENCY: 'price_agency_id'
};

export const getPlanDetails = (plan: string) => {
    switch (plan) {
        case 'starter': return { name: 'Starter', price: 97 };
        case 'pro': return { name: 'Pro', price: 197 };
        case 'agency': return { name: 'Agency', price: 397 };
        default: return { name: 'Free', price: 0 };
    }
};
