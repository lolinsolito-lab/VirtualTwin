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
                                <div className="bg-white border border-charcoal/5 rounded-[2.5rem] p-12 transition-all duration-1000 hover:border-gold/30 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-charcoal/5 flex items-center justify-center mb-10 group-hover:bg-gold/10 transition-colors">
                                        <law.icon className="w-6 h-6 text-charcoal/20 group-hover:text-gold transition-colors" />
                                    </div>

                                    <p className="text-charcoal/80 font-serif text-2xl leading-tight italic">
                                        "{law.text}"
                                    </p>

                                    <div className="mt-12 h-[1px] w-8 bg-gold/20 group-hover:w-full transition-all duration-1000" />
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

