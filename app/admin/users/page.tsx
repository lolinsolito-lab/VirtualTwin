"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    Zap,
    ShieldAlert,
    Trash2,
    Star,
    Mail,
    Phone,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    ArrowUpRight,
    LucideIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { IMPERIAL_PRICES } from '@/lib/pricing';

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

interface CitizenStat {
    id: string;
    email: string;
    full_name: string | null;
    plan_tier: string;
    subscription_status: string;
    messages_used_this_month: number;
    messages_limit: number;
    is_super_admin: boolean;
    is_founder: boolean;
    created_at: string;
    estimated_cost: number;
    profitability: number;
    health_score: number;
}

export default function AdminUsers() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<CitizenStat[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                // Enhanced mapping with real cost and revenue intelligence
                const enhancedUsers = data.map(u => {
                    const tier = u.plan_tier as keyof typeof IMPERIAL_PRICES.founder;
                    const prices = u.is_founder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_2026;
                    const rev = prices[tier] || 0;

                    // Realistic Tiered Cost Model (derived from AI usage)
                    const calculateUserTieredCost = (msgCount: number) => {
                        if (msgCount <= 1000) return msgCount * 0.015;
                        if (msgCount <= 5000) return (1000 * 0.015) + (msgCount - 1000) * 0.010;
                        return (1000 * 0.015) + (4000 * 0.010) + (msgCount - 5000) * 0.005;
                    };

                    const msgCount = u.messages_used_this_month || 0;
                    const cost = calculateUserTieredCost(msgCount);
                    const profit = rev - cost;

                    // Health Score calculation
                    const usageRatio = u.messages_limit > 0 ? msgCount / u.messages_limit : 0;
                    const health = Math.max(0, Math.min(100, 100 - (usageRatio * 40) + (profit > 0 ? 10 : -20)));

                    return {
                        ...u,
                        estimated_cost: cost,
                        profitability: profit,
                        health_score: Math.round(health)
                    };
                });

                setUsers(enhancedUsers);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 lg:p-12">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-white/20"></span>
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.8em] font-black">Citizen Registry</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight">
                    User <span className="gold-text-gradient">Profitability.</span>
                </h1>
            </header>

            {/* Top Stat Bar (Imperial Shields) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Citizens', val: users.length, icon: Users, color: 'text-gold' },
                    { label: 'Avg User Profit', val: formatCurrency(users.reduce((a, b) => a + b.profitability, 0) / (users.length || 1)), icon: TrendingUp, color: 'text-green-400' },
                    { label: 'Expansion Risk', val: users.filter(u => u.health_score < 40).length, icon: ShieldAlert, color: 'text-red-400' },
                    { label: 'High-Value Clients', val: users.filter(u => u.profitability > 100).length, icon: Star, color: 'text-gold' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex items-center justify-between group backdrop-blur-xl hover:bg-white/10 transition-all">
                        <div>
                            <p className="text-white/30 text-[8px] uppercase tracking-[0.4em] font-black mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-serif italic text-white drop-shadow-luxury tabular-nums">{stat.val}</h3>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color} opacity-10 group-hover:opacity-40 transition-opacity`} />
                    </div>
                ))}
            </div>

            {/* Users Table Container */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                {/* Table Header / Filter */}
                <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Cerca per email o nome..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Sort by Profit</span>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-gold">
                            <ArrowUpDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold">Sovereign Citizen</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold text-center">Plan Economics</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold text-center">Usage Cost</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold text-center">Net Profit</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Expansion Trigger</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((citizen, i) => (
                                <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-white font-serif italic text-lg shadow-luxury uppercase">
                                                {(citizen.full_name || citizen.email)[0]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-white leading-none">{citizen.full_name || 'Prospect'}</p>
                                                    {citizen.is_founder && <Star className="w-3 h-3 text-gold fill-gold" />}
                                                </div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-tighter mt-1">{citizen.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gold border border-gold/20 px-3 py-0.5 rounded-full">{citizen.plan_tier}</span>
                                            <span className="text-[8px] text-white/20 uppercase tracking-widest">{citizen.subscription_status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm font-bold text-white/80 tabular-nums">{formatCurrency(citizen.estimated_cost)}</p>
                                            <p className="text-[8px] text-white/20 uppercase tracking-widest">{citizen.messages_used_this_month || 0} messages</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <p className={`text-sm font-black tabular-nums ${citizen.profitability > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {formatCurrency(citizen.profitability)}
                                            </p>
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className={`h-full ${citizen.health_score > 70 ? 'bg-green-500' : citizen.health_score > 40 ? 'bg-gold' : 'bg-red-500'}`}
                                                    style={{ width: `${citizen.health_score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {(citizen.messages_used_this_month / citizen.messages_limit > 0.8 || citizen.health_score < 50) ? (
                                                <button className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 text-gold text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-gold hover:text-black transition-all">
                                                    <Zap className="w-3 h-3 animate-pulse" />
                                                    Push Upgrade
                                                </button>
                                            ) : (
                                                <button className="p-3 text-white/10 hover:text-white transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:text-white transition-all">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Override Zone */}
            <div className="mt-12 p-10 bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/10 rounded-[2.5rem]">
                <h4 className="font-serif text-2xl italic text-red-400 mb-4 flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6" />
                    Sovereign Intervention
                </h4>
                <p className="text-white/30 text-sm max-w-2xl mb-8 leading-relaxed italic">
                    Utilizza questi strumenti con saggezza. Qui puoi forzare lo stato del sistema,
                    resettare limiti di utilizzo per singoli cittadini o gestire crisi di profitto in tempo reale.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                        Bulk Reset Usage
                    </button>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                        Export Usage Logs
                    </button>
                </div>
            </div>
        </div>
    );
}

// Temporary internal component for the activity icon
function Activity({ className }: { className?: string }) {
    return <ActivityIcon className={className} />;
}
import { Activity as ActivityIcon } from 'lucide-react';
