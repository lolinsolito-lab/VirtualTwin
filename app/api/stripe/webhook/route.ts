import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { supabaseAdmin as supabase } from '@/lib/supabase';
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
 * Supports both:
 * 1. Existing users (userId in metadata) - updates their subscription
 * 2. New users (no userId) - creates account from Stripe email (Checkout-First Flow)
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.client_reference_id || session.metadata?.userId;
    const customerEmail = session.customer_email || session.customer_details?.email;
    const plan = session.metadata?.plan || 'pioniere';
    const tier = session.metadata?.tier || 'founder';
    const isFounder = tier === 'founder' || session.metadata?.isFounder === 'true';

    console.log(`[Stripe] Checkout completed - Email: ${customerEmail}, Plan: ${plan}, Tier: ${tier}, UserId: ${userId || 'NEW_USER'}`);

    // CASE 1: Existing user (came from billing page while logged in)
    if (userId) {
        const { error } = await supabase
            .from('profiles')
            .update({
                plan_tier: plan,
                subscription_status: 'active',
                is_founder: isFounder,
                founder_joined_at: isFounder ? new Date().toISOString() : undefined,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                trial_started_at: new Date().toISOString(),
                trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                is_trial_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            console.error('[Stripe] Failed to update existing user profile:', error);
        } else {
            console.log(`[Stripe] ✅ Updated existing user ${userId} to plan ${plan}`);
        }

        // Log billing event
        await supabase.from('billing_events').insert({
            user_id: userId,
            event_type: 'checkout_completed',
            stripe_event_id: session.id,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency || 'eur',
            metadata: { plan, tier, isFounder },
        });

        return;
    }

    // CASE 2: New user - Checkout-First Flow (create account from Stripe email)
    if (!customerEmail) {
        console.error('[Stripe] ❌ No email in checkout session - cannot create user');
        return;
    }

    console.log(`[Stripe] 🆕 Creating new user from Stripe checkout: ${customerEmail}`);

    // Check if user already exists by email
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', customerEmail)
        .single();

    if (existingProfile) {
        // User exists, update their subscription
        console.log(`[Stripe] User ${customerEmail} already exists, updating subscription...`);

        await supabase
            .from('profiles')
            .update({
                plan_tier: plan,
                subscription_status: 'active',
                is_founder: isFounder,
                founder_joined_at: isFounder ? new Date().toISOString() : undefined,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: session.subscription as string,
                trial_started_at: new Date().toISOString(),
                trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                is_trial_active: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existingProfile.id);

        // Send password reset email so they can access their account
        await supabase.auth.resetPasswordForEmail(customerEmail, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/auth/reset-password`,
        });

        console.log(`[Stripe] ✅ Updated existing user and sent password reset email`);
        return;
    }

    // Create brand new user account
    const randomPassword = `VT${Math.random().toString(36).slice(-12)}${Date.now().toString(36)}!`;

    // Create auth user using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: randomPassword,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
            plan,
            tier,
            is_founder: isFounder,
            source: 'checkout_first_flow',
        },
    });

    if (authError) {
        console.error('[Stripe] ❌ Failed to create auth user:', authError);
        return;
    }

    const newUserId = authData.user!.id;
    console.log(`[Stripe] ✅ Created auth user: ${newUserId}`);

    // Create profile
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: newUserId,
        email: customerEmail,
        plan_tier: plan,
        subscription_status: 'active',
        is_founder: isFounder,
        founder_joined_at: isFounder ? new Date().toISOString() : null,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        trial_started_at: new Date().toISOString(),
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        is_trial_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    if (profileError) {
        console.error('[Stripe] ❌ Failed to create profile:', profileError);
        return;
    }

    // Create default clone for the user
    await supabase.from('clones').insert({
        user_id: newUserId,
        name: 'Clone Principale',
        business_name: 'La Mia Azienda',
        business_description: 'Azienda d\'Elite',
        product_service: 'Servizi di Lusso',
        is_active: true,
    });

    // Send password reset email so user can set their password
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(customerEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://virtualtwin.vercel.app'}/auth/reset-password`,
    });

    if (resetError) {
        console.error('[Stripe] ⚠️ Failed to send password reset email:', resetError);
    } else {
        console.log(`[Stripe] 📧 Password reset email sent to ${customerEmail}`);
    }

    // Log billing event
    await supabase.from('billing_events').insert({
        user_id: newUserId,
        event_type: 'checkout_completed_new_user',
        stripe_event_id: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || 'eur',
        metadata: { plan, tier, isFounder, email: customerEmail },
    });

    console.log(`[Stripe] ✅ New user ${customerEmail} created successfully with plan ${plan} (${tier})`);
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
