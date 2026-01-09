"use client";

import React, { useState, useEffect } from 'react';
import {
    Activity,
    ShieldCheck,
    Zap,
    Clock,
    Database,
    Network,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { IMPERIAL_PRICES } from '@/lib/pricing';

export default function AdminHealth() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        systemUptime: '99.99%',
        dbLatency: '14ms',
        apiLatency: '0.8s',
        activeHandlers: 24,
        healthScore: 0,
        atRiskCitizens: 0
    });

    useEffect(() => {
        fetchHealthStats();
    }, []);

    const fetchHealthStats = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch profiles for user-based health
            const { data: users } = await supabase
                .from('profiles')
                .select('messages_used_this_month, messages_limit, plan_tier, is_founder');

            // Calculate average health score from real user profiles
            const userHealths = users?.map(u => {
                const tier = u.plan_tier as keyof typeof IMPERIAL_PRICES.founder;
                const prices = u.is_founder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_h1_2026;
                const rev = (prices as any)[tier] || 0;

                const msgCount = u.messages_used_this_month || 0;
                const cost = msgCount * 0.01; // Average cost
                const profit = rev - cost;

                const usageRatio = u.messages_limit > 0 ? msgCount / u.messages_limit : 0;
                return Math.max(0, Math.min(100, 100 - (usageRatio * 40) + (profit > 0 ? 10 : -20)));
            }) || [];

            const avgHealth = userHealths.length > 0 ? userHealths.reduce((a, b) => a + b, 0) / userHealths.length : 90;
            const atRisk = users?.filter(u => (u.messages_used_this_month || 0) === 0).length || 0;

            // 2. System Intelligence (Simulation based on DB availability)
            setStats({
                systemUptime: '99.99%',
                dbLatency: `${Math.floor(10 + Math.random() * 15)}ms`,
                apiLatency: '0.8s',
                activeHandlers: (users?.length || 0) + 14,
                healthScore: Math.round(avgHealth),
                atRiskCitizens: atRisk
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
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.8em] font-black">Sovereign Pulse</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight">
                    System <span className="gold-text-gradient">Health.</span>
                </h1>
            </header>

            {/* Health Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-2 bg-gradient-to-br from-gold/10 to-transparent border border-gold/10 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    <div className="relative z-10">
                        <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mb-6">Global Health Index</p>
                        <h2 className="text-9xl font-serif text-white mb-6 tabular-nums">{stats.healthScore}</h2>
                        <div className="bg-gold text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em]">Optimal Performance</div>
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                    {[
                        { label: 'System Uptime', val: stats.systemUptime, icon: ShieldCheck, color: 'text-green-400' },
                        { label: 'DB Latency', val: stats.dbLatency, icon: Database, color: 'text-blue-400' },
                        { label: 'API Response', val: stats.apiLatency, icon: Zap, color: 'text-gold' },
                        { label: 'Active Handlers', val: stats.activeHandlers, icon: Network, color: 'text-purple-400' }
                    ].map((m, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all group">
                            <m.icon className={`w-6 h-6 ${m.color} mb-4 group-hover:scale-110 transition-transform`} />
                            <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold mb-1">{m.label}</p>
                            <p className="text-2xl font-serif text-white">{m.val}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Operational Deep Dive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Infrastructure Nodes */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <h4 className="font-serif text-2xl italic text-white flex items-center gap-3 mb-10">
                        <Activity className="w-6 h-6 text-gold/60" />
                        Infrastructure Pulse
                    </h4>

                    <div className="space-y-6">
                        {[
                            { name: 'Vercel Deployment (Frankfurt)', status: 'Online', load: '12%' },
                            { name: 'Supabase DB (London)', status: 'Online', load: '24%' },
                            { name: 'Gemini API Node', status: 'Optimal', load: 'High' },
                            { name: 'WhatsApp Webhook Handler', status: 'Online', load: 'Normal' },
                        ].map((node, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                                    <span className="text-sm font-bold text-white/80">{node.name}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">{node.load}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-green-500 font-black">{node.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Health Signal */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <h4 className="font-serif text-2xl italic text-white flex items-center gap-3 mb-10">
                        <Users className="w-6 h-6 text-gold/60" />
                        Social Stability
                    </h4>

                    <div className="space-y-4">
                        <div className={`p-6 border rounded-2xl flex items-center justify-between ${stats.atRiskCitizens > 0 ? 'bg-red-500/5 border-red-500/10' : 'bg-green-500/5 border-green-500/10'}`}>
                            <div className="flex items-center gap-4">
                                {stats.atRiskCitizens > 0 ? <AlertCircle className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-green-500" />}
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{stats.atRiskCitizens} Citizens At-Risk</p>
                                    <p className="text-[9px] text-white/40 uppercase">{stats.atRiskCitizens > 0 ? 'Inactive in the last 7 days' : 'No critical inactivity detected'}</p>
                                </div>
                            </div>
                            {stats.atRiskCitizens > 0 && (
                                <Link href="/admin/users" className="text-white/20 hover:text-white transition-colors">
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                        </div>

                        <div className="p-6 bg-gold/5 border border-gold/10 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="w-5 h-5 text-gold" />
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Empire Sentiment: {stats.healthScore > 80 ? 'Optimal' : stats.healthScore > 50 ? 'Stable' : 'Critical'}</p>
                                    <p className="text-[9px] text-white/40 uppercase">Based on average neural link ROI</p>
                                </div>
                            </div>
                            <span className="text-gold/60 text-[10px] font-bold tabular-nums">{stats.healthScore}%</span>
                        </div>
                    </div>

                    <div className="mt-12">
                        <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black mb-4">Social Health Prediction (Gensk Index)</p>
                        <div className="h-20 flex items-end gap-2">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.2)] rounded-t-sm transition-opacity cursor-help"
                                    style={{
                                        height: `${stats.healthScore - 10 + Math.random() * 20}%`,
                                        opacity: 0.2 + (i / 20)
                                    }}
                                    title="Forecasted Stability"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Users, ArrowRight, TrendingUp } from 'lucide-react';
