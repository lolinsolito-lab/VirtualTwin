"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

/**
 * Myth vs Reality Component
 * 
 * VIRAL-READY: Each myth/reality pair = 1 carousel slide or talking-head script
 * 
 * Usage: Educational carousels, objection-handling videos, contrarian content
 */
export default function MythVsReality() {
    const myths = [
        {
            myth: "Se non rispondi tu in prima persona, i lead non comprano",
            reality: "I lead comprano se ricevono risposta RAPIDA, CHIARA e COERENTE con la tua offerta. Il Clone replica il tuo modo di rispondere, ma in 2 secondi invece che in 2 ore.",
            icon: "💬"
        },
        {
            myth: "I bot fanno arrabbiare i clienti e rovinano la reputazione",
            reality: "Il problema non è il bot, è la risposta GENERICA. Un Clone addestrato sui tuoi contenuti e sulla tua voce sembra il tuo assistente personale, non un robot.",
            icon: "🤖"
        },
        {
            myth: "Serve essere tecnico o programmare per usare l'AI",
            reality: "VirtualTwin si attiva in 10 minuti rispondendo a 15 domande sul tuo business. Zero codice. Se sai usare WhatsApp, sai usare il Clone.",
            icon: "⚙️"
        },
        {
            myth: "L'AI sostituirà completamente il contatto umano",
            reality: "Il Clone gestisce le PRIME RISPOSTE e qualifica i lead. TU intervieni per chiudere e costruire la relazione. Risparmio tempo, non personalità.",
            icon: "🤝"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                            Miti Falsi sulla <span className="text-gold italic">Vendita AI</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
                            Le obiezioni più comuni (e perché sono sbagliate). Contenuto perfetto per educare il mercato.
                        </p>
                    </motion.div>

                    {/* Myth/Reality Cards - PERFECT FOR CAROUSEL */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {myths.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Myth Card (Top) */}
                                <div className="bg-red-50 border-2 border-red-200 rounded-t-3xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                                            <X className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm uppercase font-black text-red-600 mb-2 tracking-wider">
                                                ❌ MITO
                                            </h3>
                                            <p className="text-charcoal/80 font-medium leading-relaxed">
                                                "{item.myth}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider with Icon */}
                                <div className="relative h-8 flex items-center justify-center bg-gradient-to-r from-red-50 to-green-50">
                                    <div className="absolute w-16 h-16 bg-white border-4 border-charcoal/10 rounded-full flex items-center justify-center text-3xl">
                                        {item.icon}
                                    </div>
                                </div>

                                {/* Reality Card (Bottom) */}
                                <div className="bg-green-50 border-2 border-green-400 rounded-b-3xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm uppercase font-black text-green-700 mb-2 tracking-wider">
                                                ✅ REALTÀ
                                            </h3>
                                            <p className="text-charcoal/80 font-medium leading-relaxed">
                                                {item.reality}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Script Note for Video */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 border-2 border-gold/30 rounded-2xl p-8 text-center"
                    >
                        <h3 className="text-xl font-black text-charcoal mb-3">
                            🎬 Script Talking-Head (45 sec):
                        </h3>
                        <p className="text-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                            <strong>Hook:</strong> "Ti smonto 4 miti sulla vendita con AI..."<br />
                            <strong>Content:</strong> 1 mito-realtà ogni 10 secondi, diretto in camera.<br />
                            <strong>CTA:</strong> "Quale ti bloccava? Scrivilo nei commenti."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
