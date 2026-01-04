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
    Crown,
    Star,
    Users,
    Award
} from 'lucide-react';

import { getCurrentPublicPricing, getNextPublicPricing, getDaysUntilPriceIncrease } from '@/lib/waves';

export default function StartPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Reset loading state when user returns from Stripe (browser back button)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setIsLoading(false);
                setSelectedPlan(null);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Also reset on page focus
        window.addEventListener('focus', () => {
            setIsLoading(false);
            setSelectedPlan(null);
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', () => { });
        };
    }, []);

    const currentPricing = getCurrentPublicPricing();
    const nextPricing = getNextPublicPricing();
    const daysUntilIncrease = getDaysUntilPriceIncrease();

    const plans = [
        {
            id: 'esploratore',
            name: 'Esploratore',
            subtitle: 'Per chi inizia',
            price: currentPricing.prices.esploratore,
            priceId: currentPricing.stripePriceIds.esploratore,
            nextPrice: nextPricing?.prices.esploratore,
            messages: '500',
            highlight: 'Perfetto per testare l\'AI',
            features: [
                '500 messaggi AI/mese',
                '1 canale WhatsApp',
                'AI Gemini Flash',
                'Dashboard analytics',
                'Email support'
            ],
            icon: Zap,
            gradient: 'from-slate-100 to-slate-200',
            accent: 'text-slate-600',
            popular: false
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            subtitle: 'Più scelto dai coach',
            price: currentPricing.prices.pioniere,
            priceId: currentPricing.stripePriceIds.pioniere,
            nextPrice: nextPricing?.prices.pioniere,
            messages: '2,000',
            highlight: 'Il perfetto equilibrio',
            features: [
                '2,000 messaggi AI/mese',
                '3 canali multi-platform',
                'AI Gemini Pro',
                'Analytics avanzate',
                'Priority support',
                'Founder Academy'
            ],
            icon: TrendingUp,
            gradient: 'from-amber-50 via-yellow-50 to-orange-50',
            accent: 'text-amber-700',
            popular: true
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            subtitle: 'Per agenzie & power users',
            price: currentPricing.prices.conquistatore,
            priceId: currentPricing.stripePriceIds.conquistatore,
            nextPrice: nextPricing?.prices.conquistatore,
            messages: '5,000',
            highlight: 'Scala il tuo business',
            features: [
                '5,000 messaggi AI/mese',
                'Tutti i canali',
                'AI GPT-4 Turbo',
                'White-label dashboard',
                'API access',
                'Success manager'
            ],
            icon: Crown,
            gradient: 'from-emerald-50 to-teal-50',
            accent: 'text-emerald-700',
            popular: false
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            subtitle: 'Il trono digitale',
            price: currentPricing.prices.imperatore,
            priceId: currentPricing.stripePriceIds.imperatore,
            nextPrice: nextPricing?.prices.imperatore,
            messages: '50,000',
            highlight: 'Dominio totale',
            features: [
                '50,000 messaggi AI/mese',
                'Canali illimitati',
                'AI GPT-4 Priority',
                'Full white-label',
                'API Priority',
                'Account Manager',
                'Custom integrations'
            ],
            icon: Crown,
            gradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
            accent: 'text-purple-700',
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
            // eslint-disable-next-line react-hooks/immutability
            if (url) window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
            setIsLoading(false);
            setSelectedPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne via-white to-champagne/30">
            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold/5 to-transparent rounded-full" />
            </div>

            {/* Elegant Header */}
            <header className="relative z-10">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-serif text-2xl text-charcoal tracking-tight">VirtualTwin</span>
                        </Link>
                        <Link
                            href="/founder"
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-full text-sm font-medium hover:bg-charcoal/90 transition"
                        >
                            <Crown className="w-4 h-4 text-gold" />
                            Prezzi Founder
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero - Editorial Style */}
            <section className="relative z-10 container mx-auto px-6 pt-12 pb-20">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Category Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-charcoal/5 rounded-full mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-charcoal/60 text-sm tracking-widest uppercase">Accesso Immediato</span>
                    </motion.div>

                    {/* Main Headline - Magazine Style */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-[0.95]"
                    >
                        Il Tuo Clone AI<br />
                        <span className="italic text-gold">Ti Aspetta</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-charcoal/60 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Inizia oggi stesso. Nessuna attesa, nessuna approvazione.
                        <br className="hidden md:block" />
                        Attiva il tuo assistente AI in meno di 10 minuti.
                    </motion.p>

                    {/* Urgency Banner */}
                    {daysUntilIncrease <= 30 && nextPricing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl"
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-xl text-white">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-red-600 font-semibold">Prezzo aumenta tra {daysUntilIncrease} giorni</p>
                                <p className="text-red-500/70 text-sm">Blocca il prezzo attuale oggi</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Stats Bar */}
            <section className="relative z-10 py-8 border-y border-charcoal/5 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gold" />
                            <span className="text-charcoal font-medium">200+ Imprenditori Attivi</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5 text-gold" />
                            <span className="text-charcoal font-medium">1M+ Messaggi Gestiti</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-gold" />
                            <span className="text-charcoal font-medium">4.9/5 Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section - Magazine Grid */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
                            Scegli il Tuo Percorso
                        </h2>
                        <p className="text-charcoal/50 max-w-xl mx-auto">
                            Ogni piano include 14 giorni di trial. Cancella quando vuoi.
                        </p>
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                                className="group relative"
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                                        <div className="px-4 py-1 bg-gold text-white text-xs font-bold rounded-full shadow-lg">
                                            PIÙ SCELTO
                                        </div>
                                    </div>
                                )}

                                {/* Card */}
                                <div className={`relative h-full bg-gradient-to-br ${plan.gradient} rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl transition-all duration-500 ${plan.popular ? 'ring-2 ring-gold/30' : ''
                                    }`}>
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6`}>
                                        <plan.icon className={`w-6 h-6 ${plan.accent}`} />
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="font-serif text-2xl text-charcoal mb-1">{plan.name}</h3>
                                    <p className="text-charcoal/40 text-sm mb-6">{plan.subtitle}</p>

                                    {/* Price */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-serif text-4xl text-charcoal">€{plan.price}</span>
                                            <span className="text-charcoal/40">/mese</span>
                                        </div>
                                        <p className="text-charcoal/50 text-sm mt-1">
                                            <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                                            {plan.messages} messaggi
                                        </p>
                                    </div>

                                    {/* Highlight */}
                                    <div className={`mb-6 px-3 py-2 rounded-xl bg-white/60 ${plan.accent} text-sm font-medium`}>
                                        {plan.highlight}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-charcoal/70 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleCheckout(plan.priceId, plan.name)}
                                        disabled={isLoading}
                                        className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${plan.popular
                                            ? 'bg-charcoal text-white hover:bg-charcoal/90'
                                            : 'bg-white text-charcoal hover:bg-charcoal hover:text-white border border-charcoal/10'
                                            } disabled:opacity-50`}
                                    >
                                        {isLoading && selectedPlan === plan.name ? (
                                            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Inizia Ora
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="relative z-10 py-16 bg-gradient-to-b from-transparent via-white/50 to-transparent">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-12">
                        <div className="flex items-center gap-3 text-charcoal/50">
                            <Shield className="w-6 h-6" />
                            <span className="font-medium">Pagamento Sicuro con Stripe</span>
                        </div>
                        <div className="flex items-center gap-3 text-charcoal/50">
                            <Sparkles className="w-6 h-6" />
                            <span className="font-medium">Attivazione Istantanea</span>
                        </div>
                        <div className="flex items-center gap-3 text-charcoal/50">
                            <Award className="w-6 h-6" />
                            <span className="font-medium">Garanzia 30 Giorni</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder CTA Section */}
            <section className="relative z-10 container mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative overflow-hidden bg-charcoal rounded-[2rem] p-10 md:p-16 text-center">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <Crown className="w-12 h-12 text-gold mx-auto mb-6" />

                        <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                            Cerchi uno Sconto?
                        </h3>

                        <p className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
                            I prezzi <strong className="text-gold">Founder</strong> sono riservati ai primi 60 clienti
                            (20 per wave) che credono nel progetto sin dall&apos;inizio.
                            Risparmia fino al <strong className="text-gold">50%</strong> a vita.
                        </p>

                        <Link
                            href="/founder"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-charcoal rounded-2xl font-bold hover:bg-gold/90 transition"
                        >
                            <Crown className="w-5 h-5" />
                            Verifica Disponibilità Founder
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-charcoal/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-charcoal/40">
                            <Bot className="w-5 h-5" />
                            <span className="font-medium">VirtualTwin</span>
                            <span>© 2026</span>
                        </div>
                        <div className="flex items-center gap-6 text-charcoal/40 text-sm">
                            <Link href="/privacy" className="hover:text-charcoal transition">Privacy</Link>
                            <Link href="/terms" className="hover:text-charcoal transition">Termini</Link>
                            <Link href="mailto:support@virtualtwin.app" className="hover:text-charcoal transition">Contatti</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
