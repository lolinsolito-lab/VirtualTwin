import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWaitlistExpired, sendWaitlistInvite } from '@/lib/emails/waitlistEmails';
import { getWaveByIdSafe } from '@/lib/waves';

/**
 * Cron job to handle expired waitlist tokens
 * Runs every hour via Vercel Cron
 * 
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/waitlist-expiry",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
    try {
        // Auth check for Vercel Cron
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.warn('[Cron] Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('[Cron] Starting waitlist expiry check...');

        // Find expired tokens
        const { data: expired, error } = await supabase
            .from('waitlist')
            .select('*')
            .eq('token_status', 'sent')
            .lt('token_expires_at', new Date().toISOString());

        if (error) {
            console.error('[Cron] Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!expired || expired.length === 0) {
            console.log('[Cron] No expired tokens found');
            return NextResponse.json({ message: 'No expired tokens' });
        }

        console.log(`[Cron] Found ${expired.length} expired tokens`);

        // Mark as expired
        const expiredIds = expired.map(e => e.id);
        await supabase
            .from('waitlist')
            .update({ token_status: 'expired' })
            .in('id', expiredIds);

        // Send expiry notifications
        for (const entry of expired) {
            try {
                await sendWaitlistExpired({
                    email: entry.email,
                    name: entry.name || entry.email.split('@')[0],
                    plan: entry.plan,
                    waveName: entry.next_wave
                });
                console.log(`[Cron] Sent expiry email to ${entry.email}`);
            } catch (emailError) {
                console.error(`[Cron] Failed to send expiry email to ${entry.email}:`, emailError);
            }
        }

        // Group by wave to send invites to next in queue
        const waveGroups = expired.reduce((acc, entry) => {
            if (!acc[entry.next_wave]) acc[entry.next_wave] = [];
            acc[entry.next_wave].push(entry);
            return acc;
        }, {} as Record<string, any[]>);

        let queuedCount = 0;

        for (const [waveId, entries] of Object.entries(waveGroups) as [string, any[]][]) {
            // Get next N people in queue
            const { data: nextInQueue } = await supabase
                .from('waitlist')
                .select('*')
                .eq('next_wave', waveId)
                .eq('token_status', 'pending')
                .order('created_at', { ascending: true })
                .limit(entries.length);

            if (!nextInQueue || nextInQueue.length === 0) {
                console.log(`[Cron] No more users in queue for ${waveId}`);
                continue;
            }

            console.log(`[Cron] Processing ${nextInQueue.length} next users for ${waveId}`);

            // Get wave details
            const wave = getWaveByIdSafe(waveId);
            if (!wave) {
                console.error(`[Cron] Wave not found: ${waveId}`);
                continue;
            }

            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

            for (let i = 0; i < nextInQueue.length; i++) {
                const user = nextInQueue[i];
                const position = i + 1;
                const checkoutToken = crypto.randomUUID();

                try {
                    // Update user
                    await supabase
                        .from('waitlist')
                        .update({
                            position_in_queue: position,
                            checkout_token: checkoutToken,
                            token_expires_at: expiresAt.toISOString(),
                            token_status: 'sent'
                        })
                        .eq('id', user.id);

                    // Get pricing
                    const wavePrice = wave.prices[user.plan as keyof typeof wave.prices];
                    const publicPrice = user.plan === 'esploratore' ? 297 :
                        user.plan === 'pioniere' ? 697 :
                            user.plan === 'conquistatore' ? 1197 : 1997;

                    // Send invite
                    await sendWaitlistInvite({
                        email: user.email,
                        name: user.name || user.email.split('@')[0],
                        waveName: wave.name,
                        checkoutToken,
                        expiresAt,
                        position,
                        plan: user.plan,
                        wavePrice,
                        publicPrice
                    });

                    queuedCount++;
                    console.log(`[Cron] Sent invite to ${user.email} (next in queue)`);

                } catch (error) {
                    console.error(`[Cron] Failed to process ${user.email}:`, error);
                }
            }
        }

        return NextResponse.json({
            success: true,
            expired: expired.length,
            notifiedNext: queuedCount,
            waves: Object.keys(waveGroups).length
        });

    } catch (error) {
        console.error('[Cron Expiry Error]:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
