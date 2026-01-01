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

    const templates = [
        {
            id: 'conn-caldo',
            title: 'Richiesta Connessione (Calda)',
            target: 'Chi ti segue o interagisce',
            icon: Target,
            text: `Ciao [Nome]! 👋

Ho notato il tuo lavoro su [TOPIC/POST]. Impressionante.

Sto lanciando qualcosa che potrebbe interessarti... Te ne parlo se accetti?

Michael`
        },
        {
            id: 'conn-fredda',
            title: 'Richiesta Connessione (Fredda)',
            target: 'Coach/Consulenti sconosciuti',
            icon: Send,
            text: `Ciao [Nome],

Vedo che lavori come [RUOLO] a [CITTÀ]. 

Sto cercando 10 professionisti per testare gratuitamente il mio nuovo progetto AI. Interessato a saperne di più?

Michael`
        },
        {
            id: 'follow-up-1',
            title: 'Primo Messaggio (Pitch)',
            target: 'Dopo 24h dall\'accettazione',
            icon: MessageCircle,
            text: `Grazie per la connessione, [Nome]! 🙏

Arrivo al punto: Sto lanciando VirtualTwin, un clone AI che risponde ai tuoi clienti su WhatsApp 24/7.

Cerco 10 Founder Beta che lo testino GRATIS in cambio di feedback onesto.

🎁 Cosa ottieni:
- Accesso lifetime al piano Pioneer (€97/mese, per te gratis)
- Setup personalizzato 1:1 con me
- Priorità sulle nuove features

📋 Cosa chiedo:
- 15 min per capire il tuo business
- Feedback brutalmente onesto
- Video testimonial se funziona

Ti interessa? Dimmi un giorno per una call veloce 📞`
        },
        {
            id: 'video-testimonial',
            title: 'Richiesta Testimonial',
            target: 'Dopo 7-14 giorni di uso',
            icon: PlayCircle,
            text: `[Nome], come sta andando con VirtualTwin?

Se stai vedendo risultati, ti chiedo un favore enorme: un video di 60 secondi dove racconti:

1. Prima: come gestivi i messaggi WhatsApp
2. Dopo: cosa è cambiato con VirtualTwin
3. A chi lo consiglieresti

Lo userò sul sito (con la tua faccia = trust enorme!). In cambio, ti sblocco una feature premium gratis per sempre.

Ci stai? 🎬`
        }
    ];

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

            {/* Templates Section */}
            <div className="space-y-12">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-serif text-charcoal italic">Script di Vendita & Outreach</h2>
                    <div className="flex-1 h-[1px] bg-charcoal/5" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {templates.map((tpl) => (
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
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                                LinkedIn Strategy
                            </div>
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                                B2B Growth
                            </div>
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
