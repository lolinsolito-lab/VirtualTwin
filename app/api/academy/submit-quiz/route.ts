import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateEligibleBadges, detectNewBadges } from '@/lib/achievements';
import { UserProfile } from '@/lib/types';

/**
 * API to submit quiz results and earn XP/Badges
 * POST /api/academy/submit-quiz
 * 
 * Body: { moduleId: string, score: number, totalQuestions: number }
 */
export async function POST(req: Request) {
    try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { moduleId, score, totalQuestions } = await req.json();

        if (!moduleId || score === undefined) {
            return NextResponse.json({ error: 'Module ID and score required' }, { status: 400 });
        }

        // 1. Fetch current profile
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

        if (fetchError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const userProfile = profile as UserProfile;

        // 1.5 Standardize quizzes_passed (ensure it's an object, not an array)
        let quizzesPassed = userProfile.quizzes_passed;
        if (!quizzesPassed || Array.isArray(quizzesPassed)) {
            quizzesPassed = {};
        }

        const isPerfectScore = score === totalQuestions;
        const alreadyPassed = !!quizzesPassed[moduleId];

        const TIER_ORDER: UserProfile['plan_tier'][] = ['curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore', 'sovereignty'];
        const currentTierIndex = TIER_ORDER.indexOf(moduleId as any);

        let xpToAdd = 0;
        let newTiersValidated: string[] = [];

        // 2. Propagation Logic: If passing a higher tier, validate all previous ones
        if (isPerfectScore && currentTierIndex !== -1) {
            for (let i = 0; i <= currentTierIndex; i++) {
                const tierId = TIER_ORDER[i];
                if (!quizzesPassed[tierId]) {
                    quizzesPassed[tierId] = {
                        score: i === currentTierIndex ? score : (moduleId === tierId ? score : 1),
                        total: i === currentTierIndex ? totalQuestions : 1,
                        passed_at: new Date().toISOString(),
                        propagated: i !== currentTierIndex
                    };
                    xpToAdd += 200;
                    newTiersValidated.push(tierId);
                }
            }
        }

        // 3. Update Profile if progress was made
        if (xpToAdd > 0) {
            const currentBadges = userProfile.badges || [];
            const eligibleBadges = calculateEligibleBadges({
                ...userProfile,
                quizzes_passed: quizzesPassed
            });
            const newBadgesEarned = detectNewBadges(currentBadges, eligibleBadges);

            const newXP = (userProfile.xp || 0) + xpToAdd;
            const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
            const updatedBadges = [...currentBadges, ...newBadgesEarned];

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    quizzes_passed: quizzesPassed,
                    xp: newXP,
                    level: newLevel,
                    badges: updatedBadges,
                    last_activity_at: new Date().toISOString()
                })
                .eq('id', authUser.id);

            if (updateError) {
                console.error('[Quiz API] Update Error:', updateError);
                return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                passed: true,
                xpEarned: xpToAdd,
                newLevel,
                newBadges: newBadgesEarned,
                validatedTiers: newTiersValidated,
                firstTime: true
            });
        }

        return NextResponse.json({
            success: true,
            passed: isPerfectScore,
            xpEarned: 0,
            firstTime: false
        });

    } catch (error: any) {
        console.error('[Quiz API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
