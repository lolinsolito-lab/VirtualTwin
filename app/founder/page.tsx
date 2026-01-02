'use client';

import { useState, useEffect } from 'react';
import { Crown, Zap, Clock, Users, ArrowRight, Check, Star, Loader2 } from 'lucide-react';

export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(141);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
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
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, []);

    const plans = [
        {
            id: 'esploratore',
            name: 'Esploratore',
            icon: '⚡',
            priceFounder: 39,
            pricePublic: 79,
            pricePublic2030: 119,
            marginPercent: 92,
            features: ['1 Clone AI', '1,000 msg/mese', '1 Canale', 'Email Support <48h'],
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            icon: '🚀',
            priceFounder: 97,
            pricePublic: 197,
            pricePublic2030: 297,
            marginPercent: 85,
            featured: true,
            features: ['1 Clone AI', '5,000 msg/mese', '3 Canali', 'A/B Testing 20%', 'Analytics Pro'],
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            icon: '💎',
            priceFounder: 197,
            pricePublic: 397,
            pricePublic2030: 597,
            marginPercent: 72,
            features: ['3 Cloni AI', '20,000 msg/mese', 'API Access (60 req/min)', 'Priority Support'],
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            icon: '👑',
            priceFounder: 595,
            pricePublic: 797,
            pricePublic2030: 1197,
            marginPercent: 68,
            badge: 'PIÙ SCELTO',
            features: ['10 Cloni AI', '50K msg/mese*', 'White-label', 'Account Manager', 'API Priority'],
        },
    ];

    // Direct checkout - no registration required!
    const handleCheckout = async (planId: string) => {
        setLoadingPlan(planId);

        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId, tier: 'founder' }),
            });

            const data = await response.json();

            if (data.error) {
                alert(`Errore: ${data.error}`);
                return;
            }

            // Redirect to Stripe Checkout
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
            <div className="gold-gradient text-white py-3 text-center text-sm font-medium">
                <span className="animate-pulse">🔥</span> Solo {spotsLeft}/153 Founder Disponibili · Chiusura: 31 Marzo 2026 · Prezzo Bloccato LIFETIME
            </div>

            {/* Main Container */}
            <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-6 py-2 rounded-full mb-8 font-black text-[10px] uppercase tracking-[0.4em]">
                        <Crown className="w-4 h-4" />
                        Founder Program Sovereign Edition
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight text-charcoal">
                        Blocca il Prezzo<br />
                        <span className="italic gold-text-gradient">Per Sempre.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed">
                        Entra nei primi <strong className="text-charcoal">153 Founder</strong> e blocca il prezzo
                        a <strong className="text-gold">€39-€595/mese</strong> per sempre.
                        <br className="hidden md:block" />
                        Anche quando nel 2030 costerà €1,197/mese.
                    </p>
                </div>

                {/* Countdown Section */}
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
                                <span className="text-white/60 text-lg">/153 posti</span>
                            </div>
                        </div>
                        <div className="hidden md:block w-px h-10 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <Star className="w-6 h-6 text-gold" />
                            <div>
                                <span className="text-3xl font-bold text-gold">€36,120</span>
                                <span className="text-white/60 text-lg"> risparmio 5 anni</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div id="pricing" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 scroll-mt-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-[1.5rem] p-6 border-2 transition-all ${plan.featured
                                ? 'bg-gradient-to-br from-gold/10 to-champagne border-gold shadow-xl scale-[1.02]'
                                : plan.badge
                                    ? 'bg-charcoal text-white border-gold shadow-xl'
                                    : 'bg-white border-charcoal/10 hover:border-gold/50'
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="text-4xl mb-3">{plan.icon}</div>
                            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>

                            <div className="mb-4">
                                <div className={`text-4xl font-bold mb-1 ${plan.badge ? 'text-gold' : 'text-gold'}`}>
                                    €{plan.priceFounder}
                                </div>
                                <div className={`text-sm line-through ${plan.badge ? 'text-white/40' : 'text-charcoal/40'}`}>
                                    €{plan.pricePublic} pubblico 2026
                                </div>
                                <div className={`text-xs ${plan.badge ? 'text-white/30' : 'text-charcoal/30'}`}>
                                    €{plan.pricePublic2030} nel 2030
                                </div>
                            </div>

                            <div className="bg-green-500/10 text-green-600 text-sm font-medium px-3 py-2 rounded-lg mb-6">
                                {plan.marginPercent}% margin · Lifetime lock
                            </div>

                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.badge ? 'text-gold' : 'text-green-500'}`} />
                                        <span className={plan.badge ? 'text-white/80' : 'text-charcoal/70'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CHECKOUT BUTTON - Direct to Stripe! */}
                            <button
                                onClick={() => handleCheckout(plan.id)}
                                disabled={loadingPlan !== null}
                                className={`w-full block text-center py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${plan.badge
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
                                ) : (
                                    `Scegli ${plan.name}`
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="bg-white rounded-[2rem] p-10 mb-16 shadow-lg border border-charcoal/5">
                    <h2 className="text-3xl font-serif italic text-center mb-10 text-charcoal">
                        🏆 Vantaggi <span className="gold-text-gradient">Founder</span> Esclusivi
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: '💎', title: 'Prezzo Bloccato LIFETIME', desc: 'Paghi €595 oggi, €595 nel 2030. Mai aumento per te.' },
                            { icon: '👑', title: 'Badge Legacy Founder', desc: 'Status symbol visibile su profilo e dashboard.' },
                            { icon: '⚡', title: 'Tutte le Nuove Feature', desc: 'Accesso automatico a ogni release 2026-2030+.' },
                            { icon: '🎯', title: 'Priority Support Tier 0', desc: 'Sopra Priority, sopra tutti. Risposta garantita <6h.' },
                            { icon: '📞', title: 'Accesso Diretto WhatsApp', desc: 'Linea diretta con Account Manager (Imperatore).' },
                            { icon: '🚀', title: 'Early Beta Testing', desc: 'Provi feature in anteprima prima del pubblico.' },
                        ].map((benefit, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-champagne/50 transition-colors">
                                <div className="text-3xl">{benefit.icon}</div>
                                <div>
                                    <h3 className="font-bold mb-1 text-charcoal">{benefit.title}</h3>
                                    <p className="text-sm text-charcoal/60">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-gradient-to-br from-champagne to-white rounded-[2rem] p-10 mb-16 border border-charcoal/5">
                    <h2 className="text-3xl font-serif italic text-center mb-8 text-charcoal">
                        Founder vs Pubblico: Il Confronto
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-charcoal/10">
                                    <th className="text-left py-4 px-4 font-bold text-charcoal">Piano</th>
                                    <th className="text-center py-4 px-4 text-gold font-bold">Founder 2026</th>
                                    <th className="text-center py-4 px-4 text-charcoal/60">Pubblico 2026</th>
                                    <th className="text-center py-4 px-4 text-charcoal/40">Pubblico 2030</th>
                                    <th className="text-center py-4 px-4 bg-green-50 font-bold text-green-700">Risparmio 5 Anni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/5">
                                <tr>
                                    <td className="py-4 px-4 font-medium">Esploratore</td>
                                    <td className="text-center py-4 px-4 text-gold font-bold">€39/mese</td>
                                    <td className="text-center py-4 px-4 text-charcoal/60">€79/mese</td>
                                    <td className="text-center py-4 px-4 text-charcoal/40">€119/mese</td>
                                    <td className="text-center py-4 px-4 bg-green-50 font-bold text-green-700">€4,800</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium">Pioniere</td>
                                    <td className="text-center py-4 px-4 text-gold font-bold">€97/mese</td>
                                    <td className="text-center py-4 px-4 text-charcoal/60">€197/mese</td>
                                    <td className="text-center py-4 px-4 text-charcoal/40">€297/mese</td>
                                    <td className="text-center py-4 px-4 bg-green-50 font-bold text-green-700">€12,000</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium">Conquistatore</td>
                                    <td className="text-center py-4 px-4 text-gold font-bold">€197/mese</td>
                                    <td className="text-center py-4 px-4 text-charcoal/60">€397/mese</td>
                                    <td className="text-center py-4 px-4 text-charcoal/40">€597/mese</td>
                                    <td className="text-center py-4 px-4 bg-green-50 font-bold text-green-700">€24,000</td>
                                </tr>
                                <tr className="bg-gold/5">
                                    <td className="py-4 px-4 font-bold">Imperatore 👑</td>
                                    <td className="text-center py-4 px-4 text-gold font-bold text-lg">€595/mese</td>
                                    <td className="text-center py-4 px-4 font-bold text-charcoal/70">€797/mese</td>
                                    <td className="text-center py-4 px-4 font-bold text-charcoal/50">€1,197/mese</td>
                                    <td className="text-center py-4 px-4 bg-green-100 font-bold text-green-800 text-lg">€36,120</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-center text-xs text-charcoal/40 mt-4">
                        * Imperatore include Fair Use Policy: 50K msg inclusi, soft limit 100K, hard limit 250K con Account Manager dedicato.
                    </p>
                </div>

                {/* Final CTA */}
                <div className="text-center gold-gradient text-white rounded-[2rem] p-12 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-serif italic mb-6">
                        Sei nel 20% che Costruisce Imperi,<br />
                        o nell'80% che Insegue?
                    </h2>

                    <p className="text-xl mb-8 text-white/80">
                        Solo 153 persone avranno questo privilegio. Per sempre.
                    </p>

                    <a
                        href="#pricing"
                        className="inline-flex items-center gap-3 bg-white text-gold px-12 py-5 rounded-full text-lg font-bold hover:bg-champagne transition-all transform hover:scale-105 shadow-xl"
                    >
                        SCEGLI IL TUO PIANO FOUNDER
                        <ArrowRight className="w-5 h-5" />
                    </a>

                    <div className="mt-6 text-sm text-white/60">
                        {spotsLeft}/153 Founder · Chiusura 31 Marzo 2026 · 14 giorni trial gratuito
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
