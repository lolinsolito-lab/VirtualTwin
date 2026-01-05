import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API to mark a video as completed in the Founder Academy
 * POST /api/academy/complete-video
 * 
 * Body: { videoId: string, xpAwarded: number }
 */
export async function POST(req: Request) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { videoId, xpAwarded = 25 } = await req.json();

        if (!videoId) {
            return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
        }

        // 1. Get current profile to check if video is already completed
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('completed_video_ids, xp, level')
            .eq('id', user.id)
            .single();

        if (fetchError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const completedVideoIds = profile.completed_video_ids || [];

        // 2. If video not already completed, update profile
        if (!completedVideoIds.includes(videoId.toString())) {
            const newCompletedVideos = [...completedVideoIds, videoId.toString()];
            const newXP = (profile.xp || 0) + xpAwarded;

            // Sovereing Leveling Curve: level = floor(sqrt(xp / 100)) + 1
            const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    completed_video_ids: newCompletedVideos,
                    xp: newXP,
                    level: newLevel,
                    last_activity_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) {
                console.error('[Academy API] Update Error:', updateError);
                return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                newXP,
                newLevel,
                firstTime: true
            });
        }

        return NextResponse.json({
            success: true,
            newXP: profile.xp,
            newLevel: profile.level,
            firstTime: false
        });

    } catch (error: any) {
        console.error('[Academy API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
