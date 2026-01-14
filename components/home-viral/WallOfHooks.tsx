"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Infinity, Sparkles } from 'lucide-react';
import Image from 'next/image';

/**
 * Wall of Hooks Component - VISUAL VERSION
 * 
 * 3 Truths with real images and visual cards
 */
export default function WallOfHooks() {
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

    const laws = [
        {
            text: "Tu ti godi la vita. Il tuo Clone fa crescere il business.",
            icon: Bot,
            image: "/images/truths/truth_freedom.png",
            badge: "Libertà Totale"
        },
        {
            text: "Il Clone parla esattamente come te, senza mai stancarsi. Sempre coerente.",
            icon: Infinity,
            image: "/images/truths/truth_clone.png",
            badge: "Identità Perfetta"
        },
        {
            text: "24/7 su WhatsApp e Instagram, risponde ai clienti mentre tu riposi.",
            icon: Sparkles,
            image: "/images/truths/truth_247.png",
            badge: "Sempre Attivo"
        }
    ];

    return (
        <section ref={sectionRef} className="relative z-10 py-20 bg-gradient-to-b from-champagne/30 via-white to-champagne/20">
            <div className="container mx-auto px-6">
                <div className={`max-w-7xl mx-auto transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Le 3 Verità Che Cambiano Tutto</span>
                        </span>

                        <h2 className="font-serif text-4xl md:text-8xl text-charcoal mb-8 leading-[0.9] tracking-tighter">
                            La Struttura della <br />
                            <span className="text-gold italic">Tua Nuova Libertà.</span>
                        </h2>
                    </div>

                    {/* Truths Grid - Visual Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {laws.map((law, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-lg hover:shadow-2xl transition-all duration-500"
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transform: inView ? 'translateY(0)' : 'translateY(30px)',
                                    transition: `all 0.5s ease ${index * 0.15}s`
                                }}
                            >
                                {/* Image Header */}
                                <div className="relative h-52 overflow-hidden">
                                    <Image
                                        src={law.image}
                                        alt={law.text}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                                    {/* Badge */}
                                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-gold text-white rounded-full shadow-lg">
                                        <span className="text-[10px] font-black uppercase tracking-wider">
                                            {law.badge}
                                        </span>
                                    </div>

                                    {/* Shimmer on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                </div>

                                {/* Content - Centered */}
                                <div className="p-8 text-center">
                                    {/* Icon */}
                                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold transition-colors">
                                        <law.icon className="w-7 h-7 text-gold group-hover:text-white transition-colors" />
                                    </div>

                                    {/* Text */}
                                    <p className="text-charcoal/80 font-serif text-xl leading-tight italic">
                                        "{law.text}"
                                    </p>

                                    {/* Verità Assoluta Badge */}
                                    <div className="mt-6 pt-6 border-t border-charcoal/10">
                                        <span className="text-gold text-[9px] uppercase font-black tracking-[0.3em]">
                                            Verità Assoluta
                                        </span>
                                    </div>
                                </div>

                                {/* Active Indicator */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
