import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '@/lib/apiAuth';

/**
 * Create Stripe Billing Portal Session
 * POST /api/stripe/portal
 * 
 * Allows users to manage their subscription (cancel, upgrade, payment methods)
 */
export async function POST(req: NextRequest) {
    try {
        // 🔐 Require authenticated session
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const stripe = getStripe();
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // 🔐 Ensure the authenticated user can only access their own portal
        if (auth.user.id !== userId) {
            return NextResponse.json(
                { error: 'Accesso non autorizzato al billing di un altro utente.' },
                { status: 403 }
            );
        }

        // Get user's Stripe customer ID
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('stripe_customer_id, email')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!profile.stripe_customer_id) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 400 }
            );
        }

        // Create Stripe Billing Portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/dashboard/billing`,
        });

        return NextResponse.json({
            url: session.url,
        });

    } catch (error: any) {
        console.error('Billing Portal Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create portal session' },
            { status: 500 }
        );
    }
}
