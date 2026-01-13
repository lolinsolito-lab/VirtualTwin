import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/referral/track
 * Tracks when a referred user signs up.
 * Called during registration if ?ref= parameter was present.
 */
export async function POST(request: NextRequest) {
    try {
        const { referralCode, newUserId, newUserEmail } = await request.json();

        if (!referralCode || !newUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find the referrer by their referral code
        const { data: referrer, error: findError } = await supabase
            .from('profiles')
            .select('id, referrals_count, email')
            .eq('referral_code', referralCode)
            .single();

        if (findError || !referrer) {
            // Invalid referral code, but don't block registration
            console.warn(`Invalid referral code used: ${referralCode}`);
            return NextResponse.json({ success: false, message: 'Invalid referral code' });
        }

        // Prevent self-referral
        if (referrer.id === newUserId) {
            return NextResponse.json({ success: false, message: 'Cannot refer yourself' });
        }

        // Increment the referrer's count
        const newCount = (referrer.referrals_count || 0) + 1;
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ referrals_count: newCount })
            .eq('id', referrer.id);

        if (updateError) {
            console.error('Failed to update referral count:', updateError);
            return NextResponse.json({ error: 'Failed to track referral' }, { status: 500 });
        }

        // Log the referral for analytics
        await supabase.from('referral_logs').insert({
            referrer_id: referrer.id,
            referred_user_id: newUserId,
            referred_email: newUserEmail,
            referral_code: referralCode,
            created_at: new Date().toISOString()
        });

        // Check if referrer just hit the reward threshold (3 referrals)
        if (newCount === 3) {
            // Trigger reward email (you'd call Resend here)
            console.log(`🎉 User ${referrer.id} just unlocked 1 month free reward!`);

            // Mark their reward as pending
            await supabase
                .from('profiles')
                .update({ referral_reward_pending: true })
                .eq('id', referrer.id);
        }

        return NextResponse.json({
            success: true,
            referrerNewCount: newCount,
            rewardUnlocked: newCount >= 3
        });

    } catch (error) {
        console.error('Referral tracking error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
