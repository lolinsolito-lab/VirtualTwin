"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, Target, CreditCard, Globe, Calendar, Brain, Mic, BarChart3, Zap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const FeaturesEnhanced = () => {
    const [mounted, setMounted] = useState(false);
    const [inView, setInView] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setMounted(true);
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const coreFeatures = [
        {
            icon: MessageCircle,
            title: "Parla Come Te",
            desc: "L'AI impara il tuo tono, stile e risposte. I clienti pensano di parlare con te.",
            iconBg: "bg-gradient-to-br from-pink-400 to-pink-500",
            cardBg: "bg-gradient-to-br from-pink-50 to-white"
        },
        {
            icon: Target,
            title: "Qualifica Automatica",
            desc: "Separa i curiosi dai compratori. Tu parli solo con chi è pronto a pagare.",
            iconBg: "bg-gradient-to-br from-orange-400 to-orange-500",
            cardBg: "bg-gradient-to-br from-orange-50 to-white"
        },
        {
            icon: CreditCard,
            title: "Chiude le Vendite",
            desc: "Invia link Stripe, prenota chiamate, raccoglie pagamenti. Tutto in chat.",
            iconBg: "bg-gradient-to-br from-amber-400 to-amber-500",
            cardBg: "bg-gradient-to-br from-amber-50 to-white"
        }
    ];

    const extraFeatures = [
        {
            icon: Globe,
            title: "Multi-Lingua Nativo",
            desc: "Italiano, inglese, spagnolo, tedesco. Risposte automatiche nella lingua del cliente.",
            iconBg: "bg-gradient-to-br from-blue-400 to-blue-500",
            cardBg: "bg-gradient-to-br from-blue-50 to-white"
        },
        {
            icon: Calendar,
            title: "Booking Integrato",
            desc: "Calendly, Cal.com, Google Calendar. Prenota appuntamenti direttamente in chat.",
            iconBg: "bg-gradient-to-br from-green-400 to-green-500",
            cardBg: "bg-gradient-to-br from-green-50 to-white"
        },
        {
            icon: Brain,
            title: "Impara & Migliora",
            desc: "Ogni conversazione lo rende più intelligente. Feedback loop automatico.",
            iconBg: "bg-gradient-to-br from-purple-400 to-purple-500",
            cardBg: "bg-gradient-to-br from-purple-50 to-white"
        },
        {
            icon: Mic,
            title: "Audio & Media",
            desc: "Gestisce note vocali, immagini e documenti. Risponde in modo contestuale.",
            iconBg: "bg-gradient-to-br from-rose-400 to-rose-500",
            cardBg: "bg-gradient-to-br from-rose-50 to-white"
        },
        {
            icon: BarChart3,
            title: "Analytics Avanzati",
            desc: "Dashboard con metriche: lead, conversioni, revenue. Tutto in tempo reale.",
            iconBg: "bg-gradient-to-br from-indigo-400 to-indigo-500",
            cardBg: "bg-gradient-to-br from-indigo-50 to-white"
        },
        {
            icon: Zap,
            title: "Follow-up Automatici",
            desc: "Sequenze automatiche per lead freddi. Non perdi mai un'opportunità.",
            iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-500",
            cardBg: "bg-gradient-to-br from-yellow-50 to-white"
        }
    ];

    const FeatureCard = ({ feature, index }: { feature: typeof coreFeatures[0], index: number }) => (
        <div
            className={`group relative ${feature.cardBg} rounded-3xl p-6 lg:p-8 border border-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Icon */}
            <div className={`w-12 h-12 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                <feature.icon className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <h3 className="font-serif text-lg lg:text-xl text-charcoal mb-2 group-hover:text-gold transition-colors">
                {feature.title}
            </h3>
            <p className="text-charcoal/50 text-sm leading-relaxed">
                {feature.desc}
            </p>
        </div>
    );

    return (
        <section ref={sectionRef} id="features" className="py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-b from-champagne to-white relative overflow-hidden">
            <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">Mentre Tu Vivi</span>
                    <h2 className="font-serif text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-medium leading-[1] tracking-[-0.02em] text-charcoal mt-4 mb-4">
                        Lui Risponde. Vende. <span className="italic text-gold">Incassa.</span>
                    </h2>
                    <p className="text-charcoal/50 text-base lg:text-lg max-w-lg mx-auto">
                        Tutto in un'unica piattaforma. <span className="text-charcoal font-medium">Niente più 10 tool diversi.</span>
                    </p>
                </div>

                {/* Core Features - 3 cards */}
                <div className="grid md:grid-cols-3 gap-5 mb-8">
                    {coreFeatures.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} />
                    ))}
                </div>

                {/* Expand Button */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gold/10 hover:bg-gold hover:text-white rounded-full text-gold text-xs font-bold uppercase tracking-wider transition-all duration-300"
                    >
                        <Sparkles className="w-4 h-4" />
                        {expanded ? 'Mostra Meno' : 'E Molto Altro Ancora'}
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>

                {/* Extra Features - 6 cards (expandable) */}
                <div className={`grid md:grid-cols-3 gap-5 transition-all duration-500 ${expanded ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                    {extraFeatures.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i + 3} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesEnhanced;
