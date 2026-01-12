"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot, Shield, Unlock, Moon, Zap, Infinity } from 'lucide-react';

/**
 * Wall of Hooks Component - LUXURY EDITION
 * 
 * ELITE DESIGN: Sophisticated palette, premium feel
 * 
 * Usage: Homepage sub-hero - headline library for Meta Ads
 */
export default function WallOfHooks() {
    const laws = [
        {
            text: "Presenza Neurale Permanente. Tu vivi. Il Genio espande l'Impero.",
            icon: Bot
        },
        {
            text: "Oltre il Bot. Oltre l'Umano. L'Identità che non conosce stanchezza.",
            icon: Infinity
        },
        {
            text: "Sovranità Temporale. Riprenditi l'energia che il mercato ti ha sottratto.",
            icon: Zap
        },
        {
            text: "L'Autorità è Silenziosa. Un'Intelligenza che agisce esattamente come te.",
            icon: Shield
        },
        {
            text: "L'Eccellenza non dorme. Massimizza l'impatto mentre ti rigeneri.",
            icon: Moon
        }
    ];

    return (
        <section className="relative z-10 py-16 bg-gradient-to-b from-champagne/30 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-8 block opacity-40">Leggi Universali dell'Impero Neurale</span>
                        <h2 className="font-serif text-4xl md:text-8xl text-charcoal mb-8 leading-[0.9] tracking-tighter">
                            La Struttura della <br />
                            <span className="text-gold italic">Tua Nuova Libertà.</span>
                        </h2>
                    </motion.div>

                    {/* Hooks Grid - LUXURY STYLE (Flexbox for centering) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                        {laws.map((law, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                {/* Neural Glow Background - PERSISTENT */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-gold/10 via-transparent to-champagne/5 blur-2xl opacity-100 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-1000" />

                                <div className="relative bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-12 transition-all duration-1000 hover:border-gold/50 hover:shadow-[0_40px_100px_-20px_rgba(212,175,55,0.2)] h-full flex flex-col justify-between overflow-hidden group">
                                    {/* Animated light beam - PERSISTENT SUBTLE */}
                                    <div className="absolute -left-full top-0 w-full h-full bg-gradient-to-r from-transparent via-gold/5 to-transparent skew-x-12 animate-[shine_8s_ease-in-out_infinite]" />

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center mb-10 group-hover:from-gold group-hover:to-gold/80 transition-all duration-700 shadow-lg shadow-gold/5">
                                        <law.icon className="w-8 h-8 text-gold/60 group-hover:text-white transition-all duration-700 group-hover:scale-110" />
                                    </div>

                                    <p className="text-charcoal/90 font-serif text-2xl leading-tight italic relative z-10 transition-colors duration-700">
                                        "{law.text}"
                                    </p>

                                    <div className="mt-12 group">
                                        <div className="h-[2px] w-24 bg-gradient-to-r from-gold/60 via-gold/20 to-transparent group-hover:w-full transition-all duration-1000 rounded-full" />
                                        <div className="mt-2 text-[8px] uppercase font-black text-gold tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity duration-1000">Verità Assoluta</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Usage Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-charcoal/50 text-sm italic">
                            💡 Ogni frase = Hook pronto per ads, headline, primary text
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

