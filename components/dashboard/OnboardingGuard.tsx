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
        if (!loading && user) {
            // 1. If onboarding not completed, go there
            if (user.onboarding_completed === false && !isOnboardingPage) {
                router.push('/dashboard/onboarding');
                return;
            }

            // 2. If onboarding completed but email NOT verified, show verification screen
            // This is the "Bot Protection Gate" requested by the user
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user && !session.user.email_confirmed_at && user.onboarding_completed && !pathname?.includes('/check-email')) {
                    router.push('/auth/check-email');
                }
            });

            return () => subscription.unsubscribe();
        }
    }, [user, loading, isOnboardingPage, pathname, router]);

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
