import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import { getWaveByIdSafe } from '@/lib/waves';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover'
});

/**
 * Token-based checkout for waitlist users
 * GET /api/waitlist/checkout/[token]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        console.log(`[Waitlist Checkout] Token: ${token}`);

        // Validate token
        const { data: waitlistEntry, error } = await supabase
            .from('waitlist')
            .select('*')
            .eq('checkout_token', token)
            .eq('token_status', 'sent')
            .single();

        if (error || !waitlistEntry) {
            console.log('[Waitlist Checkout] Invalid token');
            return new Response(
                `<!DOCTYPE html>
                <html>
                <body style="font-family: system-ui; text-align: center; padding: 60px 20px;">
                    <h1 style="color: #ef4444;">❌ Token Non Valido</h1>
                    <p>Questo link non è valido o è già stato utilizzato.</p>
                    <a href="${process.env.NEXT_PUBLIC_URL}/waitlist" style="color: #C9A86A;">Torna alla Waitlist</a>
                </body>
                </html>`,
                {
                    status: 404,
                    headers: { 'Content-Type': 'text/html' }
                }
            );
        }

        // Check if expired
        if (new Date(waitlistEntry.token_expires_at) < new Date()) {
            console.log('[Waitlist Checkout] Token expired');

            // Mark as expired
            await supabase
                .from('waitlist')
                .update({ token_status: 'expired' })
                .eq('id', waitlistEntry.id);

            return new Response(
                `<!DOCTYPE html>
                <html>
                <body style="font-family: system-ui; text-align: center; padding: 60px 20px;">
                    <h1 style="color: #f59e0b;">⏰ Token Scaduto</h1>
                    <p>Questo link è scaduto dopo 24 ore.</p>
                    <p>Puoi ancora iniziare al prezzo pubblico:</p>
                    <a href="${process.env.NEXT_PUBLIC_URL}/start" 
                       style="display: inline-block; background: #C9A86A; color: white; 
                              padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">
                        Vedi Prezzi Pubblici
                    </a>
                </body>
                </html>`,
                {
                    status: 410,
                    headers: { 'Content-Type': 'text/html' }
                }
            );
        }

        // Get wave pricing
        const wave = getWaveByIdSafe(waitlistEntry.next_wave);

        if (!wave) {
            console.error('[Waitlist Checkout] Wave not found:', waitlistEntry.next_wave);
            return NextResponse.json({ error: 'Wave not found' }, { status: 404 });
        }

        // Get Stripe Price ID for this plan
        const stripePriceId = wave.stripePriceIds[waitlistEntry.plan as keyof typeof wave.stripePriceIds];

        if (!stripePriceId) {
            console.error('[Waitlist Checkout] Invalid plan:', waitlistEntry.plan);
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        console.log(`[Waitlist Checkout] Creating session for ${waitlistEntry.email} - Plan: ${waitlistEntry.plan}`);

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{
                price: stripePriceId,
                quantity: 1
            }],
            metadata: {
                plan: waitlistEntry.plan,
                tier: 'founder',
                wave: wave.id,
                waitlistToken: token,
                fromWaitlist: 'true'
            },
            success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true&wave=${wave.name}&founder=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/waitlist?cancelled=true`,
            customer_email: waitlistEntry.email
        });

        console.log(`[Waitlist Checkout] Session created: ${session.id}`);

        // Redirect to Stripe
        return NextResponse.redirect(session.url!);

    } catch (error) {
        console.error('[Waitlist Checkout Error]:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
