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
        name: "Marco G.",
        role: "Founder & High-Performance Coach",
        transformation: "Dalla saturazione operativa alla sovranità creativa.",
        story: "Marco gestiva 150+ interazioni al giorno. Il suo business cresceva, ma la sua vita era ostaggio di uno schermo. L'eccellenza era diventata un limite biologico invalicabile.",
        outcome: "Oggi, la sua Essenza Neurale governa il mercato mentre lui governa la visione. Il suo gemello non si limita a rispondere: protegge il suo brand e scala la sua influenza nel silenzio assoluto dei risultati."
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
                                <span className="text-gold text-[10px] uppercase font-black tracking-widest">Metamorfosi d'Élite</span>
                            </div>

                            <h3 className="font-serif text-4xl md:text-6xl text-charcoal leading-[1.1]">
                                La Metamorfosi <br /> <span className="text-gold italic">del Fondatore.</span>
                            </h3>

                            <div className="space-y-6 text-charcoal/70 text-lg leading-relaxed italic">
                                <p>"{caseStudy.story}"</p>
                                <p className="not-italic font-medium text-charcoal border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-2xl">
                                    "{caseStudy.outcome}"
                                </p>
                            </div>

                            <div className="pt-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-charcoal flex items-center justify-center text-white font-serif font-bold">MG</div>
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
                                    src="/avatar_coaching_elite_man_1768245490457.png"
                                    alt="Elite Founder Transformation"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                />

                                {/* Floating Label */}
                                <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold" />
                                    <span className="text-white text-[10px] uppercase font-black tracking-widest">Status: Presenza Neurale Attiva</span>
                                </div>

                                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
                                    <p className="text-white font-serif italic text-lg leading-relaxed">
                                        "Il gemello non ha solo aumentato il mio impatto; mi ha restituito l'energia per tornare a sognare in grande."
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
                            { image: "/whatsapp_proof_real_mockup_1768242467395.png", label: "Relazioni su WhatsApp" },
                            { image: "/instagram_proof_real_mockup_1768242485974.png", label: "Ingaggio su Instagram" },
                            { image: "/messenger_proof_real_mockup_1768242505400.png", label: "Scalabilità su Messenger" }
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

                    {/* VIDEO DEMO - THE FINAL TOUCH */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative max-w-5xl mx-auto"
                    >
                        <div className="absolute -inset-10 bg-gold/5 rounded-[4rem] blur-[100px] pointer-events-none" />

                        <div className="relative bg-charcoal rounded-[3rem] overflow-hidden shadow-3xl border border-white/10 aspect-video flex items-center justify-center group cursor-pointer">
                            <img
                                src="/video_testimonial_frame_elite_1768245512073.png"
                                alt="Neural Training Demo"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />

                            {/* Play Button */}
                            <div className="relative z-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-gold transition-all duration-500 shadow-2xl">
                                <Play className="w-10 h-10 text-white fill-white group-hover:text-charcoal group-hover:fill-charcoal transition-colors" />
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-10 left-10 text-left">
                                <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-black mb-1">Elite Insight</p>
                                <h5 className="text-white font-serif text-2xl italic">L'Inconfutabile: La Magia in Azione</h5>
                            </div>
                        </div>
                    </motion.div>

                    {/* ELITE SCARCITY - WAVE GENESIS */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 rounded-[3.5rem] bg-gradient-to-br from-charcoal to-black border border-gold/30 text-center relative overflow-hidden shadow-3xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Genesis Founders Wave</span>
                            <h3 className="text-3xl md:text-5xl font-serif text-white mb-6">
                                Unisciti ai <span className="text-gold italic">Primi 20 Visionari.</span>
                            </h3>
                            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                                Stiamo aprendo le porte a soli 20 fondatori per addestrare i primi Gemelli Digitali con accesso prioritario e prezzo bloccato a vita. <br />
                                <span className="text-white font-medium">L'opportunità di scalare senza limiti biologici inizia qui.</span>
                            </p>

                            <div className="inline-flex flex-col items-center">
                                <div className="text-7xl font-serif text-gold font-black mb-2">20</div>
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Posti Disponibili • Wave Genesis</p>
                            </div>

                            <div className="mt-12">
                                <a
                                    href="#pricing"
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-gold text-charcoal rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-luxury-gold"
                                >
                                    Inizia la tua Trasformazione
                                    <TrendingUp className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
