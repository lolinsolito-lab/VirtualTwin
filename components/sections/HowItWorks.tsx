"use client";

import React from 'react';
import { Plug, Brain, Rocket } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            num: "01",
            icon: Plug,
            title: "Connetti",
            desc: "Collega WhatsApp, Instagram o Messenger in 2 click",
        },
        {
            num: "02",
            icon: Brain,
            title: "Insegna",
            desc: "L'AI impara il tuo tono, i tuoi servizi e le tue FAQ",
        },
        {
            num: "03",
            icon: Rocket,
            title: "Vendi",
            desc: "Il tuo clone risponde e qualifica lead 24/7",
        },
    ];

    return (
        <section className="py-32 lg:py-48 px-6 lg:px-12 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black mb-4 block">Come Funziona</span>
                    <h2 className="font-serif text-[2.5rem] md:text-[4rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal">
                        Tre Passi. <span className="italic gold-text-gradient">Zero Stress.</span>
                    </h2>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 relative">
                    {/* Connection Lines (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-[16.5%] right-[16.5%] h-[1px] bg-gold/20 -translate-y-1/2 z-0"></div>

                    {steps.map((step, i) => (
                        <div key={i} className="relative z-10 text-center group">
                            {/* Number Badge */}
                            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-champagne border-2 border-gold/20 flex items-center justify-center group-hover:border-gold group-hover:bg-gold transition-all duration-500">
                                <span className="text-2xl font-serif text-gold group-hover:text-white transition-colors duration-500">{step.num}</span>
                            </div>

                            {/* Icon */}
                            <step.icon className="w-8 h-8 mx-auto mb-4 text-charcoal/30 group-hover:text-gold transition-colors duration-300" />

                            {/* Title */}
                            <h3 className="text-2xl font-serif italic text-charcoal mb-3">{step.title}</h3>

                            {/* Description */}
                            <p className="text-charcoal/50 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-20">
                    <p className="text-charcoal/40 text-sm mb-6">
                        <span className="font-bold text-charcoal">5 minuti</span> di setup.
                        <span className="font-bold text-charcoal"> Zero</span> competenze tecniche richieste.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
