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
    XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

export default function AdminUsers() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);

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

            if (data) setUsers(data);
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
                    <span className="text-white/40 text-[10px] uppercase tracking-[0.8em] font-black">Citizen Registry</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight">
                    User <span className="gold-text-gradient">Management.</span>
                </h1>
            </header>

            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Citizens', val: users.length, icon: Users, color: 'text-gold' },
                    { label: 'Active (7d)', val: '87', icon: Activity, color: 'text-green-400' },
                    { label: 'Founder Seats', val: '25/1000', icon: Star, color: 'text-gold' },
                    { label: 'At Risk', val: '3', icon: ShieldAlert, color: 'text-red-400' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group">
                        <div>
                            <p className="text-white/30 text-[8px] uppercase tracking-widest font-black mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-serif text-white">{stat.val}</h3>
                        </div>
                        <stat.icon className={`w-8 h-8 ${stat.color} opacity-20 group-hover:opacity-60 transition-opacity`} />
                    </div>
                ))}
            </div>

            {/* Users Table Container */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                {/* Table Header / Filter */}
                <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Cerca per nome, email o azienda..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase tracking-widest font-bold text-white hover:bg-white/10 transition-all">
                            <Filter className="w-4 h-4" />
                            Filtri
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold">User / Company</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold">Plan / Status</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold">Role</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((citizen, i) => (
                                <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-white font-serif italic text-lg shadow-luxury uppercase">
                                                {(citizen.full_name || citizen.email)[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{citizen.full_name || 'Prospect'}</p>
                                                <p className="text-[10px] text-white/30 uppercase tracking-tighter">{citizen.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gold">{citizen.plan_tier}</span>
                                            <div className="flex items-center gap-2">
                                                {citizen.subscription_status === 'active' ? (
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 text-red-500" />
                                                )}
                                                <span className="text-[9px] uppercase tracking-widest text-white/40">{citizen.subscription_status}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {citizen.is_super_admin ? (
                                            <span className="bg-gradient-to-r from-gold to-white text-black px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">SuperAdmin</span>
                                        ) : citizen.is_founder ? (
                                            <span className="bg-white/10 border border-gold/40 text-gold px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(212,175,55,0.2)]">Founder</span>
                                        ) : (
                                            <span className="text-white/20 text-[8px] font-bold uppercase tracking-widest">Normal Citizen</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:text-gold transition-all" title="Edit Permissions">
                                                <ShieldAlert className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:text-gold transition-all" title="Send Notification">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:text-red-500 transition-all" title="Suspend Account">
                                                <Trash2 className="w-4 h-4" />
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
                    <Zap className="w-6 h-6" />
                    Sovereign Override Zone
                </h4>
                <p className="text-white/30 text-sm max-w-2xl mb-8 leading-relaxed italic">
                    Utilizza questi strumenti con saggezza. Qui puoi forzare lo stato del sistema,
                    resettare limiti globali o gestire crisi di sistema in tempo reale.
                    Ogni azione verrà loggata permanentemente.
                </p>
                <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                        Reset Global Limits
                    </button>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                        Backup System DB
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
