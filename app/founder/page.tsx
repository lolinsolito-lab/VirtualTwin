'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, ArrowRight, Check, Star, Loader2, Shield, Lock } from 'lucide-react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, getDisplayPricing, getCurrentPublicPricing, getTotalFounderSpots, Wave, WAVES } from '@/lib/waves';

export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [totalSpots, setTotalSpots] = useState(60);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [displayPricing, setDisplayPricing] = useState<Awaited<ReturnType<typeof getDisplayPricing>> | null>(null);
    const [nextWave, setNextWave] = useState<Wave | null>(null);
    const [isFounderOpen] = useState(true);

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
            setSpotsLeft(remaining);
            setIsSoldOut(remaining === 0);

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
            priceFounder: displayPricing?.prices?.esploratore || 39,
            pricePublic: publicPricing.prices.esploratore,
            pricePublicFinal: 397,
            features: ['1 Clone AI', '1,000 msg/mese', '1 Canale', 'Email Support <48h'],
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            icon: '🚀',
            priceFounder: displayPricing?.prices?.pioniere || 147,
            pricePublic: publicPricing.prices.pioniere,
            pricePublicFinal: 797,
            featured: true,
            badge: 'PIÙ SCELTO',
            features: ['1 Clone AI', '5,000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro'],
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            icon: '💎',
            priceFounder: displayPricing?.prices?.conquistatore || 347,
            pricePublic: publicPricing.prices.conquistatore,
            pricePublicFinal: 1397,
            features: ['3 Cloni AI', '20,000 msg/mese', 'API Access (60 req/min)', 'Priority Support'],
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            icon: '👑',
            priceFounder: displayPricing?.prices?.imperatore || 697,
            pricePublic: publicPricing.prices.imperatore,
            pricePublicFinal: 2197,
            features: ['10 Cloni AI', '50K msg/mese', 'White-label', 'Account Manager', 'API Priority'],
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
            <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 ${isFounderOpen ? 'bg-gold/10 text-gold' : 'bg-charcoal/10 text-charcoal'} px-6 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.4em]`}>
                        <Crown className="w-4 h-4" />
                        {isFounderOpen ? 'Founder Program Sovereign Edition' : 'VirtualTwin Public Pricing'}
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight text-charcoal">
                        {isFounderOpen ? (
                            <>
                                Blocca il Prezzo<br />
                                <span className="italic gold-text-gradient">Per Sempre.</span>
                            </>
                        ) : (
                            <>
                                Il Tuo Clone AI<br />
                                <span className="italic text-charcoal/70">Ti Aspetta.</span>
                            </>
                        )}
                    </h1>

                    <p className="text-xl md:text-2xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed">
                        {isFounderOpen ? (
                            <>
                                Entra nei primi <strong className="text-charcoal">{totalSpots} Founder</strong> e blocca il prezzo
                                a <strong className="text-gold">€{displayPricing?.prices?.pioniere || 147}/mese</strong> per sempre.
                                <br className="hidden md:block" />
                                Anche quando il prezzo pubblico aumenterà a €{plans[1].pricePublicFinal}/mese.
                            </>
                        ) : (
                            <>
                                Scegli il piano perfetto per il tuo business.
                                <br className="hidden md:block" />
                                Inizia con <strong className="text-charcoal">14 giorni di trial gratuito</strong>.
                            </>
                        )}
                    </p>
                </div>

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
                )}

                {/* Pricing Grid */}
                <div id="pricing" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 scroll-mt-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-[1.5rem] p-6 border-2 transition-all ${plan.featured
                                ? 'bg-gradient-to-br from-gold/10 to-champagne border-gold shadow-xl scale-[1.02]'
                                : plan.id === 'imperatore'
                                    ? 'bg-charcoal text-white border-gold shadow-xl'
                                    : 'bg-white border-charcoal/10 hover:border-gold/50'
                                }`}
                        >
                            {/* SOLD OUT Badge when Genesis exhausted */}
                            {isSoldOut && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider z-10">
                                    🔴 SOLD OUT
                                </div>
                            )}

                            {/* Popular Badge - only when founder open */}
                            {plan.badge && isFounderOpen && !isSoldOut && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="text-4xl mb-3">{plan.icon}</div>
                            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>

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
                                        className="gold-gradient text-white py-3 rounded-xl font-bold text-xs uppercase hover:scale-105 transition-all"
                                    >
                                        💳 €{plan.pricePublic} Public
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
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
        </div >
    );
}
