/**
 * Email templates for automated waitlist system
 * Handles invite notifications and expiry alerts
 */

import { resend, SYSTEM_EMAIL } from '@/lib/resend';

export interface WaitlistInviteParams {
    email: string;
    name: string;
    waveName: string;
    checkoutToken: string;
    expiresAt: Date;
    position: number;
    plan: string;
    wavePrice: number;
    publicPrice: number;
}

export async function sendWaitlistInvite(params: WaitlistInviteParams) {
    const {
        email,
        name,
        waveName,
        checkoutToken,
        expiresAt,
        position,
        plan,
        wavePrice,
        publicPrice
    } = params;

    const checkoutUrl = `${process.env.NEXT_PUBLIC_URL}/api/waitlist/checkout/${checkoutToken}`;
    const hoursLeft = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));
    const savings = publicPrice - wavePrice;

    try {
        const { data, error } = await resend.emails.send({
            from: SYSTEM_EMAIL,
            to: email,
            subject: `🎉 ${waveName} Wave Aperta - Hai 24h!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #f9fafb;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #C9A86A 0%, #A68B5B 100%); padding: 32px; text-align: center;">
                            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                                🎉 ${waveName} Wave Aperta!
                            </h1>
                        </div>

                        <!-- Content -->
                        <div style="padding: 32px;">
                            <p style="font-size: 18px; color: #1f2937; margin: 0 0 24px;">
                                Ciao <strong>${name}</strong>,
                            </p>

                            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
                                Sei nella posizione <strong style="color: #C9A86A;">#${position}</strong> per la 
                                <strong>${waveName} Founder Wave</strong>. Il tuo checkout esclusivo è ora disponibile!
                            </p>

                            <!-- Info Box -->
                            <div style="background: #f9fafb; border-left: 4px solid #C9A86A; padding: 20px; border-radius: 8px; margin: 24px 0;">
                                <div style="margin-bottom: 16px;">
                                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Piano Scelto</div>
                                    <div style="font-size: 20px; font-weight: bold; color: #1f2937; text-transform: uppercase;">
                                        ${plan}
                                    </div>
                                </div>

                                <div style="margin-bottom: 16px;">
                                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Prezzo Founder</div>
                                    <div style="font-size: 32px; font-weight: bold; color: #C9A86A;">
                                        €${wavePrice}/mese
                                    </div>
                                    <div style="font-size: 14px; color: #6b7280;">
                                        <span style="text-decoration: line-through;">€${publicPrice}</span> 
                                        Risparmi <strong style="color: #10b981;">€${savings}/mese</strong>
                                    </div>
                                </div>

                                <div style="background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 16px; text-align: center;">
                                    <div style="font-size: 14px; color: #92400e; margin-bottom: 8px; font-weight: bold;">
                                        ⏰ SCADENZA
                                    </div>
                                    <div style="font-size: 24px; font-weight: bold; color: #92400e;">
                                        ${hoursLeft} ore rimanenti
                                    </div>
                                    <div style="font-size: 12px; color: #92400e; margin-top: 4px;">
                                        Scade: ${expiresAt.toLocaleString('it-IT', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            })}
                                    </div>
                                </div>
                            </div>

                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${checkoutUrl}" 
                                   style="display: inline-block; background: linear-gradient(135deg, #C9A86A 0%, #A68B5B 100%); 
                                          color: white; text-decoration: none; padding: 18px 48px; 
                                          border-radius: 12px; font-weight: bold; font-size: 18px; 
                                          box-shadow: 0 4px 6px rgba(201, 168, 106, 0.3);">
                                    💳 Completa il Checkout
                                </a>
                            </div>

                            <!-- Info -->
                            <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 24px 0;">
                                <p style="margin: 0 0 12px; font-size: 14px; color: #1e40af; font-weight: bold;">
                                    ℹ️ Perché la scadenza?
                                </p>
                                <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">
                                    Vogliamo dare a tutti una chance equa. Se non completi entro 24h, 
                                    il tuo posto andrà al prossimo in lista.
                                </p>
                            </div>

                            <!-- Alternative -->
                            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
                                <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px;">
                                    <strong>Non riesci a completare ora?</strong> Nessun problema!
                                </p>
                                <p style="font-size: 14px; color: #6b7280; margin: 0;">
                                    Puoi sempre iniziare subito al prezzo pubblico su 
                                    <a href="${process.env.NEXT_PUBLIC_URL}/start" style="color: #C9A86A; text-decoration: underline;">
                                        virtualtwin.app/start
                                    </a>
                                </p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                © 2026 VirtualTwin - Sovereign Edition
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('[Waitlist Email Error]:', error);
            throw error;
        }

        console.log(`[Waitlist] Invite sent to ${email} (position #${position})`);
        return data;

    } catch (error) {
        console.error('[Send Waitlist Invite Error]:', error);
        throw error;
    }
}

export async function sendWaitlistExpired({
    email,
    name,
    plan,
    waveName
}: {
    email: string;
    name: string;
    plan: string;
    waveName: string;
}) {
    try {
        const { data, error } = await resend.emails.send({
            from: SYSTEM_EMAIL,
            to: email,
            subject: `⏰ Token Scaduto - Altre Opzioni Disponibili`,
            html: `
                <!DOCTYPE html>
                <html>
                <body style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f9fafb;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px;">
                        <h1 style="color: #1f2937; margin-top: 0;">Ciao ${name},</h1>
                        
                        <p style="color: #4b5563; line-height: 1.6;">
                            Il tuo checkout token per la <strong>${waveName} Wave</strong> è scaduto dopo 24h.
                        </p>
                        
                        <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 16px; border-radius: 8px; margin: 24px 0;">
                            <p style="margin: 0 0 12px; font-weight: bold; color: #92400e;">
                                Nessun problema! Hai ancora due opzioni:
                            </p>
                            <ol style="margin: 0; padding-left: 20px; color: #92400e;">
                                <li>Rimanere in waitlist per la prossima wave</li>
                                <li>Iniziare subito al prezzo pubblico</li>
                            </ol>
                        </div>
                        
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${process.env.NEXT_PUBLIC_URL}/start" 
                               style="display: inline-block; background: #C9A86A; color: white; 
                                      padding: 14px 28px; border-radius: 8px; text-decoration: none; 
                                      font-weight: bold;">
                                Vedi Prezzi Pubblici →
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #6b7280; text-align: center;">
                            Per domande, rispondi a questa email.
                        </p>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('[Waitlist Expiry Email Error]:', error);
            throw error;
        }

        return data;

    } catch (error) {
        console.error('[Send Waitlist Expired Error]:', error);
        throw error;
    }
}
