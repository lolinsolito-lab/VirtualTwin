'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import PricingUltimate from '@/components/sections/PricingUltimate';
import SocialProofHuman from '@/components/home-viral/SocialProofHuman';
import FinalCTAUltimate from '@/components/sections/FinalCTAUltimate';
import {
    Clock,
    ArrowRight,
    Shield,
    Sparkles,
    MessageSquare,
    Crown,
    Star,
    Users,
    Check,
    Zap,
    Target,
    Brain
} from 'lucide-react';

import { getDaysUntilPriceIncrease, getCurrentWaveSpotsRemaining } from '@/lib/waves';

/**
 * START PAGE - PUBLIC FACING
 * 
 * Upgraded with new visual DNA and communication style
 */
export default function StartPage() {
    const [daysUntilIncrease, setDaysUntilIncrease] = useState(0);
    const [founderSpotsLeft, setFounderSpotsLeft] = useState(0);

    useEffect(() => {
        setDaysUntilIncrease(getDaysUntilPriceIncrease());
        getCurrentWaveSpotsRemaining().then(setFounderSpotsLeft);
    }, []);

    const features = [
        {
            icon: MessageSquare,
            title: "Identità Indistinguibile",
            desc: "Il Clone parla esattamente come te, 24/7",
            image: "/images/features/feature_identity.png"
        },
        {
            icon: Target,
            title: "Filtro dell'Élite",
            desc: "Qualifica automaticamente chi è pronto all'acquisto",
            image: "/images/features/feature_filter.png"
        },
        {
            icon: Zap,
            title: "Conversione Silenziosa",
            desc: "Ogni interazione è un passo verso la vendita",
            image: "/images/features/feature_conversion.png"
        }
    ];

    const howItWorks = [
        {
            step: "01",
            title: "Addestra il Clone",
            desc: "Carica le tue FAQ, il tuo stile, la tua personalità. 10 minuti.",
            image: "/images/stages/stage_awakening.png"
        },
        {
            step: "02",
            title: "Collega i Canali",
            desc: "WhatsApp, Instagram, Messenger. Un click.",
            image: "/images/stages/stage_bicycle.png"
        },
        {
            step: "03",
            title: "Scala il Business",
            desc: "Il Clone vende mentre tu vivi la tua vita.",
            image: "/images/stages/stage_soul.png"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne via-white to-champagne/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Urgency Tag */}
                        {daysUntilIncrease > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 border-2 border-red-200 rounded-full mb-8"
                            >
                                <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                                <span className="text-red-700 text-sm font-black tracking-wider uppercase">
                                    Prezzi aumentano tra {daysUntilIncrease} giorni
                                </span>
                            </motion.div>
                        )}

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-[0.9]"
                        >
                            Sii Ovunque. <br />
                            <span className="italic text-gold">Sii Libero.</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-charcoal/50 max-w-3xl mx-auto mb-12 leading-relaxed italic"
                        >
                            "Il tuo Clone AI risponde come te, vende come te, <br />
                            <strong className="text-charcoal/70">mentre tu ti riprendi la tua vita."</strong>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                        >
                            <Link
                                href="/auth/register"
                                className="group inline-flex items-center gap-3 px-10 py-5 bg-gold text-white rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl"
                            >
                                <Sparkles className="w-5 h-5" />
                                Inizia Gratis · 14 Giorni
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {founderSpotsLeft > 0 && (
                                <Link
                                    href="/founder"
                                    className="inline-flex items-center gap-2 px-6 py-4 bg-charcoal text-white rounded-full text-sm font-medium hover:bg-charcoal/90 transition"
                                >
                                    <Crown className="w-4 h-4 text-gold" />
                                    🔥 {founderSpotsLeft} Posti Founder Rimasti
                                </Link>
                            )}
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-6 text-charcoal/40 text-sm"
                        >
                            <span className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" /> No carta richiesta
                            </span>
                            <span className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" /> Setup in 10 minuti
                            </span>
                            <span className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" /> Cancella quando vuoi
                            </span>
                        </motion.div>
                    </div>
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

            {/* Features Section with Images */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Strumenti di Potere</span>
                        </span>
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4">
                            Il Clone Che <span className="text-gold italic">Lavora Per Te.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden border border-charcoal/5 shadow-lg hover:shadow-2xl transition-all"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                </div>
                                <div className="p-6 text-center">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                                        <feature.icon className="w-6 h-6 text-gold group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-serif text-xl text-charcoal italic mb-2">{feature.title}</h3>
                                    <p className="text-charcoal/60 text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works with Images */}
            <section className="py-20 px-6 bg-charcoal">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-4 block">Come Funziona</span>
                        <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
                            Tre Passi Verso la <span className="text-gold italic">Libertà.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorks.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-charcoal text-[10px] font-black uppercase rounded-full">
                                        Passo {step.step}
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="font-serif text-xl text-white italic mb-2">{step.title}</h3>
                                    <p className="text-white/60 text-sm">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-5xl text-charcoal/30 italic leading-tight"
                    >
                        "Il mondo digitale dovrebbe <span className="text-gold">servire l'uomo</span>, <br />
                        non <span className="text-charcoal/10">schiavizzarlo.</span>"
                    </motion.p>
                </div>
            </section>

            {/* PRICING */}
            <PricingUltimate pricingMode="public" />

            {/* SOCIAL PROOF */}
            <SocialProofHuman />

            {/* FINAL CTA */}
            <FinalCTAUltimate />

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
                            <Brain className="w-6 h-6" />
                            <span className="font-medium">AI che Impara da Te</span>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
