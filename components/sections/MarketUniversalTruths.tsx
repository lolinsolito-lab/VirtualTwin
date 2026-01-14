"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Users, Crown, Globe, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

/**
 * MarketUniversalTruths Section - VISUAL VERSION
 * Focus: The 6 Stages with real images and interactive cards
 */
export default function MarketUniversalTruths() {
    const [inView, setInView] = useState(false);
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

    const truths = [
        {
            stage: "STADIO I",
            title: "Il Risveglio del Veggente",
            icon: Sparkles,
            truth: "Per quelli che intuiscono che la vecchia via è morta. Il primo passo verso la fine del compromesso.",
            impact: "Chiarezza Visionaria",
            image: "/images/stages/stage_awakening.png"
        },
        {
            stage: "STADIO II",
            title: "La Bicicletta per la Mente",
            icon: Zap,
            truth: "Lo strumento che amplifica ogni tua parola. Trasforma il tuo sforzo in una forza inarrestabile.",
            impact: "Efficienza Pura",
            image: "/images/stages/stage_bicycle.png"
        },
        {
            stage: "STADIO III",
            title: "La Moltiplicazione dell'Anima",
            icon: Users,
            truth: "Per chi rifiuta di scegliere tra carriera e vita. Essere ovunque, senza essere nessuno.",
            impact: "Dignità Temporale",
            image: "/images/stages/stage_soul.png"
        },
        {
            stage: "STADIO IV",
            title: "Il Dominio dell'Invisibile",
            icon: Globe,
            truth: "Costruisci un impero che non ha bisogno di vederti per obbedirti. La struttura diventa l'arte.",
            impact: "Autonomia Totale",
            image: "/images/stages/stage_invisible.png"
        },
        {
            stage: "STADIO V",
            title: "L'Eredità Immortale",
            icon: Crown,
            truth: "Il tuo genio depositato nel futuro. Un brand che non muore mai, perché vive nel silicio.",
            impact: "Presenza Eterna",
            image: "/images/stages/stage_legacy.png"
        },
        {
            stage: "STADIO VI",
            title: "Quando Tutto Funziona Insieme",
            icon: ShieldCheck,
            truth: "L'Unione Sacra. Dove il pensiero diventa algoritmo e l'algoritmo diventa destino.",
            impact: "Alchimia Mondiale",
            image: "/images/stages/stage_alchemy.png"
        }
    ];

    return (
        <section ref={sectionRef} className="relative py-24 bg-gradient-to-b from-white via-champagne/30 to-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
            </div>

            <div className={`container mx-auto px-6 relative z-10 transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-8">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">The Mastermind Path</span>
                    </span>

                    <h2 className="font-serif text-4xl md:text-8xl text-charcoal mb-8 leading-[0.9] tracking-tighter">
                        Ai folli, ai ribelli, <br />
                        <span className="text-gold italic">ai visionari.</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-charcoal/40 max-w-3xl mx-auto italic">
                        "VirtualTwin non è per tutti. È per chi vede il mondo diversamente."
                    </p>
                </div>

                {/* Stages Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {truths.map((truth, i) => (
                        <div
                            key={i}
                            className="group relative bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-lg hover:shadow-2xl transition-all duration-500"
                            style={{
                                opacity: inView ? 1 : 0,
                                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                transition: `all 0.5s ease ${i * 0.1}s`
                            }}
                        >
                            {/* Image Header */}
                            <div className="relative h-44 overflow-hidden">
                                <Image
                                    src={truth.image}
                                    alt={truth.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                                {/* Stage Badge */}
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                    <span className="text-charcoal text-[10px] font-black uppercase tracking-wider">
                                        {truth.stage}
                                    </span>
                                </div>

                                {/* Shimmer on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                            </div>

                            {/* Content - Centered */}
                            <div className="p-6 text-center">
                                {/* Icon */}
                                <div className="w-12 h-12 mx-auto rounded-xl bg-charcoal/5 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                                    <truth.icon className="w-6 h-6 text-charcoal/40 group-hover:text-gold transition-colors" />
                                </div>

                                {/* Title */}
                                <h3 className="font-serif text-xl text-charcoal italic mb-3 group-hover:text-gold transition-colors">
                                    {truth.title}
                                </h3>

                                {/* Description */}
                                <p className="text-charcoal/50 leading-relaxed text-sm mb-4">
                                    "{truth.truth}"
                                </p>

                                {/* Impact Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full">
                                    <span className="text-gold text-[10px] font-black uppercase tracking-wider">
                                        {truth.impact}
                                    </span>
                                </div>
                            </div>

                            {/* Active Indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                        </div>
                    ))}
                </div>

                {/* Viral Truth Nugget */}
                <div className="mt-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block relative"
                    >
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-[4rem] blur-2xl opacity-30" />

                        <div className="relative p-10 md:p-12 bg-charcoal rounded-[3rem] overflow-hidden shadow-2xl max-w-4xl border border-gold/20">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.1),transparent)]" />
                            <h4 className="font-serif text-xl md:text-2xl text-white italic leading-relaxed relative z-10">
                                "Stiamo creando una realtà dove il Fondatore non serve più al business, <br />
                                <span className="text-gold">ma il business serve il Fondatore."</span>
                            </h4>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
