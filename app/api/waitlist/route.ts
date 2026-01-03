/**
 * Waitlist API Route
 * 
 * Handles waitlist signups with email confirmation via Resend
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, full_name, interested_plan, source, metadata } = body;

        // Validate required fields
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if already on waitlist
        const { data: existing } = await supabase
            .from('waitlist')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Email already on waitlist', alreadyExists: true },
                { status: 409 }
            );
        }

        // Insert into waitlist
        const { data, error } = await supabase
            .from('waitlist')
            .insert({
                email,
                full_name: full_name || null,
                source: source || 'waitlist_page',
                metadata: {
                    ...metadata,
                    interested_plan: interested_plan || 'pioniere',
                    signup_timestamp: new Date().toISOString()
                }
            })
            .select()
            .single();

        if (error) {
            console.error('[Waitlist] Insert error:', error);
            return NextResponse.json(
                { error: 'Failed to join waitlist' },
                { status: 500 }
            );
        }

        // Send confirmation email via Resend
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(apiKey);

                await resend.emails.send({
                    from: 'VirtualTwin <noreply@virtualtwin.app>',
                    to: email,
                    subject: '🎉 Sei nella Waitlist di VirtualTwin!',
                    html: getWaitlistConfirmationEmail(full_name || 'there')
                });

                console.log(`[Waitlist] ✅ Confirmation email sent to ${email}`);
            } catch (emailError) {
                console.error('[Waitlist] Email error:', emailError);
                // Don't fail the request if email fails
            }
        }

        console.log(`[Waitlist] ✅ New signup: ${email} (${interested_plan})`);

        return NextResponse.json({
            success: true,
            message: 'Successfully joined waitlist'
        });

    } catch (error) {
        console.error('[Waitlist] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Generate waitlist confirmation email HTML
 */
function getWaitlistConfirmationEmail(name: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .badge { display: inline-block; background: linear-gradient(135deg, #D4AF37, #B8860B); color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        .title { font-size: 28px; font-weight: bold; color: #1f2937; margin: 20px 0 10px; }
        .subtitle { color: #6b7280; font-size: 16px; }
        .info-box { background: #fef3c7; border-left: 4px solid #D4AF37; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .cta-button { display: inline-block; background: #1f2937; color: white; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #9ca3af; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <span class="badge">🎉 Sei nella Lista!</span>
                <h1 class="title">Benvenuto, ${name}!</h1>
                <p class="subtitle">Sei ora nella waitlist di VirtualTwin</p>
            </div>
            
            <p>Grazie per il tuo interesse in VirtualTwin! Sei stato aggiunto alla nostra waitlist esclusiva.</p>
            
            <div class="info-box">
                <strong>🚀 Prossimo Step: Pioneer Wave</strong>
                <p style="margin: 10px 0 0;">La prossima wave inizierà ad <strong>Aprile 2026</strong> con 30 posti disponibili. Ti contatteremo prima degli altri!</p>
            </div>
            
            <p>Nel frattempo, cosa puoi fare:</p>
            <ul>
                <li>Prepara la tua lista di FAQ per addestrare l'AI</li>
                <li>Configura il tuo account WhatsApp Business</li>
                <li>Pensa a come vuoi che il tuo clone risponda</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="https://virtualtwin.vercel.app/start" class="cta-button">
                    Non vuoi aspettare? Inizia Subito →
                </a>
            </p>
            
            <div class="footer">
                <p>Team VirtualTwin<br>
                📧 support@virtualtwin.app</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}
