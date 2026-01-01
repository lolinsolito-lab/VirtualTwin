import { NextRequest, NextResponse } from 'next/server';
import { processConversation } from '@/lib/gemini';
import { ChatHistoryItem } from '@/lib/types';

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

        // Default business context for demo
        const context = businessContext || `
VirtualTwin Sovereign AI - Cloni Digitali per Vendite Automatiche

PRODOTTO: VirtualTwin è una piattaforma che crea cloni AI per rispondere automaticamente ai clienti su WhatsApp, Instagram e Messenger.

BENEFICI:
- Risposta 24/7 (anche alle 23:47 di domenica)
- +340% conversioni rispetto a risposta manuale
- Setup in 5 minuti
- Zero competenze tecniche richieste

PRICING:
- Free (€0): 1 clone, 100 msg/mese, watermark
- Esploratore (€39/mese): 1K msg, analytics
- Pioniere (€97/mese): 5K msg, 3 canali, PIÙ SCELTO
- Conquistatore (€197/mese): 20K msg, priority support
- Imperatore (€397/mese): White-label, illimitato

TARGET: Imprenditori digitali, coach, consulenti, e-commerce, agenzie

OBIETTIVO: Qualificare il lead, capire le sue esigenze, e guidarlo verso il piano giusto o una demo.
        `.trim();

        // Call Gemini AI
        const aiResponse = await processConversation(
            history,
            message,
            context
        );

        return NextResponse.json({
            success: true,
            reply: aiResponse.reply,
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
