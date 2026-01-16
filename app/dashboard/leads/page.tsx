"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, ArrowRight, Users, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { supabase } from '@/lib/supabase';

export default function LeadsPage() {
    const [stages, setStages] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const [statsCounts, setStatsCounts] = useState({
        total: 0,
        qualification: 0,
        negotiation: 0,
        closed: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);

            const { data: convData, count } = await supabase
                .from('conversations')
                .select('*', { count: 'exact' })
                .order('last_message_at', { ascending: false })
                .limit(50);

            const { count: qualCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'qualified');
            const { count: negCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'converted');
            const { count: closedCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'closed');

            setStatsCounts({
                total: count || 0,
                qualification: qualCount || 0,
                negotiation: negCount || 0,
                closed: closedCount || 0
            });

            const leadsData = (convData || []).map(conv => ({
                id: conv.id,
                name: conv.contact_name || 'Prospect',
                business: conv.contact_platform_id || 'Sandbox',
                stage: conv.status === 'active' ? 'inquiry' :
                    conv.status === 'qualified' ? 'qualification' :
                        conv.status === 'converted' ? 'negotiation' : 'closed',
                value: conv.conversion_value || 0,
                created_at: conv.created_at
            }));

            setStages([
                { id: 'inquiry', name: 'Inquiry', color: 'bg-blue-500' },
                { id: 'qualification', name: 'Qualifica', color: 'bg-gold' },
                { id: 'negotiation', name: 'Negoziazione', color: 'bg-purple-500' },
                { id: 'closed', name: 'Chiuso', color: 'bg-green-500' }
            ]);
            setLeads(leadsData);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    const hasData = leads.length > 0;

    return (
        <div className="h-[calc(100vh-60px)] flex flex-col bg-champagne overflow-hidden">
            {/* Compact Header */}
            <header className="flex-shrink-0 px-4 lg:px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-charcoal/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="h-[1px] w-8 bg-gold/30"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black">Pipeline</span>
                        </div>
                        <h1 className="font-serif text-2xl lg:text-3xl italic text-charcoal">
                            Gestione <span className="gold-text-gradient">Patrimoniale</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-charcoal/10 rounded-xl">
                            <Search className="w-4 h-4 text-charcoal/40" />
                            <input
                                type="text"
                                placeholder="Cerca..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent outline-none text-sm text-charcoal placeholder:text-charcoal/30 w-32"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-gold animate-spin" />
                </div>
            ) : hasData ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Stats Row - Compact */}
                    <div className="flex-shrink-0 px-4 lg:px-8 py-4">
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: 'Totale', value: statsCounts.total, icon: Users, color: 'text-charcoal' },
                                { label: 'Qualifica', value: statsCounts.qualification, icon: Target, color: 'text-gold' },
                                { label: 'Negoziazione', value: statsCounts.negotiation, icon: TrendingUp, color: 'text-purple-600' },
                                { label: 'Chiusi', value: statsCounts.closed, icon: CheckCircle, color: 'text-green-600' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-charcoal/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                        <span className="text-[9px] text-charcoal/40 uppercase tracking-wider font-bold">{stat.label}</span>
                                    </div>
                                    <p className={`text-2xl lg:text-3xl font-serif ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Kanban - Takes remaining space */}
                    <div className="flex-1 px-4 lg:px-8 pb-4 overflow-hidden">
                        <KanbanBoard initialStages={stages} initialLeads={leads} />
                    </div>
                </div>
            ) : (
                /* Empty State - Centered */
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-gold" />
                        </div>
                        <h2 className="font-serif text-3xl italic text-charcoal mb-4">
                            Pipeline <span className="gold-text-gradient">Vuota</span>
                        </h2>
                        <p className="text-charcoal/50 text-sm mb-8">
                            I lead appariranno qui quando il tuo AI Clone inizierà a conversare con i clienti.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard/channels"
                                className="px-8 py-3 gold-gradient rounded-xl text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                Attiva WhatsApp
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/dashboard/chat"
                                className="px-8 py-3 bg-charcoal text-gold rounded-xl font-bold text-xs uppercase tracking-widest"
                            >
                                Prova Sandbox
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
