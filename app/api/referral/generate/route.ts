import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/referral/generate
 * Generates or retrieves a unique referral code for the logged-in user.
 */
export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Check if user already has a referral code
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('referral_code, referrals_count')
            .eq('id', userId)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If already has code, return it
        if (existingProfile?.referral_code) {
            return NextResponse.json({
                referralCode: existingProfile.referral_code,
                referralsCount: existingProfile.referrals_count || 0,
                referralLink: `https://virtualtwin.vercel.app/?ref=${existingProfile.referral_code}`,
                rewardStatus: getRewardStatus(existingProfile.referrals_count || 0)
            });
        }

        // Generate new unique referral code
        const referralCode = generateReferralCode(userId);

        // Update profile with new referral code
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                referral_code: referralCode,
                referrals_count: 0
            })
            .eq('id', userId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 });
        }

        return NextResponse.json({
            referralCode,
            referralsCount: 0,
            referralLink: `https://virtualtwin.vercel.app/?ref=${referralCode}`,
            rewardStatus: getRewardStatus(0)
        });

    } catch (error) {
        console.error('Referral generation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * GET /api/referral/generate?userId=xxx
 * Retrieves referral stats for a user.
 */
export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('referral_code, referrals_count')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            referralCode: profile.referral_code || null,
            referralsCount: profile.referrals_count || 0,
            referralLink: profile.referral_code
                ? `https://virtualtwin.vercel.app/?ref=${profile.referral_code}`
                : null,
            rewardStatus: getRewardStatus(profile.referrals_count || 0)
        });

    } catch (error) {
        console.error('Referral fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Helper: Generate unique referral code
function generateReferralCode(userId: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'VT-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Add last 4 chars of userId for uniqueness
    code += '-' + userId.slice(-4).toUpperCase();
    return code;
}

// Helper: Get reward status based on referrals count
function getRewardStatus(count: number): {
    message: string;
    progress: number;
    unlocked: boolean;
} {
    if (count >= 3) {
        return {
            message: "🎉 Hai sbloccato 1 mese gratis!",
            progress: 100,
            unlocked: true
        };
    }
    return {
        message: `Invita altri ${3 - count} Founder per sbloccare 1 mese gratis`,
        progress: Math.round((count / 3) * 100),
        unlocked: false
    };
}
