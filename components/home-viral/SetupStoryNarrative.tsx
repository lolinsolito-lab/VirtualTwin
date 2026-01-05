"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, Link2, Rocket, CheckCircle2 } from 'lucide-react';

/**
 * Setup Story Narrative Component
 * 
 * WARM & NARRATIVE: 10-minute journey to duplicate yourself
 * 
 * Usage: Homepage setup section - demystify activation with storytelling
 */
export default function SetupStoryNarrative() {
    const journey = [
        {
            minutes: "1-3",
            icon: MessageSquare,
            title: "Racconti Come Vendi",
            story: "Il sistema ti fa 15 domande sul tuo business. Non sono domande tech. Sono domande SUL TUO MODO di vendere.",
            example: "Esempio: 'Come rispondi quando un cliente dice: è troppo caro?'",
            detail: "Tu scrivi la TUA risposta. Quella vera. Quella che usi quando chiudi una vendita.",
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50"
        },
        {
            minutes: "4-6",
            icon: Brain,
            title: "L'AI Impara la TUA Voce",
            story: "Il sistema analizza le tue risposte. Studia il tuo tono, le tue parole, il tuo stile.",
            example: "Non crea un bot generico. Crea UN CLONE DI TE.",
            detail: "Quello che esce è la versione digitale del TUO modo di comunicare. I clienti parleranno con 'te'.",
            color: "from-purple-500 to-violet-600",
            bg: "bg-purple-50"
        },
        {
            minutes: "7-9",
            icon: Link2,
            title: "Colleghi i Tuoi Canali",
            story: "WhatsApp, Instagram, Messenger. Scegli dove vuoi che il tuo gemello digitale lavori.",
            example: "3 click. Zero codice da scrivere. Zero configurazioni complicate.",
            detail: "È letteralmente: click → autorizza → fatto. Anche tua nonna lo farebbe.",
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-50"
        },
        {
            minutes: "10",
            icon: Rocket,
            title: "Supervisioni e Vai Live",
            story: "Il gemello inizia a rispondere. Tu guardi le prime 5-10 conversazioni.",
            example: "Se qualcosa non ti piace, correggi. Il sistema impara.",
            detail: "Dopo qualche aggiustamento... lo lasci fare. Lui vende. Tu scali.",
            color: "from-green-500 to-emerald-600",
            bg: "bg-green-50"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-white to-champagne/30">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            10 Minuti per <span className="text-gold italic">Duplicare Te Stesso</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed">
                            Non è complicato. Non è tecnico. <br />
                            È una <strong className="text-charcoal">conversazione guidata</strong> che trasforma il tuo modo di vendere in un gemello digitale.
                        </p>
                    </motion.div>

                    {/* Timeline Journey */}
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 via-amber-400 to-green-400 opacity-30 transform -translate-x-1/2" />

                        {/* Journey Steps */}
                        <div className="space-y-12">
                            {journey.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className={`relative flex items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Time Badge (Center) */}
                                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
                                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}>
                                            <div className="text-center">
                                                <step.icon className="w-10 h-10 text-white mx-auto mb-1" />
                                                <p className="text-white text-xs font-black">{step.minutes} MIN</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 ${step.bg} border-2 border-charcoal/10 rounded-3xl p-8 shadow-lg`}>
                                        {/* Mobile Icon */}
                                        <div className="md:hidden mb-6">
                                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                                                <step.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-sm font-black text-charcoal/60 mt-2">MINUTI {step.minutes}</p>
                                        </div>

                                        <h3 className="text-2xl font-serif text-charcoal font-bold mb-4">
                                            {step.title}
                                        </h3>

                                        <p className="text-charcoal/80 leading-relaxed mb-4 text-lg">
                                            {step.story}
                                        </p>

                                        <div className="bg-white rounded-xl p-4 mb-4 border-l-4 border-gold">
                                            <p className="text-charcoal/70 italic">
                                                💡 {step.example}
                                            </p>
                                        </div>

                                        <p className="text-charcoal/70 leading-relaxed">
                                            {step.detail}
                                        </p>
                                    </div>

                                    {/* Spacer for alternating layout */}
                                    <div className="hidden md:block flex-1" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Result Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 text-center bg-gradient-to-br from-gold/10 to-amber-100 rounded-3xl p-10 border-2 border-gold/40"
                    >
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-6" />

                        <h3 className="text-3xl font-serif text-charcoal mb-4">
                            Risultato: Il Tuo Gemello Digitale è Live
                        </h3>

                        <p className="text-xl text-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-6">
                            <strong className="text-charcoal">Non è un bot generico.</strong><br />
                            È la TUA voce. Il TUO modo di vendere. Le TUE parole.<br />
                            <span className="text-gold font-bold">Moltiplicato per infinito.</span>
                        </p>

                        <div className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-full font-bold text-lg shadow-xl">
                            <Rocket className="w-6 h-6" />
                            <span>Totale: ~10 Minuti. Risultato: Te Duplicato.</span>
                        </div>

                        <p className="text-charcoal/50 text-sm mt-6 italic">
                            "Non ci credo che sia così facile." — Ogni cliente prima di provare 😄
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
