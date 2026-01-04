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
            scale: 1.05,
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

                {/* PRICING GRID - 2 ROWS x 3 COLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-6 lg:gap-y-12 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-[2rem] transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{
                                transitionDelay: `${i * 100}ms`,
                                transform: `scale(${plan.scale || 1.0})`,
                                zIndex: plan.isHero ? 20 : plan.scale > 1.0 ? 15 : 10
                            }}
                            onMouseEnter={() => setHoveredPlan(i)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            {/* Luxury Badge (Top-Right) - BIGGER */}
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

                            {/* Secondary Badge (if exists - Pioniere) - BIGGER */}
                            {(plan as any).badge2 && (
                                <div className="absolute -top-4 -left-4 z-30">
                                    <div className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 flex items-center gap-1.5 shadow-xl">
                                        <span className="text-base">{(plan as any).badge2.emoji}</span>
                                        <span>{(plan as any).badge2.text}</span>
                                    </div>
                                </div>
                            )}

                            {/* Hero Glow (Pioniere) - DRAMATIC */}
                            {plan.isHero && (
                                <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400/40 via-amber-500/50 to-yellow-400/40 rounded-[3rem] blur-3xl opacity-70 animate-pulse"></div>
                            )}

                            {/* Standard Glow for others */}
                            {plan.glow && !plan.isHero && (
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

                            {/* Card - THINNER BORDER + STRONGER SHADOW */}
                            <div className={`
                                relative h-[550px] lg:h-[600px] rounded-[2rem] p-6 lg:p-8 border 
                                transition-all duration-500 overflow-hidden flex flex-col
                                ${plan.bg} ${plan.border} 
                                ${hoveredPlan === i ? 'shadow-2xl ring-2 ring-offset-2' : 'shadow-xl'} 
                                ${plan.isHero && hoveredPlan === i ? 'ring-amber-400' : ''}
                                ${!plan.isHero && hoveredPlan === i ? 'ring-blue-300' : ''}
                                ${isPlanSoldOut(plan.name) ? 'pointer-events-none' : ''}
                            `}>

                                {/* Icon - COLORED */}
                                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-4 ${plan.isDark ? 'bg-white/10' : plan.isGold ? 'bg-white/20' : 'bg-white/50'}`}>
                                    <plan.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${plan.isDark || plan.isGold ? 'text-white' : plan.id === 'aspirante' ? 'text-green-600' : plan.id === 'esploratore' ? 'text-blue-600' : plan.accent}`} />
                                </div>

                                {/* Plan Name */}
                                <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-2 ${plan.isDark ? 'text-white/60' : plan.accent}`}>
                                    {plan.name}
                                </p>

                                {/* Price */}
                                <div className="mb-2">
                                    <span className={`text-4xl lg:text-5xl font-serif tracking-tight ${plan.isDark || plan.isGold ? 'text-white' : plan.textColor || 'text-charcoal'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-sm ml-1 ${plan.isDark ? 'text-white/50' : plan.isGold ? 'text-white/60' : 'text-charcoal/40'}`}>
                                        {plan.period}
                                    </span>
                                </div>

                                {/* Public Price (Crossed Out) - Only show if different from Founder price */}
                                {plan.publicPrice && plan.publicPrice !== plan.price && (
                                    <p className={`text-xs mb-3 ${plan.isDark || plan.isGold ? 'text-white/50' : 'text-charcoal/40'}`}>
                                        <span className="line-through">{plan.publicPrice}/m</span>
                                        <span className="ml-2 text-green-500 font-bold">FOUNDER</span>
                                    </p>
                                )}

                                {/* Story */}
                                <p className={`text-sm lg:text-base font-medium mb-2 ${plan.isDark || plan.isGold ? 'text-white' : 'text-charcoal'}`}>
                                    {plan.story}
                                </p>

                                {/* Subtitle (New!) - TRUNCATED WITH HOVER EXPAND */}
                                {(plan as any).subtitle && (
                                    <p className={`text-xs mb-4 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all ${plan.isDark ? 'text-white/70' : 'text-charcoal/60'}`}>
                                        {(plan as any).subtitle}
                                    </p>
                                )}

                                {/* Social Proof (Pioniere) */}
                                {(plan as any).socialProof && (
                                    <div className="mb-3 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold inline-block">
                                        {(plan as any).socialProof}
                                    </div>
                                )}

                                {/* Scarcity (Pioniere, Imperatore) */}
                                {(plan as any).scarcity && (
                                    <div className="mb-4 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold animate-pulse inline-block">
                                        {(plan as any).scarcity}
                                    </div>
                                )}

                                {/* Features */}
                                <div className="space-y-2 lg:space-y-3 mb-6 flex-grow">
                                    {plan.features.map((feature, j) => (
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

                                {/* CTA - Always at bottom */}
                                <div className="mt-auto">
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
