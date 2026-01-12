"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare, Star, Play, PlayCircle, Plus } from 'lucide-react';

/**
 * Social Proof Human Component
 * 
 * CREDIBILITY: Real chat proofs & video testimonials
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

                    {/* Genesis Wave Scarcity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-gold/10 to-amber-100 rounded-3xl p-10 border-2 border-gold/40 text-center"
                    >
                        <h3 className="text-3xl font-serif text-charcoal mb-4">
                            🚀 Pre-Lancio <span className="text-gold">Wave Genesis</span>
                        </h3>
                        <p className="text-xl text-charcoal/60 max-w-2xl mx-auto mb-8">
                            VirtualTwin è in fase di lancio esclusivo. <br />
                            I primi <strong className="text-charcoal">20 Founder</strong> della Wave Genesis bloccano il prezzo per sempre.
                        </p>

                        <div className="flex flex-col items-center justify-center">
                            <p className="text-6xl font-black text-gold mb-2">20</p>
                            <p className="text-charcoal/70 uppercase tracking-widest text-xs font-bold">Posti Disponibili in Wave Genesis</p>
                        </div>

                        <p className="text-charcoal/50 text-sm mt-8 italic">
                            ⏳ L'opportunità Founder si chiude al completamento della wave.
                        </p>
                    </motion.div>

                    {/* Video Testimonial Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="relative max-w-4xl mx-auto group">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-gold/30 via-amber-500/20 to-gold/30 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />

                            <div className="relative bg-charcoal rounded-[2rem] overflow-hidden shadow-3xl border border-white/10 aspect-video flex items-center justify-center">
                                {/* Video Placeholder / Embed */}
                                <div className="absolute inset-0 z-0">
                                    <video
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover opacity-60"
                                    >
                                        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-1549-large.mp4" type="video/mp4" />
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                                </div>

                                {/* Video Overlay Info */}
                                <div className="relative z-10 text-center px-6">
                                    <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center mx-auto mb-6 shadow-luxury-gold animate-pulse cursor-pointer hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-charcoal fill-charcoal" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 italic">
                                        Demo: Il Gemello in <span className="text-gold">Azione</span>
                                    </h3>
                                    <p className="text-white/60 text-sm max-w-md mx-auto">
                                        Guarda come VirtualTwin gestisce una pipeline di lead complessa senza alcun intervento umano.
                                    </p>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Live Demo Preview</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Chat Proof Grid */}
                    <div className="text-center mb-16">
                        <h3 className="font-serif text-3xl text-charcoal mb-4">
                            Conversazioni <span className="italic gold-text-gradient">Verificate</span>
                        </h3>
                        <p className="text-charcoal/50 max-w-xl mx-auto">
                            Esempi reali di come il Gemello Digitale qualifica, vende e fissa appuntamenti sui canali social più usati.
                        </p>
                    </div>
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
                </div>
            </div>
        </section>
    );
}
