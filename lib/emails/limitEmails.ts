/**
 * Email Templates for Message Limit Notifications
 * 
 * 3 levels: warning (75%), critical (90%), exceeded (100%)
 * Each with persuasive copy for upsell conversion
 */

import { LimitStatus, TierUpgrade, calculatePotentialLoss, getUpgradeUrl } from '@/lib/limits/messageLimitChecker';

// =============================================
// TYPES
// =============================================

interface EmailData {
    subject: string;
    html: string;
}

interface LimitEmailParams {
    userName: string;
    userEmail: string;
    used: number;
    limit: number;
    remaining: number;
    tier: string;
    nextTier: TierUpgrade;
    businessName?: string;
}

// =============================================
// EMAIL TEMPLATES
// =============================================

/**
 * WARNING (75%) - First gentle nudge
 */
function getWarningEmail(params: LimitEmailParams): EmailData {
    const { userName, used, limit, remaining, nextTier } = params;
    const percentage = Math.round((used / limit) * 100);
    const daysRemaining = Math.ceil(remaining / (used / 30));
    const upgradeUrl = getUpgradeUrl(nextTier);

    return {
        subject: `⚠️ 75% Limite Messaggi Raggiunto - VirtualTwin`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .alert-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stats { background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .upgrade-box { background: #DCFCE7; border: 2px solid #22C55E; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Stai Crescendo Velocemente!</h1>
        </div>
        
        <p>Ciao ${userName || 'there'},</p>
        
        <p>Ottime notizie! Il tuo clone VirtualTwin sta lavorando tantissimo questo mese. 🚀</p>
        
        <div class="alert-box">
            <strong>📊 Stato Attuale:</strong>
            <ul>
                <li>Messaggi usati: <strong>${used}/${limit}</strong> (${percentage}%)</li>
                <li>Messaggi rimanenti: <strong>${remaining}</strong></li>
                <li>Giorni stimati: <strong>~${daysRemaining} giorni</strong> al tuo ritmo</li>
            </ul>
        </div>
        
        <p>💡 <strong>Cosa significa?</strong></p>
        <p>Se continui a questo ritmo, raggiungerai il limite prima della fine del mese. Quando il limite è raggiunto, il clone si ferma automaticamente e i lead ricevono un messaggio "in pausa".</p>
        
        <div class="upgrade-box">
            <h2>✅ Passa a ${nextTier.name}</h2>
            <p>${nextTier.limit.toLocaleString()} messaggi/mese (${Math.round(nextTier.limit / limit)}x più del tuo piano)</p>
            <p style="font-size: 24px; font-weight: bold; color: #059669;">€${nextTier.price}/mese</p>
            <p style="margin-bottom: 20px;">Recuperi l'investimento con 1-2 vendite.</p>
            <a href="${upgradeUrl}" class="cta-button">🚀 Fai Upgrade Ora</a>
        </div>
        
        <p>Hai domande? Rispondi a questa email, ti rispondo personalmente.</p>
        
        <div class="footer">
            <p>Team VirtualTwin<br>
            📧 support@virtualtwin.app</p>
        </div>
    </div>
</body>
</html>
        `
    };
}

/**
 * CRITICAL (90%) - Urgent warning
 */
function getCriticalEmail(params: LimitEmailParams): EmailData {
    const { userName, used, limit, remaining, nextTier, tier } = params;
    const daysRemaining = Math.max(1, Math.ceil(remaining / (used / 30)));
    const potentialLoss = calculatePotentialLoss(Math.floor(used / 30), daysRemaining);
    const upgradeUrl = getUpgradeUrl(nextTier);

    return {
        subject: `🚨 URGENTE: Solo ${remaining} Messaggi Rimasti! - VirtualTwin`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; background: #FEE2E2; border-radius: 12px; margin-bottom: 20px; }
        .critical-box { background: #FEE2E2; border: 2px solid #DC2626; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .warning-list { background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .upgrade-box { background: #10B981; color: white; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .cta-button { display: inline-block; background: white; color: #10B981; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; }
        .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #DC2626; margin: 0;">🚨 ATTENZIONE</h1>
            <p style="font-size: 18px; color: #991B1B; margin: 10px 0 0;">Il tuo clone sta per bloccarsi!</p>
        </div>
        
        <p>Ciao ${userName || 'there'},</p>
        
        <div class="critical-box">
            <h2 style="color: #DC2626; margin-top: 0;">📊 Stato CRITICO</h2>
            <p style="font-size: 28px; font-weight: bold; color: #DC2626; margin: 10px 0;">Solo ${remaining} messaggi rimasti!</p>
            <p>Usati: ${used}/${limit} (${Math.round((used / limit) * 100)}%)</p>
            <p>Il clone si bloccherà tra <strong>~${daysRemaining} giorni</strong></p>
        </div>
        
        <div class="warning-list">
            <h3>⚠️ Cosa succede quando il limite è raggiunto:</h3>
            <ul>
                <li>❌ Clone AI si ferma automaticamente</li>
                <li>❌ I lead ricevono: <em>"Assistente in pausa"</em></li>
                <li>💸 Perdi vendite fino al prossimo pagamento</li>
            </ul>
            <p style="font-weight: bold; color: #B45309;">Perdita stimata: €${potentialLoss.toLocaleString()}</p>
        </div>
        
        <div class="upgrade-box">
            <h2 style="color: white; margin-top: 0;">✅ AZIONE IMMEDIATA</h2>
            <p style="color: white;">Upgrade a <strong>${nextTier.name}</strong> ORA</p>
            <ul style="text-align: left; color: white;">
                <li>🚀 ${nextTier.limit.toLocaleString()} messaggi/mese</li>
                <li>✅ Attivazione istantanea (30 secondi)</li>
                <li>🎁 +500 messaggi bonus gratis</li>
            </ul>
            <p style="font-size: 24px; font-weight: bold; color: white;">€${nextTier.price}/mese</p>
            <a href="${upgradeUrl}" class="cta-button">🚨 UPGRADE IMMEDIATO</a>
        </div>
        
        <p><strong>Ogni ora che aspetti = Lead persi.</strong></p>
        <p>Hai bisogno di aiuto? Rispondi a questa email o scrivici su WhatsApp.</p>
        
        <div class="footer">
            <p>Team VirtualTwin<br>
            📧 support@virtualtwin.app</p>
        </div>
    </div>
</body>
</html>
        `
    };
}

/**
 * EXCEEDED (100%) - Clone blocked
 */
function getExceededEmail(params: LimitEmailParams): EmailData {
    const { userName, used, limit, nextTier, tier } = params;
    const dailyRate = Math.floor(used / 30);
    const potentialLoss = calculatePotentialLoss(dailyRate, 15); // Assume 15 days until payment
    const upgradeUrl = getUpgradeUrl(nextTier);

    return {
        subject: `❌ CLONE BLOCCATO - Azione Urgente Richiesta - VirtualTwin`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #991B1B, #DC2626); border-radius: 12px; margin-bottom: 20px; }
        .blocked-box { background: #FEE2E2; border: 3px solid #991B1B; padding: 25px; border-radius: 8px; margin: 20px 0; }
        .impact-box { background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .upgrade-box { background: linear-gradient(135deg, #059669, #10B981); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center; }
        .cta-button { display: inline-block; background: white; color: #059669; padding: 20px 60px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 20px; }
        .secondary-button { display: inline-block; background: transparent; color: white; border: 2px solid white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
        .footer { text-align: center; padding: 20px 0; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white; margin: 0; font-size: 32px;">❌ CLONE AI BLOCCATO</h1>
        </div>
        
        <p>Ciao ${userName || 'there'},</p>
        
        <div class="blocked-box">
            <p style="font-size: 18px; margin: 0;"><strong style="color: #991B1B;">Hai raggiunto il limite di ${limit} messaggi/mese.</strong></p>
            <p style="margin: 15px 0 0;">
                <span style="display: inline-block; background: #991B1B; color: white; padding: 5px 15px; border-radius: 20px;">
                    Clone AI: ❌ DISATTIVATO
                </span>
            </p>
        </div>
        
        <div class="impact-box">
            <h3 style="color: #B45309; margin-top: 0;">📱 Cosa sta succedendo ADESSO:</h3>
            <ul>
                <li>❌ Nuovi lead ricevono messaggio automatico "in pausa"</li>
                <li>❌ Nessuna risposta AI attiva</li>
                <li>📉 Stai perdendo ~${dailyRate} lead al giorno</li>
            </ul>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; color: #991B1B; font-size: 18px;">
                    <strong>💸 Perdita Stimata: €${potentialLoss.toLocaleString()}</strong>
                </p>
                <p style="margin: 5px 0 0; color: #666; font-size: 14px;">
                    (se aspetti fino al prossimo pagamento)
                </p>
            </div>
        </div>
        
        <div class="upgrade-box">
            <h2 style="color: white; margin-top: 0;">✅ RIATTIVA ORA - 30 Secondi</h2>
            <p style="color: white;">Upgrade a <strong>${nextTier.name}</strong></p>
            <ul style="text-align: left; color: white; margin: 20px 0;">
                <li>🚀 ${nextTier.limit.toLocaleString()} messaggi/mese (${Math.round(nextTier.limit / limit)}x più)</li>
                <li>✅ Clone riattivato istantaneamente</li>
                <li>🎁 +500 messaggi bonus gratis</li>
                <li>💰 Recuperi investimento con 1-2 vendite</li>
            </ul>
            <p style="font-size: 28px; font-weight: bold; color: white;">€${nextTier.price}/mese</p>
            <a href="${upgradeUrl}" class="cta-button">🚀 RIATTIVA CLONE ORA</a>
            <br>
            <a href="mailto:support@virtualtwin.app" class="secondary-button">💬 Parla con Noi</a>
        </div>
        
        <p style="text-align: center; font-weight: bold; color: #DC2626;">⏱ Ogni ora che aspetti = Lead persi</p>
        
        <div class="footer">
            <p>Team VirtualTwin<br>
            📧 support@virtualtwin.app<br>
            📞 Risposta garantita in 1 ora</p>
        </div>
    </div>
</body>
</html>
        `
    };
}

// =============================================
// MAIN EXPORT
// =============================================

/**
 * Get email template based on limit status
 */
export function getLimitEmail(status: LimitStatus, params: LimitEmailParams): EmailData | null {
    switch (status) {
        case 'warning':
            return getWarningEmail(params);
        case 'critical':
            return getCriticalEmail(params);
        case 'exceeded':
            return getExceededEmail(params);
        default:
            return null;
    }
}

/**
 * Send limit notification email via Resend
 */
export async function sendLimitNotificationEmail(
    status: LimitStatus,
    params: LimitEmailParams
): Promise<boolean> {
    const email = getLimitEmail(status, params);

    if (!email) {
        console.log('[Email] No email template for status:', status);
        return false;
    }

    // Check for API key
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[Email] RESEND_API_KEY not configured - logging only');
        console.log(`[Email] Would send ${status} email to ${params.userEmail}`);
        console.log(`[Email] Subject: ${email.subject}`);
        return true; // Return true so we don't retry
    }

    try {
        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        const { data, error } = await resend.emails.send({
            from: 'VirtualTwin <noreply@virtualtwin.app>',
            to: params.userEmail,
            subject: email.subject,
            html: email.html
        });

        if (error) {
            console.error('[Email] Resend error:', error);
            return false;
        }

        console.log(`[Email] ✅ Sent ${status} email to ${params.userEmail} (ID: ${data?.id})`);
        return true;

    } catch (error) {
        console.error('[Email] Failed to send:', error);
        return false;
    }
}
