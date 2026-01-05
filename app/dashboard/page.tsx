"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    Users,
    MessageSquare,
    Zap,
    Plus,
    Download,
    RefreshCw,
    ArrowRight,
    Sparkles,
    DollarSign,
    XCircle,
    AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Mini Chart Component
const MiniChart = ({ data = [], color = "gold" }: { data?: number[], color?: string }) => {
    const displayData = data && data.length > 0 ? data : [20, 40, 30, 50, 45, 60, 55];
    const max = Math.max(...displayData);
    const min = Math.min(...displayData);
    const range = max - min || 1;

    return (
        <div className="flex items-end gap-1 h-12">
            {displayData.map((value, i) => {
                const height = ((value - min) / range) * 100;
                return (
                    <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-500 ${color === "gold" ? "bg-gold/40 group-hover:bg-gold" : "bg-green-500/40 group-hover:bg-green-500"
                            }`}
                        style={{ height: `${Math.max(20, height)}%` }}
                    />
                );
            })}
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig: Record<string, { bg: string, text: string, dot: string, label: string }> = {
        'Qualifica': { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500', label: 'QUALIFICATO' },
        'qualified': { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500', label: 'QUALIFICATO' },
        'Inquiry': { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', label: 'INTERESSATO' },
        'active': { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', label: 'ATTIVO' },
        'Negoziazione': { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', label: 'TRATTATIVA' },
        'Chiuso': { bg: 'bg-purple-500/10', text: 'text-purple-600', dot: 'bg-purple-500', label: 'CONVERSO' },
        'Perso': { bg: 'bg-red-500/10', text: 'text-red-600', dot: 'bg-red-500', label: 'PERSO' },
    };

    const config = statusConfig[status] || { bg: 'bg-charcoal/5', text: 'text-charcoal/60', dot: 'bg-charcoal/30', label: status.toUpperCase() };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} ${config.text} text-[8px] tracking-[0.2em] font-black border border-white/20 shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shadow-sm animate-pulse`}></span>
            {config.label}
        </span>
    );
};

export default function DashboardPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalLeads: 0,
        conversations: 0,
        aiAccuracy: 0,
        potentialRevenue: 0,
        recentLeads: [] as any[]
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { count: leadCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
            const { count: messageCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
            const { data: recentLeads } = await supabase.from('conversations').select('*').eq('user_id', user.id).order('last_message_at', { ascending: false }).limit(4);

            const revenue = (leadCount || 0) * 500;

            setStats({
                totalLeads: leadCount || 0,
                conversations: messageCount || 0,
                aiAccuracy: 98.2,
                potentialRevenue: revenue,
                recentLeads: recentLeads || []
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchDashboardData();
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const hasData = stats.totalLeads > 0 || stats.conversations > 0;

    return (
        <div className="p-6 lg:p-12 bg-champagne min-h-screen">
            {/* Header */}
            <header className="mb-16">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-6 mb-8">
                            <span className="h-[1px] w-16 bg-gold/30"></span>
                            <span className="text-gold text-[10px] uppercase tracking-[1em] font-black italic">Imperial Intelligence</span>
                        </div>
                        <h1 className="font-serif text-5xl lg:text-7xl italic text-charcoal leading-[1.1] tracking-tight mb-6">
                            Il tuo Impero, <span className="gold-text-gradient">Sincronizzato.</span>
                        </h1>
                        <p className="text-charcoal/40 font-serif italic text-lg max-w-xl border-l border-gold/20 pl-6">
                            &ldquo;Il futuro non si aspetta, si governa. Monitora ogni battito del tuo clone digitale.&rdquo;
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            href="/dashboard/leads"
                            className="flex items-center gap-4 px-10 py-5 gold-gradient text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:scale-105 transition-all shadow-luxury"
                        >
                            <Plus className="w-5 h-5" />
                            Gestisci Pipeline
                        </Link>
                        <button
                            onClick={handleRefresh}
                            className={`p-5 bg-white border border-charcoal/5 rounded-full text-gold shadow-sm hover:shadow-xl transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {hasData ? (
                <div className="space-y-16">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: DollarSign, label: "Valore Pipeline", val: `€${stats.potentialRevenue.toLocaleString()}`, change: "+12%", status: "up", data: [40, 50, 45, 60, 75, 80, 95], color: "green" },
                            { icon: Users, label: "Total Leads", val: stats.totalLeads.toString(), change: "+8%", status: "up", data: [20, 25, 30, 28, 35, 40, 45], color: "gold" },
                            { icon: MessageSquare, label: "Messaggi AI", val: stats.conversations.toString(), change: "+24%", status: "up", data: [100, 150, 200, 180, 250, 300, 350], color: "gold" },
                            { icon: Zap, label: "AI Accuracy", val: `${stats.aiAccuracy}%`, change: "Optimal", status: "stable", data: [98, 98.2, 98.1, 98.2, 98.2, 98.3, 98.2], color: "gold" }
                        ].map((stat, i) => (
                            <div key={i} className="silk-card p-10 rounded-[3rem] border border-white/60 group hover:border-gold/30 hover:shadow-luxury transition-all duration-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.02] group-hover:bg-gold/[0.05] transition-colors blur-2xl" />
                                <div className="flex items-start justify-between mb-8">
                                    <div className="p-3 rounded-2xl bg-white shadow-sm border border-charcoal/5 group-hover:scale-110 transition-transform duration-500">
                                        <stat.icon className="w-5 h-5 text-gold" />
                                    </div>
                                    <MiniChart data={stat.data} color={stat.color} />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-charcoal/30 mb-2 font-black italic">{stat.label}</p>
                                <p className="text-4xl lg:text-5xl font-serif text-charcoal group-hover:scale-105 transition-transform duration-700 origin-left mb-6">{stat.val}</p>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${stat.status === "up" ? "bg-green-500/10 text-green-600" : stat.status === "down" ? "bg-red-500/10 text-red-600" : "bg-gold/10 text-gold"
                                        }`}>
                                        {stat.status === "up" ? <TrendingUp className="w-3 h-3" /> : stat.status === "down" ? <TrendingDown className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                        {stat.change}
                                    </div>
                                    <span className="text-charcoal/20 text-[9px] font-bold uppercase tracking-widest italic">vs sett. scorsa</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lead Activity */}
                        <div className="lg:col-span-2 silk-card p-12 rounded-[4rem] border border-white/60">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="font-serif text-3xl italic text-charcoal tracking-tight">Attività <span className="gold-text-gradient">Critica</span></h2>
                                <Link href="/dashboard/leads" className="text-gold text-[10px] uppercase tracking-[0.3em] font-black hover:tracking-[0.5em] transition-all duration-500 flex items-center gap-2">
                                    Vedi Registro
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-6">
                                {stats.recentLeads.map((lead, i) => (
                                    <Link
                                        key={i}
                                        href="/dashboard/leads"
                                        className="flex items-center justify-between p-6 border border-charcoal/5 rounded-[2rem] hover:bg-white/40 transition-all duration-500 group/item cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 gold-gradient rounded-full flex items-center justify-center font-serif text-white italic text-xl shadow-luxury group-hover/item:scale-110 transition-transform">
                                                {(lead.contact_name || 'P')[0]}
                                            </div>
                                            <div>
                                                <p className="text-charcoal font-medium text-base tracking-tight">{lead.contact_name || 'Prospect Anonimo'}</p>
                                                <p className="text-charcoal/30 text-[9px] uppercase tracking-[0.3em] mt-1 font-black italic">{lead.contact_platform_id || 'Automa WhatsApp'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-8">
                                            <StatusBadge status={lead.status} />
                                            <div>
                                                <p className="text-gold text-2xl font-serif italic tracking-tight">€500</p>
                                                <div className="w-8 h-[0.5px] bg-gold/30 ml-auto mt-1" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Setup / CTA */}
                        <div className="silk-card p-12 rounded-[4rem] border border-white/60 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gold/[0.01] group-hover:bg-gold/[0.03] transition-colors duration-700" />
                            <div className="w-24 h-24 gold-gradient rounded-full mb-10 flex items-center justify-center shadow-luxury relative z-10">
                                <Zap className="w-10 h-10 text-white fill-white animate-pulse" />
                            </div>
                            <h2 className="font-serif text-3xl lg:text-4xl mb-6 italic text-charcoal leading-tight relative z-10">
                                L'Impero ha sete <br />di <span className="gold-text-gradient">Dati.</span>
                            </h2>
                            <p className="text-charcoal/40 text-[10px] uppercase tracking-[0.2em] max-w-xs mb-10 leading-relaxed font-bold italic relative z-10">
                                Per attivare il flusso automatico di vendita su WhatsApp, completa la genesi del tuo VirtualTwin.
                            </p>
                            <Link
                                href="/dashboard/settings"
                                className="w-full py-5 gold-gradient rounded-full text-white font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-luxury text-[10px] flex items-center justify-center gap-4 relative z-10"
                            >
                                Avvia Genesi AI
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-32 h-32 gold-gradient rounded-full mb-12 flex items-center justify-center shadow-luxury animate-pulse">
                        <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <h2 className="font-serif text-5xl lg:text-6xl italic text-charcoal mb-8">
                        Benvenuto nel tuo <span className="gold-text-gradient">Impero.</span>
                    </h2>
                    <p className="text-charcoal/50 text-xl font-serif italic max-w-md mb-12 leading-relaxed">
                        &ldquo;Anche il più grande sovrano inizia con una singola pietra.&rdquo; Configura il tuo clone per iniziare.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link
                            href="/dashboard/settings"
                            className="px-12 py-5 gold-gradient rounded-full text-white font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-luxury text-[11px] flex items-center gap-4"
                        >
                            Inizia Genesi
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/dashboard/chat"
                            className="px-12 py-5 bg-white border border-charcoal/10 rounded-full text-charcoal font-black uppercase tracking-[0.3em] hover:border-gold transition-all shadow-sm text-[11px] flex items-center gap-4"
                        >
                            Prova Chat AI
                            <MessageSquare className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
