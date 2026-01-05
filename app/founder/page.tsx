'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, ArrowRight, Check, Star, Loader2, Shield, Lock } from 'lucide-react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, getDisplayPricing, getCurrentPublicPricing, getTotalFounderSpots, Wave, WAVES, isPreLaunch } from '@/lib/waves';
import FounderHeroEmotional from '@/components/founder-viral/FounderHeroEmotional';
import ScarcityTimeline from '@/components/founder-viral/ScarcityTimeline';
import FounderTestimonials from '@/components/founder-viral/FounderTestimonials';
import FounderFAQ from '@/components/founder-viral/FounderFAQ';
import PhilosophyAdvantage from '@/components/founder-viral/PhilosophyAdvantage';

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
            tagline: 'Per chi Inizia a Scalare',
            description: 'Il punto di ingresso per testare il potenziale della tua AI.',
            priceFounder: 297,
            pricePublic: 697,
            icon: '⚡',
            gradient: 'from-[#F8FAFC] to-[#F1F5F9]',
            borderColor: 'border-slate-200',
            borderHover: 'hover:border-slate-300',
            dark: false,
            features: [
                '1 Clone AI Professionale',
                '1,000 messaggi/mese',
                '1 Canale dedicato',
                'Supporto Email <48h',
            ]
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            tagline: 'Per chi vuole Dominare',
            description: 'La soluzione completa per scalare la tua presenza digitale.',
            priceFounder: 697,
            pricePublic: 1197,
            icon: '🚀',
            badge: 'PIÙ SCELTO',
            featured: true,
            gradient: 'from-[#FAFAF9] to-[#F5F5F4]',
            borderColor: 'border-gold/30',
            borderHover: 'hover:border-gold/50',
            dark: false,
            features: [
                '1 Clone AI Alta Fedeltà',
                '5,000 messaggi/mese',
                '3 Canali diversi',
                'A/B Testing 20% vocale',
                'Analytics Pro',
            ]
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            tagline: 'L\'Agenzia nell\'Ombra',
            description: 'Potenza e velocità per chi non accetta compromessi.',
            priceFounder: 1197,
            pricePublic: 1997,
            icon: '💎',
            gradient: 'from-charcoal via-[#1C1C1C] to-charcoal',
            borderColor: 'border-white/10',
            borderHover: 'hover:border-white/20',
            dark: true,
            features: [
                '3 Cloni AI Simultanei',
                '20,000 messaggi/mese',
                'Accesso API (60 req/min)',
                'Priority Support 24/7',
                'White-label (optional)',
            ]
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            tagline: 'Il Trono Digitale',
            description: 'Controllo totale, dominio assoluto. Solo per i migliori.',
            priceFounder: 1997,
            pricePublic: 4997,
            icon: '👑',
            gradient: 'from-[#0F0F0F] via-[#141414] to-[#0F0F0F]',
            borderColor: 'border-gold/40',
            borderHover: 'hover:border-gold/60 shadow-[0_0_30px_rgba(212,175,55,0.1)]',
            dark: true,
            features: [
                '10 Cloni AI - Rete Neurale',
                '50,000 messaggi/mese',
                'Account Manager Dedicato',
                'API Priority & Custom',
                'Sviluppo Modelli Custom',
            ]
        },
    ];

    // Function to calculate 5-year savings for Founder plans
    const calculateFounderSavings = (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return 0;
        return (plan.pricePublic - plan.priceFounder) * 60; // 60 months in 5 years
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
        <div className="min-h-screen bg-[#FDFCFB]">
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
                    <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
                        <div className="bg-charcoal border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
                                {[
                                    { value: timeLeft.days, label: 'Giorni' },
                                    { value: timeLeft.hours, label: 'Ore' },
                                    { value: timeLeft.minutes, label: 'Minuti' },
                                    { value: timeLeft.seconds, label: 'Secondi' },
                                ].map((item, i) => (
                                    <div key={i} className="relative group">
                                        <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-white group-hover:text-gold transition-colors">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 mt-2">{item.label}</div>
                                        {i < 3 && <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-white/10 text-3xl">:</div>}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-gold" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">{spotsLeft}</div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest">posti rimasti</div>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-12 bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Star className="w-5 h-5 text-gold" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">€{calculateFounderSavings('imperatore').toLocaleString()}</div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest">risparmio garantito</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* PHILOSOPHY SECTION - NEW */}
                <PhilosophyAdvantage />

                {/* Pricing Grid */}
                <div id="pricing" className="max-w-7xl mx-auto px-4 py-20 scroll-mt-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative rounded-[2.5rem] p-8 border transition-all duration-500 overflow-hidden group ${plan.dark
                                    ? `bg-gradient-to-br ${plan.gradient} text-white ${plan.borderColor} shadow-2xl hover:scale-[1.02]`
                                    : plan.featured
                                        ? `bg-gradient-to-br ${plan.gradient} ${plan.borderColor} shadow-xl scale-[1.03] animate-pulse-slow`
                                        : `bg-white ${plan.borderColor} ${plan.borderHover} shadow-sm hover:shadow-xl hover:scale-[1.02]`
                                    }`}
                            >

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
                                <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform duration-500">
                                    {plan.icon}
                                </div>

                                {/* Plan Name */}
                                <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black mb-1 ${plan.dark ? 'text-white/40' : 'text-charcoal/40'}`}>
                                    {plan.name}
                                </h3>

                                {/* Tagline */}
                                <p className={`text-xl font-serif italic mb-4 ${plan.dark ? 'text-white' : 'text-charcoal'}`}>
                                    {plan.tagline}
                                </p>

                                {/* Description */}
                                <p className={`text-xs leading-relaxed mb-6 font-medium ${plan.dark ? 'text-white/60' : 'text-charcoal/50'}`}>
                                    {plan.description}
                                </p>

                                <div className="mb-6">
                                    <div className={`text-5xl font-bold mb-1 tracking-tighter ${plan.dark ? 'text-white' : 'text-charcoal'}`}>
                                        €{isFounderOpen ? plan.priceFounder : plan.pricePublic}<span className="text-sm font-normal text-current/40">/mo</span>
                                    </div>
                                    {isFounderOpen && (
                                        <div className="flex flex-col gap-1">
                                            <div className={`text-xs font-bold uppercase tracking-widest ${plan.id === 'imperatore' ? 'text-white/30' : 'text-charcoal/30'}`}>
                                                Public: <span className="line-through">€{plan.pricePublic}</span>
                                            </div>
                                            <div className="text-[9px] uppercase font-black tracking-widest text-gold animate-pulse">
                                                ↗ Prezzo bloccato per sempre
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {isFounderOpen && (
                                    <div className="bg-gold/5 border border-gold/10 text-gold text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl mb-8 text-center">
                                        Risparmio: €{calculateFounderSavings(plan.id).toLocaleString()}
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
                </div>

                {/* SCARCITY TIMELINE - Show price escalation */}
                <ScarcityTimeline />

                {/* FOUNDER TESTIMONIALS - Social proof */}
                <FounderTestimonials />

                {/* FAQ - Handle objections */}
                <FounderFAQ />

                {/* FINAL CTA */}
                <div className="max-w-4xl mx-auto px-6 py-20 pb-20">
                    <div className="relative group overflow-hidden bg-charcoal text-white rounded-[3rem] p-12 md:p-16 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] text-center">
                        {/* Interactive Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50 group-hover:scale-110 transition-transform duration-1000" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 leading-tight">
                                {isFounderOpen ? (
                                    <>
                                        Entra nel cerchio ristretto <br />
                                        che <span className="text-gold">possiede</span> il Futuro.
                                    </>
                                ) : (
                                    <>
                                        Inizia Oggi con <br />
                                        14 Giorni di Prova
                                    </>
                                )}
                            </h2>

                            <p className="text-xl mb-12 text-white/50 max-w-2xl mx-auto leading-relaxed">
                                {isFounderOpen
                                    ? `Solo ${totalSpots} posti disponibili. Una volta chiusa la Genesis Wave, non ci sarà modo di rientrare a queste condizioni.`
                                    : 'Prova l\'esperienza VirtualTwin completa per 14 giorni. Nessun impegno, solo risultati.'}
                            </p>

                            <div className="flex flex-col items-center gap-6">
                                <a
                                    href="#pricing"
                                    className="group/btn inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)]"
                                >
                                    {isFounderOpen ? 'BLOCCA ORA IL TUO POSTO' : 'INIZIA ORA'}
                                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                </a>

                                <div className="flex items-center gap-8 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Nessuna Carta Richiesta</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> 14 Giorni Trial</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Cancella Ora</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center mt-12 mb-20">
                        <Link href="/" className="inline-flex items-center gap-3 text-charcoal/40 hover:text-gold transition-colors font-black tracking-widest uppercase text-[10px]">
                            <ArrowRight className="w-3 h-3 rotate-180" />
                            Torna alla Home
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}


