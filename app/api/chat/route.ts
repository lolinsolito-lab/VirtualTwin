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
            userId,
            conversationId: existingConversationId,
            cloneId: providedCloneId
        } = await req.json();

        if (!userInput) {
            return NextResponse.json({ error: "Messaggio mancante" }, { status: 400 });
        }

        // 1. Resolve Clone and User
        let activeUserId = userId;
        let activeCloneId = providedCloneId;

        // If no cloneId provided, try to find the first active clone for this user
        if (activeUserId && !activeCloneId) {
            const { data: clone } = await supabase
                .from('clones')
                .select('id')
                .eq('user_id', activeUserId)
                .eq('is_active', true)
                .limit(1)
                .single();
            if (clone) activeCloneId = clone.id;
        }

        // 2. Handle Conversation Persistence
        let conversationId = existingConversationId;
        if (activeUserId && activeCloneId && !conversationId) {
            // Create a new sandbox conversation if it doesn't exist
            const { data: newConv, error: convError } = await supabase
                .from('conversations')
                .insert({
                    user_id: activeUserId,
                    clone_id: activeCloneId,
                    contact_name: 'Prospect (Sandbox)',
                    contact_platform_id: `sandbox_${Date.now()}`,
                    status: 'active'
                })
                .select()
                .single();

            if (!convError && newConv) {
                conversationId = newConv.id;
            }
        }

        // 3. Save User Message
        if (activeUserId && activeCloneId && conversationId) {
            await supabase.from('messages').insert({
                conversation_id: conversationId,
                user_id: activeUserId,
                clone_id: activeCloneId,
                content: userInput,
                direction: 'incoming',
                sender_type: 'contact',
                ai_generated: false
            });
        }

        // 4. Generate AI Response
        const context = businessContext || `VirtualTwin AI Strategy Consultant. Goal: Qualify lead for high-ticket AI automation.`;

        // Fetch user's plan if available for Hybrid AI
        let aiResponse;
        let providerName = 'Gemini Flash ⚡';
        let planTier = 'curioso';
        let isFounder = false;

        if (activeUserId) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('plan_tier, is_founder, messages_used_this_month, messages_limit')
                .eq('id', activeUserId)
                .single();

            // QUOTA CHECK: Deny if limit reached
            if (profile && profile.messages_used_this_month >= (profile.messages_limit || 100)) {
                return NextResponse.json({
                    reply: "Hai raggiunto il limite di messaggi del tuo piano. 🛑 Effettua l'upgrade per continuare a parlare con il tuo clone!",
                    insights: { suggestedStage: 'closed' },
                    quotaExceeded: true
                });
            }

            // Fetch Clone Specific Personality
            const { data: clone } = await supabase
                .from('clones')
                .select('personality, metadata')
                .eq('user_id', activeUserId)
                .eq('is_active', true)
                .limit(1)
                .single();

            if (profile) {
                planTier = profile.plan_tier || 'curioso';
                isFounder = profile.is_founder || false;

                const cloneSettings = clone ? {
                    tone: clone.personality,
                    customPersonality: clone.metadata?.customPersonality,
                    websiteUrl: clone.metadata?.websiteUrl,
                    knowledgeBase: clone.metadata?.knowledgeBase,
                    faqs: clone.metadata?.faqs
                } : undefined;

                aiResponse = await hybridAIResponse(
                    userInput,
                    context,
                    planTier,
                    isFounder,
                    history as ChatHistoryItem[],
                    cloneSettings
                );
                providerName = getProviderDisplayName(planTier, isFounder);
            }
        }

        // 4.5 Fallback for non-authenticated or profile-less chat (e.g., public landing)
        if (!aiResponse) {
            aiResponse = await processConversation(history as ChatHistoryItem[], userInput, context);
        }

        // 5. Save AI Message
        if (activeUserId && activeCloneId && conversationId) {
            await supabase.from('messages').insert({
                conversation_id: conversationId,
                user_id: activeUserId,
                clone_id: activeCloneId,
                content: aiResponse.reply,
                direction: 'outgoing',
                sender_type: 'ai',
                ai_generated: true,
                ai_confidence: 0.95
            });

            // Update conversation stats and insights
            const insights = aiResponse.insights || {};
            const updatePayload: any = {
                total_messages: (history?.length || 0) + 2,
                last_message_at: new Date().toISOString(),
            };

            // Intelligent updates based on AI insights
            if (insights.fullName && insights.fullName !== "...") {
                updatePayload.contact_name = insights.fullName;
            }
            if (insights.suggestedStage) {
                // Map AI stages to DB statuses
                const stageMap: Record<string, string> = {
                    'inquiry': 'active',
                    'qualification': 'qualified',
                    'negotiation': 'converted',
                    'closed': 'closed'
                };
                updatePayload.status = stageMap[insights.suggestedStage.toLowerCase()] || 'active';
            }
            if (insights.estimatedValue) {
                updatePayload.conversion_value = insights.estimatedValue;
            }
            if (insights.budgetRange || insights.desires) {
                updatePayload.notes = `Budget: ${insights.budgetRange || "N/A"}\nDesires: ${insights.desires || "N/A"}`;
            }

            await supabase.from('conversations').update(updatePayload).eq('id', conversationId);

            // 6. Increment Usage Counters (Imperial Enforcement)
            await supabase.rpc('increment_message_usage', {
                p_user_id: activeUserId,
                p_clone_id: activeCloneId
            });

            // 7. UPSELL LOGIC: Check if > 70% of quota used
            const { data: profile } = await supabase
                .from('profiles')
                .select('messages_used_this_month, messages_limit, plan_tier')
                .eq('id', activeUserId)
                .single();

            if (profile && profile.messages_limit && profile.plan_tier !== 'imperatore') {
                const usagePercent = (profile.messages_used_this_month / profile.messages_limit) * 100;
                if (usagePercent >= 70) {
                    (aiResponse as any).upsellHint = true;
                }
            }
        }

        return NextResponse.json({
            ...aiResponse,
            provider: providerName,
            planTier,
            isFounder,
            conversationId
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            {
                error: "Errore nell'elaborazione del pensiero AI",
                reply: "Mi scuso, il mio nucleo neurale sta elaborando troppo. Riprova tra un momento! 🙏"
            },
            { status: 500 }
        );
    }
}
