import { NextRequest, NextResponse } from 'next/server';
import { hybridAIResponse, getProviderDisplayName } from '@/lib/hybridAI';
import { processConversation } from '@/lib/gemini';
import { ChatHistoryItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const {
            history,
            userInput,
            businessContext,
            userId // Optional: if provided, uses hybrid AI based on plan
        } = await req.json();

        if (!userInput) {
            return NextResponse.json({ error: "Messaggio mancante" }, { status: 400 });
        }

        // Default business context
        const context = businessContext || `
VirtualTwin Sovereign AI - Cloni Digitali per Vendite Automatiche 24/7

PRODOTTO: Piattaforma che crea cloni AI per rispondere automaticamente ai clienti su WhatsApp, Instagram e Messenger.

BENEFICI:
- Risposta 24/7 (anche alle 23:47)
- +340% conversion rate
- Setup in 5 minuti
- Zero competenze tecniche

PRICING:
- Curioso €0: 100 msg/mese
- Esploratore €39: 1K msg
- Pioniere €97: 5K msg (PIÙ SCELTO)
- Conquistatore €197: 20K msg
- Imperatore €397: Illimitato

OBIETTIVO: Qualificare il lead e guidarlo verso la demo o il piano giusto.
        `.trim();

        // If userId provided, use hybrid AI with plan-based routing
        if (userId) {
            try {
                // Fetch user's plan from Supabase
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('plan_tier, is_founder')
                    .eq('id', userId)
                    .single();

                if (!error && profile) {
                    const aiResponse = await hybridAIResponse(
                        userInput,
                        context,
                        profile.plan_tier || 'curioso',
                        profile.is_founder || false,
                        history as ChatHistoryItem[]
                    );

                    const providerName = getProviderDisplayName(
                        profile.plan_tier || 'curioso',
                        profile.is_founder || false
                    );

                    return NextResponse.json({
                        ...aiResponse,
                        provider: providerName,
                        planTier: profile.plan_tier,
                        isFounder: profile.is_founder
                    });
                }
            } catch (err) {
                console.warn('Could not fetch user plan, using default AI:', err);
            }
        }

        // Fallback to standard Gemini processing
        const aiResponse = await processConversation(
            history as ChatHistoryItem[],
            userInput,
            context
        );

        return NextResponse.json({
            ...aiResponse,
            provider: 'Gemini Flash ⚡',
            planTier: 'curioso',
            isFounder: false
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            {
                error: "Errore nell'elaborazione del pensiero AI",
                reply: "Mi scuso, sto avendo un piccolo problema. Riprova tra un momento! 🙏"
            },
            { status: 500 }
        );
    }
}
