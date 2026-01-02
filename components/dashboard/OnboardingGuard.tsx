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
export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const [checking, setChecking] = useState(true);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Skip check if already on onboarding page
    const isOnboardingPage = pathname?.includes('/onboarding');

    useEffect(() => {
        if (isOnboardingPage) {
            setChecking(false);
            return;
        }

        async function checkOnboarding() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    // Not logged in, let auth handle it
                    setChecking(false);
                    return;
                }

                // Check if onboarding is completed
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('onboarding_completed')
                    .eq('id', user.id)
                    .single();

                // If onboarding_completed is false or null, redirect
                if (profile && profile.onboarding_completed === false) {
                    setShouldRedirect(true);
                    router.push('/dashboard/onboarding');
                } else {
                    setChecking(false);
                }

            } catch (error) {
                console.error('Onboarding check error:', error);
                setChecking(false);
            }
        }

        checkOnboarding();
    }, [isOnboardingPage, router]);

    // Show loading while checking
    if (checking && !isOnboardingPage) {
        return (
            <div className="min-h-screen bg-champagne flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60 text-sm">Caricamento...</p>
                </div>
            </div>
        );
    }

    // If redirecting, show nothing (prevent flash)
    if (shouldRedirect) {
        return null;
    }

    return <>{children}</>;
}
