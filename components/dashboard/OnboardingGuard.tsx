'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

/**
 * OnboardingGuard - Redirects users to onboarding if not completed
 * 
 * Usage: Wrap dashboard content with this component
 * Skip paths: /dashboard/onboarding (to prevent infinite loop)
 */
import { useSovereign } from '@/components/providers/SovereignProvider';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useSovereign();
    const router = useRouter();
    const pathname = usePathname();

    const isOnboardingPage = pathname?.includes('/onboarding');

    useEffect(() => {
        if (!loading && user && user.onboarding_completed === false && !isOnboardingPage) {
            router.push('/dashboard/onboarding');
        }
    }, [user, loading, isOnboardingPage, router]);

    // Show loading while checking
    if (loading && !isOnboardingPage) {
        return (
            <div className="min-h-screen bg-champagne flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60 text-sm">Caricamento...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
