'use client';

import React, { useState, useRef } from 'react';
import {
    School,
    Copy,
    Check,
    Send,
    MessageCircle,
    Target,
    Sparkles,
    ArrowRight,
    PlayCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

/**
 * Founder Academy Page
 * Private section for premium users to access growth templates
 */
export default function AcademyPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const copyToClipboard = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const [activeSector, setActiveSector] = useState('Generale');

    const sectors = [
        'Generale', 'Real Estate', 'E-commerce', 'Coach/Consulenti',
        'Agenzie Marketing', 'SaaS', 'Fitness/Salute', 'HR/Recruiting',
        'Assicurazioni', 'Automotive', 'Beauty/Fashion', 'Food & Beverage',
        'Tech/Sviluppo', 'Arte/Design', 'Viaggi/Luxury'
    ];

    const videoLessons = [
        { id: 1, title: 'La Genesi del Clone AI', duration: '12:45', thumbnail: 'bg-gold/10' },
        { id: 2, title: 'Architettura delle Vendite', duration: '15:20', thumbnail: 'bg-charcoal/5' },
        { id: 3, title: 'Outreach Magnetico su LinkedIn', duration: '18:10', thumbnail: 'bg-gold/10' },
        { id: 4, title: 'Gestione Obiezioni via Chat', duration: '14:30', thumbnail: 'bg-charcoal/5' },
        { id: 5, title: 'Scaling: Da 1 a 100 Cloni', duration: '20:00', thumbnail: 'bg-gold/10' },
        { id: 6, title: 'Protocollo Sovrano: Mastery', duration: '25:00', thumbnail: 'bg-charcoal/5' }
    ];

    const templates = [
        {
            id: 'conn-caldo',
            sector: 'Generale',
            title: 'Richiesta Connessione (Calda)',
            target: 'Chi ti segue o interagisce',
            icon: Target,
            text: `Ciao [Nome]! 👋\n\nHo notato il tuo lavoro su [TOPIC/POST]. Impressionante.\n\nSto lanciando qualcosa che potrebbe interessarti... Te ne parlo se accetti?\n\nMichael`
        },
        {
            id: 'real-estate-script',
            sector: 'Real Estate',
            title: 'Qualifica Immobiliare',
            target: 'Proprietari di immobili',
            icon: Target,
            text: `Buongiorno [Nome], \n\nHo visto il suo annuncio per l'immobile in [Zona]. \n\nVirtualTwin sta aiutando le agenzie in zona a qualificare i lead automaticamente in 2 minuti. Le interesserebbe vedere come funziona?`
        },
        {
            id: 'coach-cold',
            sector: 'Coach/Consulenti',
            title: 'Scalabilità per Coach',
            target: 'Coach con molto traffico',
            icon: Send,
            text: `Ciao [Nome], \n\nAmiamo i tuoi contenuti! Gestire tutti i DM deve essere un incubo però... 😅\n\nHo creato un Clone AI che parla esattamente come te e chiude vendite mentre dormi. Lo testeresti gratuitamente?`
        },
    ];

    const filteredTemplates = templates.filter(t => t.sector === activeSector || activeSector === 'Generale');

    return (
        <div className="p-4 lg:p-12 max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                        <School className="w-5 h-5 text-gold" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">Founder Academy</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-serif text-charcoal mb-4 italic">Il Tuo Arsenale di <span className="gold-text-gradient">Crescita</span></h1>
                <p className="text-charcoal/50 max-w-2xl leading-relaxed">
                    Benvenuto nel club dei Founder. Qui trovi le armi segrete per acquisire i tuoi primi 10 clienti e scalare il tuo impero digitale.
                </p>
            </header>

            {/* Steps Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                    { step: '01', title: 'Outreach LinkedIn', desc: 'Usa i template qui sotto per connetterti con lead di alta qualità.' },
                    { step: '02', title: 'Demo Call', desc: 'Portali in call e mostra come il clone AI può liberare il loro tempo.' },
                    { step: '03', title: 'Beta Test', desc: 'Offri l\'accesso Founder gratuito in cambio di un video testimonial.' }
                ].map((item, i) => (
                    <div key={i} className="bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-charcoal/5 group hover:border-gold/20 transition-all duration-500">
                        <span className="text-4xl font-serif text-gold/20 mb-4 block group-hover:text-gold/40 transition-colors italic">{item.step}</span>
                        <h3 className="text-sm uppercase tracking-widest font-black text-charcoal mb-2">{item.title}</h3>
                        <p className="text-xs text-charcoal/40 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Video Masterclass Section */}
            <div className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-serif text-charcoal italic">Video Masterclass <span className="gold-text-gradient">Founder</span></h2>
                    <div className="flex-1 h-[1px] bg-charcoal/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoLessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-3xl border border-charcoal/5 overflow-hidden group hover:shadow-xl transition-all duration-500">
                            <div className={`aspect-video ${lesson.thumbnail} flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gold shadow-xl group-hover:scale-110 transition-transform duration-500 z-10">
                                    <PlayCircle className="w-8 h-8 fill-gold/10" />
                                </div>
                                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-[10px] font-bold">
                                    {lesson.duration}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] text-gold font-black uppercase tracking-widest">Lezione {lesson.id}</span>
                                </div>
                                <h4 className="text-charcoal font-serif italic text-lg">{lesson.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Templates Section */}
            <div className="flex flex-col gap-8 mb-16">
                <div className="flex items-end justify-between">
                    <h2 className="text-3xl font-serif text-charcoal italic tracking-tight">Script di Vendita & <span className="gold-text-gradient">Outreach</span></h2>
                    <div className="hidden lg:flex items-center gap-2 mb-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-gold/10 text-charcoal/30 hover:text-gold transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-gold/10 text-charcoal/30 hover:text-gold transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Elite Sector Selector */}
                <div className="relative group/tabs">
                    {/* Horizontal Fade Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-champagne via-champagne/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-champagne via-champagne/80 to-transparent z-10 pointer-events-none" />

                    <div
                        ref={scrollContainerRef}
                        className="flex items-center gap-3 overflow-x-auto py-4 px-12 scroll-smooth no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style jsx>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {sectors.map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveSector(s)}
                                className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 relative shadow-sm border ${activeSector === s
                                    ? 'text-white border-transparent scale-105 shadow-luxury-sm'
                                    : 'bg-white/60 text-charcoal/30 hover:bg-gold/5 hover:text-gold border-white/40'
                                    }`}
                            >
                                {activeSector === s && (
                                    <div className="absolute inset-0 gold-gradient rounded-full" />
                                )}
                                <span className="relative z-10">{s}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                    {filteredTemplates.map((tpl) => (
                        <div key={tpl.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-luxury-sm hover:shadow-luxury transition-all duration-700 group">
                            <div className="p-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-charcoal/5 rounded-[1.2rem] flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                                            <tpl.icon className="w-6 h-6 text-charcoal/30 group-hover:text-gold transition-all duration-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-1">{tpl.target}</h4>
                                            <h3 className="text-xl font-serif italic text-charcoal leading-tight">{tpl.title}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(tpl.id, tpl.text)}
                                        className={`p-4 rounded-2xl transition-all duration-500 ${copiedId === tpl.id
                                            ? 'bg-green-500 text-white scale-110 shadow-lg'
                                            : 'bg-charcoal/5 text-charcoal/20 hover:bg-gold hover:text-white hover:shadow-luxury-sm'
                                            }`}
                                    >
                                        {copiedId === tpl.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="bg-charcoal/[0.02] rounded-[1.5rem] p-8 font-mono text-[11px] text-charcoal/60 leading-relaxed whitespace-pre-wrap min-h-[180px] border border-charcoal/[0.03]">
                                    {tpl.text}
                                </div>

                                <div className="mt-8 flex items-center justify-between border-t border-charcoal/5 pt-6">
                                    <div className="flex items-center gap-3 text-[9px] text-charcoal/20 font-black uppercase tracking-[0.3em] font-sans">
                                        <Sparkles className="w-4 h-4 text-gold/40" />
                                        Sovereign Assets
                                    </div>
                                    <span className="text-[10px] text-charcoal/10 font-bold">
                                        BYTES: {tpl.text.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Tip */}
            <div className="mt-16 bg-gold-gradient p-12 lg:p-20 rounded-[4rem] text-white overflow-hidden relative shadow-luxury">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="max-w-2xl text-center lg:text-left">
                        <h2 className="text-4xl lg:text-5xl font-serif italic mb-8 leading-[1.1]">La Genesi del Successo è nella <span className="text-white/40">Personalizzazione.</span></h2>
                        <p className="text-white/70 text-base font-serif italic leading-relaxed mb-10 max-w-xl">
                            "Non limitarti a incollare. Cita un risultato specifico del tuo prospect o un loro post recente. Le persone comprano da persone, non da spettatori passivi."
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-5">
                            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-white/20 transition-all shadow-xl">
                                <MessageCircle className="w-5 h-5" />
                                Private Access (TG)
                            </button>
                            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-white/20 transition-all shadow-xl">
                                <Sparkles className="w-5 h-5" />
                                Discord Sovereignty
                            </button>
                        </div>
                    </div>
                    <button className="px-14 py-7 bg-white text-gold rounded-full font-black text-[12px] uppercase tracking-[0.4em] shadow-luxury hover:scale-105 transition-all duration-700 shrink-0">
                        Strategic Session 1:1
                    </button>
                </div>
            </div>
        </div>
    );
}
