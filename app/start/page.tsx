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
            id: 'curioso',
            name: 'Curioso',
            subtitle: 'Esplora il Potere dell\'AI',
            price: 0,
            priceId: '',
            nextPrice: 0,
            messages: '100',
            highlight: '14 giorni per testare gratuitamente. Zero rischi.',
            features: [
                '14 giorni trial',
                '1 Clone AI',
                '100 msg/mese',
                '1 Canale',
                'Watermark'
            ],
            icon: Sparkles,
            gradient: 'from-gray-50 to-gray-100',
            border: 'border-gray-200',
            accent: 'text-gray-600',
            btnStyle: 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200',
            popular: false,
            isFree: true
        },
        {
            id: 'aspirante',
            name: 'Aspirante',
            subtitle: 'Il Primo Passo nel Tuo Impero',
            descLong: 'Entry-level perfetto per chi vuole provare senza impegno. Template, corso e community inclusi.',
            price: 49,
            priceId: 'price_1SlyfV7141DXdb9v9WiLhhS0',
            nextPrice: 49,
            messages: '500',
            highlight: 'Entry-level perfetto',
            features: [
                '1 Clone AI',
                '500 msg/mese',
                '1 Canale WhatsApp',
                '🆕 Template 15 settori',
                '🆕 Corso 6 video',
                '🆕 Community'
            ],
            icon: Star,
            gradient: 'from-emerald-50 via-green-50 to-teal-50',
            border: 'border-green-400',
            accent: 'text-green-700',
            btnStyle: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md',
            popular: false,
            badge: { emoji: '🌱', text: 'ENTRY-LEVEL', color: 'green' }
        },
        {
            id: 'esploratore',
            name: 'Esploratore',
            subtitle: 'Per Chi Inizia a Scalare',
            descLong: 'Strumenti professionali per testare il potenziale della tua AI.',
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
                'Email support <48h'
            ],
            icon: Zap,
            gradient: 'from-blue-50 via-indigo-50 to-blue-100',
            border: 'border-blue-400',
            accent: 'text-blue-700',
            btnStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md',
            popular: false
        },
        {
            id: 'pioniere',
            name: 'Pioniere',
            subtitle: 'La Scelta del 73% dei Coach di Successo',
            descLong: 'Il perfetto equilibrio tra potenza e prezzo. Provato da centinaia di professionisti che hanno trasformato il loro business.',
            socialProof: '⭐ 4.9/5 da 200+ Coach',
            scarcity: '⚡ Ultimi 3 posti Wave Genesis',
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
            gradient: 'from-amber-50 via-yellow-100 to-amber-100',
            border: 'border-amber-400',
            accent: 'text-amber-900',
            btnStyle: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 shadow-xl font-bold',
            popular: true,
            isHero: true,
            badge: { emoji: '🔥', text: 'PIÙ SCELTO', color: 'red', animate: 'pulse' },
            badge2: { emoji: '⭐', text: 'SCELTA #1 COACH', color: 'gold' }
        },
        {
            id: 'conquistatore',
            name: 'Conquistatore',
            subtitle: 'Per Chi Punta all\'Eccellenza',
            descLong: 'Agenzie e power user scelgono Conquistatore per dominare il mercato.',
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
            gradient: 'from-gray-900 via-purple-900 to-violet-900',
            border: 'border-purple-500',
            accent: 'text-purple-300',
            textColor: 'text-white',
            btnStyle: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-xl',
            isDark: true,
            popular: false,
            badge: { emoji: '💎', text: 'MIGLIOR VALORE', color: 'purple', animate: 'shimmer' }
        },
        {
            id: 'imperatore',
            name: 'Imperatore',
            subtitle: 'Il Trono Digitale. Solo per i Migliori.',
            descLong: 'Accesso esclusivo, priorità assoluta, dominio totale. Limitato a 10 clienti/anno.',
            scarcity: '🎖️ Solo 7 posti rimasti su 10 totali',
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
                '👑 Success Manager',
                'Custom integrations'
            ],
            icon: Crown,
            gradient: 'from-yellow-400 via-amber-500 to-yellow-600',
            border: 'border-yellow-600',
            accent: 'text-yellow-100',
            textColor: 'text-white',
            btnStyle: 'bg-white text-amber-700 hover:bg-amber-50 shadow-2xl font-bold border-2 border-amber-900',
            isGold: true,
            isDark: true,
            popular: false,
            badge: { emoji: '👑', text: 'ELITE', color: 'gold', animate: 'bounce' },
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
                    {/* Scarcity Tag - PSYCHOLOGICAL TRIGGER */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 border-2 border-red-200 rounded-full mb-6 animate-pulse"
                    >
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-red-700 text-sm font-black tracking-wider uppercase">Solo {daysUntilIncrease} giorni a questo prezzo</span>
                    </motion.div>

                    {/* Main Headline - EMOTIONAL HOOK */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal mb-6 leading-[0.95]"
                    >
                        Altri Lavorano 12h/giorno.
                        <br />
                        <span className="italic text-gold">Tu Hai un Clone AI.</span>
                    </motion.h1>

                    {/* Social Proof - TRUST BUILDING */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-2 mb-8"
                    >
                        <div className="flex -space-x-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-600 border-2 border-white flex items-center justify-center">
                                    <Star className="w-4 h-4 text-white fill-white" />
                                </div>
                            ))}
                        </div>
                        <span className="text-charcoal/70 font-medium text-sm">
                            <strong className="text-gold font-black">200+ imprenditori</strong> hanno già attivato il loro Clone
                        </span>
                    </motion.div>

                    {/* Subheadline - PAIN & SOLUTION */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-charcoal/70 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Mentre la tua concorrenza perde <strong className="text-red-600">3-5 ore al giorno</strong> in risposte manuali,
                        <br className="hidden md:block" />
                        tu <strong className="text-gold">scala il business</strong>, chiudi più clienti, e vivi la tua vita.
                        <br className="hidden md:block" />
                        <span className="text-charcoal/50 italic text-base">Attivazione in 10 minuti. Zero approvazioni. Zero attese.</span>
                    </motion.p>

                    {/* Urgency Banner */}
                    {daysUntilIncrease <= 30 && nextPricing && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-2 border-amber-200 rounded-2xl shadow-xl mb-4"
                        >
                            <div className="flex items-center justify-center w-14 h-14 bg-red-500 rounded-xl text-white">
                                <Clock className="w-7 h-7" />
                            </div>
                            <div className="text-left">
                                <p className="text-red-700 font-black text-lg uppercase tracking-wide">Prezzo aumenta tra {daysUntilIncrease} giorni</p>
                                <p className="text-amber-700 text-sm font-medium">Blocca il prezzo Founder OGGI o paghi +50% domani</p>
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

                    {/* Pricing Cards - LUXURY 3x2 GRID */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-x-8 lg:gap-y-12 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                                className="group relative"
                            >
                                {/* Luxury Badge (Top-Right) */}
                                {(plan as any).badge && typeof (plan as any).badge === 'object' && (
                                    <div className="absolute -top-4 -right-4 z-30">
                                        <div className={`
                                            px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider
                                            flex items-center gap-1.5 shadow-xl
                                            ${(plan as any).badge.color === 'green' && 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}
                                            ${(plan as any).badge.color === 'red' && 'bg-gradient-to-r from-red-500 to-orange-500 text-white'}
                                            ${(plan as any).badge.color === 'gold' && 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'}
                                            ${(plan as any).badge.color === 'purple' && 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'}
                                            ${(plan as any).badge.animate === 'pulse' && 'animate-pulse'}
                                            ${(plan as any).badge.animate === 'bounce' && 'animate-bounce'}
                                        `}>
                                            <span className="text-base">{(plan as any).badge.emoji}</span>
                                            <span>{(plan as any).badge.text}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Secondary Badge (Pioniere) */}
                                {(plan as any).badge2 && (
                                    <div className="absolute -top-4 -left-4 z-30">
                                        <div className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 flex items-center gap-1.5 shadow-xl">
                                            <span className="text-base">{(plan as any).badge2.emoji}</span>
                                            <span>{(plan as any).badge2.text}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Hero Glow (Pioniere) */}
                                {(plan as any).isHero && (
                                    <div className="absolute -inset-6 bg-gradient-to-r from-yellow-400/40 via-amber-500/50 to-yellow-400/40 rounded-[3rem] blur-3xl opacity-70 animate-pulse"></div>
                                )}

                                {/* Card */}
                                <div className={`
                                    relative h-[550px] lg:h-[600px] bg-gradient-to-br ${plan.gradient} rounded-3xl p-6 lg:p-8 border
                                    transition-all duration-500 flex flex-col shadow-xl
                                    ${(plan as any).border || 'border-white/50'}
                                    ${plan.popular ? 'ring-2 ring-amber-400' : ''}
                                `}>
                                    {/* Icon - COLORED */}
                                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mb-4 ${(plan as any).isDark ? 'bg-white/10' : (plan as any).isGold ? 'bg-white/20' : 'bg-white/50'}`}>
                                        <plan.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${(plan as any).isDark || (plan as any).isGold ? 'text-white' : plan.id === 'aspirante' ? 'text-green-600' : plan.id === 'esploratore' ? 'text-blue-600' : plan.accent}`} />
                                    </div>

                                    {/* Plan Name */}
                                    <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-2 ${(plan as any).isDark ? 'text-white/60' : plan.accent}`}>
                                        {plan.name}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-2">
                                        <span className={`text-4xl lg:text-5xl font-serif tracking-tight ${(plan as any).isDark || (plan as any).isGold ? 'text-white' : (plan as any).textColor || 'text-charcoal'}`}>
                                            €{plan.price}
                                        </span>
                                        <span className={`text-sm ml-1 ${(plan as any).isDark ? 'text-white/50' : (plan as any).isGold ? 'text-white/60' : 'text-charcoal/40'}`}>
                                            /mese
                                        </span>
                                    </div>

                                    {/* Story (subtitle) */}
                                    <p className={`text-sm lg:text-base font-medium mb-2 ${(plan as any).isDark || (plan as any).isGold ? 'text-white' : 'text-charcoal'}`}>
                                        {plan.subtitle}
                                    </p>

                                    {/* Subtitle (descLong) */}
                                    {(plan as any).descLong && (
                                        <p className={`text-xs mb-4 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all ${(plan as any).isDark ? 'text-white/70' : 'text-charcoal/60'}`}>
                                            {(plan as any).descLong}
                                        </p>
                                    )}

                                    {/* Social Proof */}
                                    {(plan as any).socialProof && (
                                        <div className="mb-3 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold inline-block">
                                            {(plan as any).socialProof}
                                        </div>
                                    )}

                                    {/* Scarcity */}
                                    {(plan as any).scarcity && (
                                        <div className="mb-4 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold animate-pulse inline-block">
                                            {(plan as any).scarcity}
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="space-y-2 lg:space-y-3 mb-6 flex-grow">
                                        {plan.features.map((feature: string, j: number) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center ${(plan as any).isDark ? 'bg-white/10' : (plan as any).isGold ? 'bg-white/20' : 'bg-green-100'}`}>
                                                    <CheckCircle className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${(plan as any).isDark || (plan as any).isGold ? 'text-white' : 'text-green-600'}`} />
                                                </div>
                                                <span className={`text-xs lg:text-sm ${(plan as any).isDark || (plan as any).isGold ? 'text-white/90' : 'text-charcoal/70'}`}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA - Always at bottom */}
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => handleCheckout(plan.priceId, plan.name)}
                                            disabled={isLoading}
                                            className={`group w-full py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 flex items-center justify-center gap-2 ${(plan as any).btnStyle || (plan.popular ? 'bg-charcoal text-white hover:bg-charcoal/90' : 'bg-white text-charcoal hover:bg-charcoal hover:text-white border border-charcoal/10')} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isLoading && selectedPlan === plan.name ? (
                                                <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Inizia Ora
                                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
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
