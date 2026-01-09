"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Crown } from 'lucide-react';

/**
 * Scarcity Timeline Component
 * 
 * FOMO: Visual price escalation timeline
 * 
 * Usage: /founder page - pain amplification through pricing comparison
 */

export default function ScarcityTimeline() {
    const timeline = [
        {
            phase: "Genesis",
            spots: 20,
            dates: "Gen - Giu 2026",
            price: 697,
            status: "current",
            icon: "⚡",
            badge: "ORA",
            gradient: "from-gold to-amber-500"
        },
        {
            phase: "Pioneer",
            spots: 20,
            dates: "Lug - Dic 2026",
            price: 897,
            status: "upcoming",
            icon: "🚀",
            badge: "+€200/mo",
            gradient: "from-orange-500 to-amber-600"
        },
        {
            phase: "Elite",
            spots: 20,
            dates: "Gen - Giu 2027",
            price: 1097,
            status: "upcoming",
            icon: "💎",
            badge: "+€400/mo",
            gradient: "from-purple-500 to-violet-600"
        },
        {
            phase: "Public",
            spots: "∞",
            dates: "Lug 2027+",
            price: 1997,
            status: "final",
            icon: "🔴",
            badge: "+€1,300/mo",
            gradient: "from-red-600 to-rose-700"
        }
    ];

    const calculateLoss = (monthsDelay: number, priceIncrease: number) => {
        return (priceIncrease * 12 * 5).toLocaleString(); // 5 years
    };

    return (
        <section className="relative py-16 bg-gradient-to-b from-champagne/10 via-white to-champagne/10">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/5 border border-gold/20 rounded-full mb-6">
                            <TrendingUp className="w-4 h-4 text-gold" />
                            <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em]">
                                Price Escalation
                            </span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
                            Il Valore <span className="text-gold italic">Cresce</span>, <br />
                            La Finestra si <span className="text-gold italic">Chiude</span>
                        </h2>
                        <p className="text-lg text-charcoal/50 max-w-2xl mx-auto font-medium">
                            Il tempo è l&apos;unico asset che non puoi ricomprare. Agisci ora per proteggere il tuo investimento.
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="grid md:grid-cols-4 gap-4 mb-12">
                        {timeline.map((phase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${phase.status === 'current'
                                    ? 'ring-2 ring-gold shadow-2xl scale-105 z-10'
                                    : 'opacity-80 hover:opacity-100 grayscale-[0.5] hover:grayscale-0 shadow-lg'
                                    }`}
                            >
                                {/* Active Indicator */}
                                {phase.status === 'current' && (
                                    <div className="absolute top-0 right-0 bg-gold text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase z-10">
                                        ATTIVA
                                    </div>
                                )}

                                {/* Header */}
                                <div className={`h-32 flex flex-col items-center justify-center ${phase.status === 'current' ? 'bg-charcoal text-white' : 'bg-stone-100 text-charcoal/60'
                                    }`}>
                                    <div className="text-4xl mb-1">{phase.icon}</div>
                                    <h3 className="text-xl font-bold uppercase tracking-widest">{phase.phase}</h3>
                                    <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">{phase.dates}</p>
                                </div>

                                {/* Content */}
                                <div className="bg-white p-6 border-x border-b border-stone-200">
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-bold text-charcoal mb-1">
                                            €{phase.price}
                                        </div>
                                        <div className="text-[10px] text-charcoal/40 uppercase font-black tracking-widest">per mese</div>
                                    </div>

                                    <div className="bg-stone-50 rounded-xl p-3 mb-4">
                                        <p className="text-[10px] font-black text-charcoal/50 text-center uppercase tracking-widest">
                                            {phase.spots === "∞" ? "Accesso Pubblico" : `${phase.spots} Posti Limitati`}
                                        </p>
                                    </div>

                                    {index > 0 && (
                                        <div className="text-center">
                                            <p className="text-amber-600 font-black text-[10px] uppercase tracking-widest mb-1">
                                                {phase.badge}
                                            </p>
                                            <p className="text-charcoal/30 text-[9px] uppercase font-black tracking-widest">
                                                vs Genesis
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pain Calculation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-charcoal rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

                        <div className="relative z-10 text-center mb-10">
                            <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                                Il Costo dell&apos;<span className="text-gold italic">Esitazione</span>
                            </h3>
                            <p className="text-white/40 text-sm uppercase tracking-widest font-black">Proiezione di Perdita Economica (5 Anni)</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 relative z-10">
                            {/* 3 months wait */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-gold/30 transition-colors">
                                <p className="text-[10px] uppercase font-black text-white/40 mb-3 tracking-widest">
                                    Ritardo 3 Mesi (Pioneer)
                                </p>
                                <p className="text-3xl font-bold text-gold mb-1">
                                    - €12,000
                                </p>
                                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                                    capitale disperso
                                </p>
                            </div>

                            {/* 6 months wait */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-gold/30 transition-colors">
                                <p className="text-[10px] uppercase font-black text-white/40 mb-3 tracking-widest">
                                    Ritardo 6 Mesi (Elite)
                                </p>
                                <p className="text-3xl font-bold text-gold mb-1">
                                    - €24,000
                                </p>
                                <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                                    capitale disperso
                                </p>
                            </div>

                            {/* 1 year wait */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-gold/30 bg-gold/5 shadow-inner">
                                <p className="text-[10px] uppercase font-black text-gold mb-3 tracking-widest">
                                    Ritardo 1 Anno (Public)
                                </p>
                                <p className="text-3xl font-bold text-gold mb-1">
                                    - €78,000
                                </p>
                                <p className="text-gold/50 text-[10px] uppercase font-black tracking-widest">
                                    capitale disperso
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 text-center pt-8 border-t border-white/10">
                            <p className="text-lg text-white/60 italic font-serif">
                                &ldquo;L&apos;indecisione è la ladra del futuro. <span className="text-gold font-bold not-italic font-sans uppercase text-sm tracking-widest">Proteggi il tuo ingresso.</span>&rdquo;
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-12"
                    >
                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-xl font-black text-lg uppercase tracking-wider hover:bg-charcoal/90 transition-all shadow-2xl hover:scale-105"
                        >
                            <Crown className="w-5 h-5 text-gold" />
                            Blocca Il Prezzo Genesis
                        </a>
                        <p className="text-charcoal/50 text-sm mt-4 italic">
                            Solo 20 posti Genesis • Poi sale a €897/mo
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
