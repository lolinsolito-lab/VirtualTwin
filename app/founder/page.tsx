'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, ArrowRight, Check, Star, Loader2, Shield, Lock } from 'lucide-react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, getDisplayPricing, getCurrentPublicPricing, getTotalFounderSpots, Wave, WAVES, isPreLaunch } from '@/lib/waves';
import FounderHeroEmotional from '@/components/founder-viral/FounderHeroEmotional';
import ScarcityTimeline from '@/components/founder-viral/ScarcityTimeline';
import FounderTestimonials from '@/components/founder-viral/FounderTestimonials';
import FounderFAQ from '@/components/founder-viral/FounderFAQ';

export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [totalSpots, setTotalSpots] = useState(60);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [displayPricing, setDisplayPricing] = useState<Awaited<ReturnType<typeof getDisplayPricing>> | null>(null);
    const [nextWave, setNextWave] = useState<Wave | null>(null);
    const [isFounderOpen, setIsFounderOpen] = useState(false);
    const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [wave, remaining, allPricing, total] = await Promise.all([
                getCurrentWave(),
                getCurrentWaveSpotsRemaining(),
                getDisplayPricing(),
                getTotalFounderSpots()
            ]);

            setCurrentWave(wave);
            setSpotsLeft(remaining);
            setDisplayPricing(allPricing);
            setTotalSpots(total);

            // Check if we're before launch (Feb 1st)
            const beforeLaunch = isPreLaunch();
            setIsBeforeLaunch(beforeLaunch);

            // Founder is open if wave exists AND is founder tier
            const founderOpen = wave !== null && wave.tier === 'founder';
            setIsFounderOpen(founderOpen);

            // SOLD OUT only if NOT pre-launch AND remaining = 0
            setIsSoldOut(!beforeLaunch && remaining === 0);

            // Get next wave for waitlist
            if (wave && allPricing.tier === 'founder') {
                const currentIndex = WAVES.findIndex(w => w.id === wave.id);
                if (currentIndex >= 0 && currentIndex < WAVES.length - 1) {
                    setNextWave(WAVES[currentIndex + 1]);
                }
            }
            // Hardcoded deadline for UI (31 March 2026)
            const deadline = new Date('2026-03-31T23:59:59');
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            }
        }
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // 👑 IMPERIAL PRICING PLANS
    const publicPricing = getCurrentPublicPricing();

    const plans = [
        {
            id: 'esploratore',
            name: 'Esploratore',
            icon: '⚡',
            tagline: 'Per Chi Inizia a Scalare',
            description: 'Strumenti professionali per testare il potenziale della tua AI',
            priceFounder: displayPricing?.prices?.esploratore || 39,
            pricePublic: publicPricing.prices.esploratore,
            pricePublicFinal: 397,
            features: ['1 Clone AI', '1,000 msg/mese', '1 Canale', 'Email Support <48h'],
            gradient: 'from-blue-50 via-indigo-50 to-blue-50',
            borderGradient: 'from-blue-400 to-indigo-500'
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            icon: '🚀',
            tagline: 'La Scelta di 73% dei Coach',
            description: 'Il portfolio scalato al prezzo: privata da remire di professionisti che hanno transformato il loro business',
            priceFounder: displayPricing?.prices?.pioniere || 147,
            pricePublic: publicPricing.prices.pioniere,
            pricePublicFinal: 797,
            featured: true,
            badge: 'PIÙ SCELTO',
            features: ['1 Clone AI', '5,000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro'],
            gradient: 'from-amber-50 via-yellow-50 to-amber-50',
            borderGradient: 'from-amber-400 to-yellow-500'
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            icon: '💎',
            tagline: 'Per Chi Punta all’Eccellenza',
            description: 'Agenzia e power user: scalare Conquistatore per dominare il mercato',
            priceFounder: displayPricing?.prices?.conquistatore || 347,
            pricePublic: publicPricing.prices.conquistatore,
            pricePublicFinal: 1397,
            features: ['3 Cloni AI', '20,000 msg/mese', 'API Access (60 req/min)', 'Priority Support'],
            gradient: 'from-purple-50 via-violet-50 to-purple-50',
            borderGradient: 'from-purple-500 to-violet-600'
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            icon: '👑',
            tagline: 'Il Trono Digitale. Solo per i Migliori',
            description: 'Accesso verticale, potenzialità illimitata, dominio totale. Libertià e 10 cloni laburo',
            priceFounder: displayPricing?.prices?.imperatore || 697,
            pricePublic: publicPricing.prices.imperatore,
            pricePublicFinal: 2197,
            features: ['10 Cloni AI', '50K msg/mese', 'White-label', 'Account Manager', 'API Priority'],
            gradient: 'from-orange-400 via-amber-500 to-orange-400',
            borderGradient: 'from-orange-500 to-amber-600',
            dark: true
        },
    ];

    // Function to calculate 5-year savings for Founder plans
    const calculateFounderSavings = (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return 0;
        return (plan.pricePublicFinal - plan.priceFounder) * 60; // 60 months in 5 years
    };

    // Direct checkout - Dynamic tier based on availability
    const handleCheckout = async (planId: string, forcePriceId?: string) => {
        setLoadingPlan(planId);

        const priceId = forcePriceId || displayPricing?.stripePriceIds?.[planId];

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: planId,
                    priceId
                }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Errore: ${data.error}`);
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Errore durante il checkout. Riprova.');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-champagne">
            {/* Top Banner */}
            <div className="bg-charcoal text-white text-center py-3 text-sm font-medium">
                {!isSoldOut ? (
                    <>
                        <span className="animate-pulse">🔥</span> {currentWave?.nameFull} · Solo {spotsLeft} Posti Rimasti · Chiusura: 31 Marzo 2026 · Prezzo Bloccato LIFETIME
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Programma Founder Chiuso · I Prezzi Pubblici Sono Ora Attivi
                    </>
                )}
            </div>

            {/* Main Container */}
            <div className="">

                {/* HERO EMOTIONAL - NEW VIRAL COMPONENT */}
                <FounderHeroEmotional
                    spotsLeft={spotsLeft}
                    totalSpots={totalSpots}
                    isBeforeLaunch={isBeforeLaunch}
                />

                {/* Countdown Section - Only show if Founder open */}
                {isFounderOpen && (
                    <div className="bg-gradient-to-br from-charcoal to-charcoal/90 border border-gold/20 rounded-[2rem] p-10 mb-16 text-center shadow-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            {[
                                { value: timeLeft.days, label: 'Giorni' },
                                { value: timeLeft.hours, label: 'Ore' },
                                { value: timeLeft.minutes, label: 'Minuti' },
                                { value: timeLeft.seconds, label: 'Secondi' },
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-4">
                                    <div className="text-4xl md:text-5xl font-bold text-gold font-mono">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-white/50 text-xs uppercase tracking-wider mt-1">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-gold" />
                                <div>
                                    <span className="text-3xl font-bold text-gold">{spotsLeft}</span>
                                    <span className="text-white/60 text-lg">/{totalSpots} posti</span>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-10 bg-white/20" />
                            <div className="flex items-center gap-3">
                                <Star className="w-6 h-6 text-gold" />
                                <div>
                                    <span className="text-3xl font-bold text-gold">€{calculateFounderSavings('imperatore').toLocaleString()}</span>
                                    <span className="text-white/60 text-lg"> risparmio 5 anni</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* Pricing Grid */}
                <div id="pricing" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 scroll-mt-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-[1.5rem] p-6 border-2 transition-all overflow-hidden ${plan.dark
                                    ? `bg-gradient-to-br ${plan.gradient} text-white border-gold shadow-2xl`
                                    : plan.featured
                                        ? `bg-gradient-to-br ${plan.gradient} border-2 border-${plan.borderGradient?.split(' ')[1]?.replace('to-', '')} shadow-xl scale-[1.02]`
                                        : `bg-gradient-to-br ${plan.gradient} border-2 hover:border-${plan.borderGradient?.split(' ')[1]?.replace('to-', '')} shadow-lg hover:shadow-xl`
                                }`}
                        >
                            {/* Border Gradient Effect */}
                            {plan.borderGradient && !plan.dark && (
                                <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-r ${plan.borderGradient} opacity-0 hover:opacity-10 transition-opacity pointer-events-none`} />
                            )}

                            {/* SOLD OUT Badge when Genesis exhausted */}
                            {isSoldOut && !isBeforeLaunch && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider z-10">
                                    🔴 SOLD OUT
                                </div>
                            )}

                            {/* Pre-Launch Badge */}
                            {isBeforeLaunch && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-amber-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider z-10">
                                    🚀 Launching Feb 1st
                                </div>
                            )}

                            {/* Popular Badge - only when founder open */}
                            {plan.badge && isFounderOpen && !isSoldOut && !isBeforeLaunch && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                    {plan.badge}
                                </div>
                            )}

                            {/* Icon */}
                            <div className="text-5xl mb-4">{plan.icon}</div>

                            {/* Plan Name */}
                            <h3 className={`text-xs uppercase tracking-[0.2em] font-black mb-1 ${plan.dark ? 'text-white/60' : 'text-charcoal/50'}`}>
                                {plan.name}
                            </h3>

                            {/* Tagline */}
                            <p className={`text-lg font-bold mb-3 ${plan.dark ? 'text-white' : 'text-charcoal'}`}>
                                {plan.tagline}
                            </p>

                            {/* Description */}
                            <p className={`text-xs leading-relaxed mb-4 ${plan.dark ? 'text-white/70' : 'text-charcoal/60'}`}>
                                {plan.description}
                            </p>

                            <div className="mb-4">
                                <div className={`text-4xl font-bold mb-1 text-gold`}>
                                    €{isFounderOpen ? plan.priceFounder : plan.pricePublic}
                                </div>
                                {isFounderOpen && (
                                    <>
                                        <div className={`text-sm line-through ${plan.id === 'imperatore' ? 'text-white/40' : 'text-charcoal/40'}`}>
                                            €{plan.pricePublic} pubblico 2026
                                        </div>
                                        <div className={`text-xs ${plan.id === 'imperatore' ? 'text-white/30' : 'text-charcoal/30'}`}>
                                            ↗ Aumenta ogni trimestre
                                        </div>
                                    </>
                                )}
                            </div>

                            {isFounderOpen && (
                                <div className="bg-green-500/10 text-green-600 text-sm font-medium px-3 py-2 rounded-lg mb-6">
                                    SAVE €{calculateFounderSavings(plan.id).toLocaleString()} (5 anni)
                                </div>
                            )}

                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.id === 'imperatore' ? 'text-gold' : 'text-green-500'}`} />
                                        <span className={plan.id === 'imperatore' ? 'text-white/80' : 'text-charcoal/70'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className={`text-xs mb-4 ${plan.id === 'imperatore' ? 'text-white/50' : 'text-charcoal/50'}`}>
                                <Shield className="w-3 h-3 inline mr-1" />
                                {plan.id === 'esploratore' ? '1 Clone AI' : plan.id === 'pioniere' ? '1 Clone AI' : plan.id === 'conquistatore' ? '3 Cloni AI' : '10 Cloni AI'}
                            </div>

                            {/* CHECKOUT BUTTONS - Dual Option when Sold Out */}
                            {!isSoldOut ? (
                                <button
                                    onClick={() => handleCheckout(plan.id)}
                                    disabled={loadingPlan !== null}
                                    className={`w-full block text-center py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${plan.featured
                                        ? 'gold-gradient text-white shadow-xl hover:shadow-2xl hover:scale-105'
                                        : plan.id === 'imperatore'
                                            ? 'bg-gold text-charcoal hover:bg-champagne shadow-lg'
                                            : 'bg-charcoal text-white hover:bg-gold hover:text-charcoal'
                                        }`}
                                >
                                    {loadingPlan === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Caricamento...
                                        </span>
                                    ) : (
                                        <>Scegli {plan.name}</>
                                    )}
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {nextWave && (
                                        <button
                                            onClick={async () => {
                                                const email = prompt("Email per waitlist:");
                                                if (email && email.includes('@')) {
                                                    try {
                                                        await fetch('/api/waitlist', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                email,
                                                                name: email.split('@')[0],
                                                                plan: plan.id,
                                                                current_wave: currentWave?.id,
                                                                next_wave: nextWave.id
                                                            })
                                                        });
                                                        alert(`In waitlist per ${nextWave.name}!`);
                                                    } catch (e) {
                                                        alert("Errore");
                                                    }
                                                }
                                            }}
                                            className="bg-white/20 hover:bg-white/30 text-charcoal border border-gold/30 py-3 rounded-xl font-bold text-xs uppercase transition-all"
                                        >
                                            📋 Waitlist
                                        </button>
                                    )}
                                    <button
                                        onClick={async () => {
                                            const publicPricing = getCurrentPublicPricing();
                                            await handleCheckout(plan.id, publicPricing.stripePriceIds[plan.id as keyof typeof publicPricing.stripePriceIds]);
                                        }}
                                        className="relative overflow-hidden bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/90 border-2 border-gold/40 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase hover:border-gold hover:scale-105 transition-all shadow-lg group"
                                    >
                                        {/* Gold accent line */}
                                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

                                        <span className="flex items-center justify-center gap-2">
                                            <span className="text-gold font-black text-base">{plan.pricePublic}€</span>
                                            <span className="text-white/80 text-xs">Prezzo Pubblico</span>
                                        </span>

                                        {/* Hover glow */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* SCARCITY TIMELINE - Show price escalation */}
                <ScarcityTimeline />

                {/* FOUNDER TESTIMONIALS - Social proof */}
                <FounderTestimonials />

                {/* FAQ - Handle objections */}
                <FounderFAQ />

                {/* FINAL CTA */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className={`text-center ${isFounderOpen ? 'gold-gradient' : 'bg-charcoal'} text-white rounded-[2rem] p-12 shadow-2xl`}>
                        <h2 className="text-3xl md:text-4xl font-serif italic mb-6">
                            {isFounderOpen ? (
                                <>
                                    Sei nel 20% che Costruisce Imperi,<br />
                                    o nell&apos;80% che Insegue?
                                </>
                            ) : (
                                <>
                                    Inizia Oggi con<br />
                                    14 Giorni Gratuiti
                                </>
                            )}
                        </h2>

                        <p className="text-xl mb-8 text-white/80">
                            {isFounderOpen
                                ? `Solo ${totalSpots} persone avranno questo privilegio. Per sempre.`
                                : 'Prova VirtualTwin senza rischi. Cancella quando vuoi.'}
                        </p>

                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-3 bg-white text-gold px-12 py-5 rounded-full text-lg font-bold hover:bg-champagne transition-all transform hover:scale-105 shadow-xl"
                        >
                            {isFounderOpen ? 'SCEGLI IL TUO PIANO FOUNDER' : 'INIZIA ORA'}
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <div className="mt-6 text-sm text-white/60">
                            {isFounderOpen
                                ? `${spotsLeft}/${totalSpots} Founder · Chiusura 31 Marzo 2026 · 14 giorni trial gratuito`
                                : '14 giorni trial gratuito · Nessuna carta richiesta'}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-12 text-charcoal/40 text-sm">
                        <Link href="/" className="text-gold hover:underline">← Torna alla Home</Link>
                    </div>

                </div>
            </div>

        </div>
        </div>
    );
}


