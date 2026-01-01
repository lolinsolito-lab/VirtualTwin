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

type LogEntry = {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    category: string;
    message: string;
    user?: string;
};

export default function AdminLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([
        { id: '1', timestamp: '18:30:25', level: 'success', category: 'BILLING', message: 'Stripe webhook processed: invoice.paid', user: 'lordinsolito@gmail.com' },
        { id: '2', timestamp: '18:30:12', level: 'info', category: 'AI_CLONE', message: 'Gemini-1.5-Pro response generated (1.2s)', user: 'marco@agency.it' },
        { id: '3', timestamp: '18:29:45', level: 'warn', category: 'SECURITY', message: 'Rate limit threshold reached (80%)', user: 'system' },
        { id: '4', timestamp: '18:29:10', level: 'info', category: 'USER', message: 'New Beta Signup: alessia@marketing.it', user: 'alessia@marketing.it' },
        { id: '5', timestamp: '18:28:30', level: 'error', category: 'WHATSAPP', message: 'Message delivery failed: invalid recipient', user: 'paolo@ecom.it' },
        { id: '6', timestamp: '18:27:15', level: 'success', category: 'AUTH', message: 'SuperAdmin login detected', user: 'lordinsolito@gmail.com' },
        { id: '7', timestamp: '18:26:00', level: 'info', category: 'API', message: 'Stripe pricing sync completed', user: 'system' },
    ]);

    return (
        <div className="p-8 lg:p-12 font-mono">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-gold/30"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Live Telemetry</span>
                </div>
                <h1 className="font-serif text-5xl italic text-white leading-tight font-sans">
                    System <span className="gold-text-gradient">Logs.</span>
                </h1>
            </header>

            {/* Log Controls */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                        type="text"
                        placeholder="Filter logs by message, user or category..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs text-gold outline-none focus:border-gold/40 transition-all placeholder:text-white/10"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4" />
                        Export JSON
                    </button>
                    <div className="h-4 w-[1px] bg-white/10 mx-2" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-widest text-green-500/60 font-black">Streaming Online</span>
                    </div>
                </div>
            </div>

            {/* Terminal View */}
            <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="bg-white/[0.02] px-8 py-4 border-b border-white/5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black ml-4">admin@sovereign:~/telemetry</span>
                </div>

                <div className="p-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                    <div className="space-y-1">
                        {logs.map((log) => (
                            <div key={log.id} className="flex gap-6 py-2 px-4 hover:bg-white/[0.02] transition-colors group rounded-lg">
                                <span className="text-white/20 text-[10px] tabular-nums whitespace-nowrap min-w-[70px] pt-0.5">{log.timestamp}</span>

                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded min-w-[100px] text-center h-fit pt-1 
                                    ${log.level === 'success' ? 'bg-green-500/10 text-green-500' :
                                        log.level === 'error' ? 'bg-red-500/10 text-red-500' :
                                            log.level === 'warn' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-blue-500/10 text-blue-400'}`}>
                                    {log.category}
                                </span>

                                <div className="flex-1">
                                    <p className={`text-[11px] leading-relaxed ${log.level === 'error' ? 'text-red-400/80' : 'text-white/60'}`}>
                                        {log.message}
                                    </p>
                                    {log.user && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="w-3 h-3 text-white/10" />
                                            <span className="text-[9px] text-gold/40 hover:text-gold cursor-pointer transition-colors uppercase tracking-tight">{log.user}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-white/10 hover:text-white p-1">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Recursive entry simulation line */}
                        <div className="flex gap-6 py-2 px-4 animate-pulse">
                            <span className="text-white/5 text-[10px] tabular-nums min-w-[70px]">18:30:26</span>
                            <div className="h-4 w-24 bg-white/5 rounded" />
                            <div className="h-4 flex-1 bg-white/5 rounded max-w-md" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Insight */}
            <div className="mt-12 flex items-center justify-between p-8 bg-gold text-black rounded-[2rem] shadow-[0_20px_40px_rgba(212,175,55,0.2)]">
                <div className="flex items-center gap-6">
                    <Terminal className="w-10 h-10" />
                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-[10px] mb-1">Live Intelligence Status</h5>
                        <p className="font-serif text-2xl italic leading-none">System is stable. No critical failures detected.</p>
                    </div>
                </div>
                <div className="hidden lg:block text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 opacity-40">Packet Flux</p>
                    <p className="text-xl font-bold">1.2 GB/s</p>
                </div>
            </div>
        </div>
    );
}
