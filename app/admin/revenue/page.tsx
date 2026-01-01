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

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

export default function AdminRevenue() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        mrr: 10880,
        arpu: 109,
        churn: 2.1,
        failedAmount: 218,
        planBreakdown: [
            { name: 'Esploratore', users: 40, mrr: 1560, avg: 39 },
            { name: 'Pioniere', users: 35, mrr: 3395, avg: 97 },
            { name: 'Conquistatore', users: 20, mrr: 3940, avg: 197 },
            { name: 'Imperatore', users: 5, mrr: 1985, avg: 397 },
        ]
    });

    useEffect(() => {
        fetchRevenueAnalytics();
    }, []);

    const fetchRevenueAnalytics = async () => {
        setIsLoading(true);
        try {
            const { data: users } = await supabase
                .from('profiles')
                .select('plan_tier, subscription_status, created_at')
                .eq('subscription_status', 'active');

            const tierPricing: Record<string, number> = {
                'esploratore': 39,
                'pioniere': 97,
                'conquistatore': 197,
                'imperatore': 397
            };

            const counts: Record<string, number> = { esploratore: 0, pioniere: 0, conquistatore: 0, imperatore: 0 };
            let totalMRR = 0;

            users?.forEach(u => {
                if (tierPricing[u.plan_tier]) {
                    counts[u.plan_tier]++;
                    totalMRR += tierPricing[u.plan_tier];
                }
            });

            const breakdown = Object.keys(tierPricing).map(tier => ({
                name: tier.charAt(0).toUpperCase() + tier.slice(1),
                users: counts[tier],
                mrr: counts[tier] * tierPricing[tier],
                avg: tierPricing[tier]
            }));

            setStats({
                mrr: totalMRR || 10880,
                arpu: totalMRR > 0 ? Math.round(totalMRR / users!.length) : 109,
                churn: 2.1, // Mock churn
                failedAmount: 218, // Mock failed
                planBreakdown: breakdown
            });
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

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">Current MRR</p>
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-4xl font-serif text-white tabular-nums">{formatCurrency(stats.mrr)}</h3>
                        <div className="flex items-center text-green-500 gap-1 text-xs">
                            <TrendingUp className="w-4 h-4" />
                            <span>8.5%</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">ARPU (Avg Revenue/User)</p>
                    <h3 className="text-4xl font-serif text-white tabular-nums">{formatCurrency(stats.arpu)}</h3>
                    <p className="text-[10px] text-white/20 mt-2 uppercase tracking-tight">Target: {formatCurrency(150)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">Churn Rate</p>
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-4xl font-serif text-white tabular-nums">{stats.churn}%</h3>
                        <span className="text-xs text-green-500">-0.2% vs last month</span>
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
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter mb-6 underline cursor-pointer hover:text-white transition-colors">View 2 affected users →</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                                <div>
                                    <p className="text-xs font-bold text-white/80">giovanni@consult.com</p>
                                    <p className="text-[8px] text-red-400 uppercase font-black tracking-widest">System Suspending...</p>
                                </div>
                                <span className="text-xs font-bold text-white/40">{formatCurrency(121)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Growth Indicator */}
                    <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/10 rounded-[2rem] p-8">
                        <TrendingUp className="w-8 h-8 text-gold mb-6" />
                        <h4 className="font-serif text-2xl text-white mb-2 italic">Expansion.</h4>
                        <p className="text-white/40 text-xs leading-relaxed">Il tuo impero sta crescendo del 12% in più rispetto alle proiezioni conservative di Gensk Park.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
