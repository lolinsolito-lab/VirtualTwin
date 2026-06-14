import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatHistoryItem, ChatAIResponse } from "./types";

// =============================================
// HYBRID AI PROVIDER SYSTEM — v2.0
// Gemini 2.5 Flash/Pro + Claude Haiku/Sonnet
// Zero dipendenza OpenAI = massimo risparmio
//
// PREZZI (giugno 2026, per 1M token):
//   Gemini 2.5 Flash:  $0.30 input / $2.50 output
//   Gemini 2.5 Pro:    ~$1.25 input / $5.00 output (stima)
//   Claude Haiku 4.5:  $1.00 input / $5.00 output
//   Claude Sonnet 4.6: $3.00 input / $15.00 output
// =============================================

export type AIProvider =
    | 'gemini-2.5-flash'
    | 'gemini-2.5-pro'
    | 'claude-haiku-4-5'
    | 'claude-sonnet-4-6';

interface PlanAIConfig {
    provider: AIProvider;
    modelName: string;
    maxTokens: number;
    temperature: number;
    priority: 'standard' | 'high' | 'priority';
    costPer1KTokensEur: number; // costo stimato output in €
}

// =============================================
// CONFIGURAZIONE AI PER PIANO
// Allineata con lib/pricing.ts PLAN_LIMITS
// =============================================
export const PLAN_AI_CONFIG: Record<string, PlanAIConfig> = {
    // FREE TRIAL — più economico possibile
    curioso: {
        provider: 'gemini-2.5-flash',
        modelName: 'gemini-2.5-flash',
        maxTokens: 300,
        temperature: 0.7,
        priority: 'standard',
        costPer1KTokensEur: 0.0023,  // ~$0.0025 → ~€0.0023
    },

    // ENTRY LEVEL — ancora Flash, buona qualità
    solopreneur: {
        provider: 'gemini-2.5-flash',
        modelName: 'gemini-2.5-flash',
        maxTokens: 500,
        temperature: 0.7,
        priority: 'standard',
        costPer1KTokensEur: 0.0023,
    },

    // MID TIER — Gemini Pro per qualità superiore
    entrepreneur: {
        provider: 'gemini-2.5-pro',
        modelName: 'gemini-2.5-pro',
        maxTokens: 800,
        temperature: 0.65,
        priority: 'high',
        costPer1KTokensEur: 0.0046,  // ~$0.005/1K output
    },

    // PREMIUM — Claude Haiku 4.5 (veloce, premium feel)
    conquistatore: {
        provider: 'claude-haiku-4-5',
        modelName: 'claude-haiku-4-5-20251001',
        maxTokens: 1000,
        temperature: 0.6,
        priority: 'priority',
        costPer1KTokensEur: 0.0046,  // $5/M output → €0.0046/1K
    },

    // ENTERPRISE — Claude Sonnet 4.6 (miglior qualità)
    imperatore: {
        provider: 'claude-sonnet-4-6',
        modelName: 'claude-sonnet-4-6-20250514',
        maxTokens: 2000,
        temperature: 0.55,
        priority: 'priority',
        costPer1KTokensEur: 0.0138,  // $15/M output → €0.0138/1K
    },

    // PARTNERSHIP — Sonnet top tier
    sovereignty: {
        provider: 'claude-sonnet-4-6',
        modelName: 'claude-sonnet-4-6-20250514',
        maxTokens: 4000,
        temperature: 0.5,
        priority: 'priority',
        costPer1KTokensEur: 0.0138,
    },
};

// Initialize Gemini (server-side only — key NON è NEXT_PUBLIC)
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Get AI configuration based on user's plan
 */
export function getAIConfig(planTier: string): PlanAIConfig {
    return PLAN_AI_CONFIG[planTier?.toLowerCase()] || PLAN_AI_CONFIG.curioso;
}

/**
 * Call Gemini 2.5 Flash or Pro
 */
async function callGemini(
    systemPrompt: string,
    config: PlanAIConfig,
    history: ChatHistoryItem[] = []
): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY non configurata (richiede variabile server-side)');
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
        model: config.modelName,
        generationConfig: {
            maxOutputTokens: config.maxTokens,
            temperature: config.temperature,
        },
        systemInstruction: systemPrompt,
    });

    const historyFormatted = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as const,
        parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history: historyFormatted });
    const lastUserMsg = history.length > 0 ? history[history.length - 1]?.content : '';
    const result = await chat.sendMessage(lastUserMsg || '');
    return result.response.text();
}

/**
 * Call Claude Haiku 4.5 or Sonnet 4.6
 */
async function callClaude(
    systemPrompt: string,
    userMessage: string,
    config: PlanAIConfig,
    history: ChatHistoryItem[] = []
): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.warn('[HybridAI] ANTHROPIC_API_KEY non configurata. Fallback a Gemini Pro.');
        return callGemini(systemPrompt, PLAN_AI_CONFIG.entrepreneur, history);
    }

    const messages = [
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant' as const,
            content: msg.content,
        })),
        { role: 'user' as const, content: userMessage },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model: config.modelName,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            system: systemPrompt,
            messages,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Claude API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
}

/**
 * Costruisce il system prompt per il clone AI
 */
function buildSystemPrompt(
    businessContext: string,
    cloneSettings?: {
        tone?: string;
        customPersonality?: string;
        websiteUrl?: string;
        knowledgeBase?: { name: string }[];
        faqs?: { question: string; answer: string }[];
    }
): string {
    const personality = cloneSettings?.customPersonality
        || 'Sei un assistente AI professionale che rappresenta questa azienda.';
    const tone = cloneSettings?.tone ? `\nTONO: ${cloneSettings.tone}` : '';
    const website = cloneSettings?.websiteUrl ? `\nSITO: ${cloneSettings.websiteUrl}` : '';
    const kb = cloneSettings?.knowledgeBase?.length
        ? `\nDOCUMENTI: ${cloneSettings.knowledgeBase.map(f => f.name).join(', ')}`
        : '';
    const faqs = cloneSettings?.faqs?.length
        ? `\nFAQ:\n${cloneSettings.faqs.map((f, i) => `${i + 1}. D: ${f.question}\n   R: ${f.answer}`).join('\n')}`
        : '';

    return `${personality}${tone}${website}${kb}

CONTESTO AZIENDALE:
${businessContext}
${faqs}

COMPITO:
1. Rispondi in italiano, in modo naturale e professionale
2. Estrai info chiave del lead: nome, azienda, budget, necessità, stadio pipeline
3. Mantieni risposte BREVI (max 2-3 frasi)
4. Se il lead mostra interesse concreto, proponi un passo successivo (call/demo)
5. Non inventare informazioni che non conosci

RISPOSTA (JSON):
{
  "reply": "tua risposta al cliente",
  "insights": {
    "fullName": "nome estratto o ...",
    "businessName": "azienda o ...",
    "suggestedStage": "inquiry|qualification|negotiation|closed",
    "budgetRange": "se menzionato",
    "desires": "cosa vuole"
  },
  "shouldNotifyOwner": false
}`.trim();
}

/**
 * Main hybrid AI function — Gemini 2.5 Flash/Pro + Claude Haiku/Sonnet
 * Sceglie automaticamente il provider in base al piano
 */
export async function hybridAIResponse(
    userMessage: string,
    businessContext: string,
    planTier: string,
    isFounder: boolean = false,
    history: ChatHistoryItem[] = [],
    cloneSettings?: {
        tone?: string;
        customPersonality?: string;
        websiteUrl?: string;
        knowledgeBase?: { name: string }[];
        faqs?: { question: string; answer: string }[];
    }
): Promise<ChatAIResponse> {
    const config = getAIConfig(planTier);
    const systemPrompt = buildSystemPrompt(businessContext, cloneSettings);

    try {
        let responseText: string;

        if (config.provider.startsWith('claude')) {
            responseText = await callClaude(systemPrompt, userMessage, config, history);
        } else {
            // Per Gemini, includiamo il userMessage nella history
            const fullHistory: ChatHistoryItem[] = [
                ...history,
                { role: 'user', content: userMessage }
            ];
            responseText = await callGemini(systemPrompt, config, fullHistory);
        }

        // Parse JSON dalla risposta
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as ChatAIResponse;
        }

        // Fallback se non è JSON valido
        return {
            reply: responseText,
            insights: { suggestedStage: 'inquiry' },
            shouldNotifyOwner: false,
        };

    } catch (error: any) {
        console.error(`[HybridAI] Errore provider ${config.provider}:`, error.message);

        // Fallback a Gemini Flash se il provider premium fallisce
        if (config.provider !== 'gemini-2.5-flash') {
            console.warn('[HybridAI] Fallback a Gemini 2.5 Flash...');
            try {
                const fallbackConfig = PLAN_AI_CONFIG.curioso;
                const fullHistory: ChatHistoryItem[] = [
                    ...history,
                    { role: 'user', content: userMessage }
                ];
                const fallbackText = await callGemini(systemPrompt, fallbackConfig, fullHistory);
                const jsonMatch = fallbackText.match(/\{[\s\S]*\}/);
                if (jsonMatch) return JSON.parse(jsonMatch[0]) as ChatAIResponse;
            } catch (fallbackErr) {
                console.error('[HybridAI] Anche il fallback ha fallito:', fallbackErr);
            }
        }

        return {
            reply: "Mi scuso per il disagio. Il sistema sta avendo un problema temporaneo. Riprova tra qualche secondo! 🙏",
            insights: {},
            shouldNotifyOwner: true,
        };
    }
}

/**
 * Nome display del provider per la dashboard analytics
 */
export function getProviderDisplayName(planTier: string): string {
    const config = getAIConfig(planTier);
    const names: Record<AIProvider, string> = {
        'gemini-2.5-flash': 'Gemini 2.5 Flash ⚡',
        'gemini-2.5-pro':   'Gemini 2.5 Pro 🚀',
        'claude-haiku-4-5': 'Claude Haiku 4.5 💡',
        'claude-sonnet-4-6': 'Claude Sonnet 4.6 🧠',
    };
    return names[config.provider] || 'AI Standard';
}

/**
 * Calcola il costo stimato di un messaggio in €
 */
export function estimateMessageCostEur(planTier: string, outputTokens: number = 200): number {
    const config = getAIConfig(planTier);
    return (outputTokens / 1000) * config.costPer1KTokensEur;
}

export type { PlanAIConfig };
