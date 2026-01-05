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
            dates: "Feb - Apr 2026",
            price: 697,
            status: "current",
            icon: "⚡",
            badge: "ORA",
            gradient: "from-gold to-amber-500"
        },
        {
            phase: "Pioneer",
            spots: 20,
            dates: "May - Jul 2026",
            price: 897,
            status: "upcoming",
            icon: "🚀",
            badge: "+€200/mo",
            gradient: "from-orange-500 to-amber-600"
        },
        {
            phase: "Elite",
            spots: 20,
            dates: "Aug - Oct 2026",
            price: 1097,
            status: "upcoming",
            icon: "💎",
            badge: "+€400/mo",
            gradient: "from-purple-500 to-violet-600"
        },
        {
            phase: "Public",
            spots: "∞",
            dates: "Nov 2026+",
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
        <section className="relative py-20 bg-gradient-to-b from-champagne/20 via-red-50/20 to-champagne/20">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border-2 border-red-300 rounded-full mb-6">
                            <AlertTriangle className="w-5 h-5 text-red-700" />
                            <span className="text-red-800 text-sm font-black uppercase tracking-wider">
                                Price Escalation
                            </span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            Ogni Trimestre Il Prezzo <span className="text-red-700 italic">Sale</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                            Chi aspetta paga di più. <strong className="text-charcoal">Per sempre.</strong>
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                        {timeline.map((phase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl overflow-hidden ${phase.status === 'current'
                                        ? 'ring-4 ring-gold shadow-2xl scale-105'
                                        : 'shadow-xl'
                                    }`}
                            >
                                {/* Badge */}
                                {phase.status === 'current' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white px-3 py-1 rounded-full text-xs font-black uppercase z-10">
                                        {phase.badge}
                                    </div>
                                )}

                                {/* Header */}
                                <div className={`bg-gradient-to-r ${phase.gradient} p-6 text-white text-center`}>
                                    <div className="text-5xl mb-2">{phase.icon}</div>
                                    <h3 className="text-2xl font-bold mb-1">{phase.phase}</h3>
                                    <p className="text-white/80 text-xs uppercase tracking-wider">{phase.dates}</p>
                                </div>

                                {/* Content */}
                                <div className="bg-white p-6">
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-charcoal mb-1">
                                            €{phase.price}
                                        </div>
                                        <div className="text-sm text-charcoal/60">per mese</div>
                                    </div>

                                    <div className="bg-charcoal/5 rounded-lg p-3 mb-3">
                                        <p className="text-xs font-bold text-charcoal/70 text-center">
                                            {phase.spots === "∞" ? "Posti Illimitati" : `${phase.spots} Posti Totali`}
                                        </p>
                                    </div>

                                    {index > 0 && (
                                        <div className="text-center">
                                            <p className="text-red-600 font-bold text-sm mb-1">
                                                {phase.badge}
                                            </p>
                                            <p className="text-charcoal/50 text-xs">
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
                        className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-200 rounded-3xl p-10 shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-serif text-charcoal mb-4">
                                Il Costo di <span className="text-red-700 italic">Aspettare</span>
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* 3 months wait */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-orange-200">
                                <p className="text-sm uppercase font-black text-orange-600 mb-2 tracking-wider">
                                    Aspetti 3 Mesi (Pioneer)
                                </p>
                                <p className="text-4xl font-bold text-orange-700 mb-2">
                                    +€12,000
                                </p>
                                <p className="text-charcoal/60 text-sm">
                                    persi in 5 anni vs Genesis
                                </p>
                            </div>

                            {/* 6 months wait */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
                                <p className="text-sm uppercase font-black text-purple-600 mb-2 tracking-wider">
                                    Aspetti 6 Mesi (Elite)
                                </p>
                                <p className="text-4xl font-bold text-purple-700 mb-2">
                                    +€24,000
                                </p>
                                <p className="text-charcoal/60 text-sm">
                                    persi in 5 anni vs Genesis
                                </p>
                            </div>

                            {/* 1 year wait */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-red-300 shadow-lg ring-2 ring-red-200">
                                <p className="text-sm uppercase font-black text-red-700 mb-2 tracking-wider">
                                    Aspetti 1 Anno (Public)
                                </p>
                                <p className="text-4xl font-bold text-red-700 mb-2">
                                    +€78,000
                                </p>
                                <p className="text-charcoal/60 text-sm">
                                    persi in 5 anni vs Genesis
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xl text-charcoal/80 italic">
                                "Ogni giorno che aspetti è denaro bruciato. <span className="text-red-700 font-bold not-italic">Per sempre.</span>"
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
