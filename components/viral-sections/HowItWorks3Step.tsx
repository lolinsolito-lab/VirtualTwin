"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

/**
 * How It Works 3-Step Component
 * 
 * VIRAL-READY: Perfect for screen recording tutorial videos
 * 
 * Usage: Tutorial Reels, onboarding video ads, explainer content
 */
export default function HowItWorks3Step() {
    const steps = [
        {
            number: "1",
            title: "Rispondi a 15 Domande",
            subtitle: "5 minuti di setup",
            description: "Ci racconti il tuo business, la tua offerta, come rispondi di solito. Il Clone impara dal tuo modo di vendere.",
            icon: "📝",
            color: "from-blue-500 to-indigo-500",
            bg: "bg-blue-50"
        },
        {
            number: "2",
            title: "Colleghi i Canali",
            subtitle: "3 click totali",
            description: "WhatsApp, Instagram, Messenger. Scegli dove vuoi che il Clone risponda e colleghi con un click. Zero codice, zero stress.",
            icon: "🔗",
            color: "from-purple-500 to-violet-500",
            bg: "bg-purple-50"
        },
        {
            number: "3",
            title: "Vai Live (con Supervisione)",
            subtitle: "Prime conversazioni insieme",
            description: "Il Clone inizia a rispondere. Tu supervisioni le prime 5-10 conversazioni, correggi se serve, poi... lasci fare a lui.",
            icon: "🚀",
            color: "from-green-500 to-emerald-500",
            bg: "bg-green-50"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-white">
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
                            Attivazione in <span className="text-gold italic">3 Passaggi</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
                            Non serve essere tecnico. Non serve programmazione. In 10 minuti hai il tuo primo venditore AI.
                        </p>
                    </motion.div>

                    {/* 3 Steps - PERFECT FOR SCREEN RECORDING */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative"
                            >
                                {/* Arrow between steps */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 z-10 transform -translate-y-1/2">
                                        <ArrowRight className="w-8 h-8 text-gold" />
                                    </div>
                                )}

                                {/* Step Card */}
                                <div className={`${step.bg} border-2 border-charcoal/10 rounded-3xl p-8 h-full flex flex-col`}>
                                    {/* Step Number Badge */}
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                                        <span className="text-3xl">{step.icon}</span>
                                    </div>

                                    {/* Step Number */}
                                    <div className="mb-2">
                                        <span className={`text-6xl font-serif bg-gradient-to-br ${step.color} bg-clip-text text-transparent font-black opacity-20`}>
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-serif text-charcoal mb-2 font-bold">
                                        {step.title}
                                    </h3>

                                    {/* Subtitle */}
                                    <p className="text-sm text-gold font-bold uppercase tracking-wider mb-4">
                                        {step.subtitle}
                                    </p>

                                    {/* Description */}
                                    <p className="text-charcoal/70 leading-relaxed flex-grow">
                                        {step.description}
                                    </p>

                                    {/* Check Icon */}
                                    <div className="mt-6">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Video Script Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 border-2 border-gold/30 rounded-2xl p-8 text-center"
                    >
                        <h3 className="text-xl font-black text-charcoal mb-3">
                            🎬 Script Reel (30 secondi):
                        </h3>
                        <p className="text-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                            <strong>Hook:</strong> "Ti faccio vedere in 30 secondi come ho messo un clone a rispondere ai DM per me."<br />
                            <strong>Content:</strong> Screen recording di questi 3 step esatti.<br />
                            <strong>CTA:</strong> "Link in bio per attivare il tuo."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
