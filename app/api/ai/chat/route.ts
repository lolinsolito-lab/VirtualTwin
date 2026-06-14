import { NextRequest, NextResponse } from 'next/server';
import { hybridAIResponse } from '@/lib/hybridAI';
import { ChatHistoryItem } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase';
import { checkMessageLimit, incrementMessageUsage } from '@/lib/supabaseHelpers';

// =============================================
// AI CHAT ENDPOINT — v2.0 SICURO
// ✅ Autenticazione obbligatoria
// ✅ Input sanitization (max length, strip HTML)
// ✅ Message limit enforcement
// ✅ Provider AI differenziato per piano (hybridAI)
// ✅ Watermark per piano free
// =============================================

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 20;

/**
 * Rimuove tag HTML e limita la lunghezza del messaggio
 */
function sanitizeMessage(message: string): string {
    return message
        .replace(/<[^>]*>/g, '')             // strip HTML tags
        .replace(/javascript:/gi, '')         // strip JS injection
        .replace(/on\w+\s*=/gi, '')           // strip event handlers
        .substring(0, MAX_MESSAGE_LENGTH)     // hard length limit
        .trim();
}

export async function POST(request: NextRequest) {
    try {
        // =========================================
        // 1. AUTENTICAZIONE OBBLIGATORIA
        // =========================================
        const authHeader = request.headers.get('Authorization');
        let userId: string | null = null;
        let userPlan = 'curioso';

        if (authHeader?.startsWith('Bearer ')) {
            // Token JWT da Supabase session
            const token = authHeader.replace('Bearer ', '');
            const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

            if (authError || !user) {
                return NextResponse.json(
                    { error: 'Sessione non valida. Effettua il login.' },
                    { status: 401 }
                );
            }
            userId = user.id;
        } else {
            // Prova con la cookie session (browser)
            const cookies = request.headers.get('cookie') || '';
            // Se non c'è autenticazione, blocca
            return NextResponse.json(
                { error: 'Autenticazione richiesta. Effettua il login per usare il clone AI.' },
                { status: 401 }
            );
        }

        // =========================================
        // 2. RECUPERA PIANO UTENTE
        // =========================================
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('plan_tier, subscription_status, is_trial_active, trial_ends_at')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json(
                { error: 'Profilo utente non trovato.' },
                { status: 403 }
            );
        }

        userPlan = profile.plan_tier || 'curioso';

        // Verifica che l'account sia attivo (non expired)
        if (profile.subscription_status === 'canceled' && !profile.is_trial_active) {
            return NextResponse.json(
                { error: 'Abbonamento non attivo. Rinnova il piano per continuare.' },
                { status: 402 }
            );
        }

        // =========================================
        // 3. CHECK LIMITE MESSAGGI
        // =========================================
        const limitCheck = await checkMessageLimit(userId);
        if (!limitCheck.allowed) {
            return NextResponse.json(
                {
                    error: limitCheck.message || 'Limite messaggi raggiunto.',
                    reason: limitCheck.reason,
                    upgradeUrl: '/founder',
                },
                { status: 429 }
            );
        }

        // =========================================
        // 4. PARSING E SANITIZATION INPUT
        // =========================================
        const body = await request.json();
        const {
            message: rawMessage,
            history: rawHistory = [],
            businessContext,
            cloneId,
            cloneSettings,
        } = body as {
            message: string;
            history: ChatHistoryItem[];
            businessContext?: string;
            cloneId?: string;
            cloneSettings?: {
                tone?: string;
                customPersonality?: string;
                websiteUrl?: string;
                knowledgeBase?: { name: string }[];
                faqs?: { question: string; answer: string }[];
            };
        };

        if (!rawMessage || typeof rawMessage !== 'string') {
            return NextResponse.json(
                { error: 'Messaggio richiesto.' },
                { status: 400 }
            );
        }

        // Sanitize message
        const message = sanitizeMessage(rawMessage);

        if (message.length === 0) {
            return NextResponse.json(
                { error: 'Messaggio vuoto dopo sanitizzazione.' },
                { status: 400 }
            );
        }

        // Limita la history per evitare token bombing
        const history = (Array.isArray(rawHistory) ? rawHistory : [])
            .slice(-MAX_HISTORY_ITEMS)
            .map(item => ({
                role: item.role === 'user' ? 'user' : 'assistant',
                content: sanitizeMessage(String(item.content || '')),
            })) as ChatHistoryItem[];

        // =========================================
        // 5. CARICA CONTESTO CLONE (se specificato)
        // =========================================
        let finalContext = businessContext || '';
        let finalCloneSettings = cloneSettings;

        if (cloneId && !businessContext) {
            const { data: clone } = await supabaseAdmin
                .from('clones')
                .select('business_name, business_description, product_service, target_audience, faq_data, tone_of_voice, custom_instructions')
                .eq('id', cloneId)
                .eq('user_id', userId)   // security: solo cloni dell'utente
                .single();

            if (clone) {
                finalContext = `
Azienda: ${clone.business_name}
Descrizione: ${clone.business_description}
Prodotto/Servizio: ${clone.product_service}
Target: ${clone.target_audience || 'Professionisti e imprenditori'}
                `.trim();

                finalCloneSettings = {
                    tone: clone.tone_of_voice,
                    customPersonality: clone.custom_instructions || undefined,
                    faqs: Array.isArray(clone.faq_data) ? clone.faq_data : [],
                };
            }
        }

        if (!finalContext) {
            finalContext = 'Assistente AI professionale per gestione clienti su WhatsApp, Instagram e Messenger.';
        }

        // =========================================
        // 6. CHIAMATA AI — HYBRIDAI (piano-based)
        // =========================================
        const aiResponse = await hybridAIResponse(
            message,
            finalContext,
            userPlan,
            false,           // isFounder — passa se vuoi upgrade AI per founder
            history,
            finalCloneSettings,
        );

        // =========================================
        // 7. WATERMARK PER PIANO FREE
        // =========================================
        let finalReply = aiResponse.reply;
        if (userPlan === 'curioso') {
            finalReply += '\n\n---\n⚡ Risposta generata da VirtualTwin (Piano Free)';
        }

        // =========================================
        // 8. INCREMENTA CONTATORE USO
        // =========================================
        await incrementMessageUsage(userId);

        // =========================================
        // 9. RISPOSTA
        // =========================================
        return NextResponse.json({
            success: true,
            reply: finalReply,
            insights: aiResponse.insights,
            shouldNotifyOwner: aiResponse.shouldNotifyOwner,
            remaining: limitCheck.remaining ? limitCheck.remaining - 1 : undefined,
            provider: userPlan, // per debug — remove in prod se vuoi
        });

    } catch (error: any) {
        console.error('[AI Chat] Errore:', error.message);

        return NextResponse.json(
            {
                error: 'Errore del server AI.',
                reply: "Mi scuso per il disagio. Il sistema sta avendo un problema temporaneo. Riprova tra qualche secondo! 🙏",
            },
            { status: 500 }
        );
    }
}
