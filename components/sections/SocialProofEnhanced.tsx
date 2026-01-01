"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Star, Quote, TrendingUp } from 'lucide-react';

const SocialProofEnhanced = () => {
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const testimonials = [
        {
            name: "Marco R.",
            role: "Consulente Marketing",
            initials: "MR",
            quote: "Prima passavo 3 ore al giorno a rispondere su WhatsApp. Ora mi sveglio con gli appuntamenti già fissati.",
            result: "+340% conversioni",
            resultIcon: TrendingUp
        },
        {
            name: "Elena B.",
            role: "E-commerce Owner",
            initials: "EB",
            quote: "Pensavo fosse impossibile essere online 24/7. Il mio clone risponde alle 3 di notte come farei io.",
            result: "Zero weekend al telefono",
            resultIcon: Star
        },
        {
            name: "Giovanni V.",
            role: "Agenzia Immobiliare",
            initials: "GV",
            quote: "I nostri agenti ora si concentrano solo sui clienti caldi. L'AI qualifica tutto automaticamente.",
            result: "Team 5x più produttivo",
            resultIcon: TrendingUp
        }
    ];

    return (
        <section ref={sectionRef} className="py-16 lg:py-24 px-6 lg:px-12 bg-champagne relative overflow-hidden">
            <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Header - Clear and Simple */}
                <div className="text-center mb-12">
                    <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">Testimonianze</span>
                    <h2 className="font-serif text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-medium leading-[1] tracking-[-0.02em] text-charcoal mt-4 mb-4">
                        Cosa Dicono <span className="italic text-gold">i Clienti</span>
                    </h2>
                    <p className="text-charcoal/50 text-base lg:text-lg max-w-lg mx-auto">
                        Imprenditori come te che hanno già automatizzato le loro conversazioni.
                    </p>
                </div>

                {/* Testimonial Cards - Magazine Style */}
                <div className="grid md:grid-cols-3 gap-5 mb-12">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="group bg-white rounded-3xl p-6 lg:p-8 border border-charcoal/5 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Quote Icon */}
                            <Quote className="w-8 h-8 text-gold/20 mb-4" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-charcoal/70 text-sm lg:text-base leading-relaxed mb-6 font-serif italic">
                                "{t.quote}"
                            </p>

                            {/* Result Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full mb-6">
                                <t.resultIcon className="w-3 h-3 text-green-600" />
                                <span className="text-green-700 text-xs font-bold">{t.result}</span>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {t.initials}
                                </div>
                                <div>
                                    <p className="text-charcoal font-medium text-sm">{t.name}</p>
                                    <p className="text-charcoal/40 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { value: "500+", label: "Clienti attivi" },
                        { value: "2M+", label: "Messaggi gestiti" },
                        { value: "98%", label: "Soddisfazione" },
                        { value: "<2s", label: "Tempo risposta" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center bg-white/60 rounded-2xl py-5 px-4">
                            <p className="text-2xl lg:text-3xl font-serif text-gold font-medium">{stat.value}</p>
                            <p className="text-charcoal/40 text-xs mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProofEnhanced;
