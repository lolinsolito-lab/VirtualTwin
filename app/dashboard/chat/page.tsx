"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
    Send, Bot, User, Brain, Database, ShieldCheck, Sparkles,
    Search, MessageSquare, Instagram, MessageCircle,
    Filter, Clock, CheckCheck, Loader2, ChevronRight,
    Zap, Hash, Phone
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
        } else {
            setActiveConversation(null);
            setMessages([
                { role: 'assistant', content: 'Buongiorno! Seleziona una conversazione per iniziare o scrivi un messaggio in modalità Sandbox.' }
            ]);
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
        <div className="h-[calc(100vh-80px)] p-6 lg:p-10 flex gap-6">

            {/* 1. ARCHITETTURA: LISTA CONVERSAZIONI (SIDEBAR) */}
            <div className="w-80 flex flex-col gap-6">
                <div className="silk-card p-6 h-full flex flex-col gap-6 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif italic text-2xl text-charcoal">Frequenze.</h2>
                        <div className="bg-gold/10 p-2 rounded-lg">
                            <Filter className="w-4 h-4 text-gold" />
                        </div>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/20 group-focus-within:text-gold transition-colors" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cerca lead..."
                            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-charcoal/5 rounded-xl outline-none focus:border-gold/30 text-xs font-medium"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {loadingConvs ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-20 bg-charcoal/5 rounded-2xl animate-pulse" />
                            ))
                        ) : filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => router.push(`?leadId=${conv.id}`)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 group",
                                        activeLeadId === conv.id
                                            ? "bg-charcoal border-gold/30 shadow-luxury"
                                            : "bg-white/50 border-charcoal/5 hover:bg-white hover:border-gold/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center relative",
                                        activeLeadId === conv.id ? "bg-white/10" : "bg-charcoal/5"
                                    )}>
                                        {conv.channel_type === 'whatsapp' ? (
                                            <MessageCircle className={cn("w-5 h-5", activeLeadId === conv.id ? "text-gold" : "text-charcoal/40")} />
                                        ) : conv.channel_type === 'instagram' ? (
                                            <Instagram className={cn("w-5 h-5", activeLeadId === conv.id ? "text-gold" : "text-charcoal/40")} />
                                        ) : (
                                            <MessageSquare className={cn("w-5 h-5", activeLeadId === conv.id ? "text-gold" : "text-charcoal/40")} />
                                        )}
                                        {conv.status === 'active' && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-champagne animate-pulse shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className={cn("font-bold text-[11px] truncate uppercase tracking-widest", activeLeadId === conv.id ? "text-white" : "text-charcoal")}>
                                                {conv.contact_name || 'Contatto'}
                                            </p>
                                            <p className={cn("text-[8px]", activeLeadId === conv.id ? "text-gold/50" : "text-charcoal/20")}>
                                                {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </div>
                                        <p className={cn("text-[9px] truncate italic", activeLeadId === conv.id ? "text-white/40" : "text-charcoal/40")}>
                                            {conv.contact_phone || 'Senza Numero'}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-30 italic text-xs">Nessun lead trovato</div>
                        )}
                    </div>

                    <button className="w-full py-4 bg-gold/10 text-gold rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
                        Nuova Conversazione +
                    </button>
                </div>
            </div>

            {/* 2. ARCHITETTURA: PONTE DI COMANDO (CHAT) */}
            <div className="flex-1 silk-card overflow-hidden flex flex-col relative">
                {/* Decorative Light */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-40 bg-gold/5 blur-[100px] pointer-events-none" />

                {/* Header Chat */}
                <div className="px-10 py-6 border-b border-charcoal/5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center shadow-luxury p-1">
                            <div className="w-full h-full border border-gold/30 rounded-xl flex items-center justify-center">
                                <Bot className="w-8 h-8 text-gold" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif italic text-charcoal">
                                {activeConversation ? activeConversation.contact_name : 'Sovereign Assistant'}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Link Attivo
                                </span>
                                <span className="text-charcoal/20 text-[10px]">|</span>
                                <span className="text-charcoal/40 text-[10px] flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Latenza 0.4s
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden xl:block">
                            <p className="text-[9px] uppercase tracking-widest text-gold font-black mb-1">Status Canale</p>
                            <div className="flex items-center gap-2 justify-end">
                                <Zap className="w-3 h-3 text-gold" />
                                <span className="text-xs font-bold text-charcoal">Cifratura Sovereignty</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold cursor-pointer hover:bg-gold hover:text-white transition-all">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Area Messaggi */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar relative z-10">
                    {messages.map((m, i) => (
                        <div key={i} className={cn("flex group", m.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                            <div className={cn("max-w-[70%] flex gap-6", m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse')}>
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-110",
                                    m.role === 'assistant' ? 'bg-charcoal text-gold' : 'gold-gradient text-white'
                                )}>
                                    {m.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                </div>
                                <div className="space-y-2">
                                    <div className={cn(
                                        "px-8 py-5 rounded-[2.5rem] text-[13px] leading-relaxed shadow-sm border",
                                        m.role === 'assistant'
                                            ? 'bg-white border-charcoal/5 text-charcoal rounded-tl-lg'
                                            : 'bg-charcoal border-gold/10 text-white rounded-tr-lg'
                                    )}>
                                        {m.content}
                                    </div>
                                    <div className={cn("flex items-center gap-3 px-2", m.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                                        <span className="text-[8px] uppercase tracking-widest text-charcoal/20 font-black">
                                            {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sincronizzato'}
                                        </span>
                                        {m.role === 'assistant' && (
                                            <CheckCheck className="w-3 h-3 text-blue-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex gap-6 items-center">
                                <div className="w-12 h-12 rounded-2xl bg-charcoal flex items-center justify-center text-gold shadow-lg"><Brain className="w-6 h-6 animate-pulse" /></div>
                                <div className="px-10 py-5 bg-white border border-charcoal/5 rounded-[2.5rem] rounded-tl-lg shadow-sm">
                                    <div className="flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-charcoal/5 bg-white/40">
                    <form onSubmit={handleSend} className="flex gap-5 max-w-5xl mx-auto">
                        <div className="flex-1 relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                                <Hash className="w-5 h-5 text-gold" />
                            </div>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={activeConversation ? `Scrivi a ${activeConversation.contact_name}...` : "Invia un comando neurale..."}
                                className="w-full bg-white border border-charcoal/5 rounded-[2rem] pl-20 pr-32 py-5 outline-none focus:border-gold/30 focus:shadow-luxury-sm transition-all text-sm font-medium text-charcoal shadow-inner"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gold animate-pulse">Neural Input</span>
                                <Database className="w-4 h-4 text-charcoal/20" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-16 h-16 bg-charcoal text-gold border border-gold/20 rounded-[2rem] flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-700 shadow-luxury disabled:opacity-30 group"
                        >
                            <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>

            {/* 3. ARCHITETTURA: NEURAL INSIGHTS (RIGHT SIDEBAR) */}
            <div className="w-96 flex flex-col gap-8">
                <div className="bg-charcoal p-10 rounded-[3rem] border border-gold/20 shadow-luxury relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-700" />

                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-colors">
                            <Sparkles className="w-7 h-7 text-gold" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif italic text-white">Neural Analysis</h3>
                            <p className="text-gold text-[9px] uppercase tracking-widest font-black">Lead Fingerprint</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="silk-card !bg-white/5 border-white/5 p-6 hover:border-gold/20 transition-all group/item">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-gold font-black mb-4 flex items-center justify-between">
                                Budget Rilevato
                                <Zap className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-white font-serif italic text-2xl tracking-tight leading-none">{insights.budget}</p>
                        </div>

                        <div className="silk-card !bg-white/5 border-white/5 p-6 hover:border-gold/20 transition-all group/item">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-gold font-black mb-4">Desideri & Obiettivi</p>
                            <p className="text-white/70 text-xs leading-relaxed font-medium italic">{insights.desires}</p>
                        </div>

                        <div className="p-8 rounded-[2rem] border border-gold/40 bg-gold/10 shadow-inner group/stage">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 font-black">Pipeline Projection</p>
                                <div className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_10px_#D4AF37]" />
                            </div>
                            <p className="text-white font-black text-sm uppercase tracking-[0.2em]">{insights.stage}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 silk-card p-8 flex flex-col items-center justify-center text-center gap-4 border-gold/10">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-charcoal/40 font-black">Status Operazione</p>
                    <div className={cn(
                        "px-8 py-2 rounded-full text-[10px] font-black tracking-widest border",
                        activeLeadId ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                    )}>
                        {activeLeadId ? '🔴 UNITÀ LIVE' : '🟢 SIMULAZIONE NEURALE'}
                    </div>
                    {activeConversation && (
                        <div className="mt-4 p-5 bg-charcoal/5 rounded-2xl border border-charcoal/5 w-full bg-white/50">
                            <p className="text-[10px] text-charcoal/30 uppercase tracking-widest font-black mb-3">Dati Connessione</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-charcoal/40">Canale</span>
                                    <span className="text-[10px] px-3 py-1 bg-charcoal text-white rounded-full font-bold uppercase tracking-widest">{activeConversation.channel_type}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-charcoal/40">Contatto</span>
                                    <span className="text-[10px] font-bold text-charcoal flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        {activeConversation.contact_phone}
                                    </span>
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
                    <p className="text-gold text-[10px] uppercase tracking-[0.6em] font-black">Caricamento Neural Pulse...</p>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
