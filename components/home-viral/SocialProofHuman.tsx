"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Clock, Heart, Linkedin, ArrowRight } from 'lucide-react';

/**
 * Social Proof Human Component
 * 
 * WARM TESTIMONIALS: Real people, real emotions, real results
 * 
 * Usage: Homepage social proof - humanize with faces, stories, outcomes
 */
export default function SocialProofHuman() {
    const chatProofs = [
        {
            platform: "WhatsApp",
            title: "Qualifica Lead Immobiliare",
            image: "/whatsapp_proof.png",
            outcome: "Lead qualificato e appuntamento fissato in 2 minuti.",
            color: "from-green-500/20 to-emerald-500/20",
            borderColor: "border-green-400/30"
        },
        {
            platform: "Instagram",
            title: "Chiusura Vendita Diretta",
            image: "/instagram_proof.png",
            outcome: "Obiezione prezzo gestita e link pagamento inviato.",
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-400/30"
        },
        {
            platform: "Messenger",
            title: "Supporto Clienti & Upsell",
            image: "/messenger_proof.png",
            outcome: "Risposta immediata alle 3 di notte e lead pronto all'acquisto.",
            color: "from-blue-500/20 to-cyan-500/20",
            borderColor: "border-blue-400/30"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-champagne/20 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            Chi Ha Già <span className="text-gold italic">Il Suo Gemello</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                            Non sono solo testimonianze. Sono <strong className="text-charcoal">storie reali</strong> di persone che hanno fatto la scelta di duplicarsi.
                        </p>
                    </motion.div>

                    {/* Testimonial Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {chatProofs.map((proof, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative group rounded-[2.5rem] overflow-hidden border ${proof.borderColor} bg-gradient-to-br ${proof.color} p-4 shadow-luxury-gold hover:shadow-2xl transition-all duration-500`}
                            >
                                {/* Platform Badge */}
                                <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] uppercase font-black tracking-widest text-charcoal">
                                    {proof.platform}
                                </div>

                                <div className="space-y-4">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                        <img
                                            src={proof.image}
                                            alt={proof.title}
                                            className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-60" />
                                    </div>

                                    <div className="px-2 pb-2">
                                        <h3 className="text-xl font-serif text-charcoal font-bold mb-2">
                                            {proof.title}
                                        </h3>
                                        <div className="flex items-start gap-2 p-3 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50">
                                            <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-charcoal/80 leading-relaxed italic">
                                                {proof.outcome}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Community Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-gold/10 to-amber-100 rounded-3xl p-10 border-2 border-gold/40 text-center"
                    >
                        <h3 className="text-3xl font-serif text-charcoal mb-6">
                            Unisciti a <span className="text-gold">500+ Professionisti</span>
                        </h3>

                        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div>
                                <p className="text-5xl font-black text-gold mb-2">500+</p>
                                <p className="text-charcoal/70">Gemelli Digitali Attivi</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-gold mb-2">1.2M+</p>
                                <p className="text-charcoal/70">Conversazioni Gestite</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-gold mb-2">€3.4M+</p>
                                <p className="text-charcoal/70">Vendite Automatizzate</p>
                            </div>
                        </div>

                        <p className="text-charcoal/50 text-sm mt-8 italic">
                            📊 Dati aggiornati - Gennaio 2026
                        </p>
                    </motion.div>

                    {/* Video Placeholder Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 text-center bg-charcoal/5 rounded-2xl p-8 border-2 border-charcoal/10"
                    >
                        <p className="text-charcoal/60 text-sm">
                            🎬 <strong>Video testimonial UGC</strong> verranno integrati qui<br />
                            (30-sec snippets clienti reali che raccontano risultati)
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
