"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Target, CreditCard, Globe, Calendar, Brain, Mic, BarChart3, Zap, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Image from 'next/image';

/**
 * Features Enhanced - REAL IMAGES + CSS-ONLY HOVER
 * 
 * Fixed: No React state for hover = no re-render loop
 * Text centered in cards
 */
const FeaturesEnhanced = () => {
    const [inView, setInView] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const coreFeatures = [
        {
            icon: MessageCircle,
            title: "Identità Indistinguibile",
            desc: "L'AI assorbe il tuo stile. I clienti parlano con il tuo genio digitale, non con un bot.",
            image: "/images/features/feature_identity.png",
            stat: "98% indistinguibile"
        },
        {
            icon: Target,
            title: "Filtro dell'Élite",
            desc: "Separa il valore dal rumore. Il sistema seleziona chi è pronto all'acquisto.",
            image: "/images/features/feature_filter.png",
            stat: "3x più conversioni"
        },
        {
            icon: CreditCard,
            title: "Conversione Silenziosa",
            desc: "Dal desiderio alla transazione. Ogni interazione è un passo verso la vendita.",
            image: "/images/features/feature_conversion.png",
            stat: "+47% vendite"
        }
    ];

    const extraFeatures = [
        {
            icon: Globe,
            title: "Ubiquità Linguistica",
            desc: "Italiano, inglese, spagnolo, tedesco e 50+ lingue del mondo.",
            image: "/images/features/feature_globe.png",
            stat: "50+ lingue"
        },
        {
            icon: Calendar,
            title: "Grazia Logistica",
            desc: "Prenotazioni automatiche. Calendly, Google, Cal.com integrati.",
            image: "/images/features/feature_calendar.png",
            stat: "Zero no-show"
        },
        {
            icon: Brain,
            title: "Evoluzione Continua",
            desc: "Ogni conversazione è apprendimento. Il sistema migliora col tuo successo.",
            image: "/images/features/feature_brain.png",
            stat: "Auto-learning"
        },
        {
            icon: Mic,
            title: "Presenza Multimodale",
            desc: "Audio, immagini, documenti. Comprensione totale senza limiti.",
            image: "/images/features/feature_microphone.png",
            stat: "Voice + Vision"
        },
        {
            icon: BarChart3,
            title: "Verità Statistica",
            desc: "Metrics in tempo reale. Ogni lead tracciato con precisione chirurgica.",
            image: "/images/features/feature_analytics.png",
            stat: "Dashboard live"
        },
        {
            icon: Zap,
            title: "Risonanza Infinita",
            desc: "Follow-up automatici che non dimenticano mai. Zero lead persi.",
            image: "/images/features/feature_lightning.png",
            stat: "0% lead persi"
        }
    ];

    const FeatureCard = ({ feature, index, isCore = false }: {
        feature: {
            icon: any;
            title: string;
            desc: string;
            image: string;
            stat: string;
        },
        index: number,
        isCore?: boolean
    }) => (
        <div
            className={`group relative bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-lg hover:shadow-2xl transition-all duration-500 ${isCore ? 'min-h-[380px]' : 'min-h-[300px]'
                }`}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.5s ease ${index * 0.1}s`
            }}
        >
            {/* Image Header */}
            <div className="relative h-40 overflow-hidden">
                <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                {/* Stat Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-charcoal text-[11px] font-black uppercase tracking-wider">
                        {feature.stat}
                    </span>
                </div>

                {/* Shimmer on hover - CSS only */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </div>

            {/* Content - CENTERED */}
            <div className="p-6 text-center">
                {/* Icon */}
                <div className="w-12 h-12 mx-auto rounded-xl bg-charcoal/5 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-charcoal/40 group-hover:text-gold transition-colors" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl text-charcoal italic mb-3 group-hover:text-gold transition-colors">
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-charcoal/60 leading-relaxed text-sm">
                    {feature.desc}
                </p>
            </div>

            {/* Active Indicator - CSS only */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
        </div>
    );

    return (
        <section ref={sectionRef} id="features" className="py-20 lg:py-32 px-6 lg:px-12 bg-gradient-to-b from-champagne via-white to-champagne/50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
            </div>

            <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Arsenal Completo</span>
                    </span>

                    <h2 className="font-serif text-5xl md:text-8xl text-charcoal mb-8 leading-[0.9] tracking-tight">
                        Strumenti <br />
                        <span className="text-gold italic">di Potere.</span>
                    </h2>

                    <p className="text-xl text-charcoal/40 max-w-2xl mx-auto italic">
                        "La perfezione non è quando non c'è più nulla da aggiungere.<br />
                        <strong className="text-charcoal/60">Ma quando non c'è più nulla da togliere."</strong>
                    </p>
                </div>

                {/* Core Features - 3 large cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {coreFeatures.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} isCore={true} />
                    ))}
                </div>

                {/* Expand Button */}
                <div className="text-center mb-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpanded(!expanded)}
                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 ${expanded
                                ? 'bg-charcoal text-white'
                                : 'bg-gold/10 text-gold hover:bg-gold hover:text-white'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        {expanded ? 'Mostra Meno' : 'Esplora Tutto'}
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.button>
                </div>

                {/* Extra Features - 6 cards (expandable) */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-3 gap-6 overflow-hidden"
                        >
                            {extraFeatures.map((feature, i) => (
                                <FeatureCard key={i} feature={feature} index={i + 3} isCore={false} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <p className="text-charcoal/40 italic">
                        Tutto questo, <strong className="text-charcoal/60">senza scrivere una riga di codice.</strong>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FeaturesEnhanced;
