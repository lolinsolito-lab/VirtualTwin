"use client";

import React, { useState, useEffect } from 'react';
import {
    Terminal,
    Search,
    Filter,
    Download,
    Zap,
    ShieldCheck,
    AlertTriangle,
    Clock,
    User,
    ArrowRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type LogEntry = {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    category: string;
    message: string;
    user?: string;
};

export default function AdminLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRealTelemetry();
    }, []);

    const fetchRealTelemetry = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch Billing Events (Real synchronized logs)
            const { data: billing } = await supabase
                .from('billing_events')
                .select('id, event_type, amount, user_email, created_at')
                .order('created_at', { ascending: false })
                .limit(10);

            // 2. Fetch Latest Messages (for traffic pulse)
            const { data: messages } = await supabase
                .from('messages')
                .select('id, sender_type, created_at, conversations(lead_name)')
                .order('created_at', { ascending: false })
                .limit(10);

            const billingLogs: LogEntry[] = (billing || []).map(b => ({
                id: b.id,
                timestamp: new Date(b.created_at).toLocaleTimeString(),
                level: 'success',
                category: 'BILLING',
                message: `Stripe Event: ${b.event_type} - Amount: €${b.amount}`,
                user: b.user_email || 'System'
            }));

            const messageLogs: LogEntry[] = (messages || []).map(m => ({
                id: m.id,
                timestamp: new Date(m.created_at).toLocaleTimeString(),
                level: 'info',
                category: 'NEURAL_LINK',
                message: `Message ${m.sender_type === 'ai' ? 'SENT' : 'RECEIVED'} - Interacting with: ${(m.conversations as any)?.contact_name || 'Prospect'}`,
                user: m.sender_type === 'ai' ? 'Sensei AI' : 'External Lead'
            }));

            // Combine and sort
            const allLogs = [...billingLogs, ...messageLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
            setLogs(allLogs);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 lg:p-12 font-mono">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-gold/30"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Admin Telemetry</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight font-sans">
                    Live <span className="gold-text-gradient">Signals.</span>
                </h1>
            </header>

            {/* Log Controls */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="Scan neural packets..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-gold outline-none focus:border-gold/40 transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchRealTelemetry()}
                        className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all ${isLoading ? 'animate-pulse' : ''}`}
                    >
                        <Zap className="w-4 h-4" />
                        Refresh Matrix
                    </button>
                    <div className="h-4 w-[1px] bg-white/10 mx-2" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-[9px] uppercase tracking-[0.5em] text-green-500 font-black">Live Pulse</span>
                    </div>
                </div>
            </div>

            {/* Terminal View */}
            <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                <div className="bg-white/[0.02] px-8 py-4 border-b border-white/5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black ml-4">sovereign@root:~/empire_signals</span>
                </div>

                <div className="p-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                    {logs.length === 0 && !isLoading ? (
                        <div className="py-20 text-center">
                            <p className="text-white/10 text-xs uppercase tracking-[0.5em]">No signals detected in the current wave.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-6 py-3 px-5 hover:bg-white/[0.03] transition-colors group rounded-2xl border border-transparent hover:border-white/5">
                                    <span className="text-white/20 text-[10px] tabular-nums whitespace-nowrap min-w-[70px] pt-1">{log.timestamp}</span>

                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full min-w-[100px] text-center h-fit 
                                        ${log.level === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            log.level === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                log.level === 'warn' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                        {log.category}
                                    </span>

                                    <div className="flex-1">
                                        <p className={`text-[11px] leading-relaxed font-sans ${log.level === 'error' ? 'text-red-400/80' : 'text-white/70'}`}>
                                            {log.message}
                                        </p>
                                        {log.user && (
                                            <div className="flex items-center gap-2 mt-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <User className="w-3 h-3 text-gold" />
                                                <span className="text-[9px] text-gold uppercase tracking-tighter">{log.user}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Insight */}
            <div className="mt-12 flex items-center justify-between p-10 bg-gold text-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)]">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-black/10 rounded-2xl">
                        <Terminal className="w-10 h-10" />
                    </div>
                    <div>
                        <h5 className="font-black uppercase tracking-[0.4em] text-[10px] mb-2 opacity-60">Sovereign Matrix Status</h5>
                        <p className="font-serif text-3xl italic leading-none drop-shadow-sm">The pulse is steady, Sovereign.</p>
                    </div>
                </div>
                <div className="hidden lg:block text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">System Throughput</p>
                    <p className="text-3xl font-serif italic">1.4 TB/s</p>
                </div>
            </div>
        </div>
    );
}

