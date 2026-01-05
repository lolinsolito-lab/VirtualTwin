"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, Download, Calendar } from 'lucide-react';
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
            <div className="p-12 lg:p-24 min-h-screen bg-champagne flex flex-col items-center justify-center gap-8">
                <div className="w-20 h-20 gold-gradient rounded-full animate-pulse shadow-luxury" />
                <p className="text-gold text-[10px] uppercase tracking-[1em] font-black animate-pulse">Sincronizzazione Imperiale...</p>
            </div>
        );
    }

    return (
        <div className="p-12 lg:p-24 min-h-screen bg-champagne animate-soft-focus">
            <header className="flex flex-col lg:row justify-between items-start lg:items-end gap-12 mb-32">
                <div>
                    <div className="flex items-center gap-6 mb-8">
                        <span className="h-[1px] w-16 bg-gold/30"></span>
                        <span className="text-gold text-[10px] uppercase tracking-[1.2em] font-black">Imperial Intelligence</span>
                    </div>
                    <h1 className="font-serif text-7xl italic text-charcoal leading-[1.1] tracking-tight">
                        Analisi <span className="gold-text-gradient">Sovrana.</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-4 px-8 py-4 glass-card rounded-full border border-gold/10 text-gold text-[10px] uppercase tracking-widest font-black hover:bg-gold hover:text-white transition-all duration-700 shadow-sm">
                        <Calendar className="w-4 h-4" />
                        Ultimi 30 Giorni
                    </button>
                    <button className="gold-gradient flex items-center gap-4 px-10 py-4 rounded-full text-white text-[10px] uppercase tracking-widest font-black shadow-luxury hover:scale-105 transition-all duration-700">
                        <Download className="w-4 h-4" />
                        Esporta Rapporto
                    </button>
                </div>
            </header>

            {/* Metrics Bar - Sovereign Shields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-32">
                {[
                    { label: "Valore Pipeline", val: `€${metrics?.totalValue.toLocaleString()}`, icon: DollarSign, trend: "+14%" },
                    { label: "Lead Attivi", val: metrics?.leadCount, icon: Users, trend: "+8%" },
                    { label: "Valore Medio", val: `€${Math.round(metrics?.avgValue || 0).toLocaleString()}`, icon: Target, trend: "Ottimale" },
                    { label: "Conversion Rate", val: `${metrics?.conversionRate.toFixed(1)}%`, icon: TrendingUp, trend: "+2.4%" }
                ].map((m, i) => (
                    <div key={i} className="bg-white/40 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/60 group hover:border-gold/30 transition-all duration-700 relative overflow-hidden shadow-luxury-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] group-hover:bg-gold/[0.05] blur-2xl transition-colors" />
                        <m.icon className="w-8 h-8 text-gold/30 mb-8 group-hover:text-gold transition-colors" />
                        <p className="text-[10px] uppercase tracking-[0.5em] text-charcoal/30 mb-4 font-black">{m.label}</p>
                        <p className="text-5xl font-serif italic text-charcoal group-hover:scale-105 transition-transform duration-700 origin-left">{m.val}</p>
                        <div className="mt-6 flex items-center gap-2 text-gold text-[9px] font-black uppercase tracking-widest">
                            <ArrowUpRight className="w-3 h-3" />
                            {m.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
                {/* Neural Pipeline Chart */}
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-md p-16 rounded-[4rem] border border-white/60 relative group shadow-luxury-sm">
                    <div className="flex justify-between items-center mb-16">
                        <h2 className="font-serif text-3xl italic text-charcoal tracking-tight">Distribuzione <span className="gold-text-gradient">Pipeline</span></h2>
                        <div className="text-[9px] uppercase tracking-widest text-gold font-black opacity-40">Live Neural Feed</div>
                    </div>
                    <div className="h-[350px] w-full">
                        <NeuralChart
                            type="bar"
                            data={metrics?.stageDistribution.map(s => ({ name: s.name, value: s.value })) || []}
                            height={350}
                        />
                    </div>
                </div>

                {/* Revenue Projector */}
                <div className="bg-charcoal p-16 rounded-[4rem] border border-gold/20 flex flex-col relative group overflow-hidden shadow-luxury">
                    <div className="absolute inset-0 bg-gold/[0.03] pointer-events-none" />
                    <h2 className="font-serif text-3xl italic text-white tracking-tight mb-16">Proiezione <span className="text-gold">Revenue</span></h2>
                    <div className="flex-1 flex items-center justify-center filter invert brightness-200">
                        <NeuralChart
                            type="area"
                            data={[
                                { name: 'Sett 1', value: metrics?.totalValue ? metrics.totalValue * 0.4 : 12000 },
                                { name: 'Sett 2', value: metrics?.totalValue ? metrics.totalValue * 0.6 : 18000 },
                                { name: 'Sett 3', value: metrics?.totalValue ? metrics.totalValue * 0.5 : 15000 },
                                { name: 'Sett 4', value: metrics?.totalValue ? metrics.totalValue * 0.8 : 25000 },
                                { name: 'Sett 5', value: metrics?.totalValue ? metrics.totalValue * 1.1 : 32000 }
                            ]}
                            height={250}
                        />
                    </div>
                    <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-2 italic">Previsione Mensile</p>
                        <p className="text-3xl font-serif text-white tracking-tight">
                            €{(metrics?.totalValue || 0 * 1.2).toLocaleString()}
                            <span className="text-[12px] text-green-400 not-italic font-black ml-4">+22%</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Lead Activity Stream - Neural Feed */}
            <div className="bg-white/40 backdrop-blur-xl p-20 rounded-[5rem] border border-white/60 shadow-luxury-sm">
                <div className="flex justify-between items-center mb-16">
                    <h2 className="font-serif text-4xl italic text-charcoal tracking-tight">Attività <span className="gold-text-gradient">Critica</span></h2>
                    <button className="text-gold text-[10px] uppercase tracking-[0.3em] font-black hover:tracking-[0.5em] transition-all duration-500">Vedi Registro Completo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {metrics?.recentActivity.map((act, i) => (
                        <div key={i} className="flex items-center gap-8 p-8 border border-charcoal/5 rounded-3xl hover:bg-white/40 transition-all duration-500 group">
                            <div className="w-14 h-14 gold-gradient rounded-full flex items-center justify-center font-serif text-white italic shadow-luxury border border-white/50 text-xl group-hover:scale-110 transition-transform">
                                {act.name[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-charcoal text-base font-medium tracking-tight">{act.name}</p>
                                    <span className="text-[9px] text-gold font-black uppercase tracking-widest">{act.time}</span>
                                </div>
                                <p className="text-charcoal/30 text-[9px] uppercase tracking-[0.3em] mt-2 font-black italic">{act.action}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gold text-2xl font-serif italic tracking-tight">€{act.value?.toLocaleString()}</p>
                                <div className="w-8 h-[0.5px] bg-gold/30 ml-auto mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
