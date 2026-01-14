"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Headphones, Bot, Crown, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Superiority Matrix Component - 2026 COMPARISON TABLE
 * 
 * 4 Categories: Marketing Automation, Customer Support, AI Conversazionale, VirtualTwin
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
            limits: ["Flussi rigidi e robotici", "Zero personalità", "Setup complesso"]
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
            limits: ["Non vende, risolve", "Impersonale", "Costoso per PMI"]
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
            limits: ["Non conosce il TUO business", "Zero personalità", "Nessun follow-up"]
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
                        Non tutti i bot sono uguali. Ecco cosa distingue ogni categoria.
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
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-charcoal/40 font-black mb-1">Interazione</p>
                                        <p className="text-charcoal/60 text-sm italic">{comp.interaction}</p>
                                    </div>

                                    {/* Limits */}
                                    <div className="pt-4 border-t border-charcoal/10">
                                        <p className="text-[9px] uppercase tracking-widest text-red-600/60 font-black mb-2">Limiti</p>
                                        <ul className="space-y-1">
                                            {comp.limits.map((limit, i) => (
                                                <li key={i} className="text-red-600/70 text-sm flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                                    {limit}
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
                    className="relative"
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
                                <p className="text-white/40 italic">
                                    "{virtualTwin.usp}"
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-charcoal rounded-full font-black uppercase tracking-widest text-sm shadow-xl"
                                >
                                    Inizia Ora
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
