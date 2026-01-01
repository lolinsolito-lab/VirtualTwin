// =============================================
// VIRTUALTWIN TRIAL MANAGEMENT
// 14-day trial for Curioso plan
// =============================================

import { supabase } from './supabase';

export interface TrialStatus {
    isTrialing: boolean;
    daysRemaining: number;
    trialEndDate: Date | null;
    isExpired: boolean;
}

/**
 * Check trial status for a user
 */
export async function getTrialStatus(userId: string): Promise<TrialStatus> {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('created_at, plan_tier, subscription_status')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        return {
            isTrialing: false,
            daysRemaining: 0,
            trialEndDate: null,
            isExpired: true
        };
    }

    // Only Curioso plan has trial
    if (profile.plan_tier !== 'curioso') {
        return {
            isTrialing: false,
            daysRemaining: 0,
            trialEndDate: null,
            isExpired: false
        };
    }

    const createdAt = new Date(profile.created_at);
    const trialEndDate = new Date(createdAt);
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

    const now = new Date();
    const diffMs = trialEndDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
        isTrialing: daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
        trialEndDate,
        isExpired: daysRemaining <= 0
    };
}

/**
 * Check if user can access features (not trial expired)
 */
export async function canAccessFeatures(userId: string): Promise<boolean> {
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan_tier, subscription_status')
        .eq('id', userId)
        .single();

    if (!profile) return false;

    // Paid plans always have access
    if (profile.plan_tier !== 'curioso') return true;

    // Active subscription has access
    if (profile.subscription_status === 'active') return true;

    // Check trial for Curioso
    const trial = await getTrialStatus(userId);
    return !trial.isExpired;
}

/**
 * Format trial countdown for display
 */
export function formatTrialCountdown(daysRemaining: number): string {
    if (daysRemaining <= 0) return 'Trial scaduto';
    if (daysRemaining === 1) return '1 giorno rimanente';
    return `${daysRemaining} giorni rimanenti`;
}

/**
 * Get trial warning level for UI
 */
export function getTrialWarningLevel(daysRemaining: number): 'none' | 'info' | 'warning' | 'critical' {
    if (daysRemaining > 7) return 'none';
    if (daysRemaining > 3) return 'info';
    if (daysRemaining > 0) return 'warning';
    return 'critical';
}
