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
            title: "Identità Indistinguibile",
            desc: "L'AI assorbe il tuo battito verbale. I clienti non staranno parlando con un bot, ma con il tuo genio digitale.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: Target,
            title: "Filtro dell'Élite",
            desc: "Separa istantaneamente il valore dal rumore. Il sistema seleziona chi è pronto, proteggendo la tua energia.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: CreditCard,
            title: "Conversione Silenziosa",
            desc: "Dalla gestione del desiderio alla transazione finale. Ogni interazione è un passo fluido verso l'impatto.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        }
    ];

    const extraFeatures = [
        {
            icon: Globe,
            title: "Ubiquità Linguistica",
            desc: "Oltre i confini. Italiano, inglese, spagnolo, tedesco. Il tuo business parla ogni lingua del mondo.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: Calendar,
            title: "Grazia Logistica",
            desc: "Prenotazioni senza frizione. Calendly, Google, Cal.com. Il tempo si organizza da solo.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: Brain,
            title: "Evoluzione Continua",
            desc: "Ogni conversazione è un atto di apprendimento. Il sistema si affina col tuo successo.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: Mic,
            title: "Presenza Multimodale",
            desc: "Audio, immagini, documenti. Una comprensione totale per un'assistenza priva di limiti.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: BarChart3,
            title: "Verità Statistica",
            desc: "Metrics d'élite in tempo reale. Ogni centesimo e ogni lead tracciati con precisione chirurgica.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        },
        {
            icon: Zap,
            title: "Risonanza Infinita",
            desc: "Follow-up che non dimenticano mai. Mantieni vivo il desiderio senza alcuno sforzo biologico.",
            iconBg: "bg-charcoal/5",
            cardBg: "bg-white/40"
        }
    ];

    const FeatureCard = ({ feature, index }: { feature: typeof coreFeatures[0], index: number }) => (
        <div
            className={`group relative ${feature.cardBg} backdrop-blur-3xl rounded-[2rem] p-8 lg:p-12 border border-white/40 shadow-2xl transition-all duration-1000 hover:border-gold/30 hover:-translate-y-2`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-10 group-hover:bg-gold/10 transition-all duration-500`}>
                <feature.icon className="w-6 h-6 text-charcoal/20 group-hover:text-gold transition-colors" />
            </div>

            <h3 className="font-serif text-2xl lg:text-3xl text-charcoal mb-4 italic group-hover:text-gold transition-colors">
                {feature.title}
            </h3>
            <p className="text-charcoal/40 text-lg leading-relaxed italic font-light">
                "{feature.desc}"
            </p>
        </div>
    );

    return (
        <section ref={sectionRef} id="features" className="py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-b from-champagne to-white relative overflow-hidden">
            <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                <div className="text-center mb-24">
                    <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-8 block opacity-40">Magnificare la Visione</span>
                    <h2 className="font-serif text-5xl md:text-9xl text-charcoal mb-12 leading-[0.8] tracking-tighter">
                        Strumenti <br />
                        <span className="text-gold italic">di Potere.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-charcoal/30 max-w-2xl mx-auto leading-relaxed font-light italic">
                        "La perfezione non è quando non c'è più nulla da aggiungere. <br />
                        <strong className="text-charcoal/50 font-medium italic text-xl">Ma quando non c'è più nulla da togliere."</strong>
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
