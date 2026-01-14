"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Target, CreditCard, Globe, Calendar, Brain, Mic, BarChart3, Zap, ChevronDown, ChevronUp, Sparkles, Play } from 'lucide-react';

/**
 * Features Enhanced - VISUAL STORYTELLING VERSION
 * 
 * Each feature has a visual illustration + animated reveal
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
            desc: "L'AI assorbe il tuo battito verbale. I clienti non parlano con un bot, ma con il tuo genio digitale.",
            visual: "💬",
            gradient: "from-violet-500 to-purple-600",
            demo: "Ciao! Sono il clone di Marco. Come posso aiutarti oggi?",
            stat: "98% non distingue dall'originale"
        },
        {
            icon: Target,
            title: "Filtro dell'Élite",
            desc: "Separa istantaneamente il valore dal rumore. Il sistema seleziona chi è pronto.",
            visual: "🎯",
            gradient: "from-amber-500 to-orange-600",
            demo: "Lead qualificato: Budget ✓ Urgenza ✓ Decisore ✓",
            stat: "3x più conversioni"
        },
        {
            icon: CreditCard,
            title: "Conversione Silenziosa",
            desc: "Dalla gestione del desiderio alla transazione. Ogni interazione è un passo verso l'impatto.",
            visual: "💳",
            gradient: "from-emerald-500 to-green-600",
            demo: "Pagamento completato! €2.497 ricevuti.",
            stat: "+47% vendite automatiche"
        }
    ];

    const extraFeatures = [
        {
            icon: Globe,
            title: "Ubiquità Linguistica",
            desc: "Italiano, inglese, spagnolo, tedesco. Il tuo business parla ogni lingua.",
            visual: "🌍",
            gradient: "from-blue-500 to-cyan-600",
            stat: "50+ lingue"
        },
        {
            icon: Calendar,
            title: "Grazia Logistica",
            desc: "Prenotazioni senza frizione. Calendly, Google, Cal.com integrati.",
            visual: "📅",
            gradient: "from-pink-500 to-rose-600",
            stat: "Zero no-show"
        },
        {
            icon: Brain,
            title: "Evoluzione Continua",
            desc: "Ogni conversazione è apprendimento. Il sistema si affina col tuo successo.",
            visual: "🧠",
            gradient: "from-indigo-500 to-blue-600",
            stat: "Auto-miglioramento"
        },
        {
            icon: Mic,
            title: "Presenza Multimodale",
            desc: "Audio, immagini, documenti. Comprensione totale senza limiti.",
            visual: "🎙️",
            gradient: "from-red-500 to-rose-600",
            stat: "Voice + Vision"
        },
        {
            icon: BarChart3,
            title: "Verità Statistica",
            desc: "Metrics d'élite in tempo reale. Ogni lead tracciato con precisione.",
            visual: "📊",
            gradient: "from-teal-500 to-emerald-600",
            stat: "Dashboard live"
        },
        {
            icon: Zap,
            title: "Risonanza Infinita",
            desc: "Follow-up che non dimenticano mai. Mantieni vivo il desiderio.",
            visual: "⚡",
            gradient: "from-yellow-500 to-amber-600",
            stat: "0% lead persi"
        }
    ];

    const FeatureCard = ({ feature, index, isCore = false }: {
        feature: typeof coreFeatures[0],
        index: number,
        isCore?: boolean
    }) => {
        const isActive = activeFeature === index;

        return (
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                className={`group relative bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-lg hover:shadow-2xl transition-all duration-500 ${isCore ? 'min-h-[380px]' : 'min-h-[280px]'
                    }`}
            >
                {/* Visual Header with Gradient */}
                <div className={`relative h-32 bg-gradient-to-br ${feature.gradient} overflow-hidden`}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                              radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)`
                        }} />
                    </div>

                    {/* Large Emoji Visual */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                            className="text-6xl opacity-90 group-hover:scale-125 transition-transform duration-500"
                            animate={isActive ? { y: [0, -10, 0] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {feature.visual}
                        </motion.span>
                    </div>

                    {/* Stat Badge */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                            {feature.stat}
                        </span>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                            <feature.icon className="w-5 h-5 text-white" />
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
                    {isCore && 'demo' in feature && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={isActive ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 bg-charcoal/5 rounded-xl border border-charcoal/10 mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <Play className="w-3 h-3 text-gold" />
                                    <span className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold">Demo Live</span>
                                </div>
                                <p className="text-sm text-charcoal/80 font-medium italic">
                                    "{(feature as any).demo}"
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Active Indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
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

            <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                className="max-w-7xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Arsenal Completo</span>
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-5xl md:text-8xl text-charcoal mb-8 leading-[0.9] tracking-tight"
                    >
                        Strumenti <br />
                        <span className="text-gold italic">di Potere.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xl text-charcoal/40 max-w-2xl mx-auto italic"
                    >
                        "La perfezione non è quando non c'è più nulla da aggiungere.<br />
                        <strong className="text-charcoal/60">Ma quando non c'è più nulla da togliere."</strong>
                    </motion.p>
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <p className="text-charcoal/40 italic mb-6">
                        Tutto questo, <strong className="text-charcoal/60">senza scrivere una riga di codice.</strong>
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default FeaturesEnhanced;
