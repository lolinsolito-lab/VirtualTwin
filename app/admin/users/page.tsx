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
    const [selectedUser, setSelectedUser] = useState<CitizenStat | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
                    const prices = u.is_founder ? IMPERIAL_PRICES.founder : IMPERIAL_PRICES.public_h1_2026;
                    const rev = prices[tier as keyof typeof prices] || 0;

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

    const handleUpdateUser = async (updates: Partial<CitizenStat>) => {
        if (!selectedUser) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', selectedUser.id);

            if (error) throw error;
            await fetchUsers();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error updating citizen:', error);
            alert('Errore imperiale: impossibile aggiornare il cittadino.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        if (!confirm('ATTENZIONE: Stai per cancellare questo cittadino dall\'Impero. Questa azione è irreversibile. Procedere?')) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', selectedUser.id);

            if (error) throw error;
            await fetchUsers();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Error deleting citizen:', error);
            alert('Errore imperiale: il cittadino oppone resistenza alla cancellazione.');
        } finally {
            setIsSaving(false);
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
                                                <button
                                                    onClick={() => { setSelectedUser(citizen); setIsEditModalOpen(true); }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 text-gold text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-gold hover:text-black transition-all"
                                                >
                                                    <Zap className="w-3 h-3 animate-pulse" />
                                                    Push Upgrade
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => { setSelectedUser(citizen); setIsEditModalOpen(true); }}
                                                    className="p-3 text-white/10 hover:text-gold transition-colors"
                                                >
                                                    <Zap className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setSelectedUser(citizen); setIsEditModalOpen(true); }}
                                                className="p-3 bg-white/5 border border-white/5 rounded-xl hover:text-white transition-all"
                                            >
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

            {/* Sovereign Command Modal */}
            {isEditModalOpen && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsEditModalOpen(false)} />
                    <div className="w-full max-w-2xl bg-[#020202] border border-white/10 rounded-[3rem] p-10 relative z-10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -z-10" />

                        <header className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-5 h-5 text-gold animate-pulse" />
                                <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">Imperial Command Unit</span>
                            </div>
                            <h2 className="font-serif text-4xl italic text-white leading-tight">
                                Citizen: <span className="gold-text-gradient">{selectedUser.full_name || selectedUser.email}</span>
                            </h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* Tier Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 font-black px-2">Access Tier (Testing Academy)</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'].map((tier) => (
                                        <button
                                            key={tier}
                                            onClick={() => handleUpdateUser({ plan_tier: tier })}
                                            disabled={isSaving}
                                            className={`px-6 py-4 rounded-2xl border text-[10px] uppercase tracking-[0.2em] font-black transition-all flex items-center justify-between group ${selectedUser.plan_tier === tier
                                                ? 'bg-gold text-black border-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                                                : 'bg-white/5 border-white/10 text-white/40 hover:border-gold/40 hover:text-white'
                                                }`}
                                        >
                                            {tier}
                                            {selectedUser.plan_tier === tier && <CheckCircle2 className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status & Founders */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-black px-2">Social Status</label>
                                    <div className="flex gap-2">
                                        {['active', 'paused', 'canceled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateUser({ subscription_status: status })}
                                                disabled={isSaving}
                                                className={`flex-1 py-4 rounded-2xl border text-[9px] uppercase tracking-widest font-black transition-all ${selectedUser.subscription_status === status
                                                    ? 'bg-white/20 border-white/40 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/20 hover:border-white/20'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleUpdateUser({ is_founder: !selectedUser.is_founder })}
                                    disabled={isSaving}
                                    className={`w-full py-5 rounded-2xl border text-[10px] uppercase tracking-[0.3em] font-black transition-all flex items-center justify-center gap-3 ${selectedUser.is_founder
                                        ? 'bg-gold/10 border-gold/40 text-gold'
                                        : 'bg-white/5 border-white/10 text-white/20'
                                        }`}
                                >
                                    <Star className={`w-4 h-4 ${selectedUser.is_founder ? 'fill-gold' : ''}`} />
                                    Founder Rights: {selectedUser.is_founder ? 'Active' : 'Missing'}
                                </button>

                                <button
                                    onClick={handleDeleteUser}
                                    disabled={isSaving}
                                    className="w-full py-5 rounded-2xl border border-red-500/10 bg-red-500/5 text-red-500/40 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 mt-4"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Purge Citizen
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-8 border-t border-white/5">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            >
                                Close Command Center
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Temporary internal component for the activity icon
function Activity({ className }: { className?: string }) {
    return <ActivityIcon className={className} />;
}
import { Activity as ActivityIcon } from 'lucide-react';
