"use client";

import React from 'react';
import { Star } from 'lucide-react';

const SocialProof = () => {
    const testimonials = [
        {
            quote: "VirtualTwin ha triplicato le mie conversioni in 30 giorni. L'AI capisce esattamente il mio tono.",
            name: "Marco R.",
            role: "Consulente Digital"
        },
        {
            quote: "Finalmente posso dormire sapendo che i lead vengono gestiti. Setup in 10 minuti, risultati immediati.",
            name: "Giulia T.",
            role: "CEO, Agenzia Creativa"
        },
        {
            quote: "Il white-label è perfetto per rivendere ai miei clienti. Margini altissimi, zero lavoro extra.",
            name: "Luca B.",
            role: "Web Agency Owner"
        }
    ];

    return (
        <section className="py-32 lg:py-48 px-6 lg:px-12 bg-champagne relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black mb-4 block">Testimonial</span>
                    <h2 className="font-serif text-[2.5rem] md:text-[4rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal">
                        Chi Lo Usa, <span className="italic gold-text-gradient">Conferma.</span>
                    </h2>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl p-8 lg:p-10 border border-charcoal/5 relative group hover:shadow-xl transition-all duration-500"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-charcoal/70 text-base lg:text-lg font-serif italic leading-relaxed mb-8">
                                "{t.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-serif text-lg">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="text-charcoal font-medium">{t.name}</p>
                                    <p className="text-charcoal/40 text-sm">{t.role}</p>
                                </div>
                            </div>

                            {/* Decorative Quote Mark */}
                            <div className="absolute top-6 right-8 text-6xl font-serif text-gold/10 leading-none">"</div>
                        </div>
                    ))}
                </div>

                {/* Logos (Placeholder) */}
                <div className="mt-20 text-center">
                    <p className="text-charcoal/30 text-[9px] uppercase tracking-[0.5em] font-bold mb-8">Trusted By</p>
                    <div className="flex items-center justify-center gap-12 opacity-30">
                        <span className="text-2xl font-serif text-charcoal">Brand</span>
                        <span className="text-2xl font-serif text-charcoal">Logo</span>
                        <span className="text-2xl font-serif text-charcoal">Azienda</span>
                        <span className="text-2xl font-serif text-charcoal">Partner</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
