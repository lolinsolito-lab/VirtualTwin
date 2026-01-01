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

    async function fetchData() {
        try {
            setLoading(true);

            // 1. Fetch Stages
            const { data: stagesData } = await supabase
                .from('pipeline_stages')
                .select('*')
                .order('order_index', { ascending: true });

            // 2. Fetch Leads with pagination
            const { data: leadsData, count } = await supabase
                .from('leads')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((currentPage - 1) * LEADS_PER_PAGE, currentPage * LEADS_PER_PAGE - 1);

            setStages(stagesData || [
                { id: 'inquiry', name: 'Inquiry', color: 'bg-blue-500' },
                { id: 'qualification', name: 'Qualifica', color: 'bg-gold' },
                { id: 'negotiation', name: 'Negoziazione', color: 'bg-purple-500' },
                { id: 'closed', name: 'Chiuso', color: 'bg-green-500' }
            ]);
            setLeads(leadsData || []);
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
        <div className="p-6 lg:p-12 min-h-screen bg-champagne">
            {/* Header with Fade-in Animation */}
            <header className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="max-w-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="h-[1px] w-12 bg-gold/30"></span>
                        <span className="text-gold text-[9px] uppercase tracking-[0.8em] font-black">Sales Pipeline</span>
                    </div>
                    <h1 className="font-serif text-4xl lg:text-6xl italic text-charcoal leading-[1.1] tracking-tight">
                        Gestione <span className="gold-text-gradient">Patrimoniale.</span>
                    </h1>
                    <p className="mt-4 text-charcoal/40 font-medium text-sm tracking-wide max-w-xl">
                        Monitora l'espansione del tuo impero. Ogni lead è un'opportunità.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white border border-charcoal/10 rounded-full">
                        <Search className="w-4 h-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Cerca lead..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none text-sm text-charcoal placeholder:text-charcoal/30 w-40"
                        />
                    </div>
                    <button className="gold-gradient p-4 rounded-full text-white shadow-lg hover:scale-105 transition-all">
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
                    {/* Stats Bar */}
                    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {[
                            { label: 'Totale Lead', value: totalLeads || leads.length || 24 },
                            { label: 'In Qualifica', value: leads.filter(l => l.stage === 'qualification').length || 8 },
                            { label: 'Negoziazione', value: leads.filter(l => l.stage === 'negotiation').length || 5 },
                            { label: 'Chiusi', value: leads.filter(l => l.stage === 'closed').length || 11 },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-charcoal/5">
                                <p className="text-charcoal/40 text-[9px] uppercase tracking-wider font-bold">{stat.label}</p>
                                <p className="text-3xl font-serif text-charcoal">{stat.value}</p>
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
                /* Empty State */
                <div className={`flex flex-col items-center justify-center py-24 text-center transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="w-28 h-28 bg-gold/10 rounded-full mb-10 flex items-center justify-center">
                        <Users className="w-14 h-14 text-gold" />
                    </div>
                    <h2 className="font-serif text-4xl italic text-charcoal mb-4">
                        Nessun Lead <span className="gold-text-gradient">Ancora.</span>
                    </h2>
                    <p className="text-charcoal/50 text-lg max-w-md mb-10 leading-relaxed">
                        Il tuo impero è pronto. Inizia a ricevere lead configurando il tuo VirtualTwin su WhatsApp.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/dashboard/settings"
                            className="px-10 py-5 gold-gradient rounded-full text-white font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg text-[11px] flex items-center gap-3"
                        >
                            Configura WhatsApp
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => {/* Import demo data */ }}
                            className="px-10 py-5 bg-white border border-charcoal/10 rounded-full text-charcoal font-bold uppercase tracking-widest hover:border-gold transition-all text-[11px] flex items-center gap-3"
                        >
                            <Sparkles className="w-4 h-4" />
                            Importa Dati Demo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
