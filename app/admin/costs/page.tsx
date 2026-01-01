"use client";

import React, { useState, useEffect } from 'react';
import {
    PieChart as PieChartIcon,
    Zap,
    MessageSquare,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    Search,
    BrainCircuit
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

export default function AdminCosts() {
    const [stats, setStats] = useState({
        totalCosts: 653,
        aiCosts: 210,
        waCosts: 250,
        infraCosts: 93,
        stripeCosts: 163,
        modelBreakdown: [
            { model: 'Gemini Flash', cost: 5, msgs: '2.380', color: 'bg-green-400' },
            { model: 'Gemini Pro', cost: 145, msgs: '34.500', color: 'bg-blue-400' },
            { model: 'GPT-4o', cost: 45, msgs: '13.240', color: 'bg-purple-400' },
            { model: 'GPT-4 Turbo', cost: 15, msgs: '2.220', color: 'bg-gold' },
        ]
    });

    useEffect(() => {
        fetchCostStats();
    }, []);

    const fetchCostStats = async () => {
        // In a real implementation, we would aggregate cost tokens from messages
        // and conversation windows from webhooks.
        // For now, we simulate the logic based on Sovereign Economics.
    };

    return (
        <div className="p-8 lg:p-12">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-white/20"></span>
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.8em] font-black">Expense Architecture</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight">
                    Cost <span className="gold-text-gradient">Intelligence.</span>
                </h1>
            </header>

            {/* Total Cost Card */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                <div className="lg:col-span-1 bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">Cumulative Costs</p>
                    <h3 className="text-5xl font-serif text-white tabular-nums mb-4">{formatCurrency(stats.totalCosts)}</h3>
                    <div className="flex items-center text-red-400 gap-1 text-[10px] font-black uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4" />
                        <span>+15% Forecast</span>
                    </div>
                </div>

                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'AI APIs', val: stats.aiCosts, icon: BrainCircuit, color: 'text-gold' },
                        { label: 'WhatsApp', val: stats.waCosts, icon: MessageSquare, color: 'text-blue-400' },
                        { label: 'Infrastructure', val: stats.infraCosts, icon: Zap, color: 'text-green-400' },
                        { label: 'Stripe Fees', val: stats.stripeCosts, icon: DollarSign, color: 'text-purple-400' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-crosshair">
                            <item.icon className={`w-5 h-5 ${item.color} mb-3`} />
                            <p className="text-white/30 text-[8px] uppercase tracking-widest font-bold mb-1">{item.label}</p>
                            <p className="text-xl font-serif text-white">{formatCurrency(item.val)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Model Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Breakdown */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <h4 className="font-serif text-2xl italic text-white flex items-center gap-3 mb-10">
                        <BrainCircuit className="w-6 h-6 text-gold/60" />
                        AI Model Burn Rate
                    </h4>

                    <div className="space-y-8">
                        {stats.modelBreakdown.map((m, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${m.color}`} />
                                        <span className="text-sm font-bold text-white">{m.model}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gold font-bold mr-4">{formatCurrency(m.cost)}</span>
                                        <span className="text-white/20 text-[10px] uppercase tracking-widest">{m.msgs} msg</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${m.color}`}
                                        style={{ width: `${(m.cost / stats.aiCosts) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-gold/5 border border-gold/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gold">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gold">Alert: Focus on Optimization</span>
                        </div>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter italic">"Hybrid routing is 92% effective today"</p>
                    </div>
                </div>

                {/* Infrastructure & Alerts */}
                <div className="space-y-8">
                    {/* Fixed Infrastructure */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                        <h4 className="font-serif text-2xl italic text-white mb-8">Infrastructure <span className="text-white/20">(Fixed)</span></h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Vercel Pro', price: 20 },
                                { name: 'Supabase Pro', price: 25 },
                                { name: 'Resend Pro', price: 20 },
                                { name: 'Domain .app', price: 2 },
                                { name: 'Monitoring', price: 26 },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{item.name}</span>
                                    <span className="text-white font-serif italic">{formatCurrency(item.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Health */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                        <h4 className="font-serif text-2xl italic text-white mb-8">Operational Status</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-xs font-bold text-white">WhatsApp Budgets</p>
                                    <p className="text-[9px] text-white/40 uppercase">Within optimal range</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <div>
                                    <p className="text-xs font-bold text-white">AI Cost Spike</p>
                                    <p className="text-[9px] text-white/40 uppercase">+15% vs Forecast (Check GPT-4 Usage)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Temporary internal component for the chart icon
function TrendingUp({ className }: { className?: string }) {
    return <TrendingUpIcon className={className} />;
}
import { TrendingUp as TrendingUpIcon } from 'lucide-react';
