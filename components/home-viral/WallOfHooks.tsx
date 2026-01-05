"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Wall of Hooks Component - LUXURY EDITION
 * 
 * ELITE DESIGN: Sophisticated palette, premium feel
 * 
 * Usage: Homepage sub-hero - headline library for Meta Ads
 */
export default function WallOfHooks() {
    const hooks = [
        {
            text: "Uno di Te Vive. L'Altro Vende 24/7.",
            icon: "⚡"
        },
        {
            text: "Non è un Bot. Sei TU, Duplicato.",
            icon: "👥"
        },
        {
            text: "La Libertà Inizia Quando Non Sei Più Schiavo dello Smartphone.",
            icon: "🔓"
        },
        {
            text: "Il Tuo Venditore Più Bravo Non Dovrebbe Dormire.",
            icon: "🌙"
        },
        {
            text: "Vendite Mentre Sogni. Non è Magia, è VirtualTwin.",
            icon: "✨"
        }
    ];

    return (
        <section className="relative z-10 py-16 bg-gradient-to-b from-champagne/30 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold/40 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-gold text-sm font-black uppercase tracking-wider">
                                Messaggi Chiave
                            </span>
                        </div>
                    </motion.div>

                    {/* Hooks Grid - LUXURY STYLE (Flexbox for centering) */}
                    <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                        {hooks.map((hook, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
                            >
                                {/* Luxury Card */}
                                <div className="relative bg-gradient-to-br from-white via-champagne/20 to-champagne/40 border-2 border-charcoal/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] overflow-hidden">
                                    {/* Subtle top accent */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

                                    {/* Icon - Subtle */}
                                    <div className="text-5xl mb-4 opacity-20 group-hover:opacity-30 transition-opacity">
                                        {hook.icon}
                                    </div>

                                    {/* Hook Text */}
                                    <p className="text-charcoal font-serif text-xl md:text-2xl font-bold leading-tight">
                                        {hook.text}
                                    </p>

                                    {/* Gold corner accent */}
                                    <div className="absolute bottom-4 right-4">
                                        <div className="w-2 h-2 bg-gold rounded-full opacity-40 group-hover:opacity-60 transition-opacity" />
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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

