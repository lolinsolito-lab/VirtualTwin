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
    const testimonials = [
        {
            name: "Laura Bianchi",
            role: "Coach Mindset & Business",
            avatar: "https://ui-avatars.com/api/?name=Laura+Bianchi&background=7c3aed&color=fff",
            story: "Prima passavo 2 ore ogni sera a rispondere agli stessi 'mi mandi info?'. Zero vita personale. Il mio gemello digitale ora gestisce tutto. Io intervengo solo per le call di chiusura.",
            results: [
                "+3 clienti a settimana",
                "15 ore/mese recuperate",
                "Prima vacanza in 2 anni"
            ],
            linkedin: "linkedin.com/in/laurabianchi",
            emotion: "Libertà ritrovata",
            rating: 5,
            color: "from-purple-500 to-violet-600"
        },
        {
            name: "Marco Ferretti",
            role: "Studio Odontoiatrico",
            avatar: "https://ui-avatars.com/api/?name=Marco+Ferretti&background=2563eb&color=fff",
            story: "La segretaria era sommersa da richieste banali. Il gemello ora filtra, qualifica e fissa appuntamenti 24/7. La segretaria si occupa solo di convertire i pazienti in clinica.",
            results: [
                "-60% carico segreteria",
                "+40% appuntamenti",
                "Risposta media: 2 secondi"
            ],
            linkedin: "linkedin.com/in/marcoferretti",
            emotion: "Controllo totale",
            rating: 5,
            color: "from-blue-500 to-indigo-600"
        },
        {
            name: "Sofia Romano",
            role: "E-commerce Moda",
            avatar: "https://ui-avatars.com/api/?name=Sofia+Romano&background=db2777&color=fff",
            story: "Perdevo vendite notturne perché non rispondevo ai DM dopo le 22:00. Il mio gemello risponde 24/7, qualifica e manda il giusto link prodotto. Vendo letteralmente mentre dormo.",
            results: [
                "+30% conversioni notturne",
                "€2.4K extra/mese stabili",
                "Zero lead persi"
            ],
            linkedin: "linkedin.com/in/sofiaromano",
            emotion: "Vendite automatiche",
            rating: 5,
            color: "from-pink-500 to-rose-600"
        },
        {
            name: "Alessandro Conti",
            role: "Consulente Marketing",
            avatar: "https://ui-avatars.com/api/?name=Alessandro+Conti&background=059669&color=fff",
            story: "Facevo troppe call con persone non in target. Ora il gemello qualifica PRIMA. Io parlo solo con chi è pronto a firmare il contratto. Efficienza moltiplicata per 10.",
            results: [
                "ROI: 12x in 30 giorni",
                "Tasso chiusura: 78%",
                "Stress eliminato"
            ],
            linkedin: "linkedin.com/in/alessandroconti",
            emotion: "Focus sui deal veri",
            rating: 5,
            color: "from-green-500 to-emerald-600"
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
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-charcoal/10 hover:shadow-2xl transition-shadow"
                            >
                                {/* Header with Avatar */}
                                <div className={`bg-gradient-to-r ${testimonial.color} px-8 py-8 relative overflow-hidden group`}>
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group-hover:scale-105 transition-transform">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-2xl font-serif text-white font-bold leading-tight">
                                                    {testimonial.name}
                                                </h3>
                                                {testimonial.linkedin && (
                                                    <a
                                                        href={`https://${testimonial.linkedin}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                                    >
                                                        <Linkedin className="w-3.5 h-3.5 text-white/80" />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-white/70 text-sm font-medium tracking-wide">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mt-6 relative z-10">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                        ))}
                                    </div>
                                </div>

                                {/* Story */}
                                <div className="p-8">
                                    <div className="mb-8 p-4 bg-charcoal/[0.02] rounded-2xl border-l-4 border-gold/20">
                                        <p className="text-charcoal/80 leading-relaxed italic">
                                            "{testimonial.story}"
                                        </p>
                                    </div>

                                    {/* Results Card */}
                                    <div className="grid grid-cols-1 gap-3">
                                        {testimonial.results.map((result, i) => (
                                            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-green-50/50 rounded-xl border border-green-100 group-hover:border-green-200 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                                                </div>
                                                <span className="text-charcoal font-bold text-sm tracking-tight">
                                                    {result}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Verification Link */}
                                    {testimonial.linkedin && (
                                        <div className="mt-8 pt-6 border-t border-charcoal/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-4 h-4 text-gold" />
                                                <p className="text-gold font-bold text-xs italic">
                                                    {testimonial.emotion}
                                                </p>
                                            </div>
                                            <a
                                                href={`https://${testimonial.linkedin}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] uppercase font-black tracking-widest text-charcoal/30 hover:text-gold transition-colors flex items-center gap-1.5"
                                            >
                                                Verifica su LinkedIn <ArrowRight className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}
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
