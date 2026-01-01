import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const session = event.data.object as any;

    try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription || session.id);
                const subscription = subscriptionResponse as any;
                const tenantId = session.client_reference_id || subscription.metadata?.tenantId;
                const planType = subscription.metadata?.planType || 'free';

                // Update or Create Subscription in Supabase
                const { data: subData, error: subError } = await supabase
                    .from('subscriptions')
                    .upsert({
                        tenant_id: tenantId,
                        stripe_subscription_id: subscription.id,
                        stripe_customer_id: subscription.customer as string,
                        plan_type: planType,
                        status: subscription.status,
                        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                        cancel_at_period_end: subscription.cancel_at_period_end,
                    }, { onConflict: 'stripe_subscription_id' })
                    .select()
                    .single();

                if (subError) throw subError;

                // Update Tenant Record
                await supabase
                    .from('tenants')
                    .update({
                        plan_type: planType,
                        subscription_id: subData.id
                    })
                    .eq('id', tenantId);

                break;

            case 'customer.subscription.deleted':
                await supabase
                    .from('subscriptions')
                    .update({ status: 'canceled' })
                    .eq('stripe_subscription_id', session.id);

                // Note: We might want to reset tenant plan to 'free' here as well
                break;
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
