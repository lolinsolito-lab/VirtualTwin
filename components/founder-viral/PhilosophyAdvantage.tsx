"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Globe } from 'lucide-react';

/**
 * Philosophy Advantage Component
 * 
 * ELITE: Philosophical justification for the Founder program
 * Focuses on 'Sovereignty' and 'Prestige'
 */

export default function PhilosophyAdvantage() {
    const pillars = [
        {
            icon: <ShieldCheck className="w-8 h-8 text-gold" />,
            title: "Sovranità Digitale",
            description: "Mentre il mondo si affida a modelli generalisti e algoritmi pubblici, i Founder costruiscono una rete neurale privata. I tuoi dati, la tua voce, il tuo impero — protetti per sempre."
        },
        {
            icon: <Target className="w-8 h-8 text-gold" />,
            title: "Vantaggio Iniquo",
            description: "Essere un Founder significa avere accesso a versioni del Gemello Digitale non ancora disponibili al pubblico. Sviluppa oggi ciò che il mercato scoprirà tra due anni."
        },
        {
            icon: <Globe className="w-8 h-8 text-gold" />,
            title: "Eredità Immutabile",
            description: "Il prezzo bloccato non è solo un risparmio economico, è un atto di fede verso la tua crescita. Un contratto a vita con VirtualTwin che ignora l'inflazione e le dinamiche di mercato."
        }
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Minimalist Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-stone-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.1] mb-8">
                                La Filosofia <br />
                                della <span className="text-gold italic">Maestria</span>
                            </h2>
                            <p className="text-xl text-charcoal/60 leading-relaxed font-medium">
                                Non abbiamo creato il Programma Founder per vendere abbonamenti. Lo abbiamo creato per identificare l&apos;elite di professionisti che guiderà la rivoluzione dell&apos;AI in Italia.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-stone-50 border border-stone-200 rounded-[2.5rem] p-8 md:p-12"
                        >
                            <p className="text-2xl font-serif text-charcoal italic leading-relaxed">
                                &ldquo;Il vero lusso non è il prezzo basso, ma la certezza di possedere una tecnologia che evolve con te, senza doverne rinegoziare mai più le condizioni d&apos;accesso.&rdquo;
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="w-10 h-[1px] bg-gold" />
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/40">The VirtualTwin Vision</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {pillars.map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col"
                            >
                                <div className="mb-6">{pillar.icon}</div>
                                <h3 className="text-xl font-bold text-charcoal mb-4 uppercase tracking-widest">{pillar.title}</h3>
                                <div className="w-8 h-[2px] bg-gold mb-6" />
                                <p className="text-sm text-charcoal/50 leading-relaxed font-medium">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
