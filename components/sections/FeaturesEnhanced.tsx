"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Target, CreditCard, Globe, Calendar, Brain, Mic, BarChart3, Zap, ChevronDown, ChevronUp, Sparkles, Play } from 'lucide-react';
import Image from 'next/image';

/**
 * Features Enhanced - REAL IMAGES VERSION
 * 
 * Each feature has a real 3D illustration + smooth animations
 * Fixed: animation loop bug on mouse movement
 */
const FeaturesEnhanced = () => {
    const [inView, setInView] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [activeFeature, setActiveFeature] = useState<number | null>(null);
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
            stat: "98% indistinguibile",
            demo: "Ciao! Sono il clone di Marco. Come posso aiutarti oggi?"
        },
        {
            icon: Target,
            title: "Filtro dell'Élite",
            desc: "Separa il valore dal rumore. Il sistema seleziona chi è pronto all'acquisto.",
            image: "/images/features/feature_filter.png",
            stat: "3x più conversioni",
            demo: "Lead qualificato: Budget ✓ Urgenza ✓ Decisore ✓"
        },
        {
            icon: CreditCard,
            title: "Conversione Silenziosa",
            desc: "Dal desiderio alla transazione. Ogni interazione è un passo verso la vendita.",
            image: "/images/features/feature_conversion.png",
            stat: "+47% vendite",
            demo: "Pagamento completato! €2.497 ricevuti."
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
            demo?: string;
        },
        index: number,
        isCore?: boolean
    }) => {
        const isActive = activeFeature === index;

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                className={`group relative bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-lg hover:shadow-2xl transition-all duration-500 ${isCore ? 'min-h-[420px]' : 'min-h-[320px]'
                    }`}
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

                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-charcoal/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                            <feature.icon className="w-5 h-5 text-charcoal/40 group-hover:text-gold transition-colors" />
                        </div>
                        <h3 className="font-serif text-xl text-charcoal italic group-hover:text-gold transition-colors">
                            {feature.title}
                        </h3>
                    </div>

                    {/* Description */}
                    <p className="text-charcoal/60 leading-relaxed mb-4">
                        {feature.desc}
                    </p>

                    {/* Demo Preview (only for core features) */}
                    {isCore && feature.demo && (
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 bg-gold/5 rounded-xl border border-gold/20 mt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Play className="w-3 h-3 text-gold" />
                                            <span className="text-[10px] uppercase tracking-wider text-gold font-bold">Demo Live</span>
                                        </div>
                                        <p className="text-sm text-charcoal/80 font-medium italic">
                                            "{feature.demo}"
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Active Indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gold transform ${isActive ? 'scale-x-100' : 'scale-x-0'} transition-transform duration-300 origin-left`} />
            </motion.div>
        );
    };

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
                        {expanded ? 'Mostra Meno' : 'E Molto Altro Ancora'}
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
