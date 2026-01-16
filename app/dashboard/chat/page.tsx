"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
    Send, Bot, User, Brain, ShieldCheck,
    Search, MessageSquare, Instagram, MessageCircle,
    Filter, Clock, Loader2, ChevronRight,
    Zap, Activity, Plus
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

    // Mobile View State
    const [view, setView] = useState<'list' | 'chat'>('chat');

    // AI extracted insights
    const [insights, setInsights] = useState({
        budget: 'In analisi...',
        stage: 'Sandbox'
    });

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

    useEffect(() => {
        if (activeLeadId && userId) {
            loadActiveConversation(activeLeadId);
            setView('chat');
        } else {
            setActiveConversation(null);
            setMessages([
                { role: 'assistant', content: 'Buongiorno! Sono il tuo Sovereign Assistant. Scrivi un messaggio per iniziare una conversazione in modalità Sandbox.' }
            ]);
            setView('chat');
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
                    stage: conv.status || 'active'
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
                    })));
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    // Real-time updates
    useEffect(() => {
        if (!activeLeadId) return;

        const channel = supabase
            .channel(`conv_${activeLeadId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeLeadId}`
            }, (payload) => {
                const newMessage = payload.new as any;
                setMessages(prev => {
                    if (prev.some(m => m.id === newMessage.id)) return prev;
                    return [...prev, {
                        id: newMessage.id,
                        role: newMessage.sender_type === 'contact' ? 'user' : 'assistant',
                        content: newMessage.content,
                        timestamp: newMessage.created_at
                    }];
                });
                if (userId) loadConversations(userId);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
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
                const endpoint = activeConversation.channel_type === 'whatsapp'
                    ? '/api/whatsapp/send'
                    : '/api/chat';

                await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: activeConversation.contact_phone,
                        message: userMessage,
                        userId: userId,
                        conversationId: activeConversation.id
                    })
                });
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

                setMessages(prev => [...prev,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: data.reply }
                ]);

                // Update insights from AI response
                if (data.insights) {
                    setInsights({
                        budget: data.insights.budgetRange || 'In analisi...',
                        stage: data.insights.suggestedStage || 'active'
                    });
                }

                if (data.conversationId && !activeConversation) {
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

    const getStageLabel = (stage: string) => {
        const labels: Record<string, string> = {
            'active': 'Discovery',
            'qualified': 'Qualificato',
            'converted': 'Negoziazione',
            'closed': 'Chiuso'
        };
        return labels[stage] || stage;
    };

    return (
        <div className="h-[calc(100vh-60px)] flex bg-champagne">

            {/* LEFT: Conversation List - Compact */}
            <div className={cn(
                "w-72 flex-shrink-0 bg-charcoal flex flex-col transition-all duration-300",
                view !== 'list' && "hidden lg:flex"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-serif italic text-lg text-white">Frequenze</h2>
                        <Filter className="w-4 h-4 text-gold/50" />
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cerca..."
                            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:border-gold/30 outline-none"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loadingConvs ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                        ))
                    ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => router.push(`?leadId=${conv.id}`)}
                                className={cn(
                                    "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left",
                                    activeLeadId === conv.id
                                        ? "bg-gold/20 border border-gold/30"
                                        : "hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center",
                                    activeLeadId === conv.id ? "bg-gold text-charcoal" : "bg-white/10 text-white/50"
                                )}>
                                    {conv.channel_type === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> :
                                        conv.channel_type === 'instagram' ? <Instagram className="w-4 h-4" /> :
                                            <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn("text-xs font-bold truncate", activeLeadId === conv.id ? "text-gold" : "text-white/80")}>
                                        {conv.contact_name || 'Contatto'}
                                    </p>
                                    <p className="text-[10px] text-white/30 truncate">
                                        {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Nuovo'}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-white/30 text-xs italic">
                            Nessuna conversazione
                        </div>
                    )}
                </div>

                {/* New Conversation */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={() => router.push('/dashboard/chat')}
                        className="w-full py-2.5 bg-gold/10 text-gold border border-gold/20 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-gold hover:text-charcoal transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Nuova Sandbox
                    </button>
                </div>
            </div>

            {/* CENTER: Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header - Compact */}
                <div className="h-16 px-4 lg:px-6 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-charcoal/5">
                    <div className="flex items-center gap-3">
                        {/* Mobile back button */}
                        <button onClick={() => setView('list')} className="lg:hidden p-2 -ml-2">
                            <ChevronRight className="w-5 h-5 text-charcoal rotate-180" />
                        </button>

                        <div className="w-10 h-10 bg-charcoal rounded-xl flex items-center justify-center">
                            <Bot className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-charcoal">
                                {activeConversation?.contact_name || 'Sovereign Assistant'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    {activeConversation?.channel_type || 'Sandbox'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 text-charcoal/30">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Cifratura V2</span>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={cn("flex", m.role === 'assistant' ? 'justify-start' : 'justify-end')}>
                            <div className={cn("max-w-[85%] lg:max-w-[70%] flex gap-3", m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse')}>
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                    m.role === 'assistant' ? 'bg-charcoal text-gold' : 'bg-gold text-white'
                                )}>
                                    {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className="space-y-1">
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'assistant'
                                            ? 'bg-white border border-charcoal/5 text-charcoal rounded-tl-sm'
                                            : 'bg-charcoal text-white rounded-tr-sm'
                                    )}>
                                        {m.content}
                                    </div>
                                    <span className={cn("text-[9px] text-charcoal/30 px-1", m.role === 'user' && 'text-right block')}>
                                        {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ora'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-gold animate-pulse" />
                                </div>
                                <div className="px-4 py-3 bg-white border border-charcoal/5 rounded-2xl rounded-tl-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-charcoal/5">
                    <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={activeConversation ? `Scrivi a ${activeConversation.contact_name}...` : "Invia un messaggio..."}
                                className="w-full bg-white border border-charcoal/10 rounded-2xl pl-5 pr-12 py-3.5 text-sm focus:border-gold/40 outline-none"
                            />
                            <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-12 h-12 bg-charcoal text-gold rounded-2xl flex items-center justify-center hover:bg-gold hover:text-white transition-all disabled:opacity-30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* RIGHT: Insights Panel - Compact */}
            <div className="hidden xl:flex w-64 flex-shrink-0 flex-col gap-3 p-4 bg-charcoal/[0.02]">
                {/* AI Status */}
                <div className="bg-charcoal rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gold uppercase tracking-widest font-bold">Lead Analysis</p>
                            <p className="text-white font-serif italic">AI Insights</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-xl">
                            <p className="text-[9px] text-gold/60 uppercase tracking-wider mb-1">Budget</p>
                            <p className="text-white font-bold text-sm">{insights.budget}</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl">
                            <p className="text-[9px] text-gold/60 uppercase tracking-wider mb-1">Stage</p>
                            <p className="text-white font-bold text-sm">{getStageLabel(insights.stage)}</p>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-2xl p-4 text-center border border-charcoal/5">
                    <p className="text-[9px] text-charcoal/40 uppercase tracking-widest mb-2">Modalità</p>
                    <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        activeLeadId
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-green-50 text-green-600 border border-green-200"
                    )}>
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", activeLeadId ? "bg-red-500" : "bg-green-500")} />
                        {activeLeadId ? 'Live' : 'Sandbox'}
                    </div>
                </div>

                {/* Quick Actions */}
                {activeConversation && (
                    <div className="bg-white rounded-2xl p-4 border border-charcoal/5">
                        <p className="text-[9px] text-charcoal/40 uppercase tracking-widest mb-3">Info</p>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-charcoal/50">Canale</span>
                                <span className="font-bold text-charcoal">{activeConversation.channel_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-charcoal/50">Tel</span>
                                <span className="font-bold text-charcoal truncate max-w-[100px]">{activeConversation.contact_phone || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-champagne">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-gold animate-spin mx-auto mb-3" />
                    <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Caricamento...</p>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
