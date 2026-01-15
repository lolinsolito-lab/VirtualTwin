"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Sparkles, Crown, Star, ArrowRight, Clock, Gift, Info, Handshake, Users } from 'lucide-react';
import { getPlanAvailability, PlanAvailability, PlanName } from '@/lib/founderAvailability';
import { getDisplayPricing, getCurrentPublicPricing, Wave, WAVES, getFoundersSold, isPreLaunch, getDaysUntilLaunch, getCurrentWaveSpotsRemaining } from '@/lib/waves';
import DualOptionOverlay from '@/components/DualOptionOverlay';
import CountdownTimer from '@/components/CountdownTimer';
import { isAspiranteVisible } from '@/lib/features';
import PlanDetailModal from '@/components/PlanDetailModal';
import FuturePricingUrgency from './FuturePricingUrgency';

// =============================================
// PROPS: pricingMode controls display behavior
// 'public' = Show public prices, "Inizia Ora" buttons
// 'founder' = Show founder prices, "Diventa Founder" buttons
// 'auto' = Dynamic based on wave availability (default)
// =============================================
interface PricingUltimateProps {
    pricingMode?: 'public' | 'founder' | 'auto';
    showToggle?: boolean;
}

const PricingUltimate = ({ pricingMode = 'auto', showToggle = false }: PricingUltimateProps) => {
    const [inView, setInView] = useState(false);
    const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
    const [planAvailability, setPlanAvailability] = useState<Record<PlanName, PlanAvailability> | null>(null);
    const [displayPricing, setDisplayPricing] = useState<Awaited<ReturnType<typeof getDisplayPricing>> | null>(null);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);
    const [nextWave, setNextWave] = useState<Wave | null>(null);
    const [prelaunch, setPrelaunch] = useState(isPreLaunch());
    const [daysToLaunch, setDaysToLaunch] = useState(getDaysUntilLaunch());
    const [openModal, setOpenModal] = useState<string | null>(null);
    const [founderSpotsAvailable, setFounderSpotsAvailable] = useState(0);
    const [activeTier, setActiveTier] = useState<'founder' | 'public'>('founder');
    const sectionRef = useRef<HTMLElement>(null);

    // Determine effective mode: prop > activeTier toggle > auto-detection
    const isShowingFounder = pricingMode === 'founder' ||
        (pricingMode === 'auto' && (showToggle ? activeTier === 'founder' : displayPricing?.tier === 'founder'));

    const isShowingPublic = pricingMode === 'public' ||
        (pricingMode === 'auto' && (showToggle ? activeTier === 'public' : displayPricing?.tier === 'public'));

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const [availability, pricing, spotsRemaining] = await Promise.all([
                    getPlanAvailability(),
                    getDisplayPricing(),
                    getCurrentWaveSpotsRemaining()
                ]);
                setPlanAvailability(availability);
                setDisplayPricing(pricing);
                setFounderSpotsAvailable(spotsRemaining);

                if (pricing.tier === 'founder' && pricing.waveName) {
                    const sold = await getFoundersSold();
                    const currentWaveIndex = WAVES.findIndex(w => w.name === pricing.waveName);
                    if (currentWaveIndex >= 0 && currentWaveIndex < WAVES.length - 1) {
                        setNextWave(WAVES[currentWaveIndex + 1]);
                    }
                }
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
            { threshold: 0.05, rootMargin: '0px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const isPlanSoldOut = (planName: string): boolean => {
        if (!planAvailability) return false;
        const normalizedName = planName.toLowerCase() as PlanName;
        return planAvailability[normalizedName]?.isSoldOut || false;
    };

    const handleWaitlistClick = async (planId: string) => {
        const email = prompt("Inserisci la tua email per entrare in waitlist:");
        if (!email || !email.includes('@')) {
            alert("Email non valida");
            return;
        }

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name: email.split('@')[0],
                    plan: planId,
                    current_wave: displayPricing?.waveName || 'genesis',
                    next_wave: nextWave?.id || 'pioneer'
                })
            });

            if (response.ok) {
                alert("Perfetto! Sei in waitlist. Riceverai un'email quando la prossima wave si apre!");
            } else {
                alert("Errore. Riprova o usa il prezzo pubblico.");
            }
        } catch (error) {
            console.error('Waitlist error:', error);
            alert("Errore. Riprova piu tardi.");
        }
    };

    const handleCheckout = async (planId: string, priceId: string, tier: 'public' | 'founder' = 'public') => {
        setIsCheckoutLoading(planId);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    tier: tier || (displayPricing?.tier === 'founder' ? 'founder' : 'public'),
                    plan: planId
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Checkout failed');
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('[Checkout Error]:', error);
            alert(error instanceof Error ? error.message : 'Errore durante il checkout. Riprova.');
            setIsCheckoutLoading(null);
        }
    };

    const publicRef = getCurrentPublicPricing();

    // Direct price lookup using new tier names (waves.ts now uses new names)
    const getPriceForPlan = (planId: string) => {
        return displayPricing?.prices?.[planId as keyof typeof displayPricing.prices] || 0;
    };

    const getPublicPriceForPlan = (planId: string) => {
        return publicRef.prices[planId as keyof typeof publicRef.prices] || 0;
    };

    const getPriceIdForPlan = (planId: string) => {
        if (isShowingFounder) {
            return displayPricing?.stripePriceIds?.[planId as keyof typeof displayPricing.stripePriceIds];
        } else {
            return publicRef.stripePriceIds[planId as keyof typeof publicRef.stripePriceIds];
        }
    };

    const plans = [
        {
            id: "curioso",
            name: "Curioso",
            icon: Sparkles,
            price: "€0",
            publicPrice: "€0",
            period: "14 giorni",
            story: "Prova Gratuita",
            subtitle: "Zero rischio, zero carta di credito. Scopri se l'AI funziona per te.",
            features: ["1 Clone AI (demo)", "100 msg totali", "PDF Gratuito", "Community", "3 Template"],
            cta: "Prova Ora →",
            isTrial: true,
            bg: "bg-gradient-to-br from-gray-50 to-gray-100",
            border: "border-gray-200",
            accent: "text-gray-600",
            btnStyle: "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200",
            soldOut: false,
            scale: 1.0
        },
        {
            id: "solopreneur",
            name: "Solopreneur",
            icon: Sparkles,
            price: `€${getPriceForPlan('solopreneur') || 49}`,
            publicPrice: `€${getPublicPriceForPlan('solopreneur')}`,
            period: "/mese",
            story: "Entry-Level",
            idealePer: "Freelancer, coach, consulenti in P.IVA",
            wavePricing: [
                { wave: "Pioneer", price: 69, date: "Apr 2026" },
                { wave: "Elite", price: 89, date: "Lug 2026" },
                { wave: "Public", price: 347, date: "Ott 2026" }
            ],
            features: ["1 Clone AI Pro", "1K msg/mese", "1 Canale", "15 Template", "Knowledge Base 10 doc", "Support <48h"],
            cta: isShowingFounder ? "Diventa Founder →" : "Inizia Ora →",
            priceId: getPriceIdForPlan('solopreneur'),
            isFounder: isShowingFounder,
            bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
            border: "border-green-400",
            accent: "text-green-700",
            btnStyle: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md",
            soldOut: false,
            badge: { emoji: "🌱", text: "ENTRY-LEVEL", color: "green" },
            scale: 1.0
        },
        {
            id: "entrepreneur",
            name: "Entrepreneur",
            icon: Zap,
            price: `€${getPriceForPlan('entrepreneur') || 147}`,
            publicPrice: `€${getPublicPriceForPlan('entrepreneur')}`,
            period: "/mese",
            story: "",
            idealePer: "Startup 2-5 persone",
            scarcity: "⚡ Ultimi posti Wave Genesis",
            wavePricing: [
                { wave: "Pioneer", price: 197, date: "Apr 2026" },
                { wave: "Elite", price: 247, date: "Lug 2026" },
                { wave: "Public", price: 797, date: "Ott 2026" }
            ],
            features: ["3 Cloni AI", "5K msg/mese", "3 Canali", "A/B Test", "Academy Mod 1-2", "War Room mensile"],
            cta: isShowingFounder ? "Diventa Founder →" : "Inizia Ora →",
            priceId: getPriceIdForPlan('entrepreneur'),
            isFounder: isShowingFounder,
            bg: "bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100",
            border: "border-amber-400",
            accent: "text-amber-900",
            btnStyle: "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 shadow-xl font-bold",
            popular: true,
            isHero: true,
            glow: true,
            scale: 1.0,
            badge: { emoji: "🔥", text: "PIÙ SCELTO", color: "red", animate: "pulse" },
            badge2: { emoji: "⭐", text: "68% CLIENTI", color: "gold" },
            promoBadge: { text: "⏳ TARIFFA PROMOZIONALE", color: "gold" }
        },
        {
            id: "conquistatore",
            name: "Conquistatore",
            icon: Crown,
            price: `€${getPriceForPlan('conquistatore') || 347}`,
            publicPrice: `€${getPublicPriceForPlan('conquistatore')}`,
            period: "/mese",
            story: "Scale-Up",
            idealePer: "PMI e Agenzie 5-20 persone",
            subtitle: "Riduci costi operativi del 40%. API + CRM integrati.",
            wavePricing: [
                { wave: "Pioneer", price: 447, date: "Apr 2026" },
                { wave: "Elite", price: 547, date: "Lug 2026" },
                { wave: "Public", price: 1397, date: "Ott 2026" }
            ],
            features: ["5 Cloni AI", "20K msg/mese", "10 Canali inclusi", "API + CRM", "Academy Full", "CSM Dedicato"],
            cta: isShowingFounder ? "Diventa Founder →" : "Inizia Ora →",
            priceId: getPriceIdForPlan('conquistatore'),
            isFounder: isShowingFounder,
            bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
            border: "border-purple-500",
            accent: "text-purple-300",
            textColor: "text-white",
            btnStyle: "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-xl",
            badge: { emoji: "💎", text: "SCALE-UP", color: "purple", animate: "shimmer" },
            scale: 1.0,
            isDark: true,
            promoBadge: { text: "⏳ TARIFFA PROMOZIONALE", color: "purple" }
        },
        {
            id: "imperatore",
            name: "Imperatore",
            icon: Crown,
            price: `€${getPriceForPlan('imperatore') || 697}`,
            publicPrice: `€${getPublicPriceForPlan('imperatore')}`,
            period: "/mese",
            story: "Enterprise",
            idealePer: "Aziende 20+ dipendenti, €500k+ fatturato",
            wavePricing: [
                { wave: "Pioneer", price: 897, date: "Apr 2026" },
                { wave: "Elite", price: 1097, date: "Lug 2026" },
                { wave: "Public", price: 2197, date: "Ott 2026" }
            ],
            features: ["15 Cloni AI", "100K msg/mese", "25 Canali inclusi", "White-label", "Team Dedicato", "SLA 99.9%"],
            cta: isShowingFounder ? "Diventa Founder →" : "Inizia Ora →",
            priceId: getPriceIdForPlan('imperatore'),
            isFounder: isShowingFounder,
            bg: "bg-gradient-to-br from-[#f5f0e8] via-[#e8dcc8] to-[#d4c4a8]",
            border: "border-[#c9b896]",
            accent: "text-[#8b7355]",
            textColor: "text-charcoal",
            btnStyle: "bg-gradient-to-r from-[#8b7355] to-[#6b5845] text-white hover:from-[#7a6449] hover:to-[#5a4a3a] shadow-2xl font-bold",
            isGold: false,
            isDark: false,
            isChampagne: true,
            scale: 1.0,
            badge: { emoji: "👑", text: "ENTERPRISE", color: "gold", animate: "bounce" },
            badge2: {
                emoji: "🔒",
                text: `${founderSpotsAvailable > 0 ? founderSpotsAvailable : 'ULTIMI'} / 20 SLOT`,
                color: "red"
            },
            promoBadge: { text: "⏳ TARIFF PROMOZIONALE", color: "gold" }
        },
        {
            id: "sovereignty",
            name: "Sovereignty",
            icon: Handshake,
            price: "CUSTOM",
            publicPrice: "CUSTOM",
            period: "",
            story: "Partnership Strategica",
            idealePer: "Aziende che vogliono co-ownership o licensing",
            subtitle: "Non è un piano. È un accordo su misura. Solo su invito o application.",
            features: ["Licensing Perpetuo €50k", "Equity Partnership", "Profit Share 70/30", "Strategic Alliance", "Influenza Roadmap", "Priority Access"],
            cta: "Richiedi Application →",
            isPartnership: true,
            bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
            border: "border-gold/40",
            accent: "text-gold",
            textColor: "text-white",
            btnStyle: "gold-gradient text-white hover:opacity-90 shadow-2xl font-bold",
            isDark: true,
            scale: 1.0,
            badge: { emoji: "🤝", text: "INVITE ONLY", color: "gold", animate: "pulse" }
        }
    ];

    return (
        <section ref={sectionRef} id="pricing" className="py-12 lg:py-28 px-4 md:px-6 lg:px-12 bg-gradient-to-b from-champagne to-white relative overflow-hidden">
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

                    <CountdownTimer />

                    {/* INTERACTIVE TOGGLE */}
                    {showToggle && (
                        <div className="mt-12 flex flex-col items-center">
                            <div className="relative p-1 bg-charcoal/5 rounded-2xl flex items-center gap-1 mb-4 border border-charcoal/10 shadow-inner">
                                <button
                                    onClick={() => setActiveTier('founder')}
                                    className={`relative px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${activeTier === 'founder' ? 'text-white' : 'text-charcoal/40 hover:text-charcoal'}`}
                                >
                                    {activeTier === 'founder' && (
                                        <motion.div layoutId="toggleBg" className="absolute inset-0 bg-charcoal rounded-xl -z-10" />
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-3 h-3" />
                                        <span>Founder Mode</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTier('public')}
                                    className={`relative px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${activeTier === 'public' ? 'text-white' : 'text-charcoal/40 hover:text-charcoal'}`}
                                >
                                    {activeTier === 'public' && (
                                        <motion.div layoutId="toggleBg" className="absolute inset-0 bg-charcoal rounded-xl -z-10" />
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3 h-3" />
                                        <span>Public Mode</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* PRICING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-8 lg:gap-y-16 max-w-6xl mx-auto auto-rows-fr">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative h-full rounded-[2rem] transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:translate-y-12'}`}
                            style={{
                                transitionDelay: `${i * 100}ms`,
                                zIndex: plan.isHero ? 20 : plan.scale > 1.0 ? 15 : 10
                            }}
                            onMouseEnter={() => setHoveredPlan(i)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            {/* Badge */}
                            {plan.badge && typeof plan.badge === 'object' && (
                                <div className="absolute -top-4 -right-4 z-30">
                                    <div className={`
                                        px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider
                                        flex items-center gap-1.5 shadow-xl
                                        ${plan.badge.color === 'green' && 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}
                                        ${plan.badge.color === 'red' && 'bg-gradient-to-r from-red-500 to-orange-500 text-white'}
                                        ${plan.badge.color === 'gold' && 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'}
                                        ${plan.badge.color === 'purple' && 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'}
                                        ${plan.badge.animate === 'pulse' && 'animate-pulse'}
                                        ${plan.badge.animate === 'bounce' && 'animate-bounce'}
                                    `}>
                                        <span className="text-base">{plan.badge.emoji}</span>
                                        <span>{plan.badge.text}</span>
                                    </div>
                                </div>
                            )}

                            {/* Secondary Badge */}
                            {(plan as any).badge2 && (
                                <div className="absolute -top-4 -left-4 z-30">
                                    <div className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 flex items-center gap-1.5 shadow-xl">
                                        <span className="text-base">{(plan as any).badge2.emoji}</span>
                                        <span>{(plan as any).badge2.text}</span>
                                    </div>
                                </div>
                            )}

                            {/* Hero Glow */}
                            {plan.isHero && (
                                <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400/40 via-amber-500/50 to-yellow-400/40 rounded-[3rem] blur-3xl opacity-70 animate-pulse"></div>
                            )}

                            {plan.glow && !plan.isHero && (
                                <div className="absolute -inset-2 bg-gold/20 rounded-[2.5rem] blur-xl opacity-50"></div>
                            )}

                            {/* Sold Out Overlay */}
                            {isPlanSoldOut(plan.name) && (
                                <DualOptionOverlay
                                    planId={plan.id}
                                    planName={plan.name}
                                    currentWaveName={displayPricing?.waveName || 'Genesis'}
                                    nextWaveName={nextWave?.name}
                                    nextWavePrice={nextWave?.prices[plan.id as keyof typeof nextWave.prices]}
                                    publicPrice={parseInt(plan.publicPrice.replace('€', '')) || 0}
                                    publicPriceId={publicRef.stripePriceIds[plan.id as keyof typeof publicRef.stripePriceIds]}
                                    onWaitlistClick={() => handleWaitlistClick(plan.id)}
                                />
                            )}

                            {/* Card */}
                            <div className={`
                                relative h-full rounded-[2rem] p-6 lg:p-8 border 
                                transition-all duration-500 overflow-hidden flex flex-col
                                ${plan.bg} ${plan.border} 
                                ${hoveredPlan === i ? 'shadow-2xl ring-2 ring-offset-2' : 'shadow-xl'} 
                                ${plan.isHero && hoveredPlan === i ? 'ring-amber-400' : ''}
                                ${!plan.isHero && hoveredPlan === i ? 'ring-blue-300' : ''}
                                ${isPlanSoldOut(plan.name) ? 'pointer-events-none' : ''}
                            `}>

                                {/* Icon */}
                                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-4 ${plan.isDark ? 'bg-white/10' : plan.isGold ? 'bg-white/20' : 'bg-white/50'}`}>
                                    <plan.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${plan.isDark || plan.isGold ? 'text-white' : plan.accent}`} />
                                </div>

                                {/* Name */}
                                <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-2 ${plan.isDark ? 'text-white/60' : plan.accent}`}>
                                    {plan.name}
                                </p>

                                {/* Promo Badge for Tier 3, 4, 5 */}
                                {(plan as any).promoBadge && (
                                    <div className={`mb-2 inline-flex px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-current opacity-80 ${(plan as any).promoBadge.color === 'gold' ? 'text-gold border-gold/30' : (plan as any).promoBadge.color === 'purple' ? 'text-purple-400 border-purple-400/30' : 'text-green-400 border-green-400/30'}`}>
                                        {(plan as any).promoBadge.text}
                                    </div>
                                )}

                                {/* Price */}
                                <div className="mb-2 overflow-hidden h-14 relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isShowingFounder ? 'founder' : 'public'}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-baseline"
                                        >
                                            <span className={`text-4xl lg:text-5xl font-serif tracking-tight ${plan.isDark || plan.isGold ? 'text-white' : (plan as any).textColor || 'text-charcoal'}`}>
                                                {isShowingFounder ? plan.price : plan.publicPrice}
                                            </span>
                                            <span className={`text-sm ml-1 ${plan.isDark ? 'text-white/50' : plan.isGold ? 'text-white/60' : 'text-charcoal/40'}`}>
                                                {plan.period}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Dynamic Savings/Warning */}
                                <div className="h-6 mb-3">
                                    <AnimatePresence mode="wait">
                                        {isShowingFounder ? (
                                            <motion.p
                                                key="savings"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={`text-[10px] font-black uppercase tracking-wider ${plan.isDark ? 'text-cyan-400' : 'text-green-600'}`}
                                            >
                                                {plan.price === "CUSTOM" ? (
                                                    <span className="flex items-center gap-1 text-green-400">
                                                        📈 Guadagni Interessanti /mese a vita
                                                    </span>
                                                ) : (
                                                    <>📉 BLOCCA IL PREZZO — RISPARMIA IL 70%</>
                                                )}
                                            </motion.p>
                                        ) : (
                                            <motion.p
                                                key="warning"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-[10px] font-black uppercase tracking-wider text-red-500"
                                            >
                                                {plan.price === "CUSTOM" ? (
                                                    <span className="text-gold">🤝 Trattativa Riservata</span>
                                                ) : (
                                                    "⏳ TARIFFA PROMOZIONALE IN SCADENZA"
                                                )}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Story */}
                                <p className={`text-sm lg:text-base font-medium mb-1 ${plan.isDark || plan.isGold ? 'text-white' : 'text-charcoal'}`}>
                                    {plan.story}
                                </p>

                                {/* Ideale Per */}
                                {(plan as any).idealePer && (
                                    <p className={`text-xs font-bold mb-2 ${plan.isDark ? 'text-cyan-300' : plan.isGold ? 'text-yellow-100' : 'text-green-600'}`}>
                                        👤 Ideale per: {(plan as any).idealePer}
                                    </p>
                                )}

                                {/* Subtitle */}
                                {(plan as any).subtitle && (
                                    <p className={`text-xs mb-3 leading-relaxed line-clamp-2 ${plan.isDark ? 'text-white/70' : 'text-charcoal/60'}`}>
                                        {(plan as any).subtitle}
                                    </p>
                                )}

                                {/* Wave Pricing */}
                                {(plan as any).wavePricing && (plan as any).wavePricing.length > 0 && (
                                    <div className={`mb-3 p-2 rounded-lg text-[10px] ${plan.isDark ? 'bg-white/5' : plan.isGold ? 'bg-white/10' : 'bg-charcoal/5'}`}>
                                        <p className={`font-bold mb-1 ${plan.isDark || plan.isGold ? 'text-white/70' : 'text-charcoal/50'}`}>
                                            📈 Prossimi aumenti:
                                        </p>
                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                            {(plan as any).wavePricing.map((wp: any, idx: number) => (
                                                <span key={idx} className={`${plan.isDark || plan.isGold ? 'text-white/60' : 'text-charcoal/40'}`}>
                                                    €{wp.price} <span className="text-red-400">{wp.date}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Proof */}
                                {(plan as any).socialProof && (
                                    <div className="mb-3 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold inline-block">
                                        {(plan as any).socialProof}
                                    </div>
                                )}


                                {/* Scarcity */}
                                {(plan as any).scarcity && (
                                    <div className={`mb-4 px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse inline-block ${plan.isDark || plan.isGold ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
                                        {(plan as any).scarcity}
                                    </div>
                                )}

                                {/* Features */}
                                <div className="space-y-2 lg:space-y-3 mb-4 flex-grow">
                                    {plan.features.slice(0, 6).map((feature, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center ${plan.isDark ? 'bg-white/10' : plan.isGold ? 'bg-white/20' : 'bg-green-100'}`}>
                                                <Check className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${plan.isDark || plan.isGold ? 'text-white' : 'text-green-600'}`} />
                                            </div>
                                            <span className={`text-xs lg:text-sm ${plan.isDark || plan.isGold ? 'text-white/90' : 'text-charcoal/70'}`}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Container - Always at bottom */}
                                <div className="mt-auto">
                                    {/* Vedi Dettagli */}
                                    <button
                                        onClick={() => setOpenModal(plan.id)}
                                        className={`mb-4 text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 transition-all hover:gap-2.5 ${plan.isDark || plan.isGold ? 'text-white/50 hover:text-white' : `${plan.accent} opacity-60 hover:opacity-100`}`}
                                    >
                                        <Info className="w-3 h-3" />
                                        Vedi tutti i dettagli
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                    {(plan as any).isTrial ? (
                                        <Link
                                            href="/auth/register"
                                            className={`group block w-full text-center py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnStyle}`}
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (plan as any).isPartnership ? (
                                        <Link
                                            href="/contact?reason=sovereignty"
                                            className={`group block w-full text-center py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnStyle}`}
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (plan as any).isFounder ? (
                                        <Link
                                            href="/founder"
                                            className={`group block w-full text-center py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnStyle}`}
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleCheckout(plan.id, getPriceIdForPlan(plan.id) || '', isShowingFounder ? 'founder' : 'public')}
                                            disabled={isCheckoutLoading === plan.id}
                                            className={`group w-full py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isCheckoutLoading === plan.id ? 'Caricamento...' : plan.cta}
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>

                                {/* Annual Discount OR Spacer for Alignment */}
                                <div className="mt-3 text-center h-[18px]">
                                    {!((plan as any).isTrial || (plan as any).isPartnership) && (
                                        <p className={`text-[10px] font-bold ${plan.isDark ? 'text-green-400' : (plan as any).isChampagne ? 'text-[#6b5845]' : 'text-green-600'}`}>
                                            💰 Sconto 10% se paghi annualmente
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 
                  SUBSECTIONS MOVED TO SEPARATE COMPONENTS:
                  - PlanComparisonTable.tsx
                  - FounderWavesSection.tsx  
                  - FuturePricingWarning.tsx
                  - PricingFinalCTA.tsx
                */}
            </div>

            {/* Modal */}
            {openModal && (
                <PlanDetailModal
                    isOpen={!!openModal}
                    onClose={() => setOpenModal(null)}
                    planId={openModal}
                    planStyle={{
                        bg: plans.find(p => p.id === openModal)?.bg || 'bg-white',
                        border: plans.find(p => p.id === openModal)?.border || 'border-gray-200',
                        accent: plans.find(p => p.id === openModal)?.accent || 'text-gray-600',
                        isDark: plans.find(p => p.id === openModal)?.isDark,
                        isGold: plans.find(p => p.id === openModal)?.isGold
                    }}
                />
            )}
        </section>
    );
};

export default PricingUltimate;
