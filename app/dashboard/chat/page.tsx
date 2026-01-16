"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
    Send, Bot, User, Brain, ShieldCheck, Sparkles,
    Search, MessageSquare, Instagram, MessageCircle,
    Clock, Loader2, ChevronRight, ChevronDown,
    Zap, Plus, Phone, Mail, Target, TrendingUp,
    Crown, Flame, Star, ArrowUpRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Channel type icons and colors
const CHANNEL_CONFIG = {
    whatsapp: { icon: MessageCircle, color: 'bg-green-500', label: 'WhatsApp' },
    instagram: { icon: Instagram, color: 'bg-gradient-to-br from-purple-500 to-pink-500', label: 'Instagram' },
    sandbox: { icon: Bot, color: 'bg-charcoal', label: 'Sandbox' },
    messenger: { icon: MessageSquare, color: 'bg-blue-500', label: 'Messenger' }
};

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
    const inputRef = useRef<HTMLInputElement>(null);

    // Channel filter
    const [activeFilter, setActiveFilter] = useState<string>('all');

    // Expanded channel groups
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        whatsapp: true,
        instagram: true,
        sandbox: true
    });

    // AI Insights (enhanced)
    const [insights, setInsights] = useState({
        budget: 'In analisi...',
        stage: 'Discovery',
        sentiment: 'Neutro',
        nextAction: 'Qualifica il lead',
        score: 0
    });

    // Typing indicator
    const [isTyping, setIsTyping] = useState(false);

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
                .select('*, messages(content, created_at, sender_type)')
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
        } else {
            setActiveConversation(null);
            setMessages([
                {
                    role: 'assistant',
                    content: 'Benvenuto nel Ponte di Comando! 🚀\n\nSono il tuo Strategic AI Clone. Posso aiutarti a:\n• Testare conversazioni in modalità Sandbox\n• Gestire lead da WhatsApp e Instagram\n• Qualificare prospect automaticamente\n\nScrivi un messaggio per iniziare!',
                    timestamp: new Date().toISOString()
                }
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

                // Parse insights from conversation
                const budgetMatch = conv.notes?.match(/Budget: (.*)/);
                setInsights({
                    budget: budgetMatch?.[1] || 'Da determinare',
                    stage: conv.status === 'qualified' ? 'Qualificato' :
                        conv.status === 'converted' ? 'Negoziazione' :
                            conv.status === 'closed' ? 'Chiuso' : 'Discovery',
                    sentiment: 'Positivo',
                    nextAction: conv.status === 'active' ? 'Qualifica il budget' : 'Chiudi la vendita',
                    score: conv.status === 'qualified' ? 75 : conv.status === 'converted' ? 90 : 40
                });

                const { data: history } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', id)
                    .order('created_at', { ascending: true });

                if (history) {
                    setMessages(history.map(m => ({
                        id: m.id,
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

    // Real-time subscription
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
        setIsTyping(true);

        // Optimistic update
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userInput: userMessage,
                    userId: userId,
                    conversationId: activeConversation?.id,
                    history: messages.slice(-10)
                })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply,
                timestamp: new Date().toISOString()
            }]);

            // Update insights from AI response
            if (data.insights) {
                setInsights(prev => ({
                    ...prev,
                    budget: data.insights.budgetRange || prev.budget,
                    stage: data.insights.suggestedStage || prev.stage,
                    score: data.insights.leadScore || prev.score
                }));
            }

            if (data.conversationId && !activeConversation) {
                loadConversations(userId);
            }
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Mi scuso, si è verificato un errore. Riprova tra un momento.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

    // Group conversations by channel
    const groupedConversations = conversations.reduce((acc, conv) => {
        const channel = conv.channel_type || 'sandbox';
        if (!acc[channel]) acc[channel] = [];
        acc[channel].push(conv);
        return acc;
    }, {} as Record<string, any[]>);

    const filteredConversations = activeFilter === 'all'
        ? conversations
        : conversations.filter(c => (c.channel_type || 'sandbox') === activeFilter);

    const searchedConversations = filteredConversations.filter(c =>
        c.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contact_phone?.includes(searchTerm)
    );

    const getLastMessage = (conv: any) => {
        if (conv.messages && conv.messages.length > 0) {
            const last = conv.messages[conv.messages.length - 1];
            return last.content?.substring(0, 40) + (last.content?.length > 40 ? '...' : '');
        }
        return 'Nessun messaggio';
    };

    return (
        <div className="h-[calc(100vh-60px)] flex bg-gradient-to-br from-champagne via-white to-champagne/80">

            {/* LEFT SIDEBAR - Conversation Navigator */}
            <div className="w-80 flex-shrink-0 bg-charcoal flex flex-col border-r border-gold/10 hidden lg:flex">
                {/* Sidebar Header */}
                <div className="p-5 border-b border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                                <Brain className="w-5 h-5 text-charcoal" />
                            </div>
                            <div>
                                <h2 className="font-serif italic text-white text-lg">Ponte di Comando</h2>
                                <p className="text-[9px] text-gold uppercase tracking-widest">AI Control Center</p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cerca conversazioni..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:border-gold/40 outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Channel Filters */}
                <div className="px-4 py-3 border-b border-white/5 flex gap-2 overflow-x-auto">
                    {[
                        { id: 'all', label: 'Tutti', count: conversations.length },
                        { id: 'whatsapp', label: 'WA', count: groupedConversations.whatsapp?.length || 0 },
                        { id: 'instagram', label: 'IG', count: groupedConversations.instagram?.length || 0 },
                        { id: 'sandbox', label: 'Test', count: groupedConversations.sandbox?.length || 0 },
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                                activeFilter === filter.id
                                    ? "bg-gold text-charcoal"
                                    : "bg-white/5 text-white/50 hover:bg-white/10"
                            )}
                        >
                            {filter.label}
                            {filter.count > 0 && (
                                <span className="w-4 h-4 bg-white/10 rounded-full text-[8px] flex items-center justify-center">
                                    {filter.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : searchedConversations.length > 0 ? (
                        <div className="p-3 space-y-1">
                            {searchedConversations.map((conv) => {
                                const channelType = conv.channel_type || 'sandbox';
                                const config = CHANNEL_CONFIG[channelType as keyof typeof CHANNEL_CONFIG] || CHANNEL_CONFIG.sandbox;
                                const Icon = config.icon;

                                return (
                                    <motion.button
                                        key={conv.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => router.push(`?leadId=${conv.id}`)}
                                        className={cn(
                                            "w-full p-3 rounded-xl flex items-start gap-3 transition-all text-left group",
                                            activeLeadId === conv.id
                                                ? "bg-gold/20 border border-gold/30"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        {/* Avatar with channel indicator */}
                                        <div className="relative">
                                            <div className={cn(
                                                "w-11 h-11 rounded-xl flex items-center justify-center text-white font-serif italic",
                                                activeLeadId === conv.id ? "bg-gold text-charcoal" : config.color
                                            )}>
                                                {conv.contact_name?.[0] || <Icon className="w-5 h-5" />}
                                            </div>
                                            <div className={cn(
                                                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-charcoal",
                                                config.color
                                            )}>
                                                <Icon className="w-2 h-2 text-white" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={cn(
                                                    "text-sm font-medium truncate",
                                                    activeLeadId === conv.id ? "text-gold" : "text-white"
                                                )}>
                                                    {conv.contact_name || 'Lead Anonimo'}
                                                </p>
                                                <span className="text-[9px] text-white/30">
                                                    {conv.last_message_at
                                                        ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : ''}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-white/40 truncate">
                                                {getLastMessage(conv)}
                                            </p>
                                            {/* Status indicator */}
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={cn(
                                                    "text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold",
                                                    conv.status === 'qualified' ? 'bg-gold/20 text-gold' :
                                                        conv.status === 'converted' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-white/10 text-white/40'
                                                )}>
                                                    {conv.status || 'active'}
                                                </span>
                                                {conv.conversion_value > 0 && (
                                                    <span className="text-[9px] text-gold/60">
                                                        €{conv.conversion_value.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 text-white/20" />
                            </div>
                            <p className="text-white/30 text-sm mb-2">Nessuna conversazione</p>
                            <p className="text-white/20 text-xs">Attiva un canale per iniziare</p>
                        </div>
                    )}
                </div>

                {/* New Conversation Button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => router.push('/dashboard/chat')}
                        className="w-full py-3 bg-gradient-to-r from-gold to-amber-500 text-charcoal rounded-xl text-[11px] font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Nuova Sandbox AI
                    </button>
                </div>
            </div>

            {/* CENTER - Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-charcoal/5 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-charcoal rounded-xl flex items-center justify-center relative">
                            <Bot className="w-5 h-5 text-gold" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-charcoal text-lg">
                                {activeConversation?.contact_name || 'Strategic AI Clone'}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    {activeConversation?.channel_type ? CHANNEL_CONFIG[activeConversation.channel_type as keyof typeof CHANNEL_CONFIG]?.label : 'Sandbox Mode'}
                                </span>
                                <span className="text-[10px] text-charcoal/30">•</span>
                                <span className="text-[10px] text-charcoal/40 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    Cifrato E2E
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                        {activeConversation && (
                            <>
                                <button className="p-2.5 bg-charcoal/5 text-charcoal/50 rounded-xl hover:bg-charcoal hover:text-gold transition-all">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 bg-charcoal/5 text-charcoal/50 rounded-xl hover:bg-charcoal hover:text-gold transition-all">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/50 to-transparent">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn("flex", m.role === 'assistant' ? 'justify-start' : 'justify-end')}
                            >
                                <div className={cn(
                                    "max-w-[75%] flex gap-3",
                                    m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                                )}>
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1",
                                        m.role === 'assistant' ? 'bg-charcoal text-gold' : 'bg-gold text-charcoal'
                                    )}>
                                        {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className={cn(
                                            "px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                                            m.role === 'assistant'
                                                ? 'bg-white rounded-2xl rounded-tl-sm border border-charcoal/5 text-charcoal shadow-sm'
                                                : 'bg-charcoal rounded-2xl rounded-tr-sm text-white'
                                        )}>
                                            {m.content}
                                        </div>
                                        <span className={cn(
                                            "text-[9px] text-charcoal/30 px-1",
                                            m.role === 'user' && 'text-right block'
                                        )}>
                                            {m.timestamp
                                                ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : 'Ora'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="flex gap-3 items-center">
                                <div className="w-9 h-9 rounded-xl bg-charcoal flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-gold animate-pulse" />
                                </div>
                                <div className="px-4 py-3 bg-white border border-charcoal/5 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                                    </div>
                                </div>
                                <span className="text-[10px] text-charcoal/30 italic">Elaborazione strategica...</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-charcoal/5 flex-shrink-0">
                    <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={activeConversation
                                    ? `Rispondi a ${activeConversation.contact_name}...`
                                    : "Scrivi un messaggio per testare il tuo Clone AI..."
                                }
                                className="w-full bg-champagne/50 border border-charcoal/10 rounded-2xl pl-5 pr-14 py-4 text-sm focus:border-gold/40 focus:bg-white outline-none transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-gold/40" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-14 h-14 bg-charcoal text-gold rounded-2xl flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDEBAR - Intelligence Panel */}
            <div className="w-72 flex-shrink-0 bg-white border-l border-charcoal/5 hidden xl:flex flex-col">
                {/* Panel Header */}
                <div className="p-5 border-b border-charcoal/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-charcoal rounded-xl flex items-center justify-center">
                            <Target className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-charcoal">Neural Insights</h3>
                            <p className="text-[9px] text-gold uppercase tracking-widest">Live Analysis</p>
                        </div>
                    </div>
                </div>

                {/* Lead Score */}
                <div className="p-5 border-b border-charcoal/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-charcoal/50 uppercase tracking-wider font-bold">Lead Score</span>
                        <span className="text-[10px] text-gold font-bold">{insights.score}%</span>
                    </div>
                    <div className="h-2 bg-charcoal/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insights.score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                                "h-full rounded-full",
                                insights.score >= 70 ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                                    insights.score >= 40 ? "bg-gradient-to-r from-gold to-amber-500" :
                                        "bg-gradient-to-r from-red-400 to-rose-500"
                            )}
                        />
                    </div>
                    <p className="text-[9px] text-charcoal/40 mt-2 italic">
                        {insights.score >= 70 ? 'Hot Lead - Pronto per la chiusura' :
                            insights.score >= 40 ? 'Warm Lead - Continua la qualifica' :
                                'Cold Lead - Serve più nurturing'}
                    </p>
                </div>

                {/* Insights Cards */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    {[
                        { label: 'Budget', value: insights.budget, icon: Crown, color: 'text-gold' },
                        { label: 'Stage', value: insights.stage, icon: TrendingUp, color: 'text-purple-500' },
                        { label: 'Sentiment', value: insights.sentiment, icon: Star, color: 'text-green-500' },
                        { label: 'Next Action', value: insights.nextAction, icon: Flame, color: 'text-orange-500' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-charcoal/[0.02] rounded-xl border border-charcoal/5 group hover:border-gold/20 transition-all"
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                                <span className="text-[9px] text-charcoal/40 uppercase tracking-widest font-bold">{item.label}</span>
                            </div>
                            <p className="text-charcoal font-medium text-sm">{item.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Mode Indicator */}
                <div className="p-4 border-t border-charcoal/5">
                    <div className={cn(
                        "p-4 rounded-xl text-center",
                        activeLeadId
                            ? "bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"
                            : "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                    )}>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className={cn(
                                "w-2 h-2 rounded-full animate-pulse",
                                activeLeadId ? "bg-red-500" : "bg-green-500"
                            )} />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest",
                                activeLeadId ? "text-red-600" : "text-green-600"
                            )}>
                                {activeLeadId ? 'Modalità Live' : 'Sandbox Mode'}
                            </span>
                        </div>
                        <p className="text-[9px] text-charcoal/40">
                            {activeLeadId ? 'Risposte inviate al lead reale' : 'Test sicuro senza invio'}
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
                    <div className="w-16 h-16 bg-charcoal rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Brain className="w-8 h-8 text-gold" />
                    </div>
                    <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Inizializzazione Clone AI...</p>
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
