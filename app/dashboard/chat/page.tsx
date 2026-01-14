"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
    Send, Bot, User, Brain, Database, ShieldCheck, Sparkles,
    Search, MessageSquare, Instagram, MessageCircle,
    Filter, Clock, CheckCheck, Loader2, ChevronRight,
    Zap, Hash, Phone, Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeLeadId = searchParams.get('leadId');

    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingConvs, setLoadingConvs] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mobile View State: 'list' | 'chat' | 'insights'
    const [view, setView] = useState<'list' | 'chat' | 'insights'>('list');

    // AI extracted insights
    const [insights, setInsights] = useState({
        budget: 'In analisi...',
        desires: 'Estrapolazione in corso...',
        stage: 'Lead Discovery'
    });

    // 1. Get current user
    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                loadConversations(user.id);
            }
        }
        getUser();
    }, []);

    // 2. Load all conversations for the sidebar
    async function loadConversations(uid: string) {
        setLoadingConvs(true);
        try {
            const { data } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', uid)
                .order('last_message_at', { ascending: false });

            if (data) setConversations(data);
        } catch (error) {
            console.error("Error loading conversations:", error);
        } finally {
            setLoadingConvs(false);
        }
    }

    // 3. Load active conversation and messages when activeLeadId changes
    useEffect(() => {
        if (activeLeadId && userId) {
            loadActiveConversation(activeLeadId);
            // On mobile, switch to chat view when a lead is selected
            setView('chat');
        } else {
            setActiveConversation(null);
            setMessages([
                { role: 'assistant', content: 'Buongiorno! Seleziona una conversazione per iniziare o scrivi un messaggio in modalità Sandbox.' }
            ]);
            // On mobile, ensure we are in list view if no lead selected
            setView('list');
        }
    }, [activeLeadId, userId]);

    async function loadActiveConversation(id: string) {
        setLoading(true);
        try {
            const { data: conv } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', id)
                .single();

            if (conv) {
                setActiveConversation(conv);
                setInsights({
                    budget: conv.notes?.match(/Budget: (.*)/)?.[1] || 'In analisi...',
                    desires: conv.notes?.match(/Desires: (.*)/)?.[1] || 'Estrapolazione in corso...',
                    stage: conv.status || 'Inquiry'
                });

                const { data: history } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', id)
                    .order('created_at', { ascending: true });

                if (history) {
                    setMessages(history.map(m => ({
                        role: m.sender_type === 'contact' ? 'user' : 'assistant',
                        content: m.content,
                        timestamp: m.created_at,
                        is_whatsapp: conv.channel_type === 'whatsapp'
                    })));
                }
            }
        } catch (error) {
            console.error("Error loading active conversation:", error);
        } finally {
            setLoading(false);
        }
    }

    // 4. Real-time Message Updates
    useEffect(() => {
        if (!activeLeadId) return;

        const channel = supabase
            .channel(`conv_${activeLeadId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeLeadId}`
                },
                (payload) => {
                    const newMessage = payload.new as any;
                    setMessages(prev => {
                        // Avoid duplicates if already added by handleSend
                        if (prev.some(m => m.id === newMessage.id)) return prev;
                        return [...prev, {
                            id: newMessage.id,
                            role: newMessage.sender_type === 'contact' ? 'user' : 'assistant',
                            content: newMessage.content,
                            timestamp: newMessage.created_at
                        }];
                    });

                    // Also refresh conversation list to update last message
                    if (userId) loadConversations(userId);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeLeadId, userId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !userId) return;

        const userMessage = input;
        setInput('');
        setLoading(true);

        try {
            if (activeConversation) {
                // LIVE MODE (WA, IG, etc.)
                const endpoint = activeConversation.channel_type === 'whatsapp'
                    ? '/api/whatsapp/send'
                    : '/api/chat'; // Fallback for now

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: activeConversation.contact_phone,
                        message: userMessage,
                        userId: userId,
                        conversationId: activeConversation.id
                    })
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error);

                // Real-time will update the UI, but we can optimistically update
                // setMessages(prev => [...prev, { role: 'assistant', content: "(Inviato)" }]);
            } else {
                // SANDBOX MODE
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userInput: userMessage,
                        userId: userId,
                        history: messages.slice(-10)
                    })
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error);

                setMessages(prev => [...prev,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: data.reply }
                ]);

                if (data.conversationId && !activeConversation) {
                    // Refresh and select
                    loadConversations(userId);
                    router.push(`?leadId=${data.conversationId}`);
                }
            }
        } catch (err) {
            console.error("Chat Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contact_phone?.includes(searchTerm)
    );

    return (
        <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] p-4 md:p-6 lg:p-10 flex gap-6 bg-[#FAF9F6] relative overflow-hidden">

            {/* 1. ARCHITETTURA: LISTA CONVERSAZIONI (SIDEBAR) - DARK ELITE */}
            <div className={cn(
                "w-full lg:w-80 flex flex-col gap-6 transition-all duration-500",
                view !== 'list' && "hidden lg:flex"
            )}>
                <div className="bg-charcoal p-6 h-full flex flex-col gap-6 overflow-hidden rounded-[3rem] border border-gold/20 shadow-luxury relative">
                    {/* Ambient Glow Inside Sidebar */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                        <h2 className="font-serif italic text-2xl text-white">Frequenze.</h2>
                        <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <Filter className="w-4 h-4 text-gold" />
                        </div>
                    </div>

                    <div className="relative group z-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold transition-colors" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cerca lead..."
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/30 text-xs font-medium text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar z-10">
                        {loadingConvs ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                            ))
                        ) : filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => router.push(`?leadId=${conv.id}`)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group",
                                        activeLeadId === conv.id
                                            ? "bg-white/10 border-gold/40 shadow-luxury-sm"
                                            : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-gold/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center relative",
                                        activeLeadId === conv.id ? "bg-gold text-charcoal shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "bg-white/5 text-white/40"
                                    )}>
                                        {conv.channel_type === 'whatsapp' ? (
                                            <MessageCircle className="w-5 h-5" />
                                        ) : conv.channel_type === 'instagram' ? (
                                            <Instagram className="w-5 h-5" />
                                        ) : (
                                            <MessageSquare className="w-5 h-5" />
                                        )}
                                        {conv.status === 'active' && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-charcoal animate-pulse shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className={cn("font-bold text-[11px] truncate uppercase tracking-widest", activeLeadId === conv.id ? "text-gold" : "text-white/80")}>
                                                {conv.contact_name || 'Contatto'}
                                            </p>
                                            <p className={cn("text-[8px]", activeLeadId === conv.id ? "text-gold/50" : "text-white/20")}>
                                                {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                        <p className={cn("text-[9px] truncate italic", activeLeadId === conv.id ? "text-white/40" : "text-white/30")}>
                                            {conv.contact_phone || 'Senza Numero'}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-30 italic text-xs text-white">Nessun lead trovato</div>
                        )}
                    </div>

                    <button className="w-full py-4 bg-gold/10 text-gold border border-gold/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all z-10 shadow-lg">
                        Nuova Conversazione +
                    </button>
                </div>
            </div>

            {/* 2. ARCHITETTURA: PONTE DI COMANDO (CHAT) - LUXURY LIGHT GRID */}
            <div className={cn(
                "flex-1 silk-card overflow-hidden flex flex-col relative !rounded-[2rem] md:!rounded-[3rem] border-gold/10 !bg-white/80 shadow-mastermind backdrop-blur-3xl transition-all duration-500",
                view !== 'chat' && "hidden lg:flex"
            )}>
                {/* Visual Accent: Golden Neural Grid */}
                <div className="absolute inset-0 neural-grid opacity-[0.03] pointer-events-none" />

                {/* Decorative Light */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gold/5 blur-[120px] pointer-events-none" />

                {/* Mobile Navigation Header (Only visible on mobile/tablet) */}
                <div className="lg:hidden px-6 py-4 bg-charcoal flex items-center justify-between z-20">
                    <button
                        onClick={() => {
                            router.push('/dashboard/chat');
                            setView('list');
                        }}
                        className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Lista
                    </button>
                    <button
                        onClick={() => setView('insights')}
                        className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-widest"
                    >
                        Insights
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Header Chat */}
                <div className="px-6 md:px-12 py-6 md:py-8 border-b border-charcoal/5 flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-charcoal rounded-2xl md:rounded-3xl flex items-center justify-center shadow-luxury p-1 group flex-shrink-0">
                            <div className="w-full h-full border border-gold/30 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                                <Bot className="w-6 h-6 md:w-10 md:h-10 text-gold" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Interface Hub</span>
                                <ChevronRight className="w-3 h-3 text-gold/30" />
                                <span className="text-[9px] uppercase tracking-[0.4em] text-charcoal/40 font-black">
                                    {activeConversation?.channel_type || 'Sandbox'}
                                </span>
                            </div>
                            <h3 className="text-3xl font-serif italic text-charcoal tracking-tight">
                                {activeConversation ? activeConversation.contact_name : 'Sovereign Assistant'}
                            </h3>
                            <div className="flex items-center gap-5 mt-2">
                                <span className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Nucleo Attivo
                                </span>
                                <span className="text-charcoal/20 text-[10px]">|</span>
                                <span className="text-charcoal/40 text-[10px] flex items-center gap-2 italic">
                                    <Clock className="w-3 h-3" />
                                    Latenza 0.3s
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8">
                        <div className="text-right hidden md:block">
                            <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-gold font-black mb-1">Protocollo Sicurezza</p>
                            <div className="flex items-center gap-2 justify-end">
                                <ShieldCheck className="w-4 h-4 text-gold" />
                                <span className="text-[10px] md:text-xs font-bold text-charcoal">Cifratura Sovereign V2</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-charcoal text-gold rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-gold hover:text-white transition-all cursor-pointer shadow-luxury">
                            <Activity className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                    </div>
                </div>

                {/* Area Messaggi */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 md:space-y-12 custom-scrollbar relative z-10">
                    {messages.map((m, i) => (
                        <div key={i} className={cn("flex group animate-soft-focus", m.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                            <div className={cn("max-w-[90%] md:max-w-[75%] flex gap-4 md:gap-8", m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse')}>
                                <div className={cn(
                                    "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-luxury transition-transform group-hover:scale-110",
                                    m.role === 'assistant' ? 'bg-charcoal text-gold' : 'gold-gradient text-white'
                                )}>
                                    {m.role === 'assistant' ? <Bot className="w-5 h-5 md:w-7 md:h-7" /> : <User className="w-5 h-5 md:w-7 md:h-7" />}
                                </div>
                                <div className="space-y-3">
                                    <div className={cn(
                                        "px-6 md:px-10 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] text-xs md:text-sm leading-relaxed shadow-sm border",
                                        m.role === 'assistant'
                                            ? 'bg-white border-charcoal/5 text-charcoal rounded-tl-lg'
                                            : 'bg-charcoal border-gold/20 text-white rounded-tr-lg'
                                    )}>
                                        {m.content}
                                    </div>
                                    <div className={cn("flex items-center gap-3 px-3", m.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                                        <span className="text-[8px] uppercase tracking-[0.3em] text-charcoal/20 font-black">
                                            {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sincronizzato'}
                                        </span>
                                        {m.role === 'assistant' && (
                                            <div className="flex gap-0.5">
                                                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex gap-8 items-center">
                                <div className="w-14 h-14 rounded-2xl bg-charcoal flex items-center justify-center text-gold shadow-luxury"><Brain className="w-7 h-7 animate-pulse" /></div>
                                <div className="px-12 py-6 bg-white border border-charcoal/5 rounded-[2.5rem] rounded-tl-lg shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-10 border-t border-charcoal/5 bg-white/60 relative z-10">
                    <form onSubmit={handleSend} className="flex gap-4 md:gap-6 max-w-5xl mx-auto">
                        <div className="flex-1 relative">
                            <div className="absolute left-4 md:left-7 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-gold/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-gold/10 group">
                                <Zap className="w-5 h-5 md:w-6 md:h-6 text-gold group-hover:scale-110 transition-transform" />
                            </div>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={activeConversation ? `Scrivi a ${activeConversation.contact_name}...` : "Invia un messaggio..."}
                                className="w-full bg-white border border-charcoal/10 rounded-full md:rounded-[2.5rem] pl-16 md:pl-24 pr-12 md:pr-36 py-4 md:py-6 outline-none focus:border-gold/40 focus:shadow-luxury-sm transition-all text-xs md:text-sm font-medium text-charcoal shadow-inner"
                            />
                            <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-4">
                                <div className="h-6 w-[1px] bg-charcoal/10" />
                                <Database className="w-5 h-5 text-charcoal/20 hover:text-gold cursor-pointer transition-colors" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-14 h-14 md:w-20 md:h-20 bg-charcoal text-gold border border-gold/30 rounded-xl md:rounded-[2.5rem] flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-700 shadow-luxury disabled:opacity-30 group flex-shrink-0"
                        >
                            <Send className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>

            {/* 3. ARCHITETTURA: NEURAL INSIGHTS (RIGHT SIDEBAR) - DARK LUXURY */}
            <div className={cn(
                "w-full lg:w-96 flex flex-col gap-8 transition-all duration-500",
                view !== 'insights' && "hidden lg:flex"
            )}>
                {/* Mobile Navigation Header for Insights */}
                <div className="lg:hidden px-6 py-4 bg-white/80 backdrop-blur-md rounded-[2rem] border border-gold/10 flex items-center justify-between mb-4">
                    <button
                        onClick={() => setView('chat')}
                        className="flex items-center gap-2 text-charcoal text-[10px] font-black uppercase tracking-widest"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Torna alla Chat
                    </button>
                </div>
                <div className="bg-charcoal p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-gold/30 shadow-mastermind relative overflow-hidden group h-auto lg:h-[55%]">
                    {/* High-End Visual Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-1000" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 blur-[60px] translate-y-1/2 -translate-x-1/2 group-hover:bg-white/10 transition-all duration-1000" />

                    <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12 relative z-10">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/50 transition-all duration-500 shadow-inner">
                            <Brain className="w-6 h-6 md:w-8 md:h-8 text-gold animate-neural-pulse" />
                        </div>
                        <div>
                            <p className="text-gold text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-black mb-1">Controllo AI</p>
                            <h3 className="text-xl md:text-2xl font-serif italic text-white tracking-tight">Lead Analysis</h3>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-gold/30 transition-all group/item shadow-inner backdrop-blur-md">
                            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/60 font-black mb-3 md:mb-4 flex items-center justify-between">
                                Budget Estrapolato
                                <Database className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-white font-serif italic text-2xl md:text-3xl tracking-tight leading-none text-reveal">{insights.budget}</p>
                        </div>

                        <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-gold/30 transition-all group/item shadow-inner backdrop-blur-md">
                            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/60 font-black mb-3 md:mb-4">Focus Strategico</p>
                            <p className="text-white/80 text-[12px] md:text-[13px] leading-relaxed font-medium italic opacity-80 group-hover/item:opacity-100 transition-opacity">{insights.desires}</p>
                        </div>

                        <div className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gold/40 bg-gold/5 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] group/stage relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-gold/10" />
                            <div className="flex justify-between items-center mb-4 md:mb-5">
                                <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40 font-black italic">Sales Pipeline</p>
                                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold animate-pulse" />
                            </div>
                            <div className="flex items-end justify-between">
                                <p className="text-white font-serif text-xl md:text-2xl italic tracking-wide">{insights.stage}</p>
                                <div className="text-[8px] md:text-[10px] font-black text-gold/60 uppercase tracking-widest">94% Confidence</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Operations Panel */}
                <div className="flex-1 silk-card !rounded-[2.5rem] md:!rounded-[3.5rem] p-6 md:p-10 flex flex-col items-center justify-center text-center gap-4 md:gap-6 border-gold/20 shadow-luxury bg-white/90">
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-charcoal/30 font-black">Status Unità Operativa</p>

                    <div className={cn(
                        "px-6 md:px-10 py-2.5 md:py-3 rounded-full text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] border shadow-sm animate-pulse",
                        activeLeadId
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-600 border-green-200"
                    )}>
                        {activeLeadId ? '🔴 COMANDO LIVE' : '🟢 MODALITÀ TEST'}
                    </div>

                    {activeConversation && (
                        <div className="w-full mt-6 space-y-4">
                            <div className="h-[1px] w-full bg-charcoal/5" />
                            <div className="p-6 bg-charcoal/5 rounded-[2rem] border border-charcoal/5 bg-white/60">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">Canale</span>
                                        <div className="px-4 py-1.5 bg-charcoal text-gold rounded-xl text-[10px] font-black uppercase tracking-widest shadow-luxury-sm">
                                            {activeConversation.channel_type}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">ID Frequenza</span>
                                        <span className="text-[11px] font-serif italic text-charcoal flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-gold" />
                                            {activeConversation.contact_phone}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
