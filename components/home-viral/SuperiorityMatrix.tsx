"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Flame, Shield, User, Bot, Zap, TrendingUp, Infinity, Clock } from 'lucide-react';

/**
 * Superiority Matrix Component
 * 
 * COMPARISON: VirtualTwin vs. Traditional Bots vs. Human VAs
 * 
 * ELITE DESIGN: Glassmorphism table, clear vertical differentiation
 */
export default function SuperiorityMatrix() {
    const features = [
        {
            name: "Tecnologia",
            vt: "Neural Identity (Sovereign)",
            bot: "Chatbot a flussi (ManyChat)",
            va: "Interazione manuale",
            icon: Zap
        },
        {
            name: "Setup & Training",
            vt: "10 Minuti (Zero Code)",
            bot: "Settimane (Hard coding)",
            va: "Mesi (Recruiting + Onboarding)",
            icon: Clock
        },
        {
            name: "Qualità del Pensiero",
            vt: "Creatività Strategica (Tu 100%)",
            bot: "Dati statici / Robotico",
            va: "Variabile (Dipende dall'umore)",
            icon: Shield
        },
        {
            name: "Integrazione",
            vt: "Nativa (WhatsApp / IG / CRM)",
            bot: "Complessa / Spesso interrotta",
            va: "Lenta e frammentata",
            icon: TrendingUp
        },
        {
            name: "Impatto Economico",
            vt: "ROI Immediato (Costo fisso)",
            bot: "Basso costo (Basso valore)",
            va: "Stipendio Mensile (Costo alto)",
            icon: Zap
        },
        {
            name: "Scalabilità",
            vt: "Infinita (1000 conversazioni/sec)",
            bot: "Limitata dai flussi",
            va: "Zero (Richiede assunzioni)",
            icon: Infinity
        }
    ];

    return (
        <section className="relative py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-6 block">Il Verdetto del Mercato 2026</span>
                    <h2 className="font-serif text-4xl md:text-7xl text-charcoal mb-8 leading-[1.1] tracking-tighter">
                        Oltre il <br />
                        <span className="text-gold italic">Giocattolo Tech.</span>
                    </h2>
                    <p className="text-xl text-charcoal/30 max-w-3xl mx-auto italic font-light">
                        "VirtualTwin non è un'alternativa a ManyChat. È l'evoluzione definitiva del tuo business che trascende i limiti dei flussi rigidi e dell'errore umano."
                    </p>
                </div>

                {/* Matrix Table */}
                <div className="max-w-6xl mx-auto">
                    <div className="overflow-x-auto rounded-[3rem] border border-charcoal/5 shadow-3xl bg-white/50 backdrop-blur-3xl">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-charcoal/5">
                                    <th className="py-10 px-8 text-charcoal/30 text-[10px] uppercase tracking-widest font-black">Caratteristica</th>
                                    <th className="py-10 px-8 bg-gold/10 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                                                <Flame className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gold text-lg font-serif italic font-bold">VirtualTwin</span>
                                        </div>
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-gold text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl">Elite Path</div>
                                    </th>
                                    <th className="py-10 px-8">
                                        <div className="flex items-center gap-3 text-charcoal/40">
                                            <Bot className="w-5 h-5" />
                                            <span className="text-sm uppercase tracking-widest font-bold">ManyChat / Std AI</span>
                                        </div>
                                    </th>
                                    <th className="py-10 px-8">
                                        <div className="flex items-center gap-3 text-charcoal/40">
                                            <User className="w-5 h-5" />
                                            <span className="text-sm uppercase tracking-widest font-bold">Human VA / Team</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature, i) => (
                                    <motion.tr
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="border-b border-charcoal/5 hover:bg-charcoal/[0.01] transition-colors"
                                    >
                                        <td className="py-8 px-8">
                                            <div className="flex items-center gap-4">
                                                <feature.icon className="w-4 h-4 text-gold/40" />
                                                <span className="font-medium text-charcoal/60">{feature.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-8 bg-gold/[0.05]">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-600" />
                                                <span className="font-bold text-charcoal italic">{feature.vt}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-8">
                                            <div className="flex items-center gap-2 text-charcoal/30">
                                                <X className="w-3 h-3" />
                                                <span className="text-sm">{feature.bot}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-8">
                                            <div className="flex items-center gap-2 text-charcoal/30">
                                                <X className="w-3 h-3" />
                                                <span className="text-sm">{feature.va}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final Callout */}
                <div className="mt-20 text-center">
                    <p className="text-charcoal/40 italic mb-8 max-w-xl mx-auto">
                        "I leader non decidono in base al costo, ma in base al valore. <br />
                        <strong className="text-charcoal">VirtualTwin è l'unico investimento che scala insieme al tuo genio."</strong>
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-charcoal text-white px-10 py-5 rounded-full border border-gold/20 hover:border-gold/50 transition-all font-serif italic text-lg shadow-xl"
                    >
                        Scegli l'Eccellenza.
                    </motion.button>
                </div>
            </div>
        </section>
    );
}
