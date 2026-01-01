"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Check, Zap, Sparkles, Crown, Star, ArrowRight, Clock, Gift } from 'lucide-react';
import { getPlanAvailability, PlanAvailability, PlanName, FOUNDER_LIMITS } from '@/lib/founderAvailability';

// Countdown Timer Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        // Calculate time until next Sunday midnight
        const getTimeUntilSunday = () => {
            const now = new Date();
            const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
            const nextSunday = new Date(now);
            nextSunday.setDate(now.getDate() + daysUntilSunday);
            nextSunday.setHours(23, 59, 59, 999);

            const diff = nextSunday.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            return { hours: hours % 48, minutes, seconds }; // Cap at 48h for display
        };

        const timer = setInterval(() => {
            setTimeLeft(getTimeUntilSunday());
        }, 1000);

        setTimeLeft(getTimeUntilSunday());
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-6 py-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
                <Gift className="w-5 h-5" />
                <span className="font-bold text-sm">BONUS: 14 giorni trial</span>
                <span className="text-green-600/70 text-sm">(invece di 7)</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                <Clock className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-mono font-bold text-sm">
                    {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
            </div>
        </div>
    );
};


const PricingUltimate = () => {
    const [mounted, setMounted] = useState(false);
    const [inView, setInView] = useState(false);
    const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
    const [planAvailability, setPlanAvailability] = useState<Record<PlanName, PlanAvailability> | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setMounted(true);

        // Fetch real-time plan availability from Supabase
        const fetchAvailability = async () => {
            try {
                const availability = await getPlanAvailability();
                setPlanAvailability(availability);
            } catch (error) {
                console.error('Failed to fetch plan availability:', error);
            }
        };
        fetchAvailability();

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

    // Helper function to check if a plan is sold out
    const isPlanSoldOut = (planName: string): boolean => {
        if (!planAvailability) return false;
        const normalizedName = planName.toLowerCase() as PlanName;
        return planAvailability[normalizedName]?.isSoldOut || false;
    };

    // Helper function to get remaining spots
    const getFoundersRemaining = (planName: string): number => {
        if (!planAvailability) return 0;
        const normalizedName = planName.toLowerCase() as PlanName;
        return planAvailability[normalizedName]?.foundersRemaining || 0;
    };

    const plans = [
        {
            name: "Curioso",
            icon: Sparkles,
            price: "€0",
            publicPrice: "€0",
            period: "14 giorni",
            story: "Trial gratuito",
            features: ["1 Clone AI", "100 msg", "1 Canale", "Watermark"],
            cta: "Inizia Gratis",
            href: "/auth/register",
            bg: "bg-white",
            border: "border-charcoal/10",
            accent: "text-charcoal/60",
            btnStyle: "bg-champagne border border-charcoal/10 text-charcoal hover:bg-charcoal hover:text-white",
            soldOut: false
        },
        {
            name: "Esploratore",
            icon: Zap,
            price: "€39",
            publicPrice: "€79",
            period: "/mese",
            story: "Per testare il potenziale",
            features: ["1 Clone AI", "1K msg/mese", "Analytics Base", "Email Support"],
            cta: "Esplora",
            href: "/auth/register?plan=explorer",
            bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
            border: "border-blue-200",
            accent: "text-blue-600",
            btnStyle: "bg-blue-600 text-white hover:bg-blue-700"
        },
        {
            name: "Pioniere",
            icon: Zap,
            price: "€97",
            publicPrice: "€197",
            period: "/mese",
            story: "Per chi fa sul serio",
            features: ["1 Clone AI", "5K msg/mese", "3 Canali", "A/B Test (20%)"],
            cta: "Inizia il Viaggio",
            href: "/auth/register?plan=pioneer",
            bg: "bg-gradient-to-br from-gold/5 to-gold/15",
            border: "border-gold/40",
            accent: "text-gold",
            btnStyle: "gold-gradient text-white shadow-lg",
            popular: true,
            glow: true
        },
        {
            name: "Conquistatore",
            icon: Crown,
            price: "€197",
            publicPrice: "€397",
            period: "/mese",
            story: "Per dominare il mercato",
            features: ["3 Cloni AI", "20K msg/mese", "Priority Support", "API (20K req)"],
            cta: "Conquista",
            href: "/auth/register?plan=conqueror",
            bg: "bg-gradient-to-br from-champagne to-white",
            border: "border-gold/20",
            accent: "text-gold",
            btnStyle: "bg-charcoal text-white hover:bg-gold"
            // soldOut: true — ATTIVA QUANDO ESAURITO
        },
        {
            name: "Imperatore",
            icon: Crown,
            price: "€595",
            publicPrice: "€797",
            period: "/mese",
            story: "Per costruire imperi",
            features: ["10 Cloni AI", "50K msg/mese", "White-label", "Account Manager"],
            cta: "Regna",
            href: "/contact",
            bg: "gold-gradient",
            border: "border-transparent",
            accent: "text-white/80",
            btnStyle: "bg-white text-gold hover:bg-champagne shadow-lg",
            isGold: true
        }
    ];

    return (
        <section ref={sectionRef} id="pricing" className="py-12 lg:py-28 px-6 lg:px-12 bg-gradient-to-b from-champagne to-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* HEADER */}
                <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-flex items-center gap-2 text-gold text-[9px] uppercase tracking-[0.5em] font-black bg-gold/5 px-5 py-2 rounded-full mb-8">
                        <Sparkles className="w-3 h-3" />
                        La Tua Scelta
                    </span>
                    <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal mb-8">
                        Quanto Vale la Tua <br className="md:hidden" />
                        <span className="italic gold-text-gradient">Libertà?</span>
                    </h2>
                    <p className="text-charcoal/50 text-lg max-w-xl mx-auto mb-8">
                        14 giorni per provare. Nessuna carta. <span className="text-charcoal font-medium">Zero rischi.</span>
                    </p>

                    {/* COUNTDOWN BONUS */}
                    <CountdownTimer />
                </div>

                {/* PRICING GRID - 5 PLANS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-[2rem] transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onMouseEnter={() => setHoveredPlan(i)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <div className="relative">
                                        <div className="absolute inset-0 gold-gradient blur-lg opacity-50 rounded-full"></div>
                                        <div className="relative gold-gradient text-white text-[9px] uppercase tracking-wider font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-xl">
                                            <Star className="w-3 h-3 fill-white" />
                                            Più Amato
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Glow Effect for Popular */}
                            {plan.glow && (
                                <div className="absolute -inset-2 bg-gold/20 rounded-[2.5rem] blur-xl opacity-50"></div>
                            )}

                            {/* SOLD OUT Overlay - Luxury Transparent (AUTOMATIC from Supabase) */}
                            {isPlanSoldOut(plan.name) && (
                                <div className="absolute inset-0 z-30 rounded-[2rem] overflow-hidden">
                                    {/* Semi-transparent Glass Overlay - can see product behind */}
                                    <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px]"></div>

                                    {/* Elegant Gold Ribbon */}
                                    <div className="absolute top-6 -right-14 w-52 transform rotate-45">
                                        <div className="gold-gradient text-white text-center py-2.5 shadow-xl">
                                            <span className="text-[9px] uppercase tracking-[0.4em] font-black">Esaurito</span>
                                        </div>
                                    </div>

                                    {/* Waitlist Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        {/* Show the plan name */}
                                        <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-bold mb-2">{plan.name}</p>

                                        {/* Price crossed out */}
                                        <div className="relative mb-4">
                                            <span className="text-3xl font-serif text-white/40 line-through">{plan.price}</span>
                                            <span className="text-white/30 text-sm ml-1">{plan.period}</span>
                                        </div>

                                        {/* Central Icon */}
                                        <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mb-4 shadow-lg">
                                            <Crown className="w-7 h-7 text-white" />
                                        </div>

                                        <p className="font-serif text-xl text-white italic mb-1">Lista d'Attesa</p>
                                        <p className="text-white/50 text-xs max-w-[160px] mb-4">
                                            Posti Founder esauriti. Prezzo pubblico: <span className="text-gold font-bold">{plan.publicPrice}/m</span>
                                        </p>

                                        <button className="px-6 py-3 gold-gradient text-white text-[9px] uppercase tracking-[0.3em] font-black rounded-full hover:scale-105 transition-all shadow-lg">
                                            Entra in Lista →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Card */}
                            <div className={`relative h-full rounded-[2rem] p-8 border transition-all duration-500 overflow-hidden ${plan.bg} ${plan.border} ${hoveredPlan === i ? 'scale-[1.03] shadow-2xl' : 'shadow-lg'} ${isPlanSoldOut(plan.name) ? 'pointer-events-none' : ''}`}>

                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${plan.isGold ? 'bg-white/20' : 'bg-gold/10'}`}>
                                    <plan.icon className={`w-7 h-7 ${plan.isGold ? 'text-white' : 'text-gold'}`} />
                                </div>

                                {/* Plan Name */}
                                <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-2 ${plan.accent}`}>
                                    {plan.name}
                                </p>

                                {/* Price with Public Price Comparison */}
                                <div className="mb-1">
                                    <span className={`text-5xl font-serif tracking-tight ${plan.isGold ? 'text-white' : 'text-charcoal'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-sm ml-1 ${plan.isGold ? 'text-white/60' : 'text-charcoal/40'}`}>
                                        {plan.period}
                                    </span>
                                </div>

                                {/* Public Price (Crossed Out) - Only show if different from Founder price */}
                                {plan.publicPrice && plan.publicPrice !== plan.price && (
                                    <p className={`text-xs mb-2 ${plan.isGold ? 'text-white/50' : 'text-charcoal/40'}`}>
                                        <span className="line-through">{plan.publicPrice}/m</span>
                                        <span className="ml-2 text-green-600 font-bold">FOUNDER</span>
                                    </p>
                                )}

                                {/* Story */}
                                <p className={`text-sm mb-6 font-serif italic ${plan.isGold ? 'text-white/80' : 'text-charcoal/50'}`}>
                                    "{plan.story}"
                                </p>

                                {/* Features */}
                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.isGold ? 'bg-white/20' : 'bg-gold/10'}`}>
                                                <Check className={`w-3 h-3 ${plan.isGold ? 'text-white' : 'text-gold'}`} />
                                            </div>
                                            <span className={`text-sm ${plan.isGold ? 'text-white/90' : 'text-charcoal/70'}`}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={plan.href}
                                    className={`group block w-full text-center py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnStyle}`}
                                >
                                    {plan.cta}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className={`mt-20 text-center transition-all duration-1000 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-charcoal/40 text-lg font-serif italic mb-6">
                        "Il costo di non agire è più alto di qualsiasi abbonamento."
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-charcoal/40 text-sm">
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Cancella quando vuoi
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Nessun costo nascosto
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Supporto italiano
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingUltimate;
