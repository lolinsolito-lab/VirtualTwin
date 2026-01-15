"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Headphones, Bot, Crown, ArrowRight, Sparkles, Clock, Euro, AlertTriangle, Gift } from 'lucide-react';
import Image from 'next/image';

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
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
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
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
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
            color: "from-gray-400 to-gray-500",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
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
                                className={`relative ${comp.bgColor} ${comp.borderColor} border rounded-3xl p-8 overflow-hidden group hover:shadow-lg transition-all grayscale-[30%] opacity-90 hover:grayscale-0 hover:opacity-100`}
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
                    <div className="absolute -inset-4 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-[3rem] blur-2xl opacity-50 animate-pulse" />
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
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-gold/50">
                                        <Image
                                            src="/images/virtualtwin_icon.png"
                                            alt="VirtualTwin"
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
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

                {/* SETUP SECTION - Premium Only */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-charcoal rounded-full mb-6">
                            <Gift className="w-4 h-4" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Done-For-You · Su Appuntamento</span>
                        </span>
                        <h3 className="font-serif text-3xl md:text-5xl text-charcoal mb-4 italic">
                            Non hai tempo? <span className="text-gold">Ci pensiamo noi.</span>
                        </h3>
                        <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                            Il nostro team configura il tuo Clone in 48h con una call strategica dedicata. <br />
                            <strong className="text-charcoal/70">Tu ti godi i risultati.</strong>
                        </p>
                    </div>

                    {/* Premium Setup Card - Centered */}
                    <div className="p-10 bg-gradient-to-br from-charcoal via-charcoal to-black rounded-[2rem] border border-gold/30 relative overflow-hidden shadow-2xl">
                        {/* Background Glow */}
                        <div className="absolute -inset-4 bg-gold/20 rounded-[3rem] blur-3xl" />

                        {/* Concierge Image */}
                        <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-30">
                            <Image
                                src="/images/setup_premium.png"
                                alt="Setup Premium"
                                width={192}
                                height={192}
                                className="object-contain"
                            />
                        </div>

                        <div className="absolute top-4 right-4">
                            <span className="px-4 py-1.5 bg-gold text-charcoal text-[10px] font-black uppercase tracking-widest rounded-full">
                                Promo Wave · €99
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-2xl font-serif italic text-white mb-8">Setup Premium</h4>

                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                {[
                                    "Configurazione completa in 48h",
                                    "Training personalità + Tone of Voice",
                                    "Integrazione di tutti i canali",
                                    "Call 1:1 strategica di onboarding",
                                    "Importazione FAQ e knowledge base",
                                    "Test e ottimizzazione iniziale"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white/80">
                                        <Check className="w-5 h-5 text-gold flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
                                <div>
                                    <p className="text-white font-serif text-3xl italic">
                                        <span className="line-through text-white/30 text-xl">€297</span> €99
                                    </p>
                                    <p className="text-[11px] text-white/40 mt-1">Piani Starter e Creator. Altri piani da €197.</p>
                                </div>
                                <button
                                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-charcoal rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all"
                                >
                                    <Gift className="w-4 h-4" />
                                    Aggiungi al Piano
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
