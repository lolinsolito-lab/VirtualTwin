"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    MessageSquare,
    Zap,
    RefreshCw,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    DollarSign,
    Target,
    BarChart3,
    HeartPulse
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { IMPERIAL_PRICES } from '@/lib/pricing';

// Helper for currency formatting
const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

export default function AdminOverview() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [stats, setStats] = useState({
        revenue: 0,
        costs: 0,
        profit: 0,
        margin: 0,
        activeUsers: 0,
        messagesProcessed: 0,
        todayMessages: 0,
        growth: 12.5,
        mrr: 0,
        arpu: 0,
        ltv: 0,
        cac: 35,
        cacLtvRatio: '0',
        costBreakdown: {
            ai: 0,
            whatsapp: 0,
            infra: 0,
            stripe: 0
        }
    });

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        setIsRefreshing(true);
        try {
            // 1. Calculate Revenue from active users (MRR)
            const { data: users } = await supabase
                .from('profiles')
                .select('plan_tier, subscription_status, is_founder')
                .eq('subscription_status', 'active');

            // 👑 IMPERIAL PRICING SYNC
            const totalRev = users?.reduce((acc, user) => {
                const tier = user.plan_tier as keyof typeof IMPERIAL_PRICES.founder;
                const prices = user.is_founder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_2026;
                return acc + (prices[tier] || 0);
            }, 0) || 0;

            // 2. Count Messages (for AI cost estimation)
            const { count: totalMessages } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true });

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: todayCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            // 3. Tiered Cost Logic (Economies of Scale)
            const calculateTieredCost = (msgCount: number) => {
                if (msgCount <= 1000) return msgCount * 0.015;
                if (msgCount <= 5000) return (1000 * 0.015) + (msgCount - 1000) * 0.010;
                if (msgCount <= 20000) return (1000 * 0.015) + (4000 * 0.010) + (msgCount - 5000) * 0.005;
                return (1000 * 0.015) + (4000 * 0.010) + (15000 * 0.005) + (msgCount - 20000) * 0.002;
            };

            const aiWaCosts = calculateTieredCost(totalMessages || 0);
            const infraCosts = 93;
            const stripeFees = totalRev * 0.015;
            const totalCosts = aiWaCosts + infraCosts + stripeFees;

            // 4. SaaS Metrics Logic
            const activeUserCount = users?.length || 0;
            const arpu = activeUserCount > 0 ? totalRev / activeUserCount : 0;
            const ltv = arpu * 8; // Assuming 8 months retention
            const cac = 35; // Target CAC
            const cacLtvRatio = cac > 0 ? `1:${Math.round(ltv / cac)}` : 'N/A';

            setStats({
                revenue: totalRev,
                mrr: totalRev,
                costs: Math.round(totalCosts),
                profit: Math.round(totalRev - totalCosts),
                margin: totalRev > 0 ? Number((((totalRev - totalCosts) / totalRev) * 100).toFixed(1)) : 0,
                activeUsers: activeUserCount,
                messagesProcessed: totalMessages || 0,
                todayMessages: todayCount || 0,
                growth: 12.5,
                arpu: Math.round(arpu),
                ltv: Math.round(ltv),
                cac: cac,
                cacLtvRatio: cacLtvRatio,
                costBreakdown: {
                    ai: Math.round(aiWaCosts * 0.45),
                    whatsapp: Math.round(aiWaCosts * 0.55),
                    infra: infraCosts,
                    stripe: Math.round(stripeFees)
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="p-8 lg:p-12">
            {/* Header */}
            <header className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="h-[1px] w-12 bg-gold/50"></span>
                        <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Sovereign God Mode</span>
                    </div>
                    <h1 className="font-serif text-5xl lg:text-7xl italic text-white leading-tight">
                        The Empire <span className="gold-text-gradient">Cockpit.</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 italic">Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                            <p className="text-gold font-bold text-xs tracking-widest uppercase">Live Pulse</p>
                        </div>
                    </div>
                    <button
                        onClick={() => fetchAdminStats()}
                        className={`p-5 bg-gold text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Top Metrics Row - FINANCIALS (Imperial Shields) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* MRR / REVENUE CARD */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                        <TrendingUp className="w-10 h-10 text-gold" />
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                        <p className="text-gold/40 text-[10px] uppercase tracking-[0.4em] font-black">Monthly Recurring Revenue</p>
                        <span className="bg-gold/10 text-gold text-[8px] font-black px-2 py-0.5 rounded border border-gold/20">LIVE DNA</span>
                    </div>
                    <h3 className="text-6xl font-serif italic text-white mb-4 tabular-nums tracking-tighter drop-shadow-luxury">{formatCurrency(stats.mrr)}</h3>
                    <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-green-500 font-bold text-sm">+{stats.growth}%</span>
                        <span className="text-white/20 text-[10px] uppercase tracking-[0.2em] italic">Projection vs Q4</span>
                    </div>
                </div>

                {/* REAL COSTS CARD */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group backdrop-blur-xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black mb-6">Operational Costs</p>
                    <h3 className="text-6xl font-serif italic text-white mb-4 tabular-nums tracking-tighter">{formatCurrency(stats.costs)}</h3>

                    <div className="grid grid-cols-2 gap-3 mt-8">
                        {[
                            { label: 'AI Intelligence', val: stats.costBreakdown.ai },
                            { label: 'Neural Link (WA)', val: stats.costBreakdown.whatsapp },
                            { label: 'Infrastructure', val: stats.costBreakdown.infra },
                            { label: 'Empire Tax (Stripe)', val: stats.costBreakdown.stripe },
                        ].map((cost, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-all">
                                <p className="text-[8px] text-white/30 uppercase font-black mb-1 tracking-widest">{cost.label}</p>
                                <p className="text-xs font-bold text-white/70 tabular-nums">{formatCurrency(cost.val)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PROFIT CARD - THE SOVEREIGN YIELD */}
                <div className="bg-gradient-to-br from-gold/20 via-gold/5 to-transparent border border-gold/30 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-[0_30px_100px_-15px_rgba(212,175,55,0.15)] backdrop-blur-2xl">
                    <div className="absolute top-0 right-0 p-8">
                        <Sparkles className="w-12 h-12 text-gold animate-pulse drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                    </div>
                    <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mb-6 italic">Sovereign Net Yield</p>
                    <h3 className="text-7xl font-serif italic text-white mb-4 tabular-nums tracking-tighter drop-shadow-luxury">
                        {stats.profit < 0 ? '-' : ''}{formatCurrency(Math.abs(stats.profit))}
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gold text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-luxury">
                            Margin: {stats.margin}%
                        </div>
                        <div className="text-gold/60 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                            Royal Target
                        </div>
                    </div>
                    <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-bold">Annual Projection: <span className="text-gold">{formatCurrency(stats.profit * 12)}</span></p>
                </div>
            </div>

            {/* Middle Row - SaaS UNIT ECONOMICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'ARPU', val: formatCurrency(stats.arpu), sub: 'Avg Revenue / User', icon: Target, color: 'text-gold' },
                    { label: 'LTV', val: formatCurrency(stats.ltv), sub: '8-Month Est. Lifetime', icon: BarChart3, color: 'text-blue-400' },
                    { label: 'CAC', val: formatCurrency(stats.cac), sub: 'Customer Acquisition', icon: DollarSign, color: 'text-purple-400' },
                    { label: 'CAC:LTV', val: stats.cacLtvRatio, sub: 'Efficiency Ratio', icon: HeartPulse, color: 'text-green-400' }
                ].map((m, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all">
                        <m.icon className={`w-5 h-5 ${m.color} mb-4`} />
                        <p className="text-white/30 text-[9px] uppercase tracking-widest font-black mb-1">{m.label}</p>
                        <p className="text-2xl font-serif text-white mb-1 tabular-nums">{m.val}</p>
                        <p className="text-[10px] text-white/20 italic">{m.sub}</p>
                    </div>
                ))}
            </div>

            {/* Bottom Grid - ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Users Section */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Users className="w-8 h-8 text-gold/60" />
                            <h4 className="font-serif text-3xl italic text-white">Citizen Registry</h4>
                        </div>
                        <div className="text-right">
                            <span className="text-white text-5xl font-serif tabular-nums">{stats.activeUsers}</span>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Total Citizens</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">New Recruitments (30d)</span>
                            <div className="h-1.5 flex-1 mx-6 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gold w-[23%] shadow-[0_0_10px_#d4af37]" />
                            </div>
                            <span className="text-white font-bold text-sm">23</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Churn Rate (30d)</span>
                            <div className="h-1.5 flex-1 mx-6 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500/50 w-[2%]" />
                            </div>
                            <span className="text-red-500 font-bold text-sm">2%</span>
                        </div>
                    </div>
                </div>

                {/* Messages Activity */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Activity className="w-8 h-8 text-blue-400/60" />
                            <h4 className="font-serif text-3xl italic text-white">System Signal</h4>
                        </div>
                        <MessageSquare className="w-8 h-8 text-white/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Processed Packets</p>
                            <p className="text-4xl font-serif text-white tabular-nums">{stats.messagesProcessed.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Live (24h)</p>
                            <p className="text-4xl font-serif text-gold tabular-nums">{stats.todayMessages.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-center justify-between group hover:bg-blue-500/10 transition-all">
                        <div className="flex items-center gap-3">
                            <Zap className="w-6 h-6 text-gold animate-pulse" />
                            <div>
                                <span className="text-[10px] uppercase tracking-widest font-black text-white/60">Sovereign Latency</span>
                                <p className="text-[8px] text-blue-400/60 uppercase font-black">AI Response Time (Avg)</p>
                            </div>
                        </div>
                        <span className="text-white font-serif italic text-3xl">1.8s</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
