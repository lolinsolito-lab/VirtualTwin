"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, Download, Calendar, Loader2 } from 'lucide-react';
import { NeuralChart } from '@/components/dashboard/NeuralChart';
import { getImperialAnalytics, AnalyticsMetrics } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const data = await getImperialAnalytics(user.id);
                setMetrics(data);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="h-[calc(100vh-60px)] flex items-center justify-center bg-champagne">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-gold animate-spin mx-auto mb-3" />
                    <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Sincronizzazione...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-60px)] flex flex-col bg-champagne overflow-hidden">
            {/* Compact Header */}
            <header className="flex-shrink-0 px-4 lg:px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-charcoal/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="h-[1px] w-8 bg-gold/30"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black">Intelligence</span>
                        </div>
                        <h1 className="font-serif text-2xl lg:text-3xl italic text-charcoal">
                            Analisi <span className="gold-text-gradient">Sovrana</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-charcoal/10 rounded-xl text-[10px] uppercase tracking-wider font-bold text-charcoal/60">
                            <Calendar className="w-3.5 h-3.5" />
                            30 Giorni
                        </button>
                        <button className="gold-gradient flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[10px] uppercase tracking-wider font-bold">
                            <Download className="w-3.5 h-3.5" />
                            Esporta
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                {/* Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Valore Pipeline", val: `€${metrics?.totalValue.toLocaleString()}`, icon: DollarSign, trend: "+14%" },
                        { label: "Lead Attivi", val: metrics?.leadCount, icon: Users, trend: "+8%" },
                        { label: "Valore Medio", val: `€${Math.round(metrics?.avgValue || 0).toLocaleString()}`, icon: Target, trend: "Ottimale" },
                        { label: "Conversion Rate", val: `${metrics?.conversionRate.toFixed(1)}%`, icon: TrendingUp, trend: "+2.4%" }
                    ].map((m, i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-charcoal/5">
                            <div className="flex items-center justify-between mb-2">
                                <m.icon className="w-5 h-5 text-gold/50" />
                                <div className="flex items-center gap-1 text-green-600 text-[9px] font-bold uppercase">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {m.trend}
                                </div>
                            </div>
                            <p className="text-[9px] uppercase tracking-widest text-charcoal/40 mb-1 font-bold">{m.label}</p>
                            <p className="text-2xl lg:text-3xl font-serif text-charcoal">{m.val}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Pipeline Distribution */}
                    <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-charcoal/5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-serif text-xl italic text-charcoal">Distribuzione <span className="gold-text-gradient">Pipeline</span></h2>
                            <span className="text-[9px] uppercase tracking-widest text-charcoal/30 font-bold">Live Feed</span>
                        </div>
                        <div className="h-[220px] w-full">
                            <NeuralChart
                                type="bar"
                                data={metrics?.stageDistribution.map(s => ({ name: s.name, value: s.value })) || []}
                                height={220}
                            />
                        </div>
                    </div>

                    {/* Revenue Projection */}
                    <div className="bg-charcoal rounded-2xl p-6 border border-gold/20">
                        <h2 className="font-serif text-xl italic text-white mb-4">Proiezione <span className="text-gold">Revenue</span></h2>
                        <div className="h-[160px] filter invert brightness-200">
                            <NeuralChart
                                type="area"
                                data={[
                                    { name: 'S1', value: metrics?.totalValue ? metrics.totalValue * 0.4 : 12000 },
                                    { name: 'S2', value: metrics?.totalValue ? metrics.totalValue * 0.6 : 18000 },
                                    { name: 'S3', value: metrics?.totalValue ? metrics.totalValue * 0.5 : 15000 },
                                    { name: 'S4', value: metrics?.totalValue ? metrics.totalValue * 0.8 : 25000 },
                                    { name: 'S5', value: metrics?.totalValue ? metrics.totalValue * 1.1 : 32000 }
                                ]}
                                height={160}
                            />
                        </div>
                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[9px] uppercase tracking-widest text-gold font-bold mb-1">Previsione Mensile</p>
                            <p className="text-2xl font-serif text-white">
                                €{((metrics?.totalValue || 0) * 1.2).toLocaleString()}
                                <span className="text-[10px] text-green-400 font-bold ml-2">+22%</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-charcoal/5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-serif text-xl italic text-charcoal">Attività <span className="gold-text-gradient">Recente</span></h2>
                        <button className="text-gold text-[10px] uppercase tracking-widest font-bold hover:underline">Vedi Tutto</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {metrics?.recentActivity.slice(0, 4).map((act, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border border-charcoal/5 rounded-xl hover:bg-white/50 transition-colors">
                                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center font-serif text-white italic">
                                    {act.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-charcoal truncate">{act.name}</p>
                                    <p className="text-[9px] text-charcoal/40 uppercase tracking-wider">{act.action}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gold font-serif italic">€{act.value?.toLocaleString()}</p>
                                    <p className="text-[9px] text-charcoal/30">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
