"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Zap, Sparkles, Share2 } from 'lucide-react';

/**
 * Viral Compare Mode Component
 * 
 * INFOGRAPHIC: Before vs. After VirtualTwin
 * Target: Social sharing / Quick proof.
 */
export default function ViralCompareMode() {
    return (
        <section className="py-24 bg-champagne/30">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-6 block">La Metamorfosi Data-Driven</span>
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6 leading-tight tracking-tighter">
                            La Tua <span className="text-gold italic">Nuova Era.</span>
                        </h2>
                    </div>

                    {/* Compare Card - "Screenshot-Ready" */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[3rem] shadow-3xl border border-charcoal/5 overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2">
                            {/* BEFORE */}
                            <div className="p-12 bg-charcoal/5 border-r border-charcoal/5">
                                <div className="flex items-center gap-3 mb-8 opacity-40">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-widest text-charcoal">Il Vecchio Mondo</span>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-end gap-4">
                                        <div className="text-5xl font-serif text-charcoal/30">😫</div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-charcoal/20 font-black mb-1">Stress Livello</p>
                                            <p className="text-xl font-bold text-charcoal/40 italic">Saturazione Totale</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-4">
                                        <div className="text-5xl font-serif text-charcoal/30">0</div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-charcoal/20 font-black mb-1">Ore Liberate</p>
                                            <p className="text-xl font-bold text-charcoal/40 italic">0h / Settimana</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-4">
                                        <div className="text-5xl font-serif text-charcoal/30">Manual</div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-charcoal/20 font-black mb-1">Gestione Lead</p>
                                            <p className="text-xl font-bold text-charcoal/40 italic">Persi nel caos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AFTER */}
                            <div className="p-12 bg-gradient-to-br from-gold/5 to-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles className="w-32 h-32 text-gold" />
                                </div>

                                <div className="flex items-center gap-3 mb-8">
                                    <Zap className="w-5 h-5 text-gold" />
                                    <span className="text-xs font-black uppercase tracking-widest text-gold">L'Era VirtualTwin</span>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex items-end gap-4">
                                        <div className="text-5xl font-serif text-gold">😎</div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gold/40 font-black mb-1">Stress Livello</p>
                                            <p className="text-xl font-bold text-charcoal italic">Serenità Totale</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-4">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            className="text-5xl font-serif text-gold"
                                        >
                                            15+
                                        </motion.div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gold/40 font-black mb-1">Ore Liberate</p>
                                            <p className="text-xl font-bold text-charcoal italic">Recuperate Ogni Settimana</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-4">
                                        <div className="text-5xl font-serif text-gold">AI</div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gold/40 font-black mb-1">Gestione Lead</p>
                                            <p className="text-xl font-bold text-charcoal italic">Chiusure 24/7</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer - CTA */}
                        <div className="bg-charcoal p-8 flex flex-col md:flex-row items-center justify-between text-white gap-6">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-gold" />
                                <span className="font-serif italic text-lg">+300% Produttività Digitale</span>
                            </div>
                            <button className="flex items-center gap-2 bg-gold/10 border border-gold/30 hover:bg-gold/20 text-gold px-6 py-3 rounded-full transition-all group">
                                <Share2 className="w-4 h-4 group-hover:scale-110" />
                                <span className="text-sm font-bold uppercase tracking-widest">Condividi il tuo Before/After</span>
                            </button>
                        </div>
                    </motion.div>

                    <p className="text-center mt-12 text-charcoal/20 text-[10px] uppercase tracking-[1em]">Strategia · Libertà · Risultato</p>
                </div>
            </div>
        </section>
    );
}
