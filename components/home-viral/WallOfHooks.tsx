"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Wall of Hooks Component
 * 
 * PUNCH LINES: Collection of extreme emotional hooks for ads reusability
 * 
 * Usage: Homepage sub-hero - headline library for Meta Ads
 */
export default function WallOfHooks() {
    const hooks = [
        {
            text: "Uno di Te Vive. L'Altro Vende 24/7.",
            icon: "⚡",
            gradient: "from-purple-600 to-violet-700"
        },
        {
            text: "Non è un Bot. Sei TU, Duplicato.",
            icon: "👥",
            gradient: "from-blue-600 to-indigo-700"
        },
        {
            text: "La Libertà Inizia Quando Non Sei Più Schiavo dello Smartphone.",
            icon: "🔓",
            gradient: "from-gold to-amber-600"
        },
        {
            text: "Il Tuo Venditore Più Bravo Non Dovrebbe Dormire.",
            icon: "🌙",
            gradient: "from-green-600 to-emerald-700"
        },
        {
            text: "Vendite Mentre Sogni. Non è Magia, è VirtualTwin.",
            icon: "✨",
            gradient: "from-pink-600 to-rose-700"
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-gold text-sm font-black uppercase tracking-wider">
                                Messaggi Chiave
                            </span>
                        </div>
                    </motion.div>

                    {/* Hooks Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hooks.map((hook, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className={`bg-gradient-to-br ${hook.gradient} rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}>
                                    {/* Icon */}
                                    <div className="text-6xl mb-4 opacity-20 group-hover:opacity-30 transition-opacity">
                                        {hook.icon}
                                    </div>

                                    {/* Hook Text */}
                                    <p className="text-white font-serif text-xl md:text-2xl font-bold leading-tight">
                                        {hook.text}
                                    </p>

                                    {/* Arrow indicator */}
                                    <div className="absolute top-4 right-4">
                                        <div className="w-3 h-3 bg-white/30 rounded-full" />
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
