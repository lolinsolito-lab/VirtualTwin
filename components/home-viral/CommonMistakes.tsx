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
    const mistakes = [
        {
            number: "1",
            title: "OSTRUZIONE: Risposta Reattiva vs Proattiva",
            icon: "⌛",
            stat: "Il 72% dei lead di alto livello cerca altrove se non riceve una risposta immediata",
            cost: "~€2.400/mese in opportunità perse",
            detail: "Mentre tu gestisci la tua vita, l'opportunità sfuma. L'eccellenza richiede una presenza che non conosce pause."
        },
        {
            number: "2",
            title: "OSTRUZIONE: Assenza di Filtro Strategico",
            icon: "🛡️",
            stat: "L'80% delle interazioni sono rumore cognitivo, non potenziale buyer",
            cost: "15 ore/settimana di energia dissipata",
            detail: "Filtrare manualmente i curiosi è un furto alla tua creatività. Il gemello seleziona solo l'élite."
        },
        {
            number: "3",
            title: "OSTRUZIONE: Erosione dell'Identità Digitale",
            icon: "💎",
            stat: "La conversione crolla quando il cliente non percepisce la tua autorità",
            cost: "-65% nel valore percepito del brand",
            detail: "I messaggi standard uccidono il desiderio. Senza la tua impronta, sei solo un altro numero sul mercato."
        },
        {
            number: "4",
            title: "OSTRUZIONE: Il Limite Biologico delle 24 Ore",
            icon: "📈",
            stat: "Il 30% del potenziale impatto arriva fuori dai ritmi convenzionali",
            cost: "Incalcolabile perdita di momentum",
            detail: "Il mercato non dorme. Se la tua crescita dipende dalla tua presenza fisica, hai un tetto, non un business."
        },
        {
            number: "5",
            title: "OSTRUZIONE: Tu sei il collo di bottiglia del tuo Impero",
            icon: "👑",
            stat: "Non puoi scalare oltre la tua capacità di attenzione",
            cost: "Saturazione cognitiva e stallo strategico",
            detail: "La crescita organica è soffocata dalla necessità della tua operatività costante. Fino a oggi."
        }
    ];

    return (
        <section id="problem" className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-champagne/10 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 border border-charcoal/10 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            <span className="text-charcoal/60 text-[10px] uppercase font-black tracking-widest">
                                Analysis & Diagnosis
                            </span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            5 Colli di Bottiglia <br /> <span className="text-gold italic">(Che Non Sono Colpa Tua)</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                            Il sistema tradizionale è rotto. Ecco dove perdi ossigeno (e vendite) ogni giorno.
                        </p>
                    </motion.div>

                    {/* Mistakes Grid - LUXURY STYLE */}
                    <div className="space-y-6">
                        {mistakes.map((mistake, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-charcoal/10 hover:shadow-2xl transition-all"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Number Badge - LUXURY */}
                                    <div className="md:w-32 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal/90 flex items-center justify-center p-8 relative overflow-hidden">
                                        {/* Subtle gold accent */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />

                                        <div className="text-center relative z-10">
                                            <div className="text-6xl mb-2 opacity-20">
                                                {mistake.icon}
                                            </div>
                                            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl flex items-center justify-center">
                                                <span className="text-white text-3xl font-black font-serif">
                                                    {mistake.number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <X className="w-5 h-5 text-red-700" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-serif text-charcoal font-bold mb-2">
                                                    {mistake.title}
                                                </h3>
                                                <p className="text-charcoal/70 leading-relaxed mb-4">
                                                    {mistake.detail}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Stats - LUXURY STYLE */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-600 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-start gap-2">
                                                    <TrendingDown className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs uppercase font-black text-red-800 mb-1 tracking-wide">
                                                            STAT DRAMMATICO
                                                        </p>
                                                        <p className="text-charcoal/80 font-bold text-sm">
                                                            {mistake.stat}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-orange-600 rounded-xl p-4 shadow-sm">
                                                <div className="flex items-start gap-2">
                                                    <Euro className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs uppercase font-black text-orange-800 mb-1 tracking-wide">
                                                            COSTO REALE
                                                        </p>
                                                        <p className="text-charcoal/80 font-bold text-sm">
                                                            {mistake.cost}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Solution CTA - LUXURY */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 bg-gradient-to-br from-gold/5 via-champagne/10 to-white rounded-3xl p-10 border-2 border-gold/30 text-center shadow-xl"
                    >
                        <h3 className="text-3xl font-serif text-charcoal mb-4">
                            La Trasformazione? <span className="text-gold italic">L'Eleganza della Presenza Infinita</span>
                        </h3>
                        <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
                            Risposte indistinguibili. Qualifica strategica. Operatività 24/7.<br />
                            <strong className="text-charcoal">Il tuo gemello protegge il tuo tempo, mentre tu espandi la tua visione.</strong>
                        </p>

                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-charcoal rounded-xl font-black text-lg uppercase tracking-wider hover:bg-amber-400 transition-all shadow-2xl hover:scale-105"
                        >
                            Libera il Tuo Potenziale Ora
                        </a>

                        <p className="text-charcoal/50 text-sm mt-6 italic">
                            Integrazione in 10 minuti • Preserva la tua Energia • 14 giorni di prova d'Élite
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
