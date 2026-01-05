import { NextRequest, NextResponse } from 'next/server';
import { processConversation } from '@/lib/gemini';
import { ChatHistoryItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            message,
            history = [],
            businessContext,
            cloneId
        } = body as {
            message: string;
            history: ChatHistoryItem[];
            businessContext?: string;
            cloneId?: string;
        };

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Detect user tier for watermark
        let userTier = 'curioso';
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_tier')
                .eq('id', authUser.id)
                .single();
            if (profile) userTier = profile.subscription_tier || 'curioso';
        }

        // Default business context for demo
        const context = businessContext || `
VirtualTwin Sovereign AI - Cloni Digitali per Vendite Automatiche

PRODOTTO: VirtualTwin è una piattaforma che crea cloni AI per rispondere automaticamente ai clienti su WhatsApp, Instagram e Messenger.

BENEFICI:
- Risposta 24/7 (anche alle 23:47 di domenica)
- +340% conversioni rispetto a risposta manuale
- Setup in 5 minuti

PRICING (Mensile):
- Curioso (€0): 100 msg, watermark, 14gg trial
- Aspirante (€49): 500 msg, academy, community
- Esploratore (€297): 1K msg, analytics, support <48h
- Pioniere (€697): 5K msg, 3 canali, A/B Test
- Conquistatore (€1197): 20K msg, priority support
- Imperatore (€1997): 50K msg, White-label

TARGET: Imprenditori digitali, coach, consulenti, e-commerce, agenzie
`.trim();

        // Call Gemini AI
        const aiResponse = await processConversation(
            history,
            message,
            context
        );

        let finalReply = aiResponse.reply;

        // Apply watermark for Curioso tier
        if (userTier === 'curioso') {
            finalReply += "\n\n---\n⚡ Risposta generata da VirtualTwin (v. Free)";
        }

        return NextResponse.json({
            success: true,
            reply: finalReply,
            insights: aiResponse.insights,
            shouldNotifyOwner: aiResponse.shouldNotifyOwner,
            action_type: aiResponse.action_type,
            updated_fields: aiResponse.updated_fields
        });

    } catch (error: any) {
        console.error('AI Chat API Error:', error);

        return NextResponse.json(
            {
                error: 'AI processing failed',
                message: error.message,
                reply: "Mi scuso per l'inconveniente. Il sistema sta avendo un problema temporaneo. Riprova tra qualche secondo! 🙏"
            },
            { status: 500 }
        );
    }
}
