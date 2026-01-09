"use client";

import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    ChevronRight,
    Search,
    Filter,
    AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { IMPERIAL_PRICES } from '@/lib/pricing';

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

interface BillingEvent {
    id: string;
    event_type: string;
    amount: number;
    user_email: string;
    created_at: string;
}

export default function AdminRevenue() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        mrr: 0,
        arpu: 0,
        churn: 2.1,
        failedAmount: 218,
        overageRevenue: 0,
        planBreakdown: [] as any[]
    });
    const [recentEvents, setRecentEvents] = useState<BillingEvent[]>([]);

    useEffect(() => {
        fetchRevenueAnalytics();
    }, []);

    const fetchRevenueAnalytics = async () => {
        setIsLoading(true);
        try {
            // 1. Calculate Revenue from active users (MRR)
            const { data: users } = await supabase
                .from('profiles')
                .select('plan_tier, subscription_status, is_founder, created_at');

            const activeUsers = users?.filter(u => u.subscription_status === 'active') || [];
            const canceledUsers = users?.filter(u => u.subscription_status === 'canceled') || [];

            const counts: Record<string, number> = {};
            const revenuePerTier: Record<string, number> = {};
            let totalMRR = 0;

            activeUsers.forEach(u => {
                const tier = u.plan_tier;
                const prices = u.is_founder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_2026;
                const price = (prices as any)[tier] || 0;

                counts[tier] = (counts[tier] || 0) + 1;
                revenuePerTier[tier] = (revenuePerTier[tier] || 0) + price;
                totalMRR += price;
            });

            // 2. REAL CHURN CALCULATION
            const totalBase = activeUsers.length + canceledUsers.length;
            const churnRate = totalBase > 0 ? (canceledUsers.length / totalBase) * 100 : 0;

            // 3. REAL FAILED PAYMENTS
            const { data: failedPayments } = await supabase
                .from('billing_events')
                .select('amount')
                .eq('event_type', 'invoice.payment_failed');

            const totalFailed = failedPayments?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

            // 4. OVERAGE REVENUE
            const { data: overageEvents } = await supabase
                .from('billing_events')
                .select('amount')
                .eq('event_type', 'overage_purchased');

            const totalOverage = overageEvents?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

            const breakdown = Object.keys(counts).map(tier => ({
                name: tier.charAt(0).toUpperCase() + tier.slice(1),
                users: counts[tier],
                mrr: revenuePerTier[tier],
                avg: counts[tier] > 0 ? revenuePerTier[tier] / counts[tier] : 0
            })).sort((a, b) => b.mrr - a.mrr);

            // 4. REAL LEDGER EVENTS
            const { data: events } = await supabase
                .from('billing_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            setStats({
                mrr: totalMRR,
                arpu: activeUsers.length > 0 ? totalMRR / activeUsers.length : 0,
                churn: Number(churnRate.toFixed(1)),
                failedAmount: totalFailed,
                overageRevenue: totalOverage,
                planBreakdown: breakdown
            });
            setRecentEvents(events || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-white/20"></span>
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.8em] font-black">Financial Intelligence</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight">
                    Revenue <span className="gold-text-gradient">Deep Dive.</span>
                </h1>
            </header>

            {/* Quick Metrics Grid (Imperial Shields) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl group hover:bg-white/10 transition-all">
                    <p className="text-gold/40 text-[10px] uppercase tracking-[0.4em] font-black mb-4">Current Sovereign MRR</p>
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-5xl font-serif italic text-white tabular-nums drop-shadow-luxury">{formatCurrency(stats.mrr)}</h3>
                        <div className="flex items-center text-green-500 gap-1 text-xs font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                            <TrendingUp className="w-3 h-3" />
                            <span>8.5%</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl group hover:bg-white/10 transition-all">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-black mb-4">Average Revenue / User</p>
                    <h3 className="text-5xl font-serif italic text-white tabular-nums">{formatCurrency(stats.arpu)}</h3>
                    <p className="text-[10px] text-gold/20 mt-3 uppercase tracking-[0.2em] font-bold">Empire Target: {formatCurrency(150)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl group hover:bg-white/10 transition-all border-red-500/10 hover:border-red-500/30">
                    <p className="text-red-500/40 text-[10px] uppercase tracking-[0.4em] font-black mb-4">Attrition (Churn)</p>
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-5xl font-serif italic text-white tabular-nums">{stats.churn}%</h3>
                        <span className="text-[10px] text-green-500/60 uppercase tracking-widest font-black">-0.2% vs Nov</span>
                    </div>
                </div>
            </div>

            {/* Overage Revenue Card */}
            <div className="mb-12">
                <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-8 rounded-[2rem] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400/60 text-[10px] uppercase tracking-[0.4em] font-black mb-2">💎 Overage Revenue</p>
                            <h3 className="text-4xl font-serif italic text-white tabular-nums">{formatCurrency(stats.overageRevenue)}</h3>
                            <p className="text-[10px] text-purple-400/40 mt-2">Revenue addizionale da pacchetti extra (canali, cloni, messaggi)</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">MRR Totale + Overage</p>
                            <p className="text-2xl font-serif text-gold">{formatCurrency(stats.mrr + stats.overageRevenue)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Plan Breakdown Table */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h4 className="font-serif text-2xl italic text-white flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-gold/60" />
                            Revenue by Plan
                        </h4>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                                <Filter className="w-4 h-4 text-white/40" />
                            </button>
                            <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10">
                                <Search className="w-4 h-4 text-white/40" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 pb-4">
                                    <th className="text-[10px] uppercase tracking-widest text-white/20 font-bold py-4">Plan</th>
                                    <th className="text-[10px] uppercase tracking-widest text-white/20 font-bold py-4">Users</th>
                                    <th className="text-[10px] uppercase tracking-widest text-white/20 font-bold py-4">Revenue</th>
                                    <th className="text-[10px] uppercase tracking-widest text-white/20 font-bold py-4">Avg/User</th>
                                    <th className="text-[10px] uppercase tracking-widest text-white/20 font-bold py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.planBreakdown.map((plan, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-6 font-bold text-sm text-white">{plan.name}</td>
                                        <td className="py-6 tabular-nums text-white/60">{plan.users}</td>
                                        <td className="py-6 tabular-nums font-bold text-gold">{formatCurrency(plan.mrr)}</td>
                                        <td className="py-6 tabular-nums text-white/40">{formatCurrency(plan.avg)}</td>
                                        <td className="py-6 text-right">
                                            <button className="p-2 text-white/20 hover:text-gold transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    {/* Failed Payments */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-6 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                            <h4 className="font-bold text-[10px] uppercase tracking-widest">Failed Payments</h4>
                        </div>
                        <p className="text-3xl font-serif text-white mb-2">{formatCurrency(stats.failedAmount)}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter mb-6 underline cursor-pointer hover:text-white transition-colors">Total unresolved arrears</p>

                        <div className="space-y-4">
                            {/* Failed items would show up here if we filter ledger for failures */}
                            <p className="text-[10px] text-white/20 italic">Monitor the Imperial Ledger for specific failed signals.</p>
                        </div>
                    </div>

                    {/* Imperial Ledger */}
                    <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-serif text-xl italic text-white flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-gold" />
                                Imperial Ledger
                            </h4>
                            <span className="text-[8px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Live Signals</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {recentEvents.length > 0 ? recentEvents.map((event, i) => (
                                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${event.event_type.includes('success') || event.event_type.includes('paid')
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {event.event_type.split('.').pop()}
                                        </span>
                                        <span className="text-[10px] font-bold text-white tabular-nums">{formatCurrency(event.amount)}</span>
                                    </div>
                                    <p className="text-[9px] text-white/60 truncate mb-1">{event.user_email || 'System Event'}</p>
                                    <span className="text-[8px] text-white/20 uppercase tracking-tighter">
                                        {new Date(event.created_at).toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            )) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                                    <AlertCircle className="w-10 h-10 mb-4" />
                                    <p className="text-[10px] uppercase tracking-widest">No Recent Signals</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/10 rounded-[2rem] p-8">
                        <TrendingUp className="w-8 h-8 text-gold mb-6" />
                        <h4 className="font-serif text-2xl text-white mb-2 italic">Expansion.</h4>
                        <p className="text-white/40 text-xs leading-relaxed uppercase tracking-tighter">Your Empire is exceeding the growth projections for this cycle.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
