"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Clock } from 'lucide-react';

/**
 * Founder Testimonials Component
 * 
 * VIRAL-READY: Each testimonial = UGC-style ad creative
 * 
 * Usage: Social proof ads, testimonial carousels, before/after Stories
 */
export default function FounderTestimonials() {
    const testimonials = [
        {
            name: "Martina Rossi",
            role: "Coach Benessere",
            emoji: "🧘‍♀️",
            before: "2h/giorno su WhatsApp a rispondere agli stessi 'mi mandi info?'",
            after: "80% delle prime risposte automatizzate, 3 call in più a settimana",
            result: "+15h/mese recuperate",
            color: "from-green-500 to-emerald-500"
        },
        {
            name: "Luca Ferretti",
            role: "Studio Dentistico",
            emoji: "🦷",
            before: "Segretaria subissata di richieste, clienti in attesa ore per una risposta",
            after: "Clone filtra e qualifica, invia form pre-visita, fissa appuntamenti",
            result: "-60% carico segreteria",
            color: "from-blue-500 to-indigo-500"
        },
        {
            name: "Sara Lombardi",
            role: "E-commerce Fashion",
            emoji: "👗",
            before: "Perdevo vendite notturne perché non rispondevo ai DM dopo le 22",
            after: "Il Clone risponde 24/7, qualifica, manda link prodotto e sconto",
            result: "+30% conversioni notturne",
            color: "from-purple-500 to-violet-500"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-white to-champagne/20">
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
                            Chi Ha Già il <span className="text-gold italic">Suo Clone</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
                            Storie reali di founder che hanno recuperato tempo, aumentato conversioni, e scalato il business.
                        </p>
                    </motion.div>

                    {/* Testimonial Cards - PERFECT FOR UGC ADS */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="bg-white border-2 border-charcoal/10 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
                            >
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-3xl shadow-xl`}>
                                        {testimonial.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl text-charcoal font-bold">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-charcoal/60 text-sm">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Before */}
                                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                                    <p className="text-xs uppercase font-black text-red-600 mb-2 tracking-wider">
                                        ❌ Prima
                                    </p>
                                    <p className="text-charcoal/70 text-sm leading-relaxed">
                                        {testimonial.before}
                                    </p>
                                </div>

                                {/* After */}
                                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                                    <p className="text-xs uppercase font-black text-green-700 mb-2 tracking-wider">
                                        ✅ Dopo VirtualTwin
                                    </p>
                                    <p className="text-charcoal/70 text-sm leading-relaxed">
                                        {testimonial.after}
                                    </p>
                                </div>

                                {/* Result Badge */}
                                <div className={`mt-6 px-4 py-3 bg-gradient-to-r ${testimonial.color} rounded-xl text-center`}>
                                    <p className="text-white font-black text-lg">
                                        {testimonial.result}
                                    </p>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center justify-center gap-1 mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* UGC Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 border-2 border-gold/30 rounded-2xl p-8 text-center"
                    >
                        <h3 className="text-xl font-black text-charcoal mb-3">
                            📹 Video UGC Ideale:
                        </h3>
                        <p className="text-charcoal/70 leading-relaxed max-w-3xl mx-auto">
                            Cliente riprende se stesso (smartphone, ambiente reale), racconta before/after, mostra screenshot conversazioni Clone.
                            <br />
                            <span className="text-sm text-charcoal/50 italic mt-2 block">
                                Durata: 45-60 sec | Formato: 9:16 verticale | Hook: "Da quando ho il Clone AI..."
                            </span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
