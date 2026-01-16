"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Play, CheckCircle2 } from 'lucide-react';

/**
 * Social Proof Human Component - NARRATIVE CASE STUDY EDITION
 * 
 * Focus: Outcome, Transformation, Freedom.
 */
export default function SocialProofHuman() {
    const caseStudy = {
        name: "Michael J.",
        role: "Founder & Architect",
        transformation: "Dall'operatività alla conquista.",
        story: "Ho visto un pattern che il mercato ignorava: i fondatori più brillanti erano intrappolati nel rispondere ai messaggi invece di costruire imperi. Ho rifiutato quella logica.",
        mission: "VirtualTwin non è nato da una necessità personale. È nato da una visione: creare l'intelligenza che permette a chi pensa in grande di operare su scala infinita. Mentre altri costruivano chatbot, io ho progettato cloni cognitivi.",
        outcome: "Il mio gemello AI non assiste — sostituisce. Vende, qualifica, chiude. Opera con la mia esatta mentalità strategica su ogni canale, 24 ore su 24. Non ho delegato compiti. Ho moltiplicato me stesso.",
        quote: "Il futuro appartiene a chi costruisce sistemi che pensano. VirtualTwin è la mia prima conquista."
    };

    return (
        <section className="relative z-10 py-24 bg-gradient-to-b from-white via-champagne/10 to-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">

                    {/* CASE STUDY NARRATIVE */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                <span className="text-gold text-[10px] uppercase font-black tracking-widest">Visione del Fondatore</span>
                            </div>

                            <h3 className="font-serif text-4xl md:text-6xl text-charcoal leading-[1.1]">
                                Come Ho Costruito <br /> <span className="text-gold italic">VirtualTwin.</span>
                            </h3>

                            <div className="space-y-6 text-charcoal/70 text-lg leading-relaxed">
                                <p className="italic">"{caseStudy.story}"</p>

                                <p className="not-italic text-charcoal/80">
                                    {caseStudy.mission}
                                </p>

                                <p className="not-italic font-medium text-charcoal border-l-4 border-gold pl-6 py-3 bg-gold/5 rounded-r-2xl">
                                    {caseStudy.outcome}
                                </p>

                                {/* Quote Block */}
                                <div className="pt-4">
                                    <p className="font-serif text-xl md:text-2xl text-charcoal italic leading-relaxed">
                                        "{caseStudy.quote}"
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-serif font-bold">MJ</div>
                                <div>
                                    <p className="font-serif text-xl text-charcoal font-bold leading-none">{caseStudy.name}</p>
                                    <p className="text-gold text-[10px] uppercase tracking-widest mt-1 font-black">{caseStudy.role}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-gold/20 via-transparent to-gold/10 blur-3xl opacity-50" />
                            <div className="relative rounded-[3rem] overflow-hidden border border-gold/20 shadow-3xl aspect-[4/5] bg-charcoal">
                                <img
                                    src="/images/michael-founder.png"
                                    alt="Michael - VirtualTwin Founder"
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                />

                                {/* Floating Label */}
                                <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold" />
                                    <span className="text-white text-[10px] uppercase font-black tracking-widest">Status: Clone Attivo 24/7</span>
                                </div>

                                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                                    <p className="text-white font-serif italic text-lg leading-relaxed">
                                        "Ho smesso di lavorare NEL business. Ora costruisco SOPRA di esso."
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* PROOF GALLERY (Minimalist) */}
                    <div className="text-center mb-16">
                        <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black italic">Presenza Indistinguibile</span>
                        <h4 className="font-serif text-3xl text-charcoal mt-4">Conversazioni che Proteggono il Brand</h4>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 mb-32">
                        {[
                            { image: "/proof_whatsapp.png", label: "Automazione Conversazioni" },
                            { image: "/proof_instagram.png", label: "Engagement Intelligente" },
                            { image: "/proof_messenger.png", label: "Scalabilità Istantanea" }
                        ].map((proof, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="relative rounded-[2rem] overflow-hidden border border-charcoal/5 shadow-2xl aspect-[9/16] bg-gray-100">
                                    <img
                                        src={proof.image}
                                        alt={proof.label}
                                        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                                </div>
                                <p className="text-center mt-6 text-[10px] uppercase tracking-[0.2em] text-charcoal/40 font-black">{proof.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* VIDEO DEMO SECTION - Full Width Dark for Flow */}
            <div className="bg-charcoal py-20 -mx-6 px-6">
                <div className="container mx-auto">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-10 bg-gold/10 rounded-[4rem] blur-[100px] pointer-events-none" />

                            <div className="relative bg-black rounded-[3rem] overflow-hidden shadow-3xl border border-gold/20 aspect-video flex items-center justify-center group cursor-pointer">
                                <img
                                    src="/video_testimonial_frame_elite_1768245512073.png"
                                    alt="Neural Training Demo"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                                {/* Play Button */}
                                <div className="relative z-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-gold transition-all duration-500 shadow-2xl">
                                    <Play className="w-10 h-10 text-white fill-white group-hover:text-charcoal group-hover:fill-charcoal transition-colors" />
                                </div>

                                {/* Info */}
                                <div className="absolute bottom-10 left-10 text-left">
                                    <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-black mb-1">Caso Studio</p>
                                    <h5 className="text-white font-serif text-2xl italic">Risultati Reali: Il Clone in Azione</h5>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

