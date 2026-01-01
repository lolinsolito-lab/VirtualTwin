"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Brain, Smartphone, Check, Clock, ArrowRight } from 'lucide-react';

const HowItWorksEnhanced = () => {
    const [inView, setInView] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Auto-advance steps
    useEffect(() => {
        if (!inView) return;
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, [inView]);

    const steps = [
        {
            icon: MessageSquare,
            emoji: "💬",
            time: "2 min",
            title: "Rispondi a 5 Domande",
            description: "Chi sei? Cosa vendi? Tono formale o casual? L'AI ha bisogno di conoscerti.",
            mockup: (
                <div className="bg-white rounded-xl p-4 shadow-lg border border-charcoal/5">
                    <p className="text-xs text-charcoal/40 mb-3 uppercase tracking-wider">Onboarding</p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-charcoal">Nome del business</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-charcoal">Cosa vendi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-gold animate-pulse" />
                            <span className="text-sm text-charcoal/60">Tono di voce...</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            icon: Brain,
            emoji: "🧠",
            time: "30 sec",
            title: "L'AI Impara",
            description: "Il tuo clone sta nascendo. Gemini analizza il tuo stile e crea la tua voce digitale.",
            mockup: (
                <div className="bg-charcoal rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Training AI</p>
                    <div className="flex items-center justify-center py-6">
                        <div className="relative">
                            <div className="w-16 h-16 gold-gradient rounded-full animate-pulse flex items-center justify-center">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-gold/30 animate-ping" />
                        </div>
                    </div>
                    <p className="text-center text-gold text-xs">Analizzando il tuo stile...</p>
                </div>
            )
        },
        {
            icon: Smartphone,
            emoji: "📱",
            time: "2 min",
            title: "Collega WhatsApp",
            description: "Scansiona il QR code e il tuo clone è live. Inizia a rispondere ai clienti.",
            mockup: (
                <div className="bg-white rounded-xl p-4 shadow-lg border border-charcoal/5">
                    <p className="text-xs text-charcoal/40 mb-3 uppercase tracking-wider">Connetti</p>
                    <div className="flex flex-col items-center py-4">
                        <div className="w-20 h-20 bg-charcoal/5 rounded-lg flex items-center justify-center mb-3">
                            <div className="grid grid-cols-5 gap-0.5">
                                {[0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0].map((filled, i) => (
                                    <div key={i} className={`w-2 h-2 ${filled ? 'bg-charcoal' : 'bg-transparent'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Connesso!
                        </p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section ref={sectionRef} id="how-it-works" className="py-20 lg:py-28 px-6 lg:px-12 bg-gradient-to-b from-champagne to-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-flex items-center gap-2 text-gold text-[9px] uppercase tracking-[0.5em] font-black bg-gold/5 px-5 py-2 rounded-full mb-6">
                        <Clock className="w-3 h-3" />
                        Setup in 5 Minuti
                    </span>
                    <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal mb-6">
                        Da Zero a <span className="italic gold-text-gradient">Live.</span>
                    </h2>
                    <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                        Niente setup complessi. Niente codice. <span className="text-charcoal font-medium">Davvero 5 minuti.</span>
                    </p>
                </div>

                {/* Steps - Desktop */}
                <div className="hidden lg:grid grid-cols-3 gap-8 mb-12">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`relative cursor-pointer transition-all duration-500 ${activeStep === i ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}
                            onClick={() => setActiveStep(i)}
                        >
                            {/* Connection Line */}
                            {i < 2 && (
                                <div className="absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-gold/50 to-transparent z-10">
                                    <ArrowRight className="absolute -right-2 -top-1.5 w-4 h-4 text-gold/50" />
                                </div>
                            )}

                            {/* Card */}
                            <div className={`bg-white rounded-[2rem] p-8 border transition-all duration-500 ${activeStep === i ? 'border-gold shadow-2xl' : 'border-charcoal/5 shadow-lg'}`}>
                                {/* Time Badge */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl">{step.emoji}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${activeStep === i ? 'bg-gold text-white' : 'bg-charcoal/5 text-charcoal/50'}`}>
                                        {step.time}
                                    </span>
                                </div>

                                {/* Step Number */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-6 transition-all ${activeStep === i ? 'gold-gradient text-white' : 'bg-charcoal/10 text-charcoal/40'}`}>
                                    <span className="font-serif text-lg font-bold">{i + 1}</span>
                                </div>

                                {/* Content */}
                                <h3 className="font-serif text-xl italic text-charcoal mb-3">{step.title}</h3>
                                <p className="text-charcoal/50 text-sm leading-relaxed mb-6">{step.description}</p>

                                {/* Mockup */}
                                <div className={`transition-all duration-500 ${activeStep === i ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
                                    {step.mockup}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Steps - Mobile */}
                <div className="lg:hidden space-y-6">
                    {steps.map((step, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-6 border border-charcoal/5 shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg italic text-charcoal">{step.title}</h3>
                                    <span className="text-gold text-xs font-bold">{step.time}</span>
                                </div>
                                <span className="text-3xl ml-auto">{step.emoji}</span>
                            </div>
                            <p className="text-charcoal/50 text-sm">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* Total Time */}
                <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-gold/5 rounded-full border border-gold/20">
                        <Clock className="w-5 h-5 text-gold" />
                        <span className="text-charcoal font-medium">Tempo totale:</span>
                        <span className="text-2xl font-serif text-gold font-bold">~5 minuti</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksEnhanced;
