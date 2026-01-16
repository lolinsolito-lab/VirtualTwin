'use client';

import { useState } from 'react';
import { PlanTier } from '@/lib/pricing';

interface StripeCheckoutButtonProps {
    plan: PlanTier;
    isFounder?: boolean;
    billing?: 'monthly' | 'yearly';
    userId?: string;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export default function StripeCheckoutButton({
    plan,
    isFounder = false,
    billing = 'monthly',
    userId,
    className = '',
    children,
    disabled = false,
}: StripeCheckoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        if (plan === 'curioso') {
            // Free tier - redirect to register
            window.location.href = '/auth/register';
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Redirect to upsell checkout page
            // Note: This component doesn't have priceId, so we pass plan name
            // The checkout page will need to handle this or you should update the component props
            const checkoutUrl = `/checkout?plan=${plan}&tier=${isFounder ? 'founder' : 'public'}`;
            window.location.href = checkoutUrl;
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleCheckout}
                disabled={disabled || loading}
                className={`${className} ${loading ? 'opacity-50 cursor-wait' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Caricamento...
                    </span>
                ) : (
                    children
                )}
            </button>
            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}
