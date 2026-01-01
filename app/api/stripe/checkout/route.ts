import { NextResponse } from 'next/server';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { plan, tenantId, ownerEmail } = await req.json();

        if (!plan || !tenantId || !ownerEmail) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        // Get Price ID based on plan
        let priceId = '';
        switch (plan) {
            case 'starter': priceId = STRIPE_PLANS.STARTER; break;
            case 'pro': priceId = STRIPE_PLANS.PRO; break;
            case 'agency': priceId = STRIPE_PLANS.AGENCY; break;
            default: return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
            customer_email: ownerEmail,
            client_reference_id: tenantId,
            subscription_data: {
                metadata: {
                    tenantId: tenantId,
                    planType: plan
                },
            },
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
