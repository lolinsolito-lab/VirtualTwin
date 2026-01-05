'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface SovereignContextType {
    user: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    updateProgress: (videoId: string) => Promise<void>;
    addXP: (amount: number) => Promise<void>;
    isFeatureAccessible: (requiredTier: UserProfile['plan_tier']) => boolean;
}

const SovereignContext = createContext<SovereignContextType | undefined>(undefined);

const TIER_HIERARCHY: Record<UserProfile['plan_tier'], number> = {
    'curioso': 0,
    'aspirante': 1,
    'esploratore': 2,
    'pioniere': 3,
    'conquistatore': 4,
    'imperatore': 5
};

export function SovereignProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) throw error;

            setUser(profile as UserProfile);
        } catch (error) {
            console.error('Error fetching sovereign profile:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchProfile();
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const refreshProfile = async () => {
        await fetchProfile();
    };

    const updateProgress = async (videoId: string) => {
        if (!user) return;

        const alreadyCompleted = user.completed_video_ids?.includes(videoId);
        if (alreadyCompleted) return;

        const updatedVideos = [...(user.completed_video_ids || []), videoId];

        const { error } = await supabase
            .from('profiles')
            .update({
                completed_video_ids: updatedVideos,
                xp: (user.xp || 0) + 50 // 50 XP per video
            })
            .eq('id', user.id);

        if (!error) {
            setUser(prev => prev ? { ...prev, completed_video_ids: updatedVideos, xp: (prev.xp || 0) + 50 } : null);
        }
    };

    const addXP = async (amount: number) => {
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({ xp: (user.xp || 0) + amount })
            .eq('id', user.id);

        if (!error) {
            setUser(prev => prev ? { ...prev, xp: (prev.xp || 0) + amount } : null);
        }
    };

    const isFeatureAccessible = (requiredTier: UserProfile['plan_tier']): boolean => {
        if (!user) return false;
        return TIER_HIERARCHY[user.plan_tier] >= TIER_HIERARCHY[requiredTier];
    };

    return (
        <SovereignContext.Provider value={{
            user,
            loading,
            refreshProfile,
            updateProgress,
            addXP,
            isFeatureAccessible
        }}>
            {children}
        </SovereignContext.Provider>
    );
}

export function useSovereign() {
    const context = useContext(SovereignContext);
    if (context === undefined) {
        throw new Error('useSovereign must be used within a SovereignProvider');
    }
    return context;
}
