'use client';

import React, { useState } from 'react';
import {
    School,
    Copy,
    Check,
    Send,
    MessageCircle,
    Target,
    Sparkles,
    ArrowRight,
    PlayCircle
} from 'lucide-react';

/**
 * Founder Academy Page
 * Private section for premium users to access growth templates
 */
export default function AcademyPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
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
            text: `Ciao [Nome]! 👋

Ho notato il tuo lavoro su [TOPIC/POST]. Impressionante.

Sto lanciando qualcosa che potrebbe interessarti... Te ne parlo se accetti?

Michael`
        },
        {
            id: 'real-estate-script',
            sector: 'Real Estate',
            title: 'Qualifica Immobiliare',
            target: 'Proprietari di immobili',
            icon: Target,
            text: `Buongiorno [Nome], 

Ho visto il suo annuncio per l'immobile in [Zona]. 

VirtualTwin sta aiutando le agenzie in zona a qualificare i lead automaticamente in 2 minuti. Le interesserebbe vedere come funziona?`
        },
        {
            id: 'coach-cold',
            sector: 'Coach/Consulenti',
            title: 'Scalabilità per Coach',
            target: 'Coach con molto traffico',
            icon: Send,
            text: `Ciao [Nome], 

Amiamo i tuoi contenuti! Gestire tutti i DM deve essere un incubo però... 😅

Ho creato un Clone AI che parla esattamente come te e chiude vendite mentre dormi. Lo testeresti gratuitamente?`
        },
        // ... more templates would be added here in a real scenario, applying the filter for UX
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
            <div className="space-y-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                    <h2 className="text-2xl font-serif text-charcoal italic">Script di Vendita & Outreach</h2>

                    {/* Sector Selector */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                        {sectors.map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveSector(s)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSector === s
                                    ? 'bg-gold text-white shadow-lg'
                                    : 'bg-charcoal/5 text-charcoal/40 hover:bg-gold/10 hover:text-gold'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredTemplates.map((tpl) => (
                        <div key={tpl.id} className="bg-white rounded-[2rem] overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-xl transition-all duration-500 group">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-charcoal/5 rounded-2xl flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                                            <tpl.icon className="w-5 h-5 text-charcoal/30 group-hover:text-gold transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest text-gold font-black mb-1">{tpl.target}</h4>
                                            <h3 className="text-lg font-serif italic text-charcoal">{tpl.title}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(tpl.id, tpl.text)}
                                        className={`p-3 rounded-xl transition-all duration-300 ${copiedId === tpl.id
                                            ? 'bg-green-500 text-white scale-110'
                                            : 'bg-charcoal/5 text-charcoal/30 hover:bg-gold hover:text-white'
                                            }`}
                                    >
                                        {copiedId === tpl.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="bg-charcoal/5 rounded-2xl p-6 font-mono text-xs text-charcoal/70 leading-relaxed whitespace-pre-wrap min-h-[160px]">
                                    {tpl.text}
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] text-charcoal/30 font-bold uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3" />
                                        Elite Script
                                    </div>
                                    <span className="text-[10px] text-charcoal/20">
                                        Caratteri: {tpl.text.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Tip */}
            <div className="mt-16 bg-gold-gradient p-10 lg:p-16 rounded-[3rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h2 className="text-3xl lg:text-4xl font-serif italic mb-6">Il Segreto del Successo? <br />La Personalizzazione.</h2>
                        <p className="text-white/80 text-sm leading-relaxed mb-8">
                            Non limitarti a incollare. Cita un risultato specifico del tuo prospect o un loro post recente.
                            Le persone comprano da persone, non da robot.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/30 transition-all">
                                <MessageCircle className="w-4 h-4" />
                                Telegram Privato
                            </button>
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/30 transition-all">
                                <Sparkles className="w-4 h-4" />
                                Discord Elite
                            </button>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-white text-gold rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">
                        Prenota Strategia 1:1
                    </button>
                </div>
            </div>
        </div>
    );
}
