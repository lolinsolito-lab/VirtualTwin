'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FounderStoryTimeline from '@/components/viral-sections/FounderStoryTimeline';
import DayInLifeTimeline from '@/components/viral-sections/DayInLifeTimeline';
import HowItWorks3Step from '@/components/viral-sections/HowItWorks3Step';
import MythVsReality from '@/components/viral-sections/MythVsReality';
import FounderTestimonials from '@/components/viral-sections/FounderTestimonials';
import FAQVideoReady from '@/components/viral-sections/FAQVideoReady';
import CommunityFOMO from '@/components/viral-sections/CommunityFOMO';
import PricingUltimate from '@/components/sections/PricingUltimate';
import {
    Clock,
    ArrowRight,
    Shield,
    Sparkles,
    MessageSquare,
    Bot,
    Crown,
    Star,
    Users,
    Award
} from 'lucide-react';

import { getDaysUntilPriceIncrease, getCurrentWaveSpotsRemaining } from '@/lib/waves';

export default function StartPage() {
    const [daysUntilIncrease, setDaysUntilIncrease] = useState(0);
    const [founderSpotsLeft, setFounderSpotsLeft] = useState(0);

    useEffect(() => {
        setDaysUntilIncrease(getDaysUntilPriceIncrease());
        getCurrentWaveSpotsRemaining().then(setFounderSpotsLeft);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne via-white to-champagne/30">
            {/* Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-serif text-2xl text-charcoal tracking-tight">VirtualTwin</span>
                        </Link>
                        {founderSpotsLeft > 0 && (
                            <Link
                                href="/founder"
                                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-charcoal text-white rounded-full text-sm font-medium hover:bg-charcoal/90 transition"
                            >
                                <Crown className="w-4 h-4 text-gold" />
                                🔥 {founderSpotsLeft} Posti Founder!
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative z-10 container mx-auto px-6 pt-12 pb-20">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Scarcity Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-red-50 border-2 border-red-200 rounded-full mb-6 animate-pulse"
                    >
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-red-700 text-sm font-black tracking-wider uppercase">
                            Prezzi aumentano tra {daysUntilIncrease} giorni
                        </span>
                    </motion.div>

                    {/* Main Headline */}
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

                    {/* Social Proof */}
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

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-charcoal/70 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Mentre la concorrenza perde <strong className="text-red-600">3-5 ore al giorno</strong> in risposte manuali,
                        <br className="hidden md:block" />
                        tu <strong className="text-gold">scala il business</strong>, chiudi più clienti, e vivi la tua vita.
                    </motion.p>
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

            {/* Story Sections */}
            <FounderStoryTimeline />
            <DayInLifeTimeline />
            <HowItWorks3Step />

            {/* ============================================= */}
            {/* PRICING - Uses PricingUltimate Component */}
            {/* pricingMode='public' ensures public prices */}
            {/* ============================================= */}
            <PricingUltimate pricingMode="public" />

            {/* More Story Sections */}
            <MythVsReality />
            <FounderTestimonials />
            <FAQVideoReady />
            <CommunityFOMO />

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

            {/* Founder CTA Section - Only show if slots available */}
            {founderSpotsLeft > 0 && (
                <section className="relative z-10 container mx-auto px-6 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative overflow-hidden bg-charcoal rounded-[2rem] p-10 md:p-16 text-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                            <Crown className="w-12 h-12 text-gold mx-auto mb-6" />

                            <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                                🔥 Cerchi uno Sconto? Posti Founder Ancora Disponibili!
                            </h3>

                            <p className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
                                Solo <strong className="text-gold">{founderSpotsLeft} posti</strong> rimasti nella Wave Genesis.
                                Blocca il prezzo <strong className="text-gold">fino al 50% in meno</strong> per sempre.
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
            )}

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
