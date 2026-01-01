import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 * 
 * Handles subscription lifecycle events from Stripe
 */
export async function POST(req: Request) {
    const stripe = getStripe();
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
        console.error('Missing stripe-signature header');
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

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

    console.log(`[Stripe Webhook] Event: ${event.type}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdate(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionCanceled(subscription);
                break;
            }

            case 'invoice.paid': {
                const invoice = event.data.object as Stripe.Invoice;
                await handleInvoicePaid(invoice);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('[Stripe Webhook] Processing error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id;
    const plan = session.metadata?.plan || 'pioniere';
    const isFounder = session.metadata?.isFounder === 'true';

    if (!userId) {
        console.error('[Stripe] No userId in checkout session');
        return;
    }

    console.log(`[Stripe] Checkout completed for user ${userId}, plan: ${plan}`);

    // Update user profile
    const { error } = await supabase
        .from('profiles')
        .update({
            plan_tier: plan,
            subscription_status: 'active',
            is_founder: isFounder,
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

    if (error) {
        console.error('[Stripe] Failed to update profile:', error);
    }

    // Log billing event
    await supabase.from('billing_events').insert({
        user_id: userId,
        event_type: 'checkout_completed',
        stripe_event_id: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || 'eur',
        metadata: { plan, isFounder },
    });
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan;
    const isFounder = subscription.metadata?.isFounder === 'true';

    if (!userId) {
        console.log('[Stripe] No userId in subscription metadata');
        return;
    }

    console.log(`[Stripe] Subscription updated for user ${userId}, status: ${subscription.status}`);

    // Update profile with subscription status
    const sub = subscription as any; // Cast for property access
    const { error } = await supabase
        .from('profiles')
        .update({
            subscription_status: subscription.status,
            plan_tier: plan || undefined,
            is_founder: isFounder || undefined,
            stripe_subscription_id: subscription.id,
            current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : undefined,
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

    if (error) {
        console.error('[Stripe] Failed to update subscription status:', error);
    }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;

    if (!userId) {
        console.log('[Stripe] No userId for canceled subscription');
        return;
    }

    console.log(`[Stripe] Subscription canceled for user ${userId}`);

    // Downgrade to free tier
    const { error } = await supabase
        .from('profiles')
        .update({
            plan_tier: 'curioso',
            subscription_status: 'canceled',
            is_founder: false, // Lose founder status on cancel
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

    if (error) {
        console.error('[Stripe] Failed to handle cancellation:', error);
    }

    // Log billing event
    await supabase.from('billing_events').insert({
        user_id: userId,
        event_type: 'subscription_canceled',
        stripe_event_id: subscription.id,
        metadata: { reason: 'user_canceled' },
    });
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    console.log(`[Stripe] Invoice paid: ${invoice.id}, amount: ${invoice.amount_paid / 100} ${invoice.currency}`);

    // Find user by Stripe customer ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (profile) {
        // Update last payment date
        await supabase
            .from('profiles')
            .update({
                last_payment_at: new Date().toISOString(),
                subscription_status: 'active',
            })
            .eq('id', profile.id);

        // Log billing event
        await supabase.from('billing_events').insert({
            user_id: profile.id,
            event_type: 'invoice_paid',
            stripe_event_id: invoice.id,
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
        });
    }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    console.log(`[Stripe] Payment failed: ${invoice.id}`);

    // Find user and mark as past_due
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (profile) {
        await supabase
            .from('profiles')
            .update({
                subscription_status: 'past_due',
            })
            .eq('id', profile.id);

        // Log billing event
        await supabase.from('billing_events').insert({
            user_id: profile.id,
            event_type: 'payment_failed',
            stripe_event_id: invoice.id,
            metadata: {
                attempt_count: invoice.attempt_count,
                next_attempt: invoice.next_payment_attempt
            },
        });
    }
}
