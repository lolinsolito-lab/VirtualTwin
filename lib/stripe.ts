import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY must be defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.ac' as any, // Use stable or latest
    appInfo: {
        name: 'VirtualTwin Sovereign',
        version: '0.1.0',
    },
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
