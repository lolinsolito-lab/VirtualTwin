/**
 * API Route: Check Message Limit Status
 * 
 * Returns current usage, limit, status for dashboard components
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Tier limits (Monthly messages)
const TIER_LIMITS: Record<string, number> = {
    'curioso': 100,
    'solopreneur': 500,
    'entrepreneur': 5000,
    'conquistatore': 20000,
    'imperatore': 50000,
    // Legacy support
    'aspirante': 500,
    'pioniere': 5000,
    'esploratore': 5000,
};

// Tier upgrades paths
const TIER_UPGRADES: Record<string, { name: string; price: number; priceId: string }> = {
    'curioso': { name: 'Solopreneur', price: 49, priceId: 'price_1SlyfV7141DXdb9v9WiLhhS0' },
    'solopreneur': { name: 'Entrepreneur', price: 147, priceId: 'price_1SlX727141DXdb9vdgRHbxrD' },
    'entrepreneur': { name: 'Conquistatore', price: 347, priceId: 'price_1SlX727141DXdb9vCKAM0WCi' },
    'conquistatore': { name: 'Imperatore', price: 697, priceId: 'price_1SlX737141DXdb9vTmQmgd9Z' },
    // Legacy mapping
    'aspirante': { name: 'Entrepreneur', price: 147, priceId: 'price_1SlX727141DXdb9vdgRHbxrD' },
    'pioniere': { name: 'Conquistatore', price: 347, priceId: 'price_1SlX727141DXdb9vCKAM0WCi' },
};

export async function GET() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('messages_used_this_month, plan_tier, is_founder, billing_cycle_start')
            .eq('id', user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Founders have unlimited
        if (profile.is_founder) {
            return NextResponse.json({
                status: 'ok',
                used: profile.messages_used_this_month || 0,
                limit: 999999,
                percentage: 0,
                remaining: 999999,
                isFounder: true,
                nextTier: null
            });
        }

        const tier = profile.plan_tier || 'curioso';
        const limit = TIER_LIMITS[tier] || 100;
        const used = profile.messages_used_this_month || 0;
        const percentage = (used / limit) * 100;
        const remaining = Math.max(0, limit - used);

        // Calculate status
        let status = 'ok';
        if (percentage >= 100) status = 'exceeded';
        else if (percentage >= 90) status = 'critical';
        else if (percentage >= 75) status = 'warning';

        // Calculate days remaining at current rate
        const daysRemaining = used > 0 ? Math.max(1, Math.ceil(remaining / (used / 30))) : 30;

        // Potential loss if waiting
        const potentialLoss = Math.floor((used / 30) * daysRemaining * 0.3 * 80);

        return NextResponse.json({
            status,
            used,
            limit,
            percentage: Math.round(percentage),
            remaining,
            daysRemaining,
            potentialLoss,
            tier,
            isFounder: false,
            nextTier: TIER_UPGRADES[tier] || null,
            billingCycleStart: profile.billing_cycle_start
        });

    } catch (error) {
        console.error('[API] Limit check error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
