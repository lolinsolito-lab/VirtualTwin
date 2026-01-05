import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatHistoryItem, ChatAIResponse } from "./types";

// =============================================
// HYBRID AI PROVIDER SYSTEM
// Provider based on user plan tier
// =============================================

type AIProvider = 'gemini-flash' | 'gemini-pro' | 'gpt-4' | 'gpt-4o' | 'claude-3';

interface PlanAIConfig {
    provider: AIProvider;
    modelName: string;
    maxTokens: number;
    temperature: number;
    priority: 'standard' | 'high' | 'priority';
}

// AI Provider configuration per plan tier
export const PLAN_AI_CONFIG: Record<string, PlanAIConfig> = {
    // FREE TIER - Gemini Flash (fastest, cheapest)
    curioso: {
        provider: 'gemini-flash',
        modelName: 'gemini-1.5-flash',
        maxTokens: 300,
        temperature: 0.7,
        priority: 'standard'
    },

    // STARTER - Gemini Flash with more tokens
    esploratore: {
        provider: 'gemini-flash',
        modelName: 'gemini-1.5-flash',
        maxTokens: 500,
        temperature: 0.7,
        priority: 'standard'
    },

    // PRO - Gemini Pro (better quality)
    pioniere: {
        provider: 'gemini-pro',
        modelName: 'gemini-1.5-pro',
        maxTokens: 800,
        temperature: 0.6,
        priority: 'high'
    },

    // PREMIUM - GPT-4 (best for complex conversations)
    conquistatore: {
        provider: 'gpt-4o',
        modelName: 'gpt-4o-mini',
        maxTokens: 1000,
        temperature: 0.6,
        priority: 'priority'
    },

    // AGENCY - GPT-4 Full (maximum quality)
    imperatore: {
        provider: 'gpt-4',
        modelName: 'gpt-4-turbo',
        maxTokens: 1500,
        temperature: 0.5,
        priority: 'priority'
    },

    // FOUNDER BONUS - All founders get upgraded AI
    founder: {
        provider: 'gemini-pro',
        modelName: 'gemini-1.5-pro',
        maxTokens: 1000,
        temperature: 0.6,
        priority: 'priority'
    }
};

// Initialize Gemini
const geminiClient = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

/**
 * Get AI configuration based on user's plan and founder status
 */
export function getAIConfig(planTier: string, isFounder: boolean = false): PlanAIConfig {
    // Founders get upgraded AI regardless of plan
    if (isFounder && PLAN_AI_CONFIG[planTier]) {
        const baseConfig = PLAN_AI_CONFIG[planTier];
        const founderConfig = PLAN_AI_CONFIG.founder;

        // Take the better of both configs
        return {
            ...baseConfig,
            maxTokens: Math.max(baseConfig.maxTokens, founderConfig.maxTokens),
            priority: 'priority'
        };
    }

    return PLAN_AI_CONFIG[planTier] || PLAN_AI_CONFIG.curioso;
}

/**
 * Call Gemini API
 */
async function callGemini(
    prompt: string,
    config: PlanAIConfig,
    history: ChatHistoryItem[] = []
): Promise<string> {
    const model = geminiClient.getGenerativeModel({
        model: config.modelName,
        generationConfig: {
            maxOutputTokens: config.maxTokens,
            temperature: config.temperature,
        }
    });

    const historyFormatted = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as const,
        parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history: historyFormatted });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
}

/**
 * Call OpenAI API (GPT-4)
 */
async function callOpenAI(
    prompt: string,
    config: PlanAIConfig,
    history: ChatHistoryItem[] = []
): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('OpenAI API Key not configured, falling back to Gemini');
        return callGemini(prompt, { ...config, modelName: 'gemini-1.5-pro' }, history);
    }

    const messages = [
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant' as const,
            content: msg.content
        })),
        { role: 'user' as const, content: prompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: config.modelName,
            messages,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
}

/**
 * Main hybrid AI function - routes to appropriate provider based on plan
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
    const config = getAIConfig(planTier, isFounder);

    // 1. Prepare dynamic personality context
    const toneContext = cloneSettings?.tone ? `TONO COMUNICATIVO: ${cloneSettings.tone}` : '';
    const personalityContext = cloneSettings?.customPersonality
        ? `TUA PERSONALITÀ: ${cloneSettings.customPersonality}`
        : 'Sei il "VirtualTwin", un\'intelligenza artificiale d\'élite progettata per gestire clienti.';

    const websiteContext = cloneSettings?.websiteUrl ? `SITO WEB AZIENDALE (Fonte di Verità): ${cloneSettings.websiteUrl}` : '';
    const kbContext = cloneSettings?.knowledgeBase && cloneSettings.knowledgeBase.length > 0
        ? `DOCUMENTAZIONE CARICATA: ${cloneSettings.knowledgeBase.map(f => f.name).join(', ')}`
        : '';

    const faqsContext = cloneSettings?.faqs && cloneSettings.faqs.length > 0
        ? `DEEP KNOWLEDGE (FAQ d'Addestramento):
${cloneSettings.faqs.map((f, i) => `${i + 1}. D: ${f.question}\n   R: ${f.answer}`).join('\n')}`
        : '';

    const systemPrompt = `
${personalityContext}
${toneContext}
${websiteContext}
${kbContext}

CONTESTO AZIENDALE:
${businessContext}

${faqsContext}

IL TUO COMPITO:
1. Rispondi in modo sofisticato, professionale ma accessibile (Lingua: ITALIANO)
2. Estrai informazioni chiave: nome, azienda, desideri, problemi, budget
3. Valuta lo stadio del lead (inquiry, qualification, negotiation, closed)
4. Mantieni le risposte BREVI (max 2-3 frasi)
5. Rispettate fedelmente la tua personalità e il tuo tono se forniti.

REGOLE:
- Sii utile ma non pushy
- Se l'utente mostra interesse concreto, proponi un passo concreto (call, demo)
- Se non sai qualcosa, ammettilo e offri aiuto

MESSAGGIO CLIENTE:
${userMessage}

RESTITUISCI UN OGGETTO JSON:
{
  "reply": "La tua risposta",
  "insights": {
    "fullName": "nome estratto o ...",
    "businessName": "azienda estratta o ...",
    "suggestedStage": "inquiry|qualification|negotiation|closed",
    "budgetRange": "se menzionato",
    "desires": "cosa vuole il cliente"
  },
  "shouldNotifyOwner": false
}
    `.trim();

    try {
        let responseText: string;

        // Route to appropriate provider
        if (config.provider.startsWith('gpt')) {
            responseText = await callOpenAI(systemPrompt, config, history);
        } else {
            responseText = await callGemini(systemPrompt, config, history);
        }

        // Parse JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as ChatAIResponse;
        }

        // Fallback if not JSON
        return {
            reply: responseText,
            insights: { suggestedStage: 'inquiry' },
            shouldNotifyOwner: false
        };

    } catch (error: any) {
        console.error(`Hybrid AI Error (${config.provider}):`, error);

        // Fallback response
        return {
            reply: "Mi scuso, sto avendo un piccolo problema. Potrebbe ripetere? 🙏",
            insights: {},
            shouldNotifyOwner: true // Notify owner of API issues
        };
    }
}

/**
 * Get provider name for display (in dashboard analytics)
 */
export function getProviderDisplayName(planTier: string, isFounder: boolean): string {
    const config = getAIConfig(planTier, isFounder);

    const names: Record<AIProvider, string> = {
        'gemini-flash': 'Gemini Flash ⚡',
        'gemini-pro': 'Gemini Pro 🚀',
        'gpt-4': 'GPT-4 Turbo 🧠',
        'gpt-4o': 'GPT-4o 💎',
        'claude-3': 'Claude 3 🎭'
    };

    return names[config.provider] || 'AI Standard';
}

export type { PlanAIConfig, AIProvider };
