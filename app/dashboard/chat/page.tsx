"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Brain, Database, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChatContent() {
    const searchParams = useSearchParams();
    const leadId = searchParams.get('leadId');
    const [liveLead, setLiveLead] = useState<any>(null);

    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Buongiorno! Sono il tuo VirtualTwin. Come posso aiutarti oggi?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [extractedData, setExtractedData] = useState({
        budget: 'Non identificato',
        desires: 'In analisi...',
        stage: 'Lead Discovery'
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Caricamento Dati Live se leadId è presente
    useEffect(() => {
        if (leadId) {
            async function loadLiveConversation() {
                setLoading(true);
                try {
                    const { data: lead } = await supabase
                        .from('leads')
                        .select('*, conversations(*)')
                        .eq('id', leadId)
                        .single();

                    if (lead) {
                        setLiveLead(lead);
                        setExtractedData({
                            budget: lead.budget_range || 'In analisi...',
                            desires: lead.desires || 'Estrapolazione in corso...',
                            stage: lead.pipeline_stages?.name || 'Inquiry'
                        });

                        const conv = lead.conversations?.[0];
                        if (conv) {
                            const { data: history } = await supabase
                                .from('messages')
                                .select('*')
                                .eq('conversation_id', conv.id)
                                .order('created_at', { ascending: true });

                            if (history && history.length > 0) {
                                setMessages(history.map((m: any) => ({
                                    role: m.direction === 'inbound' ? 'user' : 'assistant',
                                    content: m.content
                                })));
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error loading live conversation:", error);
                } finally {
                    setLoading(false);
                }
            }
            loadLiveConversation();
        }
    }, [leadId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            if (liveLead) {
                // MODALITÀ LIVE
                const response = await fetch('/api/whatsapp/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: liveLead.phone,
                        message: userMessage,
                        tenantId: liveLead.tenant_id
                    })
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error);
                setMessages(prev => [...prev, { role: 'assistant', content: "(Inviato via WhatsApp)" }]);
            } else {
                // MODALITÀ SANDBOX
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        history: messages,
                        userInput: userMessage,
                        businessContext: "VirtualTwin Sovereign AI - Automazione WhatsApp d'Elite"
                    })
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error);

                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

                if (data.insights) {
                    setExtractedData(prev => ({
                        ...prev,
                        budget: data.insights.budgetRange || prev.budget,
                        desires: data.insights.desires || prev.desires,
                        stage: data.insights.suggestedStage || prev.stage
                    }));
                }
            }
        } catch (err: any) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Errore durante l'operazione. Riprovare." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 lg:p-16 bg-champagne">
            <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="h-[1px] w-12 bg-gold/50"></span>
                        <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">AI Sandbox</span>
                    </div>
                    <h1 className="font-serif text-5xl lg:text-6xl italic text-charcoal leading-none">Twin <span className="gold-text-gradient">Pulse.</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="silk-card px-5 py-3 rounded-full border border-gold/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-widest text-gold font-black">Neural Link: Active</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)]">
                {/* Chat Interface */}
                <div className="flex-1 silk-card rounded-[2.5rem] border border-charcoal/5 flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className="px-8 py-5 border-b border-charcoal/5 flex items-center gap-4">
                        <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-charcoal font-medium">VirtualTwin AI</p>
                            <p className="text-green-500 text-[10px] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Online - Risponde in &lt;2s
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-champagne/50 to-white/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] flex gap-4 ${m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'assistant' ? 'gold-gradient text-white' : 'bg-charcoal text-white'}`}>
                                        {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className={`px-6 py-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-white border border-charcoal/10 text-charcoal rounded-tl-md' : 'gold-gradient text-white rounded-tr-md shadow-lg'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-4 items-center">
                                    <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center"><Brain className="w-4 h-4 text-white animate-pulse" /></div>
                                    <div className="px-6 py-4 bg-white border border-charcoal/10 rounded-2xl rounded-tl-md">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gold rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.1s]"></span>
                                            <span className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-6 border-t border-charcoal/5 bg-white/50">
                        <form onSubmit={handleSend} className="flex gap-4">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Scrivi un messaggio..."
                                className="flex-1 bg-champagne border border-charcoal/10 rounded-xl px-6 py-4 outline-none focus:border-gold transition-colors text-charcoal placeholder:text-charcoal/30"
                            />
                            <button type="submit" disabled={loading} className="gold-gradient px-6 py-4 rounded-xl text-white hover:scale-105 transition-transform shadow-lg disabled:opacity-50">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar - AI Insights */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* AI Panel */}
                    <div className="silk-card p-8 rounded-[2rem] border border-charcoal/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <p className="text-charcoal font-medium text-sm">AI Insights</p>
                                <p className="text-charcoal/40 text-[10px]">Analisi in tempo reale</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="p-4 bg-champagne rounded-xl">
                                <p className="text-[9px] uppercase tracking-wider text-charcoal/40 font-bold mb-2">Budget Rilevato</p>
                                <p className="text-charcoal font-medium">{extractedData.budget}</p>
                            </div>
                            <div className="p-4 bg-champagne rounded-xl">
                                <p className="text-[9px] uppercase tracking-wider text-charcoal/40 font-bold mb-2">Desideri / Obiettivi</p>
                                <p className="text-charcoal font-medium text-sm">{extractedData.desires}</p>
                            </div>
                            <div className="p-4 bg-gold/10 rounded-xl border border-gold/20">
                                <p className="text-[9px] uppercase tracking-wider text-gold font-bold mb-2">Stage Suggerito</p>
                                <p className="text-charcoal font-bold">{extractedData.stage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mode Indicator */}
                    <div className="silk-card p-6 rounded-2xl border border-charcoal/5 text-center">
                        <p className="text-[9px] uppercase tracking-wider text-charcoal/40 font-bold mb-2">Modalità</p>
                        <p className="text-charcoal font-bold text-lg">{liveLead ? '🔴 LIVE' : '🟢 SANDBOX'}</p>
                        <p className="text-charcoal/40 text-xs mt-2">
                            {liveLead ? `Lead: ${liveLead.name}` : 'Simulazione AI'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-champagne">
                <div className="text-center">
                    <div className="w-16 h-16 gold-gradient rounded-full animate-pulse mx-auto mb-4"></div>
                    <p className="text-gold text-[10px] uppercase tracking-[0.6em] font-black">Caricamento...</p>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
