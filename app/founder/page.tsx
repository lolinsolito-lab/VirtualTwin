'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Crown, Users, ArrowRight, Check, Star, Lock, Sparkles, Gift, Zap, Shield, Clock } from 'lucide-react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, getTotalFounderSpots, Wave, isPreLaunch } from '@/lib/waves';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import PricingUltimate from '@/components/sections/PricingUltimate';
import SocialProofHuman from '@/components/home-viral/SocialProofHuman';

/**
 * FOUNDER PAGE - EXCLUSIVE ACCESS
 * 
 * Upgraded with new visual DNA and VirtualTwin branding
 */
export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [totalSpots, setTotalSpots] = useState(60);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [isFounderOpen, setIsFounderOpen] = useState(false);
    const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);

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
            setIsBeforeLaunch(beforeLaunch);

            const founderOpen = wave !== null && wave.tier === 'founder';
            setIsFounderOpen(founderOpen);
            setIsSoldOut(!beforeLaunch && remaining === 0);

            // Countdown to Genesis deadline
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

    const founderBenefits = [
        {
            icon: Lock,
            title: "Prezzo Bloccato a Vita",
            desc: "Mai aumenti. Mai sorprese. Per sempre.",
            image: "/images/stages/stage_legacy.png"
        },
        {
            icon: Crown,
            title: "Accesso Prioritario",
            desc: "Nuove feature prima di chiunque altro.",
            image: "/images/stages/stage_alchemy.png"
        },
        {
            icon: Gift,
            title: "Bonus Esclusivi",
            desc: "Setup Premium incluso + Call 1:1.",
            image: "/images/features/feature_knowledge.png"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne via-white to-champagne/30">
            <Navbar />

            {/* Top Banner */}
            <div className="bg-charcoal text-white text-center py-3 text-sm font-medium mt-20">
                {!isSoldOut ? (
                    <>
                        <span className="animate-pulse">🔥</span> {currentWave?.nameFull || 'Genesis Wave'} · Solo {spotsLeft} Posti Rimasti · Prezzo Bloccato LIFETIME
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Programma Founder Chiuso · I Prezzi Pubblici Sono Ora Attivi
                    </>
                )}
            </div>

            {/* Hero Section */}
            <section className="relative z-10 py-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
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
                                <div className="absolute -inset-4 bg-gold/30 rounded-full blur-xl animate-pulse" />
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl">
                                    <Image
                                        src="/images/virtualtwin_icon.png"
                                        alt="VirtualTwin"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-gold/10 border-2 border-gold/30 rounded-full mb-8"
                        >
                            <Crown className="w-4 h-4 text-gold" />
                            <span className="text-gold text-sm font-black tracking-wider uppercase">
                                Accesso Esclusivo Founder
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-[0.9]"
                        >
                            Diventa Uno Dei <br />
                            <span className="italic text-gold">Primi 60 Visionari.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-charcoal/50 max-w-3xl mx-auto mb-12 leading-relaxed"
                        >
                            I fondatori non pagano per un prodotto. <br />
                            <strong className="text-charcoal/70">Investono nel futuro e lo possiedono per sempre.</strong>
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Countdown Section */}
            {isFounderOpen && (
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-charcoal border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl"
                        >
                            <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Tempo Rimasto</span>

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
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-8 pt-8 border-t border-white/5">
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
                                        <div className="text-2xl font-bold text-white">€78,000</div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest">risparmio 5 anni</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Founder Benefits with Images */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">Vantaggi Esclusivi</span>
                        </span>
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4">
                            Perché i Founder <span className="text-gold italic">Vincono Sempre.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {founderBenefits.map((benefit, i) => (
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
                                        src={benefit.image}
                                        alt={benefit.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                                    {/* Gold Badge */}
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-gold text-white text-[10px] font-black uppercase rounded-full">
                                        Founder Only
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                                        <benefit.icon className="w-6 h-6 text-gold group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-serif text-xl text-charcoal italic mb-2">{benefit.title}</h3>
                                    <p className="text-charcoal/60 text-sm">{benefit.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-16 px-6 bg-charcoal">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="font-serif text-3xl md:text-5xl text-white/30 italic leading-tight"
                    >
                        "I primi arrivati non pagano il prezzo del mercato. <br />
                        <span className="text-gold">Diventano il mercato.</span>"
                    </motion.p>
                </div>
            </section>

            {/* PRICING */}
            <PricingUltimate pricingMode="founder" />

            {/* SOCIAL PROOF */}
            <SocialProofHuman />

            {/* Final CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative group overflow-hidden bg-charcoal text-white rounded-[3rem] p-12 md:p-16 shadow-2xl text-center"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-[4rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 leading-tight">
                                Entra nel cerchio ristretto <br />
                                che <span className="text-gold">possiede</span> il Futuro.
                            </h2>

                            <p className="text-xl mb-12 text-white/50 max-w-2xl mx-auto leading-relaxed">
                                Solo {totalSpots} posti disponibili. Una volta chiusa la Genesis Wave, non ci sarà modo di rientrare a queste condizioni.
                            </p>

                            <div className="flex flex-col items-center gap-6">
                                <a
                                    href="#pricing"
                                    className="group/btn inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-xl"
                                >
                                    BLOCCA ORA IL TUO POSTO
                                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                </a>

                                <div className="flex items-center gap-8 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Nessuna Carta Richiesta</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> 14 Giorni Trial</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Cancella Ora</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
