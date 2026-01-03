import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWaitlistInvite } from '@/lib/emails/waitlistEmails';
import { getWaveByIdSafe } from '@/lib/waves';

/**
 * Notify waitlist users when a new wave opens
 * Called automatically by Stripe webhook after wave sells out
 */
export async function POST(request: Request) {
    try {
        const { prevWave, newWave, spots } = await request.json();

        console.log(`[Waitlist Notify] Opening ${newWave} wave with ${spots} spots`);

        // Get first N users from waitlist for this wave
        const { data: waitlistUsers, error } = await supabase
            .from('waitlist')
            .select('*')
            .eq('next_wave', newWave)
            .eq('token_status', 'pending')
            .order('created_at', { ascending: true })
            .limit(spots);

        if (error) {
            console.error('[Waitlist Notify] Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!waitlistUsers || waitlistUsers.length === 0) {
            console.log('[Waitlist Notify] No users in queue');
            return NextResponse.json({ message: 'No waitlist users' });
        }

        console.log(`[Waitlist Notify] Found ${waitlistUsers.length} users in queue`);

        // Get wave details for pricing
        const waveDetails = getWaveByIdSafe(newWave);
        if (!waveDetails) {
            return NextResponse.json({ error: 'Wave not found' }, { status: 404 });
        }

        // Assign positions and generate tokens
        let notifiedCount = 0;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h from now

        for (let i = 0; i < waitlistUsers.length; i++) {
            const user = waitlistUsers[i];
            const position = i + 1;
            const checkoutToken = crypto.randomUUID();

            try {
                // Update user record
                await supabase
                    .from('waitlist')
                    .update({
                        position_in_queue: position,
                        checkout_token: checkoutToken,
                        token_expires_at: expiresAt.toISOString(),
                        token_status: 'sent'
                    })
                    .eq('id', user.id);

                // Get pricing for their plan
                const wavePrice = waveDetails.prices[user.plan as keyof typeof waveDetails.prices];
                const publicPrice = user.plan === 'esploratore' ? 297 :
                    user.plan === 'pioniere' ? 697 :
                        user.plan === 'conquistatore' ? 1197 : 1997;

                // Send personalized email
                await sendWaitlistInvite({
                    email: user.email,
                    name: user.name || user.email.split('@')[0],
                    waveName: waveDetails.name,
                    checkoutToken,
                    expiresAt,
                    position,
                    plan: user.plan,
                    wavePrice,
                    publicPrice
                });

                notifiedCount++;
                console.log(`[Waitlist Notify] Sent invite to ${user.email} (position ${position})`);

            } catch (emailError) {
                console.error(`[Waitlist Notify] Failed for ${user.email}:`, emailError);
                // Continue with next user even if one fails
            }
        }

        return NextResponse.json({
            success: true,
            notified: notifiedCount,
            wave: newWave,
            total: waitlistUsers.length
        });

    } catch (error) {
        console.error('[Waitlist Notify Error]:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
