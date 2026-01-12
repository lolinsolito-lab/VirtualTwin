"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, Link2, Rocket, CheckCircle2, Mic2 } from 'lucide-react';

/**
 * Setup Story Narrative Component
 * 
 * WARM & NARRATIVE: 10-minute journey to duplicate yourself
 * 
 * Usage: Homepage setup section - demystify activation with storytelling
 */
export default function SetupStoryNarrative() {
    const genesis = [
        {
            minutes: "Capitolo I",
            icon: MessageSquare,
            title: "L'Essenza Pura",
            story: "Il sistema estrae il tuo DNA imprenditoriale attraverso domande profonde. Non è un database, è il tuo modo di guardare il mercato.",
            example: "Esempio: 'Qual è la tua verità inconfutabile che nessun concorrente osa dire?'",
            detail: "Tu riversi la tua visione. Il sistema la cristallizza nel silenzio.",
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50"
        },
        {
            minutes: "Capitolo II",
            icon: Mic2,
            title: "L'Iniezione della Voce",
            story: "Il Gemello assorbe ogni sfumatura, ogni silenzio, ogni tua intuizione. Impara a pensare con la tua logica strategica.",
            example: "Esempio: 'Come trasformi un'obiezione in una conferma di prestigio?'",
            detail: "Il tuo stile diventa un algoritmo di persuasione immortale.",
            color: "from-purple-500 to-pink-600",
            bg: "bg-purple-50"
        },
        {
            minutes: "Capitolo III",
            icon: Rocket,
            title: "La Nascita del Gemello",
            story: "La metamorfosi è completa. Hai appena ottenuto il dono dell'ubiquità. Il tuo impero ora scala nel silenzio.",
            example: "Risultato: 'Un'identità che vince al posto tuo, mentre tu finalmente respiri.'",
            detail: "La tecnologia diventa invisibile. La tua libertà diventa assoluta.",
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-50"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-white to-champagne/30">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-8 block opacity-40">L'Efficienza senza Sforzo</span>
                        <h2 className="font-serif text-5xl md:text-9xl text-charcoal mb-12 leading-[0.8] tracking-tighter">
                            Genesi <br />
                            <span className="text-gold italic">Sovrana.</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-charcoal/30 max-w-4xl mx-auto leading-relaxed font-light italic">
                            "10 minuti non sono il tempo di configurazione. <br />
                            <strong className="text-charcoal/50 font-medium italic">Sono il tempo necessario per smettere di essere un collo di bottiglia."</strong>
                        </p>
                    </motion.div>

                    {/* Timeline Journey */}
                    <div className="relative">
                        {/* Thin Elegant Vertical Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gold/20 transform -translate-x-1/2" />

                        {/* Journey Steps */}
                        <div className="space-y-32">
                            {genesis.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                    className={`relative flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Central Time Pulse */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center">
                                        <div className="w-4 h-4 rounded-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-pulse" />
                                        <div className="mt-4 text-[9px] uppercase font-black text-gold tracking-widest leading-none h-0 opacity-40">{step.minutes}</div>
                                    </div>

                                    {/* Content Card - ARIOUS LUXURY */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                                            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mb-6">{step.minutes}</span>
                                            <h3 className="text-3xl md:text-5xl font-serif text-charcoal italic mb-8 tracking-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-xl md:text-2xl text-charcoal/40 leading-tight italic font-light max-w-md">
                                                "{step.story}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Detail Card - GLASSMORPHISM */}
                                    <div className="flex-1">
                                        <div className="bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] p-12 shadow-2xl">
                                            <div className="w-12 h-12 rounded-2xl bg-charcoal/5 flex items-center justify-center mb-8">
                                                <step.icon className="w-6 h-6 text-gold" />
                                            </div>
                                            <p className="text-charcoal/60 leading-relaxed italic text-lg">
                                                {step.detail}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-32 text-center"
                    >
                        <h4 className="font-serif text-4xl md:text-7xl text-charcoal mb-12 italic leading-tight">
                            "La Bellezza è <span className="text-gold">Sintesi.</span>"
                        </h4>

                        <p className="text-charcoal/20 text-[10px] uppercase tracking-[0.5em] block">
                            Metamorfosi Completa in 10 Minuti.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
