"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, TrendingDown, Euro } from 'lucide-react';

/**
 * Common Mistakes Component
 * 
 * EDUCATIONAL PAIN: 5 errors killing sales - amplify pain then offer solution
 * 
 * Usage: Homepage educational section - cold audience objection handling
 */
export default function CommonMistakes() {
    const failures = [
        {
            number: "I",
            title: "IL DECADIMENTO DELLA REATTIVITÀ",
            icon: "⌛",
            stat: "72% di perdita di opportunità",
            cost: "L'energia di un mese persa in un'ora",
            detail: "Mentre tu cerchi di vivere, il mercato ti punisce per il tuo bisogno di riposo. L'eccellenza non può essere reattiva. Deve essere onnipresente."
        },
        {
            number: "II",
            title: "L'INQUINAMENTO COGNITIVO",
            icon: "🛡️",
            stat: "80% di rumore irrilevante",
            cost: "15 ore settimanali di vita bruciata",
            detail: "Filtrare manualmente è un'offesa al tuo genio. Senza uno scudo neurale, sei solo un centralinista di te stesso."
        },
        {
            number: "III",
            title: "L'EROSIONE DELL'AUTORITÀ",
            icon: "💎",
            stat: "-65% valore del brand",
            cost: "La banalizzazione della tua visione",
            detail: "I bot standard distruggono la fiducia. Se la tua voce non è in ogni parola, la tua autorità scompare nel mare della mediocrità."
        },
        {
            number: "IV",
            title: "IL PARADOSSO BIOLOGICO",
            icon: "📈",
            stat: "Limite fisico invalicabile",
            cost: "Crescita soffocata dal riposo",
            detail: "Il mercato non si ferma mai. Il tuo corpo sì. Se il tuo successo richiede la tua interazione fisica, non sei un libero professionista, sei un prigioniero del tuo tempo."
        },
        {
            number: "V",
            title: "IL COLLO DI BOTTIGLIA DELL'ANIMA",
            icon: "👑",
            stat: "Saturazione del sé",
            cost: "Eclissi della visione strategica",
            detail: "Non puoi scalare oltre il perimetro della tua attenzione. Fino a quando non decidi di trascendere il tuo limite e diventare infinito."
        }
    ];

    return (
        <section id="problem" className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-champagne/10 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-8 block opacity-40">Diagnosi Clinica dello Status Quo</span>
                        <h2 className="font-serif text-5xl md:text-9xl text-charcoal mb-12 leading-[0.8] tracking-tighter">
                            L'Erosione del <br />
                            <span className="text-gold italic">Vecchio Mondo.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-charcoal/30 max-w-4xl mx-auto leading-relaxed font-light italic">
                            "Il sistema tradizionale è rotto alla radice. <br />
                            <strong className="text-charcoal/50 font-medium italic">Ecco dove stai perdendo la tua vita, un minuto alla volta."</strong>
                        </p>
                    </motion.div>

                    {/* Mistakes Grid - LUXURY STYLE */}
                    <div className="space-y-12">
                        {failures.map((mistake, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white/80 backdrop-blur-xl rounded-[3rem] p-12 border border-charcoal/5 hover:border-gold/40 transition-all duration-1000 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(212,175,55,0.1)]"
                            >
                                {/* Diagnostic Pulse Glow - ALWAYS VISIBLE */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-transparent to-red-500/10 pointer-events-none" />

                                <div className="absolute top-0 right-0 p-12 text-charcoal/[0.03] font-serif text-9xl leading-none transition-all duration-1000 group-hover:text-gold/10 group-hover:scale-110">
                                    {mistake.number}
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">{mistake.number}</span>
                                            <div className="h-[1px] w-24 bg-gold/40 group-hover:w-32 transition-all duration-1000" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-serif text-charcoal mb-6 italic tracking-tight">
                                            {mistake.title}
                                        </h3>
                                        <p className="text-xl text-charcoal/80 leading-relaxed italic mb-8 max-w-2xl">
                                            "{mistake.detail}"
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="p-6 rounded-3xl bg-red-50 border border-red-200/50 shadow-sm">
                                                <p className="text-[9px] uppercase font-black text-red-700/70 tracking-[0.4em] mb-2">Impatto</p>
                                                <p className="text-charcoal font-serif text-lg italic font-medium">{mistake.stat}</p>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200/50 shadow-sm">
                                                <p className="text-[9px] uppercase font-black text-amber-700/70 tracking-[0.4em] mb-2">Costo Esistenziale</p>
                                                <p className="text-charcoal font-serif text-lg italic font-medium">{mistake.cost}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Solution CTA - LUXURY */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 text-center"
                    >
                        <h4 className="font-serif text-4xl md:text-6xl text-charcoal mb-12 italic leading-tight">
                            "L'Eleganza è <span className="text-gold">Sottrazione.</span>"
                        </h4>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-charcoal text-white px-16 py-8 rounded-full border border-gold/20 hover:border-gold/50 transition-all duration-700 font-serif text-2xl italic shadow-2xl"
                        >
                            Trascendi il Limite Biologico.
                        </motion.button>

                        <p className="text-charcoal/20 text-[10px] uppercase tracking-[0.5em] mt-12 block">
                            Inizia la Metamorfosi · Wave Genesis
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
