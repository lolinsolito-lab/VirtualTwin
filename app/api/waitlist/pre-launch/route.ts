import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Pre-Launch Waitlist API
 * Collects emails for Feb 1st launch notification
 */
export async function POST(req: NextRequest) {
    try {
        const { email, plan } = await req.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email required' },
                { status: 400 }
            );
        }

        // Insert into waitlist table
        const { error } = await supabase
            .from('waitlist')
            .insert({
                email,
                name: email.split('@')[0], // Extract name from email
                plan: plan || 'genesis',
                current_wave: 'pre_launch',
                next_wave: 'genesis',
                token_status: 'pending',
                notify_at: '2026-02-01T00:00:00' // Launch day notification
            });

        if (error) {
            // Check for duplicate
            if (error.code === '23505') {
                return NextResponse.json(
                    { message: 'Already subscribed!' },
                    { status: 200 }
                );
            }
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: `You'll be notified on Feb 1st!`
        });

    } catch (error) {
        console.error('[Pre-Launch Signup Error]:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe. Please try again.' },
            { status: 500 }
        );
    }
}
