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
            title: "BOTTLENECK: Rispondi Quando Puoi, Non Quando Servono",
            icon: "⏰",
            stat: "72% dei lead abbandona dopo 5 minuti senza risposta",
            cost: "~€2.400/mese in vendite perse",
            detail: "Il competitor risponde in 2 minuti. Tu dopo 8 ore (perché sei umano). Chi vince?"
        },
        {
            number: "2",
            title: "BOTTLENECK: Nessun Filtro Automatico",
            icon: "📝",
            stat: "80% dei 'mi mandi info?' sono curiosi, non buyer",
            cost: "15 ore/settimana sprecate",
            detail: "Sprechi tempo con lead freddi che non comprano mai invece di chiudere deal caldi."
        },
        {
            number: "3",
            title: "BOTTLENECK: Template Freddi e Generici",
            icon: "📋",
            stat: "La conversione crolla quando il cliente sente il bot",
            cost: "-65% tasso di chiusura",
            detail: "Senza la tua impronta digitale, i messaggi restano sterili. La connessione si rompe."
        },
        {
            number: "4",
            title: "BOTTLENECK: Il Buio Notturno e del Weekend",
            icon: "🌙",
            stat: "30% delle vendite arrivano fuori orario lavorativo",
            cost: "€4-8K/mese lasciati sul tavolo",
            detail: "I lead non aspettano il lunedì mattina. Se non ci sei tu, comprano da chi c'è."
        },
        {
            number: "5",
            title: "BOTTLENECK: Tu sei l'imbuto del tuo business",
            icon: "🤯",
            stat: "Non puoi scalare oltre le tue 24 ore",
            cost: "Business bloccato, burnout assicurato",
            detail: "La crescita è limitata dalla tua presenza fisica. Fino a oggi."
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-champagne/10 to-white">
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
                        className="mt-16 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-champagne/20 rounded-3xl p-10 border-2 border-green-600/30 text-center shadow-xl"
                    >
                        <h3 className="text-3xl font-serif text-charcoal mb-4">
                            La Soluzione? <span className="text-green-700 italic">Un Gemello Che Non Sbaglia Mai</span>
                        </h3>
                        <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-8">
                            Risponde in 2 secondi. Qualifica automaticamente. Lavora 24/7. Non si stanca. Non perde messaggi.<br />
                            <strong className="text-charcoal">È te, moltiplicato.</strong>
                        </p>

                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-xl font-black text-lg uppercase tracking-wider hover:bg-charcoal/90 transition-all shadow-2xl hover:scale-105"
                        >
                            Elimina Questi Errori Ora
                        </a>

                        <p className="text-charcoal/50 text-sm mt-6 italic">
                            Setup 10 minuti • Recuperi il costo in 48h • 14 giorni gratis
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
