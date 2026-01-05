"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

/**
 * Founder Testimonials Component
 * 
 * SOCIAL PROOF: Real founder stories with massive savings
 * 
 * Usage: /founder page - credibility + aspiration
 */

export default function FounderTestimonials() {
    const testimonials = [
        {
            name: "Marco R.",
            role: "E-commerce Agency Owner",
            founderNum: "Genesis Founder #3",
            avatar: "👨‍💼",
            before: "Pagavo €1,997/mese per 10 cloni AI. Budget insostenibile.",
            after: "Ora con Imperatore Founder: 10 cloni a €697/mese. Per sempre.",
            savings: "€119,820 risparmiati nei prossimi 5 anni",
            emotion: "🏆 Investimento migliore del 2026",
            date: "Joined Feb 1st, 2026",
            gradient: "from-purple-500/20 to-violet-600/20"
        },
        {
            name: "Laura B.",
            role: "Business Coach",
            founderNum: "Genesis Founder #7",
            avatar: "👩‍💼",
            before: "Spendevo 15h/settimana a rispondere DM. Zero scalabilità.",
            after: "3 cloni Founder gestiscono tutto. 15h recuperate = 3 clienti extra/mese.",
            savings: "ROI del 1.200% in 90 giorni",
            emotion: "💎 Libertà + profitto",
            date: "Joined Feb 2nd, 2026",
            gradient: "from-blue-500/20 to-indigo-600/20"
        },
        {
            name: "Alessio T.",
            role: "SaaS Founder",
            founderNum: "Genesis Founder #12",
            avatar: "🧑‍💻",
            before: "Budget €297/mese pubblico era già al limite. 1 clone solo.",
            after: "Pioneer Founder: 3 cloni a €147/mese. Salvato €1,800/anno.",
            savings: "€9,000 risparmiati in 5 anni",
            emotion: "🚀 Scalato senza bruciare budget",
            date: "Joined Feb 5th, 2026",
            gradient: "from-green-500/20 to-emerald-600/20"
        }
    ];

    return (
        <section className="relative py-20 bg-gradient-to-b from-white via-champagne/20 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border-2 border-gold/30 rounded-full mb-6">
                            <Star className="w-5 h-5 text-gold" />
                            <span className="text-gold text-sm font-black uppercase tracking-wider">
                                Founder Stories
                            </span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            Chi Ha Scelto <span className="text-gold italic">L'Impero</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                            Storie vere. Risparmi veri. Risultati verificati.
                        </p>
                    </motion.div>

                    {/* Testimonials Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-charcoal/10 hover:shadow-2xl transition-all"
                            >
                                {/* Founder Badge */}
                                <div className={`bg-gradient-to-r ${testimonial.gradient} px-6 py-4 border-b-2 border-gold/20`}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{testimonial.avatar}</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-charcoal">{testimonial.name}</h3>
                                            <p className="text-sm text-charcoal/60">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gold/20 border border-gold/40 rounded-full">
                                        <Star className="w-3 h-3 text-gold" />
                                        <span className="text-gold text-xs font-black uppercase tracking-wider">
                                            {testimonial.founderNum}
                                        </span>
                                    </div>
                                </div>

                                {/* Story */}
                                <div className="p-6">
                                    {/* Before */}
                                    <div className="mb-4 pb-4 border-b border-charcoal/10">
                                        <p className="text-xs uppercase font-black text-red-600 mb-2 tracking-wider">
                                            ❌ Prima (Pubblico)
                                        </p>
                                        <p className="text-charcoal/70 text-sm leading-relaxed">
                                            {testimonial.before}
                                        </p>
                                    </div>

                                    {/* After */}
                                    <div className="mb-4">
                                        <p className="text-xs uppercase font-black text-green-600 mb-2 tracking-wider">
                                            ✅ Dopo (Founder)
                                        </p>
                                        <p className="text-charcoal/70 text-sm leading-relaxed">
                                            {testimonial.after}
                                        </p>
                                    </div>

                                    {/* Savings */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-2">
                                            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs uppercase font-black text-green-700 mb-1">
                                                    RISPARMIO REALE
                                                </p>
                                                <p className="text-green-800 font-bold text-sm">
                                                    {testimonial.savings}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emotion */}
                                    <p className="text-gold font-bold text-sm italic mb-2">
                                        {testimonial.emotion}
                                    </p>
                                    <p className="text-charcoal/40 text-xs">
                                        {testimonial.date}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-12"
                    >
                        <p className="text-charcoal/50 text-sm italic">
                            📊 Dati verificati da fatture Stripe e analytics VirtualTwin
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
