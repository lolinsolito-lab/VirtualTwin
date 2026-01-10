"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Loader2, Sparkles, ArrowRight, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { KanbanBoard } from '@/components/dashboard/KanbanBoard';
import { supabase } from '@/lib/supabase';

export default function LeadsPage() {
    const [stages, setStages] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [inView, setInView] = useState(false);

    const LEADS_PER_PAGE = 20;

    useEffect(() => {
        setInView(true);
        fetchData();
    }, [currentPage]);

    const [statsCounts, setStatsCounts] = useState({
        total: 0,
        qualification: 0,
        negotiation: 0,
        closed: 0
    });

    async function fetchData() {
        try {
            setLoading(true);

            // 1. Fetch Conversations with pagination
            const { data: convData, count } = await supabase
                .from('conversations')
                .select('*', { count: 'exact' })
                .order('last_message_at', { ascending: false })
                .range((currentPage - 1) * LEADS_PER_PAGE, currentPage * LEADS_PER_PAGE - 1);

            // 2. Fetch specific counts for stats
            const { count: qualCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'qualified');
            const { count: negCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'converted');
            const { count: closedCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'closed');

            setStatsCounts({
                total: count || 0,
                qualification: qualCount || 0,
                negotiation: negCount || 0,
                closed: closedCount || 0
            });

            // Map conversations to leads format for the Kanban
            const leadsData = (convData || []).map(conv => ({
                id: conv.id,
                name: conv.contact_name || 'Prospect Anonimo',
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
            setTotalLeads(count || 0);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(totalLeads / LEADS_PER_PAGE);
    const hasData = leads.length > 0 || loading;

    return (
        <div className="p-4 md:p-8 lg:p-12 min-h-screen bg-champagne">
            {/* Header with Fade-in Animation */}
            <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-2xl flex-1 w-full">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                        <span className="h-[1px] w-12 bg-gold/30"></span>
                        <span className="text-gold text-[8px] md:text-[9px] uppercase tracking-[0.6em] md:tracking-[0.8em] font-black">Sales Pipeline</span>
                    </div>
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl italic text-charcoal leading-[1.1] tracking-tight">
                        Gestione <span className="gold-text-gradient">Patrimoniale.</span>
                    </h1>
                    <p className="mt-4 text-charcoal/40 font-serif italic text-sm md:text-lg tracking-wide max-w-xl border-l border-gold/20 pl-4 md:pl-6">
                        Monitora l'espansione del tuo impero. Ogni lead è un'opportunità.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial flex items-center gap-3 px-4 md:px-5 py-3 bg-white border border-charcoal/10 rounded-full shadow-sm">
                        <Search className="w-4 h-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Cerca lead..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-[12px] md:text-sm text-charcoal placeholder:text-charcoal/30 w-full sm:w-40"
                        />
                    </div>
                    <button className="gold-gradient p-3.5 md:p-4 rounded-full text-white shadow-lg hover:scale-105 transition-all flex-shrink-0">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {loading ? (
                <div className={`h-96 flex flex-col items-center justify-center gap-6 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                    <Loader2 className="w-12 h-12 text-gold animate-spin" />
                    <p className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Sincronizzazione d'Elite...</p>
                </div>
            ) : hasData ? (
                <>
                    {/* Stats Bar - Imperial Glass Shields */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {[
                            { label: 'Totale Lead', value: statsCounts.total, icon: Users },
                            { label: 'In Qualifica', value: statsCounts.qualification, icon: Sparkles },
                            { label: 'Negoziazione', value: statsCounts.negotiation, icon: ArrowRight },
                            { label: 'Chiusi', value: statsCounts.closed, icon: ChevronRight },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 relative group overflow-hidden shadow-luxury-sm">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.03] blur-2xl group-hover:bg-gold/[0.08] transition-colors" />
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-charcoal/40 text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-black">{stat.label}</p>
                                    <stat.icon className="w-3 h-3 md:w-4 md:h-4 text-gold/30" />
                                </div>
                                <p className="text-4xl md:text-5xl font-serif italic text-charcoal group-hover:scale-110 transition-transform duration-700 origin-left">{stat.value}</p>
                                <div className="w-8 h-[1px] bg-gold/30 mt-3 md:mt-4 group-hover:w-16 transition-all duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Kanban Board */}
                    <div className={`transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <KanbanBoard initialStages={stages} initialLeads={leads} />
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={`flex items-center justify-center gap-4 mt-12 transition-all duration-1000 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-3 rounded-full border border-charcoal/10 hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5 text-charcoal" />
                            </button>
                            <div className="flex items-center gap-2">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${currentPage === pageNum
                                                ? 'gold-gradient text-white'
                                                : 'bg-white border border-charcoal/10 text-charcoal hover:border-gold'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <span className="text-charcoal/40">...</span>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${currentPage === totalPages
                                                ? 'gold-gradient text-white'
                                                : 'bg-white border border-charcoal/10 text-charcoal hover:border-gold'
                                                }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-full border border-charcoal/10 hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-5 h-5 text-charcoal" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* Empty State - Aspirational Luxe */
                <div className={`flex flex-col items-center justify-center py-32 text-center transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative mb-12">
                        <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center animate-glow-pulse">
                            <Users className="w-16 h-16 text-gold" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-charcoal rounded-full flex items-center justify-center border-4 border-champagne shadow-luxury">
                            <Sparkles className="w-5 h-5 text-gold" />
                        </div>
                    </div>
                    <h2 className="font-serif text-4xl lg:text-5xl italic text-charcoal mb-6 tracking-tight leading-tight">
                        Il Tuo Impero <br /> <span className="gold-text-gradient">Attende Espansione.</span>
                    </h2>
                    <p className="text-charcoal/40 text-base max-w-md mb-12 leading-relaxed italic">
                        "La ricchezza non è solo accumulo, ma una pipeline in costante movimento verso l'eccellenza."
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                        <Link
                            href="/dashboard/channels"
                            className="px-12 py-5 gold-gradient rounded-full text-white font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-luxury text-[10px] flex items-center gap-4"
                        >
                            Attiva Canale WhatsApp
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => fetchData()}
                            className="px-12 py-5 bg-charcoal text-gold border border-gold/20 rounded-full font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all shadow-luxury text-[10px] flex items-center gap-4"
                        >
                            <Sparkles className="w-4 h-4" />
                            Aggiorna Neural Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
