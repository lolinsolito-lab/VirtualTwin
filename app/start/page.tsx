'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Zap,
    Clock,
    CheckCircle,
    ArrowRight,
    Shield,
    Sparkles,
    TrendingUp,
    MessageSquare,
    Bot,
    Crown
} from 'lucide-react';

// Import wave utilities
import { getCurrentPublicPricing, getNextPublicPricing, getDaysUntilPriceIncrease } from '@/lib/waves';

export default function StartPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentPricing = getCurrentPublicPricing();
    const nextPricing = getNextPublicPricing();
    const daysUntilIncrease = getDaysUntilPriceIncrease();

    const plans = [
        {
            id: 'esploratore',
            name: 'Esploratore',
            price: currentPricing.prices.esploratore,
            priceId: currentPricing.stripePriceIds.esploratore,
            nextPrice: nextPricing?.prices.esploratore,
            messages: '500',
            features: [
                '500 messaggi AI/mese',
                '1 canale (WhatsApp)',
                'AI Gemini Flash',
                'Dashboard base',
                'Support email'
            ],
            icon: Zap,
            popular: false
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            price: currentPricing.prices.pioniere,
            priceId: currentPricing.stripePriceIds.pioniere,
            nextPrice: nextPricing?.prices.pioniere,
            messages: '2,000',
            features: [
                '2,000 messaggi AI/mese',
                '3 canali (WhatsApp, IG, Messenger)',
                'AI Gemini Pro',
                'Analytics avanzate',
                'Priority support',
                'Founder Academy'
            ],
            icon: TrendingUp,
            popular: true
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            price: currentPricing.prices.conquistatore,
            priceId: currentPricing.stripePriceIds.conquistatore,
            nextPrice: nextPricing?.prices.conquistatore,
            messages: '5,000',
            features: [
                '5,000 messaggi AI/mese',
                'Tutti i canali',
                'AI GPT-4 Turbo',
                'White-label dashboard',
                'API access',
                'Dedicated success manager'
            ],
            icon: Crown,
            popular: false
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            price: currentPricing.prices.imperatore,
            priceId: currentPricing.stripePriceIds.imperatore,
            nextPrice: nextPricing?.prices.imperatore,
            messages: '50,000',
            features: [
                '50,000 messaggi AI/mese',
                'Tutti i canali illimitati',
                'AI GPT-4 Turbo Priority',
                'White-label completo',
                'API Priority access',
                'Account Manager dedicato',
                'Custom integrations'
            ],
            icon: Crown,
            popular: false,
            isEnterprise: true
        }
    ];

    const handleCheckout = async (priceId: string, planName: string) => {
        setIsLoading(true);
        setSelectedPlan(planName);

        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    tier: 'public',
                    plan: planName.toLowerCase(),
                    isFounder: false
                })
            });

            const { url } = await response.json();

            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setIsLoading(false);
            setSelectedPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Header */}
            <header className="relative z-10 container mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition">
                    <Bot className="w-6 h-6 text-gold" />
                    <span className="font-bold">VirtualTwin</span>
                </Link>
            </header>

            {/* Hero */}
            <div className="relative z-10 container mx-auto px-4 pt-8 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Urgency Badge */}
                    {daysUntilIncrease <= 30 && nextPricing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-8"
                        >
                            <Clock className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-semibold text-sm">
                                ⚠️ Prezzo aumenta tra {daysUntilIncrease} giorni!
                            </span>
                        </motion.div>
                    )}

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Inizia <span className="text-gold">Subito</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/60 mb-4 max-w-2xl mx-auto"
                    >
                        Accesso immediato alla piattaforma. Nessuna attesa.
                    </motion.p>

                    {/* Founder CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12"
                    >
                        <Link
                            href="/founder"
                            className="text-gold/80 hover:text-gold underline text-sm"
                        >
                            Cerchi i prezzi Founder? Controlla disponibilità →
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="relative z-10 container mx-auto px-4 pb-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border ${plan.popular
                                ? 'border-gold shadow-2xl shadow-gold/10'
                                : 'border-white/10'
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-charcoal text-sm font-bold rounded-full">
                                    Più Popolare
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-gold/20' : 'bg-white/10'
                                }`}>
                                <plan.icon className={`w-7 h-7 ${plan.popular ? 'text-gold' : 'text-white/60'}`} />
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>

                            {/* Messages */}
                            <p className="text-white/50 text-sm mb-6">
                                <MessageSquare className="w-4 h-4 inline mr-1" />
                                {plan.messages} msg/mese
                            </p>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">€{plan.price}</span>
                                    <span className="text-white/50">/mese</span>
                                </div>
                                {plan.nextPrice && daysUntilIncrease <= 30 && (
                                    <p className="text-red-400 text-sm mt-1">
                                        <TrendingUp className="w-3 h-3 inline" /> Tra {daysUntilIncrease}gg: €{plan.nextPrice}/mese
                                    </p>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => handleCheckout(plan.priceId, plan.name)}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${plan.popular
                                    ? 'bg-gold text-charcoal hover:bg-gold/90'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isLoading && selectedPlan === plan.name ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                        Caricamento...
                                    </>
                                ) : (
                                    <>
                                        Inizia con {plan.name}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 flex flex-wrap justify-center gap-8"
                >
                    <div className="flex items-center gap-2 text-white/40">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm">Pagamento sicuro con Stripe</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm">Attivazione istantanea</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Cancella quando vuoi</span>
                    </div>
                </motion.div>
            </div>

            {/* FAQ Section */}
            <div className="relative z-10 container mx-auto px-4 pb-24">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">
                        Perché costa di più del prezzo Founder?
                    </h2>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        I prezzi <strong className="text-gold">Founder</strong> sono riservati ai primi 60 clienti
                        (20 per wave: Genesis, Pioneer, Elite) che credono nel progetto sin dall'inizio.
                        Essendo early adopters, ottengono uno sconto del 50% a vita.
                        <p className="text-white/70 leading-relaxed mt-4">
                            I prezzi <strong className="text-white">pubblici</strong> riflettono il valore reale della
                            piattaforma. Aumentano progressivamente man mano che aggiungiamo più funzionalità.
                        </p>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Link
                                href="/founder"
                                className="inline-flex items-center gap-2 text-gold hover:underline"
                            >
                                <Crown className="w-4 h-4" />
                                Verifica se ci sono ancora posti Founder
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
