"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Cpu, ShieldCheck, Zap } from 'lucide-react';

/**
 * Identity Preservation Section
 * Focus: The twin is YOU, not a bot. Identity, Ethics, Style.
 */
export default function IdentityPreservation() {
    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:40px_40px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Visual Side */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-gold/20 shadow-3xl bg-charcoal aspect-square flex items-center justify-center p-12">
                                <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-gold/5" />

                                {/* DNA/Fingerprint Visual */}
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-gold blur-3xl rounded-full"
                                    />
                                    <Fingerprint className="w-48 h-48 text-gold relative z-10" strokeWidth={0.5} />
                                </div>

                                {/* Floating Labels */}
                                <div className="absolute top-12 left-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3">
                                    <p className="text-[10px] text-gold uppercase tracking-[0.3em] font-black">Impronta d'Anima</p>
                                    <p className="text-white text-sm font-serif italic">Indistinguibile</p>
                                </div>
                                <div className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 text-right">
                                    <p className="text-[10px] text-gold uppercase tracking-[0.3em] font-black">Ethical Core</p>
                                    <p className="text-white text-sm font-serif italic">100% Tuo Stile</p>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
                        </motion.div>

                        {/* Text Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mb-6 block">L'Inviolabilità del Tuo Genio</span>
                            <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-8 leading-[1.1]">
                                Non è un Bot. <br />
                                <span className="text-gold italic">È la Tua Proiezione.</span>
                            </h2>

                            <p className="text-xl text-charcoal/60 leading-relaxed mb-10">
                                La più grande paura di un fondatore d'élite è perdere il controllo del proprio brand. <br />
                                <strong className="text-charcoal">VirtualTwin risolve questo bottleneck attraverso la Preservazione dell'Identità.</strong>
                            </p>

                            <div className="space-y-8">
                                {[
                                    {
                                        icon: ShieldCheck,
                                        title: "Integrità Etica",
                                        desc: "Il gemello risponde seguendo i tuoi valori morali e professionali, senza allucinazioni o errori di tono."
                                    },
                                    {
                                        icon: Cpu,
                                        title: "Risonanza Emotiva",
                                        desc: "Utilizza le tue sfumature linguistiche, le tue pause e il tuo modo unico di creare connessione."
                                    },
                                    {
                                        icon: Zap,
                                        title: "Potenza Senza Vincoli",
                                        desc: "Hai tutta la potenza dell'AI con il 100% del controllo umano. Sei tu, nel tuo giorno migliore, 24/7."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 rounded-xl bg-champagne flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                                            <item.icon className="w-6 h-6 text-gold group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-serif font-bold text-charcoal mb-1">{item.title}</h4>
                                            <p className="text-charcoal/50 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
