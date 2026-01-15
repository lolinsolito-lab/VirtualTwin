'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import SocialProofBar from "@/components/home-viral/SocialProofBar";
import FeaturesEnhanced from "@/components/sections/FeaturesEnhanced";
import SuperiorityMatrix from "@/components/home-viral/SuperiorityMatrix";
import PricingUltimate from "@/components/sections/PricingUltimate";
import SocialProofHuman from "@/components/home-viral/SocialProofHuman";
import { ArrowRight, Sparkles, Check, Users, MessageSquare, Star, Clock, Shield, Zap, Heart } from 'lucide-react';

/**
 * START PAGE - IL BENVENUTO UNIVERSALE
 * 
 * Pagina per campagne pubblicitarie post-founder
 * Tono: Accogliente, "Inizia Ora", Autosufficiente
 * Focus: AZIONE + Comparazione (non puoi fare a meno di noi)
 */
export default function StartPage() {
    return (
        <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
            <Navbar />

            <main>
                {/* WELCOMING HERO - Caldo e Invitante */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            {/* Welcome Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-gold/10 border border-gold/30 rounded-full mb-8"
                            >
                                <Heart className="w-4 h-4 text-gold" />
                                <span className="text-gold text-sm font-black tracking-wider uppercase">
                                    Benvenuto nel Futuro
                                </span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-[0.9]"
                            >
                                Finalmente <span className="text-gold italic">Libero.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-charcoal/50 max-w-3xl mx-auto mb-6 leading-relaxed"
                            >
                                Mentre gli altri rispondono manualmente a ogni messaggio, <br />
                                <strong className="text-charcoal/70">tu scali il business con il tuo Clone AI.</strong>
                            </motion.p>

                            {/* Comparison Line */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap justify-center gap-6 mb-10 text-sm"
                            >
                                <span className="flex items-center gap-2 text-red-500/70 line-through">
                                    ❌ 5+ ore/giorno in chat
                                </span>
                                <span className="flex items-center gap-2 text-red-500/70 line-through">
                                    ❌ Clienti persi di notte
                                </span>
                                <span className="flex items-center gap-2 text-red-500/70 line-through">
                                    ❌ Burnout garantito
                                </span>
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <Link
                                    href="/auth/register"
                                    className="group inline-flex items-center gap-3 px-12 py-6 bg-gold text-white rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-gold/30"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Inizia Gratis · 14 Giorni
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="flex items-center gap-6 text-charcoal/40 text-xs">
                                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> No carta richiesta</span>
                                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> Setup 10 minuti</span>
                                    <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-600" /> Cancella quando vuoi</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF BAR */}
                <SocialProofBar />

                {/* WHY THEY CAN'T LIVE WITHOUT US */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-6">
                                <Zap className="w-4 h-4 text-gold" />
                                <span className="text-charcoal/60 text-[10px] uppercase tracking-[0.4em] font-black">La Differenza</span>
                            </span>
                            <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4">
                                Loro vs. <span className="text-gold italic">Con Noi.</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* WITHOUT US */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-8 bg-gray-100 rounded-3xl border border-gray-200 grayscale-[30%]"
                            >
                                <div className="text-center mb-6">
                                    <span className="text-gray-400 text-[10px] uppercase tracking-widest font-black">Senza VirtualTwin</span>
                                    <h3 className="font-serif text-2xl text-gray-500 italic mt-2">La Routine Infinita</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Svegliarsi per rispondere ai messaggi",
                                        "Perdere clienti mentre dormi",
                                        "Ripetere le stesse FAQ 100 volte",
                                        "Burnout dopo 6 mesi",
                                        "Vacanze? Forse l'anno prossimo..."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-500">
                                            <span className="text-red-400">✗</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* WITH US */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative p-8 bg-white rounded-3xl border-2 border-gold/30 shadow-2xl"
                            >
                                <div className="absolute -inset-1 bg-gold/10 rounded-3xl blur-xl -z-10" />
                                <div className="text-center mb-6">
                                    <span className="text-gold text-[10px] uppercase tracking-widest font-black">Con VirtualTwin</span>
                                    <h3 className="font-serif text-2xl text-charcoal italic mt-2">La Nuova Libertà</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        "Il Clone risponde 24/7, identico a te",
                                        "Clienti qualificati mentre dormi",
                                        "FAQ gestite automaticamente",
                                        "Energia per ciò che conta davvero",
                                        "Vacanze? Quando vuoi, il Clone lavora"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-charcoal">
                                            <span className="text-gold">✓</span>
                                            <strong>{item}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* QUOTE - Welcoming */}
                <div className="py-20 text-center bg-gradient-to-b from-white to-champagne/50">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-3xl mx-auto px-6"
                    >
                        <p className="font-serif text-3xl md:text-5xl text-charcoal/30 italic leading-tight">
                            "Non è magia. È <span className="text-gold">strategia</span>. <br />
                            E ora <span className="text-charcoal/60">è anche tua.</span>"
                        </p>
                    </motion.div>
                </div>

                {/* FEATURES */}
                <FeaturesEnhanced />

                {/* SUPERIORITY MATRIX */}
                <SuperiorityMatrix />

                {/* PRICING - PUBLIC MODE */}
                <PricingUltimate pricingMode="public" />

                {/* SOCIAL PROOF */}
                <SocialProofHuman />

                {/* FINAL WELCOMING CTA */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative bg-charcoal rounded-[3rem] p-12 md:p-16 text-center shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent" />

                            <div className="relative z-10">
                                <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Il Tuo Momento</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-6">
                                    Sei Pronto a Essere <span className="text-gold">Ovunque</span>?
                                </h2>
                                <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
                                    Migliaia di imprenditori stanno già scalando con il loro Clone. <br />
                                    L'unica domanda è: tu quando inizi?
                                </p>

                                <Link
                                    href="/auth/register"
                                    className="group inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                    Inizia Ora · È Gratis
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </Link>

                                <div className="flex items-center justify-center gap-8 mt-8 text-white/30 text-xs font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-gold" /> Pagamento Sicuro</span>
                                    <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-gold" /> Setup 10 Min</span>
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
