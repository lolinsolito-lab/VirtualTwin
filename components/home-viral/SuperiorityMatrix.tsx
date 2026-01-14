"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Headphones, Bot, Crown, ArrowRight, Sparkles, Clock, Euro, AlertTriangle } from 'lucide-react';

/**
 * Superiority Matrix Component - 2026 COMPARISON + SETUP SECTION
 * 
 * Quantified time/money for competitors + Setup pro/contra section
 */
export default function SuperiorityMatrix() {
    const competitors = [
        {
            category: "Marketing Automation",
            example: "ManyChat",
            icon: Zap,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            objective: "Conversione e Vendita",
            usp: "Automazione massiva su Instagram/WhatsApp",
            interaction: "Ibrida: Pulsanti, menu e risposte AI guidate",
            limits: [
                { text: "Flussi rigidi e robotici", icon: "❌" },
                { text: "Setup: 40+ ore di lavoro", icon: "⏱️" },
                { text: "€50-200/mese + consulente", icon: "💸" }
            ]
        },
        {
            category: "Customer Support",
            example: "Zendesk / Tidio",
            icon: Headphones,
            color: "from-emerald-500 to-teal-500",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            objective: "Efficienza e Risoluzione",
            usp: "Integrazione con ticket e logistica",
            interaction: "Risolutiva: Basata su database di conoscenza",
            limits: [
                { text: "Non vende, solo risolve", icon: "❌" },
                { text: "Configurazione: settimane", icon: "⏱️" },
                { text: "€500+/mese enterprise", icon: "💸" }
            ]
        },
        {
            category: "AI Generiche",
            example: "Chatbot Standard",
            icon: Bot,
            color: "from-purple-500 to-violet-500",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            objective: "Assistenza generica",
            usp: "Risposte basate su conoscenza generale",
            interaction: "Libera: Dialogo generico su ogni tema",
            limits: [
                { text: "Non conosce il TUO business", icon: "❌" },
                { text: "Ore di prompt engineering", icon: "⏱️" },
                { text: "O paghi un esperto €€€", icon: "💸" }
            ]
        }
    ];

    const virtualTwin = {
        category: "Clone AI Personalizzato",
        example: "VirtualTwin",
        icon: Crown,
        objective: "Vendita + Brand + Libertà",
        usp: "Risponde come risponderesti TU, vende 24/7, protegge il tuo brand",
        interaction: "Personale: È TE in versione digitale",
        features: [
            "Addestrato sulla TUA personalità",
            "Vende, qualifica e chiude",
            "24/7 su WhatsApp, Instagram, Messenger",
            "Setup in 10 minuti, zero codice"
        ]
    };

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-champagne/5 to-white overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Analisi Mercato 2026</span>
                    </span>
                    <h2 className="font-serif text-4xl md:text-7xl text-charcoal mb-6 leading-[1.1] tracking-tighter">
                        VirtualTwin vs. <br />
                        <span className="text-gold italic">Il Resto del Mondo.</span>
                    </h2>
                    <p className="text-xl text-charcoal/40 max-w-3xl mx-auto">
                        Non tutti i bot sono uguali. Ecco cosa perdi con la concorrenza.
                    </p>
                </motion.div>

                {/* Competitors Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {competitors.map((comp, index) => {
                        const Icon = comp.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative ${comp.bgColor} ${comp.borderColor} border rounded-3xl p-8 overflow-hidden group hover:shadow-lg transition-all`}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${comp.color} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-black">
                                            {comp.category}
                                        </p>
                                        <h3 className="text-lg font-serif italic text-charcoal">
                                            {comp.example}
                                        </h3>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-black mb-1">Obiettivo</p>
                                        <p className="text-charcoal font-medium">{comp.objective}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-black mb-1">Punto di Forza</p>
                                        <p className="text-charcoal/80 text-sm">{comp.usp}</p>
                                    </div>

                                    {/* Limits with icons */}
                                    <div className="pt-4 border-t border-charcoal/10">
                                        <p className="text-[9px] uppercase tracking-widest text-red-600/60 font-black mb-3">Cosa perdi</p>
                                        <ul className="space-y-2">
                                            {comp.limits.map((limit, i) => (
                                                <li key={i} className="text-red-700/80 text-sm flex items-center gap-2 font-medium">
                                                    <span className="text-base">{limit.icon}</span>
                                                    {limit.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* VirtualTwin - The Winner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative mb-16"
                >
                    <div className="absolute -inset-2 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-[3rem] blur-xl opacity-30" />
                    <div className="relative bg-charcoal rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
                                                  linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px'
                            }} />
                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center shadow-lg">
                                        <Crown className="w-8 h-8 text-charcoal" />
                                    </div>
                                    <div>
                                        <p className="text-gold text-[10px] uppercase tracking-widest font-black">
                                            Clone AI Personalizzato
                                        </p>
                                        <h3 className="text-3xl md:text-4xl font-serif italic text-white">
                                            VirtualTwin
                                        </h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full">
                                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                                    <span className="text-gold text-[10px] uppercase tracking-widest font-black">
                                        L'Unica Scelta
                                    </span>
                                </div>
                            </div>

                            {/* USP Grid */}
                            <div className="grid md:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-2">Obiettivo</p>
                                    <p className="text-2xl font-serif italic text-white">{virtualTwin.objective}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-black mb-2">Interazione</p>
                                    <p className="text-2xl font-serif italic text-gold">{virtualTwin.interaction}</p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                {virtualTwin.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <Check className="w-5 h-5 text-gold flex-shrink-0" />
                                        <span className="text-white/80 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <p className="text-white/40 italic text-center">
                                    "{virtualTwin.usp}"
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SETUP SECTION - Pro/Contra */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h3 className="font-serif text-3xl md:text-5xl text-charcoal mb-4 italic">
                            Non hai tempo di configurare?
                        </h3>
                        <p className="text-charcoal/50 text-lg">
                            Scegli come iniziare. Zero stress, zero codice.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Self Setup */}
                        <div className="p-8 bg-white rounded-3xl border-2 border-charcoal/10 hover:border-charcoal/20 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-charcoal/5 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-charcoal/60" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-black">Opzione 1</p>
                                    <h4 className="text-xl font-serif italic text-charcoal">Self-Setup</h4>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3 text-charcoal/70">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Incluso nel tuo piano</span>
                                </li>
                                <li className="flex items-center gap-3 text-charcoal/70">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>10 minuti di configurazione</span>
                                </li>
                                <li className="flex items-center gap-3 text-charcoal/70">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span>Guide e tutorial disponibili</span>
                                </li>
                            </ul>
                            <p className="text-charcoal/40 text-sm italic">
                                Perfetto se ami fare le cose da solo.
                            </p>
                        </div>

                        {/* Premium Setup */}
                        <div className="p-8 bg-gradient-to-br from-gold/10 to-amber-50 rounded-3xl border-2 border-gold/30 hover:border-gold/50 transition-all relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-charcoal text-[9px] font-black uppercase tracking-widest rounded-full">
                                Done-for-you
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-charcoal" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gold font-black">Opzione 2</p>
                                    <h4 className="text-xl font-serif italic text-charcoal">Setup Premium</h4>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3 text-charcoal">
                                    <Check className="w-4 h-4 text-gold" />
                                    <span className="font-medium">Configuriamo tutto noi in 48h</span>
                                </li>
                                <li className="flex items-center gap-3 text-charcoal">
                                    <Check className="w-4 h-4 text-gold" />
                                    <span className="font-medium">Training personalità + FAQ</span>
                                </li>
                                <li className="flex items-center gap-3 text-charcoal">
                                    <Check className="w-4 h-4 text-gold" />
                                    <span className="font-medium">Integrazione canali completa</span>
                                </li>
                                <li className="flex items-center gap-3 text-charcoal">
                                    <Check className="w-4 h-4 text-gold" />
                                    <span className="font-medium">Call 1:1 di onboarding</span>
                                </li>
                            </ul>
                            <div className="flex items-center justify-between">
                                <p className="text-charcoal font-serif text-2xl italic">
                                    €297 <span className="text-sm text-charcoal/50">una tantum</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center mt-12">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-white rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all border border-gold/20 hover:border-gold/40"
                        >
                            Vedi i Piani
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
