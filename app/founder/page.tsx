'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import SocialProofBar from "@/components/home-viral/SocialProofBar";
import FeaturesEnhanced from "@/components/sections/FeaturesEnhanced";
import SuperiorityMatrix from "@/components/home-viral/SuperiorityMatrix";
import PricingUltimate from "@/components/sections/PricingUltimate";
import FounderWavesSection from "@/components/sections/FounderWavesSection";
import SocialProofHuman from "@/components/home-viral/SocialProofHuman";
import { ArrowRight, Crown, Lock, Users, Star, Shield, Clock, Sparkles, Check, Flame, Gem, Trophy } from 'lucide-react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, getTotalFounderSpots, Wave, isPreLaunch } from '@/lib/waves';

/**
 * FOUNDER PAGE - IL CERCHIO ESCLUSIVO
 * 
 * Pagina per FOMO, urgenza wave, comunità élite
 * Tono: "Sei speciale", "Fai parte dei primi", elegante ma urgente
 * Focus: Esclusività + Scarsità + Appartenenza
 */
export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [totalSpots, setTotalSpots] = useState(60);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [isSoldOut, setIsSoldOut] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const [wave, remaining, total] = await Promise.all([
                getCurrentWave(),
                getCurrentWaveSpotsRemaining(),
                getTotalFounderSpots()
            ]);
            const beforeLaunch = isPreLaunch();
            setCurrentWave(wave);
            setSpotsLeft(remaining);
            setTotalSpots(total);
            setIsSoldOut(!beforeLaunch && remaining === 0);

            // Countdown
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
        const interval = setInterval(fetchData, 1000); // Live countdown
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="selection:bg-gold selection:text-black min-h-screen bg-charcoal overflow-x-hidden">
            <Navbar />

            {/* EXCLUSIVE BANNER */}
            <div className="bg-gold text-charcoal text-center py-3 text-sm font-black mt-20">
                {!isSoldOut ? (
                    <>
                        <Crown className="w-4 h-4 inline-block mr-2" />
                        <span className="animate-pulse">🔥</span> {currentWave?.nameFull || 'Genesis Wave'} · Solo <strong>{spotsLeft}</strong> Posti Rimasti ·
                        <span className="ml-2 px-2 py-0.5 bg-charcoal text-gold rounded text-[10px] uppercase">Prezzo Bloccato LIFETIME</span>
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Programma Founder Chiuso · Sei arrivato tardi.
                    </>
                )}
            </div>

            <main>
                {/* EXCLUSIVE HERO - Dark & Elite */}
                <section className="relative pt-20 pb-32 overflow-hidden bg-charcoal">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }} />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            {/* VirtualTwin Icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex justify-center mb-8"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-6 bg-gold/30 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold shadow-2xl">
                                        <Image
                                            src="/images/virtualtwin_icon.png"
                                            alt="VirtualTwin"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Exclusive Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-gold text-charcoal rounded-full mb-8"
                            >
                                <Gem className="w-4 h-4" />
                                <span className="text-sm font-black tracking-wider uppercase">
                                    Accesso Esclusivo · Solo {totalSpots} Visionari
                                </span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-[0.9]"
                            >
                                I Primi <span className="text-gold italic">60</span> <br />
                                <span className="text-gold italic">Possiedono il Futuro.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-8 leading-relaxed"
                            >
                                Mentre gli altri pagheranno il prezzo pieno, <br />
                                <strong className="text-white/80">tu avrai il prezzo bloccato per sempre.</strong>
                            </motion.p>

                            {/* Comparison: Founders vs Latecomers */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap justify-center gap-8 mb-12"
                            >
                                <div className="text-center">
                                    <div className="text-3xl font-serif text-gold font-bold">€7/mese</div>
                                    <div className="text-white/40 text-xs uppercase tracking-widest">Tu, Founder</div>
                                </div>
                                <div className="text-white/20 text-3xl">vs</div>
                                <div className="text-center">
                                    <div className="text-3xl font-serif text-white/30 font-bold line-through">€29/mese</div>
                                    <div className="text-white/30 text-xs uppercase tracking-widest">Loro, dopo</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* LIVE COUNTDOWN */}
                <section className="py-12 bg-gradient-to-b from-charcoal to-black">
                    <div className="max-w-4xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-[2.5rem] p-8 md:p-12 text-center"
                        >
                            <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">⏰ Tempo Rimasto per Genesis Wave</span>

                            <div className="grid grid-cols-4 gap-4 md:gap-8 mb-8">
                                {[
                                    { value: timeLeft.days, label: 'Giorni' },
                                    { value: timeLeft.hours, label: 'Ore' },
                                    { value: timeLeft.minutes, label: 'Minuti' },
                                    { value: timeLeft.seconds, label: 'Secondi' },
                                ].map((item, i) => (
                                    <div key={i} className="relative">
                                        <div className="text-4xl md:text-6xl font-serif text-white font-bold">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 mt-2">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8 border-t border-gold/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-charcoal" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-3xl font-bold text-white">{spotsLeft}</div>
                                        <div className="text-[10px] uppercase font-black text-white/40 tracking-widest">posti rimasti</div>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-16 bg-gold/20" />
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-charcoal" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-3xl font-bold text-white">€78,000+</div>
                                        <div className="text-[10px] uppercase font-black text-white/40 tracking-widest">risparmio in 5 anni</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* WHY FOUNDERS WIN */}
                <section className="py-20 px-6 bg-gradient-to-b from-black via-charcoal to-champagne">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-6">
                                <Crown className="w-4 h-4 text-gold" />
                                <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">Vantaggi Esclusivi</span>
                            </span>
                            <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
                                Perché i Founder <span className="text-gold italic">Vincono Sempre.</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Lock,
                                    title: "Prezzo Bloccato a Vita",
                                    desc: "Mai aumenti. Mai sorprese. Il prezzo di oggi, per sempre. Mentre gli altri pagheranno €29+/mese, tu resterai a €7.",
                                    badge: "LIFETIME"
                                },
                                {
                                    icon: Flame,
                                    title: "Accesso Prioritario",
                                    desc: "Nuove feature prima di chiunque altro. Sei nella cerchia ristretta che plasma il futuro del prodotto.",
                                    badge: "VIP ACCESS"
                                },
                                {
                                    icon: Crown,
                                    title: "Setup Premium Incluso",
                                    desc: "Configuriamo tutto noi in 48h. Training personalità, integrazione canali, call 1:1. Gratis per te.",
                                    badge: "€297 VALUE"
                                }
                            ].map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-white rounded-3xl p-8 border border-charcoal/5 shadow-2xl hover:shadow-3xl transition-all"
                                >
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-charcoal text-[9px] font-black uppercase rounded-full">
                                        {benefit.badge}
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                                        <benefit.icon className="w-7 h-7 text-gold group-hover:text-charcoal transition-colors" />
                                    </div>
                                    <h3 className="font-serif text-xl text-charcoal italic mb-3">{benefit.title}</h3>
                                    <p className="text-charcoal/60 text-sm leading-relaxed">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* QUOTE - Exclusive */}
                <div className="py-20 text-center bg-champagne">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-3xl mx-auto px-6"
                    >
                        <p className="font-serif text-3xl md:text-5xl text-charcoal/30 italic leading-tight">
                            "I primi arrivati non pagano il prezzo del mercato. <br />
                            <span className="text-gold">Diventano il mercato.</span>"
                        </p>
                    </motion.div>
                </div>

                {/* SOCIAL PROOF */}
                <SocialProofBar />

                {/* FEATURES */}
                <FeaturesEnhanced />

                {/* SUPERIORITY MATRIX */}
                <SuperiorityMatrix />

                {/* PRICING - FOUNDER MODE */}
                <PricingUltimate pricingMode="founder" />

                {/* FOUNDER WAVES TIMELINE */}
                <FounderWavesSection />

                {/* SOCIAL PROOF HUMAN */}
                <SocialProofHuman />

                {/* FINAL EXCLUSIVE CTA */}
                <section className="py-20 px-6 bg-charcoal">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-[4rem] blur-2xl opacity-40 animate-pulse" />

                            <div className="relative bg-black rounded-[3rem] p-12 md:p-16 text-center border border-gold/30">
                                <Crown className="w-12 h-12 text-gold mx-auto mb-6" />

                                <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-6">
                                    Solo <span className="text-gold">{spotsLeft}</span> Posti Rimasti.
                                </h2>

                                <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
                                    Una volta chiusa la Genesis Wave, non ci sarà modo di rientrare a queste condizioni. <br />
                                    <strong className="text-white/70">Mai più.</strong>
                                </p>

                                <a
                                    href="#pricing"
                                    className="group inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gold/30"
                                >
                                    <Crown className="w-6 h-6" />
                                    BLOCCA IL TUO POSTO
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </a>

                                <div className="flex items-center justify-center gap-8 mt-8 text-white/30 text-xs font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Nessuna Carta</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> 14 Giorni Trial</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Prezzo Bloccato</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
