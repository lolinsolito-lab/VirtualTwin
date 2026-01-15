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
import { ArrowRight, Sparkles, Check, Clock, Shield, Bot, Crown, Flame, Target, Trophy, Star, Zap } from 'lucide-react';

/**
 * START PAGE - ESCLUSIVO E PREMIUM
 * 
 * Slogan: "Quanto Vale la Tua Libertà?"
 * Focus: Canali Premium, Clone AI, Esclusività
 */

const channels = [
    {
        name: "WhatsApp Business",
        tier: "Tutti i Tier",
        image: "/images/channels/whatsapp.png",
        headline: "Il Re della Conversione",
        desc: "Cattura lead, qualifica clienti e chiudi vendite mentre dormi. Il canale più potente del mondo, ora automatizzato."
    },
    {
        name: "Instagram Direct",
        tier: "Tier 2+",
        image: "/images/channels/instagram.png",
        headline: "DM che Vendono da Soli",
        desc: "Trasforma ogni interazione in un'opportunità. Rispondi, coinvolgi, converti — senza mai toccare il telefono."
    },
    {
        name: "Facebook Messenger",
        tier: "Tier 2+",
        image: "/images/channels/messenger.png",
        headline: "Velocità Fulminea",
        desc: "2 miliardi di utenti. Il tuo Clone risponde in <3 secondi. La velocità che i competitor sognano."
    },
    {
        name: "Telegram Bot",
        tier: "Tier 4+",
        image: "/images/channels/telegram.png",
        headline: "Assistenza Istantanea",
        desc: "Bot personalizzato 24/7. Supporto tecnico, FAQ, prenotazioni — tutto in pilota automatico."
    },
    {
        name: "Webchat AI",
        tier: "Tier 4+",
        image: "/images/channels/webchat.png",
        headline: "Il Tuo Sito, Potenziato",
        desc: "Widget premium che accoglie, qualifica e converte i visitatori. Design elegante, risultati brutali."
    },
    {
        name: "LinkedIn Direct",
        tier: "Tier 5 Élite",
        image: "/images/channels/linkedin.png",
        headline: "Network B2B Automatizzato",
        desc: "Connessioni strategiche, messaggi personalizzati, deal che si chiudono. Il potere del networking, scalato."
    }
];

export default function StartPage() {
    return (
        <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
            <Navbar />

            <main>
                {/* HERO PREMIUM */}
                <section className="relative pt-32 pb-24 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-[80px]" />
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
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl">
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
                                className="inline-flex items-center gap-2 px-5 py-2 bg-gold text-charcoal rounded-full mb-8"
                            >
                                <Bot className="w-4 h-4" />
                                <span className="text-sm font-black tracking-wider uppercase">
                                    VirtualTwin · Il Tuo Clone AI
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
                                Su tutti i canali. Senza mai dormire. <strong className="text-gold">Senza mai sbagliare.</strong>
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
                                    className="group inline-flex items-center gap-3 px-12 py-6 bg-charcoal text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-gold hover:scale-105 transition-all shadow-xl"
                                >
                                    <Sparkles className="w-5 h-5 text-gold group-hover:text-white" />
                                    Inizia Ora · 14 Giorni Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="flex items-center gap-2 text-charcoal/40 text-sm font-medium">
                                    <Clock className="w-4 h-4" />
                                    <span>Setup in <strong className="text-charcoal/60">10 Minuti</strong>. Senza Codice.</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CHANNELS PREMIUM SHOWCASE */}
                <section className="py-24 px-6 bg-charcoal relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.3) 0%, transparent 50%)`,
                    }} />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-flex items-center gap-2 px-5 py-2 bg-gold text-charcoal rounded-full mb-8">
                                    <Crown className="w-4 h-4" />
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase">Canali Integrati</span>
                                </span>
                                <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
                                    Un Clone. <span className="text-gold italic">Sei Dimensioni.</span>
                                </h2>
                                <p className="text-white/40 text-lg max-w-2xl mx-auto">
                                    Il tuo alter ego digitale conquista ogni piattaforma. <br />
                                    Stesso tono. Stessa precisione. <strong className="text-white/60">Risultati moltiplicati.</strong>
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {channels.map((channel, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)] transition-all duration-500"
                                >
                                    {/* Image Header */}
                                    <div className="relative h-44 overflow-hidden">
                                        <Image
                                            src={channel.image}
                                            alt={channel.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

                                        {/* Tier Badge */}
                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-gold text-charcoal text-[9px] font-black uppercase rounded-full shadow-lg">
                                            {channel.tier}
                                        </div>

                                        {/* Shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-serif text-xl text-charcoal mb-1">{channel.name}</h3>
                                        <p className="text-gold text-sm font-bold italic mb-3">{channel.headline}</p>
                                        <p className="text-charcoal/50 text-sm leading-relaxed">{channel.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF BAR */}
                <SocialProofBar />

                {/* LORO vs NOI - PREMIUM DESIGN */}
                <section className="py-24 px-6 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-champagne via-white to-champagne" />

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="inline-flex items-center gap-2 px-5 py-2 bg-charcoal text-white rounded-full mb-8">
                                    <Flame className="w-4 h-4 text-gold" />
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase">La Verità Brutale</span>
                                </span>
                                <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4">
                                    Due Realtà. <span className="text-gold italic">Una Scelta.</span>
                                </h2>
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* WITHOUT US - Crumbling */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative p-8 bg-gray-100 rounded-[2rem] border border-gray-200 overflow-hidden"
                            >
                                {/* Distressed overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-transparent" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-2xl">😰</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-black">Senza VirtualTwin</span>
                                            <h3 className="font-serif text-2xl text-gray-500 italic">La Prigione Invisibile</h3>
                                        </div>
                                    </div>

                                    <ul className="space-y-4">
                                        {[
                                            { icon: "⏰", text: "Sveglia alle 3AM per quel cliente importante" },
                                            { icon: "💸", text: "Lead persi perché non hai risposto in tempo" },
                                            { icon: "🔄", text: "'Qual è il prezzo?' — 847 volte al giorno" },
                                            { icon: "🔥", text: "Burnout garantito entro 6 mesi" },
                                            { icon: "✈️", text: "Vacanze? Si, in live su WhatsApp..." }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 text-gray-500">
                                                <span className="text-xl">{item.icon}</span>
                                                <span className="line-through opacity-70">{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>

                            {/* WITH US - Glowing */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative p-8 bg-charcoal rounded-[2rem] overflow-hidden"
                            >
                                {/* Gold glow */}
                                <div className="absolute -inset-1 bg-gradient-to-br from-gold/50 via-gold/20 to-transparent rounded-[2rem] blur-xl" />
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                                            <Crown className="w-6 h-6 text-charcoal" />
                                        </div>
                                        <div>
                                            <span className="text-gold text-[10px] uppercase tracking-widest font-black">Con VirtualTwin</span>
                                            <h3 className="font-serif text-2xl text-white italic">La Nuova Élite</h3>
                                        </div>
                                    </div>

                                    <ul className="space-y-4">
                                        {[
                                            { icon: Trophy, text: "Il Clone risponde in 3 secondi. Sempre." },
                                            { icon: Target, text: "Ogni lead qualificato prima che tu lo veda" },
                                            { icon: Zap, text: "FAQ automatizzate. Zero ripetizioni." },
                                            { icon: Star, text: "Energia per ciò che conta: strategia" },
                                            { icon: Sparkles, text: "Vacanze vere. Il Clone non dorme mai." }
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-4 text-white">
                                                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                                                    <item.icon className="w-4 h-4 text-gold" />
                                                </div>
                                                <strong>{item.text}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* QUOTE - Powerful */}
                <div className="py-20 bg-charcoal">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto px-6 text-center"
                    >
                        <p className="font-serif text-3xl md:text-5xl text-white/30 italic leading-tight">
                            "Chi rincorre i messaggi, perde il tempo. <br />
                            <span className="text-gold">Chi costruisce sistemi,</span> <br />
                            conquista la libertà."
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

                {/* FINAL CTA - Premium */}
                <section className="py-24 px-6 bg-charcoal">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-[4rem] blur-2xl opacity-30 animate-pulse" />

                            <div className="relative bg-black rounded-[3rem] p-12 md:p-16 text-center border border-gold/30 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />

                                <div className="relative z-10">
                                    <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Il Momento è Adesso</span>
                                    <h2 className="text-4xl md:text-5xl font-serif text-white italic mb-6">
                                        Pronto a <span className="text-gold">Moltiplicarti</span>?
                                    </h2>
                                    <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
                                        Setup in 10 minuti. Senza codice. Senza stress. <br />
                                        <strong className="text-white/70">Il tuo Clone AI ti aspetta.</strong>
                                    </p>

                                    <Link
                                        href="/auth/register"
                                        className="group inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gold/30"
                                    >
                                        <Sparkles className="w-6 h-6" />
                                        Inizia Ora
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </Link>

                                    <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-white/30 text-xs font-black uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-gold" /> Pagamento Sicuro</span>
                                        <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-gold" /> 14 Giorni Free</span>
                                        <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Cancella Quando Vuoi</span>
                                    </div>
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
