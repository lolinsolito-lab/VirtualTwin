"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Check, Zap, Sparkles, Crown, Star, ArrowRight, Clock, Gift } from 'lucide-react';
import { getPlanAvailability, PlanAvailability, PlanName } from '@/lib/founderAvailability';
import { getDisplayPricing, getCurrentPublicPricing, Wave, WAVES, getFoundersSold, isPreLaunch, getDaysUntilLaunch } from '@/lib/waves';
import DualOptionOverlay from '@/components/DualOptionOverlay';
import CountdownTimer from '@/components/CountdownTimer';
import { isAspiranteVisible } from '@/lib/features';


const PricingUltimate = () => {
    const [inView, setInView] = useState(false);
    const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
    const [planAvailability, setPlanAvailability] = useState<Record<PlanName, PlanAvailability> | null>(null);
    const [displayPricing, setDisplayPricing] = useState<Awaited<ReturnType<typeof getDisplayPricing>> | null>(null);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);
    const [nextWave, setNextWave] = useState<Wave | null>(null);
    const [prelaunch, setPrelaunch] = useState(isPreLaunch());
    const [daysToLaunch, setDaysToLaunch] = useState(getDaysUntilLaunch());
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Fetch real-time plan availability from Supabase
        const fetchAvailability = async () => {
            try {
                const [availability, pricing] = await Promise.all([
                    getPlanAvailability(),
                    getDisplayPricing()
                ]);
                setPlanAvailability(availability);
                setDisplayPricing(pricing);

                // Fetch next wave info for waitlist
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

    // Waitlist handler
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

    // Stripe Checkout Handler
    const handleCheckout = async (planId: string, priceId: string, tier: 'public' | 'founder' = 'public') => {
        setIsCheckoutLoading(planId);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, tier })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Checkout failed');
            }

            const { url } = await response.json();
            window.location.href = url; // Redirect to Stripe
        } catch (error) {
            console.error('[Checkout Error]:', error);
            alert(error instanceof Error ? error.message : 'Errore durante il checkout. Riprova.');
            setIsCheckoutLoading(null);
        }
    };

    const publicRef = getCurrentPublicPricing();

    const plans = [
        {
            id: "curioso",
            name: "Curioso",
            icon: Sparkles,
            price: `€${displayPricing?.prices?.curioso || 0}`,
            publicPrice: `€${publicRef.prices.curioso}`,
            period: "14 giorni",
            story: "Esplora il Potere dell'AI",
            subtitle: "14 giorni per testare gratuitamente. Zero rischi.",
            features: ["1 Clone AI", "100 msg", "1 Canale", "Watermark"],
            cta: "Inizia Gratis →",
            isTrial: true,
            bg: "bg-gradient-to-br from-gray-50 to-gray-100",
            border: "border-gray-200",
            accent: "text-gray-600",
            btnStyle: "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200",
            soldOut: false,
            scale: 1.0
        },
        ...(isAspiranteVisible() ? [{
            id: "aspirante",
            name: "Aspirante",
            icon: Sparkles,
            price: "€49",
            publicPrice: "€49",
            period: "/mese",
            story: "Il Primo Passo nel Tuo Impero",
            subtitle: "Entry-level perfetto per chi vuole provare senza impegno. Template, corso e community inclusi.",
            features: ["1 Clone AI", "500 msg/mese", "1 Canale", "🆕 Template 15 settori", "🆕 Corso 6 video", "🆕 Community"],
            cta: "Diventa Aspirante →",
            priceId: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            isFounder: false,
            bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
            border: "border-green-400",
            accent: "text-green-700",
            btnStyle: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md",
            soldOut: false,
            badge: { emoji: "🌱", text: "ENTRY-LEVEL", color: "green" },
            scale: 1.0
        }] : []),
        {
            id: "esploratore",
            name: "Esploratore",
            icon: Zap,
            price: `€${displayPricing?.prices?.esploratore || 39}`,
            publicPrice: `€${publicRef.prices.esploratore}`,
            period: "/mese",
            story: "Per Chi Inizia a Scalare",
            subtitle: "Strumenti professionali per testare il potenziale della tua AI.",
            features: ["1 Clone AI", "1K msg/mesе", "Analytics Base", "Email Support <48h"],
            cta: displayPricing?.tier === 'founder' ? "Diventa Founder →" : "Scegli Esploratore →",
            priceId: displayPricing?.stripePriceIds?.esploratore,
            isFounder: displayPricing?.tier === 'founder',
            bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100",
            border: "border-blue-400",
            accent: "text-blue-700",
            btnStyle: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md",
            scale: 1.0
        },
        {
            id: "pioniere",
            name: "Pioniere",
            icon: Zap,
            price: `€${displayPricing?.prices?.pioniere || 147}`,
            publicPrice: `€${publicRef.prices.pioniere}`,
            period: "/mese",
            story: "La Scelta del 73% dei Coach di Successo",
            subtitle: "Il perfetto equilibrio tra potenza e prezzo. Provato da centinaia di professionisti che hanno trasformato il loro business.",
            socialProof: "⭐ 4.9/5 da 200+ Coach",
            scarcity: "⚡ Ultimi 3 posti Wave Genesis",
            features: ["1 Clone AI", "5K msg/mese", "3 Canali", "A/B Test (20%)", "Priority Support"],
            cta: displayPricing?.tier === 'founder' ? "Diventa Founder →" : "Scala con Pioniere →",
            priceId: displayPricing?.stripePriceIds?.pioniere,
            isFounder: displayPricing?.tier === 'founder',
            bg: "bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100",
            border: "border-amber-400",
            accent: "text-amber-900",
            btnStyle: "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 shadow-xl font-bold",
            popular: true,
            isHero: true,
            glow: true,
            scale: 1.1,
            badge: { emoji: "🔥", text: "PIÙ SCELTO", color: "red", animate: "pulse" },
            badge2: { emoji: "⭐", text: "SCELTA #1 COACH", color: "gold" }
        },
        {
            id: "conquistatore",
            name: "Conquistatore",
            icon: Crown,
            price: `€${displayPricing?.prices?.conquistatore || 347}`,
            publicPrice: `€${publicRef.prices.conquistatore}`,
            period: "/mese",
            story: "Per Chi Punta all'Eccellenza",
            subtitle: "Agenzie e power user scelgono Conquistatore per dominare il mercato.",
            features: ["3 Cloni AI", "20K msg/mese", "Priority Support", "API Access", "9 Canali"],
            cta: displayPricing?.tier === 'founder' ? "Diventa Founder →" : "Conquista il Mercato →",
            priceId: displayPricing?.stripePriceIds?.conquistatore,
            isFounder: displayPricing?.tier === 'founder',
            bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900",
            border: "border-purple-500",
            accent: "text-purple-300",
            textColor: "text-white",
            btnStyle: "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-xl",
            badge: { emoji: "💎", text: "MIGLIOR VALORE", color: "purple", animate: "shimmer" },
            scale: 1.05,
            isDark: true
        },
        {
            id: "imperatore",
            name: "Imperatore",
            icon: Crown,
            price: `€${displayPricing?.prices?.imperatore || 697}`,
            publicPrice: `€${publicRef.prices.imperatore}`,
            period: "/mese",
            story: "Il Trono Digitale. Solo per i Migliori.",
            subtitle: "Accesso esclusivo, priorità assoluta, dominio totale. Limitato a 10 clienti/anno.",
            scarcity: "🎖️ Solo 7 posti rimasti su 10 totali",
            features: ["10 Cloni AI", "50K msg/mese", "White-label", "Account Manager", "👑 Success Manager"],
            cta: displayPricing?.tier === 'founder' ? "Diventa Founder →" : "Richiedi Accesso Elite →",
            priceId: displayPricing?.stripePriceIds?.imperatore,
            isFounder: displayPricing?.tier === 'founder',
            bg: "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600",
            border: "border-yellow-600",
            accent: "text-yellow-100",
            textColor: "text-white",
            btnStyle: "bg-white text-amber-700 hover:bg-amber-50 shadow-2xl font-bold border-2 border-amber-900",
            isGold: true,
            isDark: true,
            scale: 1.08,
            badge: { emoji: "👑", text: "ELITE", color: "gold", animate: "bounce" }
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

                            {/* DUAL OPTION Overlay - Waitlist OR Public (AUTOMATIC from Supabase) */}
                            {isPlanSoldOut(plan.name) && (
                                <DualOptionOverlay
                                    planId={plan.id}
                                    planName={plan.name}
                                    currentWaveName={displayPricing?.waveName || 'Genesis'}
                                    nextWaveName={nextWave?.name}
                                    nextWavePrice={nextWave?.prices[plan.id as keyof typeof nextWave.prices]}
                                    publicPrice={parseInt(plan.publicPrice.replace('€', ''))}
                                    publicPriceId={publicRef.stripePriceIds[plan.id as keyof typeof publicRef.stripePriceIds]}
                                    onWaitlistClick={() => handleWaitlistClick(plan.id)}
                                />
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
                                    &ldquo;{plan.story}&rdquo;
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
                                {(plan as any).isTrial ? (
                                    <Link
                                        href="/auth/register"
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
                                        onClick={() => handleCheckout(plan.id, (plan as any).priceId, 'public')}
                                        disabled={isCheckoutLoading === plan.id}
                                        className={`group w-full py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${plan.btnStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isCheckoutLoading === plan.id ? 'Caricamento...' : plan.cta}
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className={`mt-20 text-center transition-all duration-1000 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-charcoal/40 text-lg font-serif italic mb-6">
                        &ldquo;Il costo di non agire è più alto di qualsiasi abbonamento.&rdquo;
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
