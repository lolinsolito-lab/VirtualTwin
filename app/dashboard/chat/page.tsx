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
    const [userId, setUserId] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);

    // Get current user
    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        }
        getUser();
    }, []);

    // 1. Caricamento Dati Live se leadId è presente
    useEffect(() => {
        if (leadId) {
            async function loadLiveConversation() {
                setLoading(true);
                try {
                    const { data: lead } = await supabase
                        .from('conversations') // The schema uses conversations as the primary lead entity
                        .select('*')
                        .eq('id', leadId)
                        .single();

                    if (lead) {
                        setLiveLead(lead);
                        setConversationId(lead.id);
                        setExtractedData({
                            budget: lead.notes || 'In analisi...', // Mapping notes to desires for now
                            desires: lead.contact_name || 'Estrapolazione in corso...',
                            stage: lead.status || 'Inquiry'
                        });

                        const { data: history } = await supabase
                            .from('messages')
                            .select('*')
                            .eq('conversation_id', lead.id)
                            .order('created_at', { ascending: true });

                        if (history && history.length > 0) {
                            setMessages(history.map((m: any) => ({
                                role: m.direction === 'incoming' ? 'user' : 'assistant',
                                content: m.content
                            })));
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
                // MODALITÀ LIVE (WhatsApp)
                const response = await fetch('/api/whatsapp/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: liveLead.contact_phone,
                        message: userMessage,
                        userId: userId,
                        conversationId: conversationId
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
                        history: messages.slice(-10), // Send last 10 messages for context
                        userInput: userMessage,
                        userId: userId,
                        conversationId: conversationId,
                        businessContext: "VirtualTwin Sovereign AI - Automazione WhatsApp d'Elite"
                    })
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error);

                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

                if (data.conversationId) {
                    setConversationId(data.conversationId);
                }

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
            <header className="mb-12 relative">
                {/* Decorative Ambient Light */}
                <div className="absolute -top-20 -left-10 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="h-[1px] w-12 bg-gold/50"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.8em] font-black">Sovereign Intelligence</span>
                        </div>
                        <h1 className="font-serif text-5xl lg:text-7xl italic text-charcoal leading-none tracking-tight">Twin <span className="gold-text-gradient">Pulse.</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/40 backdrop-blur-md px-6 py-3 rounded-full border border-gold/20 flex items-center gap-3 shadow-luxury-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] uppercase tracking-widest text-gold font-black">Neural Link: Established</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-220px)]">
                {/* Chat Interface */}
                <div className="flex-1 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 flex flex-col overflow-hidden shadow-luxury-sm">
                    {/* Chat Header */}
                    <div className="px-10 py-6 border-b border-charcoal/5 flex items-center justify-between bg-white/40">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-charcoal rounded-2xl flex items-center justify-center shadow-luxury">
                                <Bot className="w-7 h-7 text-gold" />
                            </div>
                            <div>
                                <p className="text-charcoal font-serif italic text-xl">Sovereign Assistant</p>
                                <p className="text-green-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Latenza &lt;0.8s
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gold/30 hover:text-gold transition-colors cursor-help">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-gradient-to-b from-transparent to-charcoal/[0.02]">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[75%] flex gap-5 ${m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${m.role === 'assistant' ? 'bg-charcoal text-gold' : 'gold-gradient text-white'}`}>
                                        {m.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div className={`px-8 py-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${m.role === 'assistant'
                                        ? 'bg-white border border-charcoal/5 text-charcoal rounded-tl-lg'
                                        : 'bg-charcoal text-white rounded-tr-lg border border-gold/10'}`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-5 items-center">
                                    <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-gold shadow-lg"><Brain className="w-5 h-5 animate-pulse" /></div>
                                    <div className="px-8 py-5 bg-white border border-charcoal/5 rounded-[2rem] rounded-tl-lg">
                                        <div className="flex gap-2">
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
                    <div className="p-8 border-t border-charcoal/5 bg-white/40">
                        <form onSubmit={handleSend} className="flex gap-4">
                            <div className="flex-1 relative group">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Invia un comando o una domanda..."
                                    className="w-full bg-white/60 border border-charcoal/10 rounded-2xl px-8 py-5 outline-none focus:border-gold transition-all duration-500 text-charcoal placeholder:text-charcoal/30 shadow-inner group-hover:border-gold/30"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-charcoal/20">
                                    <Database className="w-4 h-4" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Active Context</span>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="bg-charcoal text-gold border border-gold/20 px-8 py-5 rounded-2xl hover:bg-gold hover:text-white transition-all duration-700 shadow-luxury disabled:opacity-50">
                                <Send className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar - AI Insights */}
                <div className="w-full lg:w-96 space-y-8">
                    {/* AI Panel */}
                    <div className="bg-charcoal p-10 rounded-[3rem] border border-gold/20 shadow-luxury relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-colors duration-700" />

                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold/30 transition-colors">
                                <Sparkles className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <p className="text-white font-serif italic text-lg">Neural Insights</p>
                                <p className="text-white/30 text-[9px] uppercase tracking-widest font-black">Analisi Comportamentale</p>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-gold/20 transition-colors">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-gold font-black mb-3">Budget Rilevato</p>
                                <p className="text-white font-serif italic text-lg">{extractedData.budget}</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-gold/20 transition-colors">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-gold font-black mb-3">Desideri & Obiettivi</p>
                                <p className="text-white/70 font-sans text-xs leading-relaxed">{extractedData.desires}</p>
                            </div>
                            <div className="p-6 bg-gold/10 rounded-2xl border border-gold/20">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black mb-3 italic">Pipeline Projection</p>
                                <p className="text-white font-black text-xs uppercase tracking-widest">{extractedData.stage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Mode Indicator */}
                    <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 text-center shadow-luxury-sm">
                        <p className="text-[9px] uppercase tracking-[0.4em] text-charcoal/40 font-black mb-3">Status Operativo</p>
                        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black tracking-widest ${liveLead ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {liveLead ? '🔴 UNITÀ LIVE' : '🟢 SANDBOX AMBIENT'}
                        </div>
                        <p className="text-charcoal/30 text-[10px] italic font-serif mt-4">
                            {liveLead ? `Sincronizzato con: ${liveLead.contact_name}` : 'Neural Simulation Mode'}
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
