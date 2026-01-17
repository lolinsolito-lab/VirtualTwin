"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
    Send, Bot, User, Brain, ShieldCheck, Sparkles,
    Search, MessageSquare, Instagram, MessageCircle,
    Loader2, Zap, Phone, Mail, Target, TrendingUp,
    Crown, Flame, Star, Menu, X, ChevronLeft, BarChart3
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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

    // Mobile view state: 'list' | 'chat' | 'insights'
    const [mobileView, setMobileView] = useState<'list' | 'chat' | 'insights'>('chat');
    const [showInsights, setShowInsights] = useState(false);

    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [isTyping, setIsTyping] = useState(false);

    const [insights, setInsights] = useState({
        budget: 'In analisi...',
        stage: 'Discovery',
        sentiment: 'Neutro',
        nextAction: 'Qualifica il lead',
        score: 0
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
                .select('*, messages(content, created_at, sender_type)')
                .eq('user_id', uid)
                .order('last_message_at', { ascending: false });

            if (data) setConversations(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoadingConvs(false);
        }
    }

    useEffect(() => {
        if (activeLeadId && userId) {
            loadActiveConversation(activeLeadId);
            setMobileView('chat');
        } else {
            setActiveConversation(null);
            setMessages([
                {
                    role: 'assistant',
                    content: 'Ciao! 👋 Sono il tuo Strategic AI Clone.\n\nPosso aiutarti a:\n• Testare conversazioni in Sandbox\n• Gestire lead da WhatsApp/Instagram\n• Qualificare prospect automaticamente\n\nScrivi un messaggio per iniziare!',
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

                setInsights({
                    budget: conv.notes?.match(/Budget: (.*)/)?.[1] || 'Da determinare',
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
            console.error("Error:", err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Mi scuso, si è verificato un errore. Riprova.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    };

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
        if (conv.messages?.length > 0) {
            const last = conv.messages[conv.messages.length - 1];
            return last.content?.substring(0, 35) + (last.content?.length > 35 ? '...' : '');
        }
        return 'Nessun messaggio';
    };

    const selectConversation = (id: string) => {
        router.push(`?leadId=${id}`);
        setMobileView('chat');
    };

    const startNewSandbox = () => {
        router.push('/dashboard/chat');
        setMobileView('chat');
    };

    return (
        <div className="h-[calc(100vh-60px)] flex bg-gradient-to-br from-champagne via-white to-champagne/80 overflow-hidden">

            {/* ========== LEFT SIDEBAR - Desktop & Mobile Slide ========== */}
            <div className={cn(
                "w-80 flex-shrink-0 bg-charcoal flex flex-col border-r border-gold/10",
                "fixed inset-y-0 left-0 z-40 top-[60px] lg:relative lg:top-0",
                "transition-transform duration-300 ease-out",
                mobileView === 'list' ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center">
                                <Brain className="w-4 h-4 text-charcoal" />
                            </div>
                            <div>
                                <h2 className="font-serif italic text-white text-base">Ponte di Comando</h2>
                                <p className="text-[8px] text-gold uppercase tracking-widest">AI Control</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileView('chat')}
                            className="lg:hidden p-2 text-white/50 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cerca..."
                            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:border-gold/40 outline-none"
                        />
                    </div>
                </div>

                {/* Channel Filters */}
                <div className="px-3 py-2 border-b border-white/5 flex gap-1.5 overflow-x-auto">
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
                                "px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all",
                                activeFilter === filter.id
                                    ? "bg-gold text-charcoal"
                                    : "bg-white/5 text-white/50"
                            )}
                        >
                            {filter.label} {filter.count > 0 && `(${filter.count})`}
                        </button>
                    ))}
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                    {loadingConvs ? (
                        <div className="p-3 space-y-2">
                            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
                        </div>
                    ) : searchedConversations.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {searchedConversations.map((conv) => {
                                const channelType = conv.channel_type || 'sandbox';
                                const config = CHANNEL_CONFIG[channelType as keyof typeof CHANNEL_CONFIG] || CHANNEL_CONFIG.sandbox;
                                const Icon = config.icon;

                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => selectConversation(conv.id)}
                                        className={cn(
                                            "w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left",
                                            activeLeadId === conv.id
                                                ? "bg-gold/20 border border-gold/30"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="relative">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif italic text-sm",
                                                activeLeadId === conv.id ? "bg-gold text-charcoal" : config.color
                                            )}>
                                                {conv.contact_name?.[0] || <Icon className="w-4 h-4" />}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-0.5">
                                                <p className={cn("text-sm font-medium truncate", activeLeadId === conv.id ? "text-gold" : "text-white")}>
                                                    {conv.contact_name || 'Lead'}
                                                </p>
                                                <span className="text-[9px] text-white/30 flex-shrink-0">
                                                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-white/40 truncate">{getLastMessage(conv)}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <MessageSquare className="w-8 h-8 text-white/20 mb-3" />
                            <p className="text-white/30 text-sm">Nessuna conversazione</p>
                        </div>
                    )}
                </div>

                {/* New Sandbox Button */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={startNewSandbox}
                        className="w-full py-2.5 bg-gradient-to-r from-gold to-amber-500 text-charcoal rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Nuova Sandbox
                    </button>
                </div>
            </div>

            {/* ========== CENTER - Chat ========== */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0",
                mobileView !== 'chat' && "hidden lg:flex"
            )}>
                {/* Chat Header - Mobile Optimized */}
                <div className="px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-lg border-b border-charcoal/5 flex-shrink-0 safe-top">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button - larger touch target */}
                        <button
                            onClick={() => setMobileView('list')}
                            className="lg:hidden w-10 h-10 -ml-1 flex items-center justify-center rounded-xl bg-charcoal/5 text-charcoal hover:bg-gold hover:text-white transition-all active:scale-95"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="w-10 h-10 bg-charcoal rounded-xl flex items-center justify-center relative">
                            <Bot className="w-5 h-5 text-gold" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-charcoal text-base">
                                {activeConversation?.contact_name || 'Strategic AI Clone'}
                            </h3>
                            <span className="flex items-center gap-1 text-[9px] text-green-600 font-bold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                {activeConversation?.channel_type ? CHANNEL_CONFIG[activeConversation.channel_type as keyof typeof CHANNEL_CONFIG]?.label : 'Sandbox'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {activeConversation && (
                            <>
                                <button className="hidden sm:flex p-2 bg-charcoal/5 text-charcoal/50 rounded-xl hover:bg-charcoal hover:text-gold transition-all">
                                    <Phone className="w-4 h-4" />
                                </button>
                                <button className="hidden sm:flex p-2 bg-charcoal/5 text-charcoal/50 rounded-xl hover:bg-charcoal hover:text-gold transition-all">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        {/* Mobile insights toggle */}
                        <button
                            onClick={() => setShowInsights(!showInsights)}
                            className={cn(
                                "xl:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95",
                                showInsights ? "bg-gold text-white" : "bg-charcoal/5 text-charcoal/50 hover:bg-gold hover:text-white"
                            )}
                        >
                            <BarChart3 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages - with better padding for mobile */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn("flex", m.role === 'assistant' ? 'justify-start' : 'justify-end')}
                            >
                                <div className={cn("max-w-[85%] sm:max-w-[75%] flex gap-2", m.role === 'assistant' ? 'flex-row' : 'flex-row-reverse')}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                                        m.role === 'assistant' ? 'bg-charcoal text-gold' : 'bg-gold text-charcoal'
                                    )}>
                                        {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className={cn(
                                            "px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm",
                                            m.role === 'assistant'
                                                ? 'bg-white rounded-2xl rounded-tl-md border border-charcoal/5 text-charcoal'
                                                : 'bg-gradient-to-br from-charcoal to-charcoal/90 rounded-2xl rounded-tr-md text-white shadow-lg'
                                        )}>
                                            {m.content}
                                        </div>
                                        <span className={cn("text-[9px] text-charcoal/30 px-1", m.role === 'user' && 'text-right block')}>
                                            {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 rounded-xl bg-charcoal flex items-center justify-center">
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
                        </motion.div>
                    )}
                </div>

                {/* Input - Floating Card Style */}
                <div className="p-3 sm:p-4 bg-gradient-to-t from-champagne via-champagne/95 to-transparent flex-shrink-0 safe-bottom">
                    <form onSubmit={handleSend} className="flex gap-2 sm:gap-3 bg-white rounded-2xl p-2 shadow-lg border border-charcoal/5">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={activeConversation ? `Rispondi...` : "Scrivi un messaggio..."}
                            className="flex-1 bg-transparent px-3 py-3 text-[15px] placeholder:text-charcoal/30 focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-12 h-12 bg-gold text-white rounded-xl flex items-center justify-center hover:bg-charcoal transition-all disabled:opacity-30 active:scale-95 shadow-md"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* ========== RIGHT SIDEBAR - Insights (Desktop + Mobile Sheet) ========== */}
            <div className={cn(
                "w-64 flex-shrink-0 bg-white border-l border-charcoal/5 flex-col",
                "hidden xl:flex",
                // Mobile bottom sheet
                showInsights && "fixed inset-x-0 bottom-0 z-50 xl:relative xl:inset-auto w-full xl:w-64 flex rounded-t-3xl xl:rounded-none shadow-2xl xl:shadow-none h-auto max-h-[60vh] xl:max-h-none xl:h-full"
            )}>
                {/* Mobile close handle */}
                <div className="xl:hidden flex justify-center py-2">
                    <button
                        onClick={() => setShowInsights(false)}
                        className="w-12 h-1 bg-charcoal/20 rounded-full"
                    />
                </div>

                <div className="p-4 border-b border-charcoal/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-charcoal rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-charcoal text-sm">Neural Insights</h3>
                            <p className="text-[8px] text-gold uppercase tracking-widest">Live</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowInsights(false)}
                        className="xl:hidden p-1 text-charcoal/30"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Lead Score */}
                <div className="p-4 border-b border-charcoal/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] text-charcoal/50 uppercase tracking-wider font-bold">Lead Score</span>
                        <span className="text-[10px] text-gold font-bold">{insights.score}%</span>
                    </div>
                    <div className="h-2 bg-charcoal/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insights.score}%` }}
                            transition={{ duration: 1 }}
                            className={cn(
                                "h-full rounded-full",
                                insights.score >= 70 ? "bg-green-500" :
                                    insights.score >= 40 ? "bg-gold" : "bg-red-400"
                            )}
                        />
                    </div>
                    <p className="text-[9px] text-charcoal/40 mt-1.5">
                        {insights.score >= 70 ? '🔥 Hot - Pronto per chiusura' :
                            insights.score >= 40 ? '🌡️ Warm - Continua qualifica' : '❄️ Cold - Serve nurturing'}
                    </p>
                </div>

                {/* Insights Grid */}
                <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                    {[
                        { label: 'Budget', value: insights.budget, icon: Crown, color: 'text-gold' },
                        { label: 'Stage', value: insights.stage, icon: TrendingUp, color: 'text-purple-500' },
                        { label: 'Sentiment', value: insights.sentiment, icon: Star, color: 'text-green-500' },
                        { label: 'Next Action', value: insights.nextAction, icon: Flame, color: 'text-orange-500' },
                    ].map((item) => (
                        <div key={item.label} className="p-3 bg-charcoal/[0.02] rounded-xl border border-charcoal/5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <item.icon className={cn("w-3 h-3", item.color)} />
                                <span className="text-[8px] text-charcoal/40 uppercase tracking-widest font-bold">{item.label}</span>
                            </div>
                            <p className="text-charcoal text-sm">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Mode Badge */}
                <div className="p-3 border-t border-charcoal/5">
                    <div className={cn(
                        "p-3 rounded-xl text-center",
                        activeLeadId ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"
                    )}>
                        <div className="flex items-center justify-center gap-1.5 mb-0.5">
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", activeLeadId ? "bg-red-500" : "bg-green-500")} />
                            <span className={cn("text-[9px] font-bold uppercase tracking-wider", activeLeadId ? "text-red-600" : "text-green-600")}>
                                {activeLeadId ? 'Live Mode' : 'Sandbox'}
                            </span>
                        </div>
                        <p className="text-[8px] text-charcoal/40">
                            {activeLeadId ? 'Risposte inviate al lead' : 'Test sicuro'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile overlay for sidebar */}
            {mobileView === 'list' && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileView('chat')}
                />
            )}
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
