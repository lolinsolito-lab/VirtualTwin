'use client';

import { useState, useEffect } from 'react';
import { Crown, Zap, Clock, Users, ArrowRight, Check, Star, Loader2, Shield, Lock } from 'lucide-react';
import { IMPERIAL_PRICES, PLAN_LIMITS, FOUNDER_CONFIG, calculateFounderSavings, getFounderDiscount } from '@/lib/pricing';

export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(FOUNDER_CONFIG.totalSpots); // 20 Genesis Founders
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [isFounderOpen, setIsFounderOpen] = useState(true);
    const [isSoldOut, setIsSoldOut] = useState(false); // Track if sold out (not just closed)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const deadline = FOUNDER_CONFIG.deadline;
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            } else {
                setIsFounderOpen(false);
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, []);

    // Check if founder spots are still available
    useEffect(() => {
        if (spotsLeft <= 0) {
            setIsFounderOpen(false);
            setIsSoldOut(true); // Mark as sold out
        }
    }, [spotsLeft]);

    // Fetch real founder count from API
    useEffect(() => {
        async function fetchFounderCount() {
            try {
                const response = await fetch('/api/founder/count');
                if (response.ok) {
                    const data = await response.json();
                    const remaining = FOUNDER_CONFIG.totalSpots - (data.count || 0);
                    setSpotsLeft(Math.max(0, remaining));
                }
            } catch (error) {
                console.error('Error fetching founder count:', error);
            }
        }

        fetchFounderCount();

        // Refresh every 30 seconds
        const interval = setInterval(fetchFounderCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // 👑 IMPERIAL PRICING PLANS
    const plans = [
        {
            id: 'esploratore',
            name: 'Esploratore',
            icon: '⚡',
            priceFounder: IMPERIAL_PRICES.founder.esploratore,
            pricePublic: IMPERIAL_PRICES.public_2026.esploratore,
            pricePublic2030: IMPERIAL_PRICES.public_2030.esploratore,
            discount: getFounderDiscount('esploratore'),
            savings5yr: calculateFounderSavings('esploratore'),
            features: ['1 Clone AI', '1,000 msg/mese', '1 Canale', 'Email Support <48h'],
            limits: PLAN_LIMITS.esploratore,
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            icon: '🚀',
            priceFounder: IMPERIAL_PRICES.founder.pioniere,  // €147
            pricePublic: IMPERIAL_PRICES.public_2026.pioniere,  // €297
            pricePublic2030: IMPERIAL_PRICES.public_2030.pioniere,  // €497
            discount: getFounderDiscount('pioniere'),
            savings5yr: calculateFounderSavings('pioniere'),
            featured: true,
            badge: 'PIÙ SCELTO',
            features: ['1 Clone AI', '5,000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro'],
            limits: PLAN_LIMITS.pioniere,
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            icon: '💎',
            priceFounder: IMPERIAL_PRICES.founder.conquistatore,  // €347
            pricePublic: IMPERIAL_PRICES.public_2026.conquistatore,  // €697
            pricePublic2030: IMPERIAL_PRICES.public_2030.conquistatore,  // €1097
            discount: getFounderDiscount('conquistatore'),
            savings5yr: calculateFounderSavings('conquistatore'),
            features: ['3 Cloni AI', '20,000 msg/mese', 'API Access (60 req/min)', 'Priority Support'],
            limits: PLAN_LIMITS.conquistatore,
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            icon: '👑',
            priceFounder: IMPERIAL_PRICES.founder.imperatore,  // €697
            pricePublic: IMPERIAL_PRICES.public_2026.imperatore,  // €1,197
            pricePublic2030: IMPERIAL_PRICES.public_2030.imperatore,  // €1,797
            discount: getFounderDiscount('imperatore'),
            savings5yr: calculateFounderSavings('imperatore'),
            features: ['10 Cloni AI', '50K msg/mese', 'White-label', 'Account Manager', 'API Priority'],
            limits: PLAN_LIMITS.imperatore,
        },
    ];

    // Direct checkout - Dynamic tier based on availability
    const handleCheckout = async (planId: string) => {
        setLoadingPlan(planId);

        try {
            const tier = isFounderOpen ? 'founder' : 'public';

            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId, tier }),
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
            <div className={`${isFounderOpen ? 'gold-gradient' : 'bg-charcoal'} text-white py-3 text-center text-sm font-medium`}>
                {isFounderOpen ? (
                    <>
                        <span className="animate-pulse">🔥</span> Solo {spotsLeft}/{FOUNDER_CONFIG.totalSpots} Founder Disponibili · Chiusura: 31 Marzo 2026 · Prezzo Bloccato LIFETIME
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
                                Entra nei primi <strong className="text-charcoal">{FOUNDER_CONFIG.totalSpots} Founder</strong> e blocca il prezzo
                                a <strong className="text-gold">€{IMPERIAL_PRICES.founder.pioniere}/mese</strong> per sempre.
                                <br className="hidden md:block" />
                                Anche quando il prezzo pubblico aumenterà a €{IMPERIAL_PRICES.public_2030.pioniere}/mese.
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
                                    <span className="text-white/60 text-lg">/{FOUNDER_CONFIG.totalSpots} posti</span>
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
                                    {plan.discount}% OFF · Risparmio €{plan.savings5yr.toLocaleString()}
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

                            {/* Plan Limits Badge */}
                            <div className={`text-xs mb-4 ${plan.id === 'imperatore' ? 'text-white/50' : 'text-charcoal/50'}`}>
                                <Shield className="w-3 h-3 inline mr-1" />
                                {plan.limits.clones} clone{plan.limits.clones > 1 ? 's' : ''} · {plan.limits.messagesPerMonth.toLocaleString()} msg/mese
                            </div>

                            {/* CHECKOUT BUTTON */}
                            <button
                                onClick={() => handleCheckout(plan.id)}
                                disabled={loadingPlan !== null || isSoldOut}
                                className={`w-full block text-center py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${isSoldOut
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : plan.id === 'imperatore'
                                        ? 'bg-gold text-charcoal hover:bg-gold/90'
                                        : plan.featured
                                            ? 'gold-gradient text-white shadow-lg hover:scale-105'
                                            : 'bg-charcoal/5 text-charcoal hover:bg-charcoal hover:text-white'
                                    }`}
                            >
                                {loadingPlan === plan.id ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Caricamento...
                                    </span>
                                ) : isSoldOut ? (
                                    'ESAURITO'
                                ) : (
                                    `Scegli ${plan.name}`
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* 🚀 PUBLIC PRICING SECTION - Only when Founder is sold out */}
                {isSoldOut && (
                    <div className="mb-16">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-6 py-2 rounded-full mb-4 font-black text-[10px] uppercase tracking-[0.4em]">
                                ✅ DISPONIBILI
                            </div>
                            <h2 className="font-serif text-4xl text-charcoal mb-4">
                                Prezzi <span className="italic gold-text-gradient">Pubblici</span>
                            </h2>
                            <p className="text-charcoal/60">
                                I posti Genesis Founder sono esauriti. Puoi comunque iniziare con i prezzi pubblici.
                            </p>
                        </div>

                        <div id="public-pricing" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {plans.map((plan, i) => (
                                <div
                                    key={`public-${i}`}
                                    className={`relative rounded-[1.5rem] p-6 border-2 transition-all ${plan.featured
                                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-xl scale-[1.02]'
                                        : plan.id === 'imperatore'
                                            ? 'bg-charcoal text-white border-green-400 shadow-xl'
                                            : 'bg-white border-charcoal/10 hover:border-green-400'
                                        }`}
                                >
                                    {plan.featured && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                            BESTSELLER
                                        </div>
                                    )}

                                    <div className="text-4xl mb-3">{plan.icon}</div>
                                    <h3 className="text-xl font-bold mb-4">{plan.name}</h3>

                                    <div className="mb-4">
                                        <div className="text-4xl font-bold mb-1 text-green-600">
                                            €{plan.pricePublic}
                                        </div>
                                        <div className={`text-sm ${plan.id === 'imperatore' ? 'text-white/60' : 'text-charcoal/60'}`}>
                                            /mese · Prezzo Pubblico
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feature, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm">
                                                <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.id === 'imperatore' ? 'text-green-400' : 'text-green-500'}`} />
                                                <span className={plan.id === 'imperatore' ? 'text-white/80' : 'text-charcoal/70'}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handleCheckout(plan.id)}
                                        disabled={loadingPlan !== null}
                                        className={`w-full block text-center py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider disabled:opacity-50 ${plan.id === 'imperatore'
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : plan.featured
                                                ? 'bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-105'
                                                : 'bg-green-100 text-green-700 hover:bg-green-500 hover:text-white'
                                            }`}
                                    >
                                        {loadingPlan === plan.id ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Caricamento...
                                            </span>
                                        ) : (
                                            `Inizia con ${plan.name}`
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Benefits Section - Only for Founder */}
                {isFounderOpen && (
                    <div className="bg-white rounded-[2rem] p-10 mb-16 shadow-lg border border-charcoal/5">
                        <h2 className="text-3xl font-serif italic text-center mb-10 text-charcoal">
                            🏆 Vantaggi <span className="gold-text-gradient">Founder</span> Esclusivi
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {FOUNDER_CONFIG.benefits.map((benefit, i) => {
                                const icons = ['💎', '👑', '⚡', '🎯', '🚀'];
                                return (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-champagne/50 transition-colors">
                                        <div className="text-3xl">{icons[i % icons.length]}</div>
                                        <div>
                                            <h3 className="font-bold mb-1 text-charcoal">{benefit}</h3>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Comparison Table */}
                <div className="bg-gradient-to-br from-champagne to-white rounded-[2rem] p-10 mb-16 border border-charcoal/5">
                    <h2 className="text-3xl font-serif italic text-center mb-8 text-charcoal">
                        {isFounderOpen ? 'Founder vs Pubblico: Il Confronto' : 'Confronto Piani'}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-charcoal/10">
                                    <th className="text-left py-4 px-4 font-bold text-charcoal">Piano</th>
                                    {isFounderOpen && <th className="text-center py-4 px-4 text-gold font-bold">Founder 2026</th>}
                                    <th className="text-center py-4 px-4 text-charcoal/60">Pubblico 2026</th>
                                    <th className="text-center py-4 px-4 text-charcoal/40">Pubblico 2030</th>
                                    {isFounderOpen && <th className="text-center py-4 px-4 bg-green-50 font-bold text-green-700">Risparmio 5 Anni</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/5">
                                {plans.map((plan) => (
                                    <tr key={plan.id} className={plan.id === 'imperatore' ? 'bg-gold/5' : ''}>
                                        <td className="py-4 px-4 font-medium">{plan.name} {plan.icon}</td>
                                        {isFounderOpen && <td className="text-center py-4 px-4 text-gold font-bold">€{plan.priceFounder}/mese</td>}
                                        <td className="text-center py-4 px-4 text-charcoal/60">€{plan.pricePublic}/mese</td>
                                        <td className="text-center py-4 px-4 text-charcoal/40">€{plan.pricePublic2030}/mese</td>
                                        {isFounderOpen && <td className="text-center py-4 px-4 bg-green-50 font-bold text-green-700">€{plan.savings5yr.toLocaleString()}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final CTA */}
                <div className={`text-center ${isFounderOpen ? 'gold-gradient' : 'bg-charcoal'} text-white rounded-[2rem] p-12 shadow-2xl`}>
                    <h2 className="text-3xl md:text-4xl font-serif italic mb-6">
                        {isFounderOpen ? (
                            <>
                                Sei nel 20% che Costruisce Imperi,<br />
                                o nell'80% che Insegue?
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
                            ? `Solo ${FOUNDER_CONFIG.totalSpots} persone avranno questo privilegio. Per sempre.`
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
                            ? `${spotsLeft}/${FOUNDER_CONFIG.totalSpots} Founder · Chiusura 31 Marzo 2026 · 14 giorni trial gratuito`
                            : '14 giorni trial gratuito · Nessuna carta richiesta'}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-charcoal/40 text-sm">
                    <a href="/" className="text-gold hover:underline">← Torna alla Home</a>
                </div>

            </div>
        </div>
    );
}
