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
import {
    ArrowRight, Sparkles, Check, Clock, Shield, Zap, Heart,
    MessageSquare, Send, Globe, Linkedin, Bot, Radio
} from 'lucide-react';

/**
 * START PAGE - BENVENUTO UNIVERSALE
 * 
 * Slogan: "Quanto Vale la Tua Libertà?"
 * Focus: Canali, Clone AI, Setup Veloce
 */

const channels = [
    {
        name: "WhatsApp Business",
        icon: MessageSquare,
        color: "from-green-500 to-green-600",
        status: "live",
        desc: "Rispondi automaticamente ai messaggi WhatsApp"
    },
    {
        name: "Instagram Direct",
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
            </svg>
        ),
        color: "from-pink-500 via-purple-500 to-orange-500",
        status: "coming",
        desc: "Gestisci i DM Instagram con l'AI"
    },
    {
        name: "Facebook Messenger",
        icon: () => (
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.886 1.276 5.462 3.322 7.254V22l3.405-1.862c.907.252 1.872.39 2.873.39 5.523 0 10-4.145 10-9.243S17.523 2 12 2z" />
            </svg>
        ),
        color: "from-blue-500 to-blue-600",
        status: "coming",
        desc: "Automatizza le conversazioni Messenger"
    },
    {
        name: "Telegram Bot",
        icon: Send,
        color: "from-sky-400 to-sky-500",
        status: "vip",
        desc: "Connetti il tuo bot Telegram per assistenze rapide"
    },
    {
        name: "Webchat Integrata",
        icon: Globe,
        color: "from-gold to-amber-600",
        status: "vip",
        desc: "Widget AI avanzato da integrare nel tuo sito"
    },
    {
        name: "LinkedIn Direct",
        icon: Linkedin,
        color: "from-blue-700 to-blue-800",
        status: "exclusive",
        desc: "Espandi il tuo network con messaggi AI"
    }
];

export default function StartPage() {
    return (
        <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
            <Navbar />

            <main>
                {/* HERO - "Quanto Vale la Tua Libertà?" */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 right-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-gold/10 border border-gold/30 rounded-full mb-8"
                            >
                                <Bot className="w-4 h-4 text-gold" />
                                <span className="text-gold text-sm font-black tracking-wider uppercase">
                                    Il Tuo Clone AI Digitale
                                </span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-[0.9]"
                            >
                                Quanto Vale la <br />
                                <span className="text-gold italic">Tua Libertà?</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-charcoal/50 max-w-3xl mx-auto mb-10 leading-relaxed"
                            >
                                Il Tuo Clone AI Digitale che <strong className="text-charcoal/70">Risponde per te ai Clienti 24/7</strong>. <br />
                                Su tutti i canali. Senza mai dormire.
                            </motion.p>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center gap-4 mb-12"
                            >
                                <Link
                                    href="/auth/register"
                                    className="group inline-flex items-center gap-3 px-12 py-6 bg-gold text-white rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-gold/30"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Inizia Gratis · 14 Giorni
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="flex items-center gap-2 text-charcoal/40 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>Setup in 10 Minuti. <strong>Senza Codice.</strong></span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CHANNELS SHOWCASE */}
                <section className="py-20 px-6 bg-charcoal">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 rounded-full mb-6">
                                <Radio className="w-4 h-4 text-gold" />
                                <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">Canali Supportati</span>
                            </span>
                            <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
                                Un Clone, <span className="text-gold italic">Tutti i Canali.</span>
                            </h2>
                            <p className="text-white/50 text-lg max-w-2xl mx-auto">
                                Rispondi ai tuoi clienti ovunque si trovino. <br />
                                Il tuo Clone AI parla la tua lingua su ogni piattaforma.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {channels.map((channel, i) => {
                                const IconComponent = channel.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-gold/30 transition-all"
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            {channel.status === 'live' && (
                                                <span className="px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase rounded-full">
                                                    Live
                                                </span>
                                            )}
                                            {channel.status === 'coming' && (
                                                <span className="px-2 py-1 bg-white/20 text-white/60 text-[8px] font-black uppercase rounded-full">
                                                    Coming Soon
                                                </span>
                                            )}
                                            {channel.status === 'vip' && (
                                                <span className="px-2 py-1 bg-gold text-charcoal text-[8px] font-black uppercase rounded-full">
                                                    Tier 4 & 5
                                                </span>
                                            )}
                                            {channel.status === 'exclusive' && (
                                                <span className="px-2 py-1 bg-purple-500 text-white text-[8px] font-black uppercase rounded-full">
                                                    Exclusive
                                                </span>
                                            )}
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                                            {typeof IconComponent === 'function' ? <IconComponent /> : <IconComponent className="w-6 h-6" />}
                                        </div>

                                        <h3 className="text-white font-bold text-lg mb-2">{channel.name}</h3>
                                        <p className="text-white/50 text-sm">{channel.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF BAR */}
                <SocialProofBar />

                {/* LORO vs NOI */}
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

                {/* QUOTE */}
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

                {/* PRICING - PUBLIC MODE (NON TOCCARE) */}
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
                                    Pronto a Essere <span className="text-gold">Ovunque</span>?
                                </h2>
                                <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
                                    Setup in 10 minuti. Senza codice. Senza stress. <br />
                                    Il tuo Clone AI ti aspetta.
                                </p>

                                <Link
                                    href="/auth/register"
                                    className="group inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                    Inizia Ora · È Gratis
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </Link>

                                <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-white/30 text-xs font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-gold" /> Pagamento Sicuro</span>
                                    <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-gold" /> Setup 10 Min</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> No Carta Richiesta</span>
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
