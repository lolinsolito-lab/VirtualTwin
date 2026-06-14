"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, ChevronDown } from 'lucide-react';

/**
 * Plan Comparison Table - ELEGANT DIGITAL DESIGN
 * 
 * Interactive table with hover effects and mobile accordion
 */
export default function PlanComparisonTable() {
    const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

    const plans = [
        { name: "Curioso", color: "text-gray-600", bg: "bg-gray-100" },
        { name: "Solopreneur", color: "text-emerald-600", bg: "bg-emerald-100" },
        { name: "Entrepreneur", color: "text-amber-600", bg: "bg-amber-100", highlight: true },
        { name: "Conquistatore", color: "text-purple-600", bg: "bg-purple-100" },
        { name: "Imperatore", color: "text-gold", bg: "bg-gold/10" }
    ];

    const features = [
        {
            name: "Cloni AI",
            values: ["1 (demo)", "1", "3", "5", "15"],
            highlight: [false, false, true, false, false]
        },
        {
            name: "Messaggi/mese",
            values: ["100", "1K", "5K", "20K", "100K"],
            highlight: [false, false, true, false, false]
        },
        {
            name: "Canali integrati",
            values: ["—", "1", "3", "10", "25"],
            highlight: [false, false, true, false, false]
        },
        {
            name: "Knowledge Base",
            values: ["—", "10 doc", "50 doc", "∞", "∞"],
            highlight: [false, false, false, true, true]
        },
        {
            name: "A/B Testing",
            values: [false, false, true, true, true],
            isBoolean: true
        },
        {
            name: "API Access",
            values: [false, false, false, true, true],
            isBoolean: true
        },
        {
            name: "White-Label",
            values: [false, false, false, false, true],
            isBoolean: true
        },
        {
            name: "Academy",
            values: ["—", "—", "Mod 1-2", "Full", "Full + Cert"],
            highlight: [false, false, false, true, true]
        },
        {
            name: "Support",
            values: ["Community", "<48h", "<24h", "CSM", "Dedicato"],
            highlight: [false, false, false, true, true]
        },
        {
            name: "Servizio Setup Premium",
            values: ["€49 (Promo)*", "€49 (Promo)*", "€49 (Promo)*", "€49 (Promo)*", "Gratuito"],
            highlight: [false, false, false, false, true]
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white via-champagne/5 to-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Confronto Dettagliato</span>
                        </motion.span>
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4 tracking-tight">
                            Trova il Piano <span className="italic text-gold">Perfetto</span>
                        </h2>
                        <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                            Ogni business è unico. Scegli il tier che cresce con te.
                        </p>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-3xl shadow-2xl border border-charcoal/5 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-6 bg-charcoal text-white">
                                <div className="p-6 font-medium text-white/60 text-sm uppercase tracking-wider">
                                    Feature
                                </div>
                                {plans.map((plan, i) => (
                                    <div
                                        key={i}
                                        className={`p-6 text-center ${plan.highlight ? 'bg-gold/20' : ''}`}
                                    >
                                        <span className={`font-serif text-lg italic ${plan.highlight ? 'text-gold' : 'text-white/80'}`}>
                                            {plan.name}
                                        </span>
                                        {plan.highlight && (
                                            <span className="block text-[9px] mt-1 uppercase tracking-widest text-gold/80">⭐ Più scelto</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-charcoal/5">
                                {features.map((feature, rowIndex) => (
                                    <motion.div
                                        key={rowIndex}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: rowIndex * 0.05 }}
                                        className="grid grid-cols-6 hover:bg-charcoal/[0.02] transition-colors group"
                                    >
                                        <div className="p-5 font-medium text-charcoal flex items-center">
                                            {feature.name}
                                        </div>
                                        {feature.values.map((value, colIndex) => (
                                            <div
                                                key={colIndex}
                                                className={`p-5 text-center flex items-center justify-center ${plans[colIndex].highlight ? 'bg-amber-50/50' : ''
                                                    }`}
                                            >
                                                {feature.isBoolean ? (
                                                    value ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-green-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center">
                                                            <X className="w-4 h-4 text-charcoal/20" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className={`font-medium ${(feature.highlight as boolean[])?.[colIndex]
                                                            ? 'text-gold font-bold text-lg'
                                                            : value === '—' || value === '∞'
                                                                ? 'text-charcoal/30'
                                                                : 'text-charcoal/70'
                                                        }`}>
                                                        {value as string}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Accordion */}
                    <div className="lg:hidden space-y-3">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden shadow-sm"
                            >
                                <button
                                    onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5"
                                >
                                    <span className="font-medium text-charcoal">{feature.name}</span>
                                    <ChevronDown className={`w-5 h-5 text-charcoal/40 transition-transform ${expandedFeature === index ? 'rotate-180' : ''
                                        }`} />
                                </button>

                                {expandedFeature === index && (
                                    <div className="px-5 pb-5 space-y-3">
                                        {plans.map((plan, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center justify-between p-3 rounded-xl ${plan.bg}`}
                                            >
                                                <span className={`font-medium ${plan.color}`}>{plan.name}</span>
                                                <span className="font-bold text-charcoal">
                                                    {feature.isBoolean ? (
                                                        feature.values[i] ? '✓' : '—'
                                                    ) : (
                                                        feature.values[i] as string
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Footnote */}
                    <div className="mt-8 text-center bg-white/40 p-4 rounded-2xl border border-charcoal/5 max-w-3xl mx-auto">
                        <p className="text-xs text-charcoal/50 leading-relaxed italic">
                            *Il <strong>Servizio Setup Premium</strong> (configurazione guidata chiavi, webhook, caricamento FAQ e addestramento iniziale curato dal nostro team di esperti) ha una tariffa standard di €99. In promozione speciale a <strong>€49</strong> solo per i primi 100 clienti. Incluso gratuitamente per il piano Imperatore.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
