"use client";

import React, { useState } from 'react';
import { Check, Shield, Zap, Crown, Lock, Code, Headphones, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const plans = [
    {
        id: "curioso",
        name: "Curioso",
        price: "€0",
        publicPrice: "€0",
        period: "per sempre",
        description: "L'essenza dell'IA per i tuoi primi esperimenti sovrani.",
        features: [
            "100 Messaggi / mese",
            "1 Clone AI (Core Engine)",
            "Sandbox Chat Illimitata",
            "Watermark VirtualTwin",
            "Analytics Base"
        ],
        icon: Lock,
        color: "text-charcoal/40",
        bg: "bg-white/40",
        btn: "border-charcoal/10 text-charcoal hover:bg-charcoal hover:text-white"
    },
    {
        id: "esploratore",
        name: "Esploratore",
        price: "€39",
        publicPrice: "€65",
        period: "/mese",
        description: "Inizia a scalare la tua influenza digitale.",
        features: [
            "1.000 Messaggi / mese",
            "1 Clone AI (Sovereign Core)",
            "WhatsApp & Instagram Link",
            "Nessun Watermark",
            "Analytics Avanzate",
            "Supporto Email"
        ],
        icon: Zap,
        color: "text-gold",
        bg: "bg-white/60",
        btn: "gold-gradient text-white shadow-luxury",
        popular: true
    },
    {
        id: "pioniere",
        name: "Pioniere",
        price: "€97",
        publicPrice: "€162",
        period: "/mese",
        description: "Potenza superiore per professionisti d'elite.",
        features: [
            "5.000 Messaggi / mese",
            "3 Cloni AI (Dominio Multiplo)",
            "Personalità AI Avanzata",
            "A/B Testing Neurale",
            "Integrazioni Zapier/Make",
            "Supporto Prioritario Chat"
        ],
        icon: Shield,
        color: "text-charcoal",
        bg: "bg-white/70",
        btn: "bg-charcoal text-white hover:bg-black transition-all shadow-xl"
    },
    {
        id: "conquistatore",
        name: "Conquistatore",
        price: "€197",
        publicPrice: "€328",
        period: "/mese",
        description: "Domina il mercato con intelligenza superiore.",
        features: [
            "20.000 Messaggi / mese",
            "5 Cloni AI",
            "Canali Illimitati",
            "GPT-4o 💎 (Premium AI)",
            "Custom Training",
            "Supporto 1-on-1",
            "API Completa"
        ],
        icon: Rocket,
        color: "text-gold",
        bg: "bg-white/80 border-gold/10",
        btn: "bg-gold text-white hover:bg-gold/80 hover:scale-105 transition-all shadow-luxury"
    },
    {
        id: "imperatore",
        name: "Imperatore",
        price: "€397",
        publicPrice: "€662",
        period: "/mese",
        description: "L'apice della sovranità digitale illimitata.",
        features: [
            "Messaggi ILLIMITATI",
            "White-label Totale",
            "10 Cloni AI (Agency)",
            "Sub-account Clienti",
            "SLA 99.9% Uptime",
            "Account Manager Dedicato"
        ],
        icon: Crown,
        color: "text-gold",
        bg: "gold-gradient text-white !border-transparent",
        btn: "bg-white text-gold hover:bg-champagne transition-all shadow-luxury",
        isDark: true
    }
];

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleSubscribe = async (planId: string) => {
        if (planId === 'curioso') return;
        setLoading(planId);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/auth/login';
                return;
            }

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: planId,
                    userId: user.id,
                    billing: 'monthly',
                    isFounder: true
                })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Sub Error:", error);
            alert("Errore durante l'avvio del checkout.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="p-4 lg:p-8 min-h-screen bg-transparent overflow-hidden">
            <header className="text-center mb-12 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-6 mb-3"
                >
                    <span className="h-[1px] w-10 bg-gold/30"></span>
                    <span className="text-gold text-[8px] lg:text-[10px] uppercase tracking-[1em] font-black italic shadow-gold">FOUNDER EDITION</span>
                    <span className="h-[1px] w-10 bg-gold/30"></span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-serif text-3xl lg:text-7xl italic text-charcoal leading-none tracking-tight mb-6"
                >
                    La tua <span className="gold-text-gradient">Sovranità</span> d'Elite.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-charcoal/40 font-serif italic text-base border-x border-gold/10 px-8 lg:px-12"
                >
                    "Il lusso non è un'opzione, è uno standard. Solo per i primi Founder."
                </motion.p>
            </header>

            <div className="flex flex-col lg:flex-row gap-3 h-auto lg:h-[520px] max-w-full mx-auto items-stretch px-2 lg:px-4">
                {plans.map((p, i) => {
                    const isHovered = hoveredIndex === i;
                    const isAnyHovered = hoveredIndex !== null;

                    return (
                        <motion.div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={{
                                flex: isHovered ? 3.5 : isAnyHovered ? 0.7 : 1,
                                filter: isAnyHovered && !isHovered ? 'blur(1px) grayscale(0.6)' : 'none',
                                opacity: isAnyHovered && !isHovered ? 0.6 : 1,
                                scale: isHovered ? 1.01 : 1
                            }}
                            className={`silk-card p-5 lg:p-7 rounded-[2.5rem] border border-white/60 flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${p.bg} shadow-luxury-sm hover:shadow-luxury`}
                        >
                            {p.popular && (
                                <div className="absolute top-5 right-5 flex items-center gap-2 bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20 z-20">
                                    <Zap className="w-2 h-2 text-gold" />
                                    <span className="text-[6px] text-gold font-black uppercase tracking-widest leading-none">PIÙ AMATO</span>
                                </div>
                            )}

                            <div className="flex-grow flex flex-col min-w-[150px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`p-2 rounded-xl glass-card ${p.isDark ? 'bg-white/10' : 'bg-gold/5 text-gold'}`}>
                                        <p.icon className="w-4 h-4" />
                                    </div>
                                    <p className={`text-[8px] lg:text-[10px] uppercase tracking-[0.4em] font-black ${p.isDark ? 'text-white/60' : 'text-charcoal/30'}`}>
                                        {p.name}
                                    </p>
                                </div>

                                <div className="flex flex-col mb-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl lg:text-5xl font-serif tracking-tighter ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.price}</span>
                                        <span className={`text-[8px] lg:text-[9px] uppercase tracking-widest opacity-40 font-bold ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.period}</span>
                                    </div>
                                    {p.id !== 'curioso' && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] line-through opacity-30 ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.publicPrice}</span>
                                            <span className="text-[8px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight">FOUNDER</span>
                                        </div>
                                    )}
                                </div>

                                <motion.p
                                    className={`text-[10px] lg:text-[11px] italic font-serif leading-relaxed mb-6 h-10 overflow-hidden ${p.isDark ? 'text-white/60' : 'text-charcoal/40'}`}
                                >
                                    {p.description}
                                </motion.p>

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="space-y-2 flex-grow py-3 border-t border-gold/5"
                                        >
                                            {p.features.slice(0, 8).map((f, j) => (
                                                <div key={j} className="flex items-start gap-2">
                                                    <div className={`mt-1 w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${p.isDark ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold shadow-sm'}`}>
                                                        <Check className="w-1.5 h-1.5" />
                                                    </div>
                                                    <span className={`text-[8px] lg:text-[9.5px] uppercase tracking-wider font-bold leading-tight ${p.isDark ? 'text-white/80' : 'text-charcoal/70'}`}>{f}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.div
                                className="mt-auto pt-3"
                                animate={{
                                    opacity: isHovered ? 1 : 0.8,
                                    y: isHovered ? 0 : 5
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubscribe(p.id);
                                    }}
                                    disabled={loading === p.id}
                                    className={`w-full py-3.5 rounded-full text-[8px] lg:text-[9px] uppercase tracking-[0.4em] font-black transition-all duration-500 border overflow-hidden ${p.btn}`}
                                >
                                    {loading === p.id
                                        ? '...'
                                        : p.id === 'curioso'
                                            ? 'ACTIVE'
                                            : isHovered ? `ACTIVATE ${p.name}` : `Scegli ${p.name}`}
                                </button>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <footer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-30 hover:opacity-100 transition-opacity duration-1000 px-6">
                {[
                    { icon: Lock, title: "Sovereign Vault", desc: "Protocolli d'élite." },
                    { icon: Code, title: "Custom Logic", desc: "API d'Impresa." },
                    { icon: Headphones, title: "Concierge 24/7", desc: "Al tuo fianco." }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-gold border border-gold/10 shadow-sm">
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-[0.3em] font-black text-charcoal">{item.title}</p>
                            <p className="text-[10px] italic font-serif text-charcoal/60">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </footer>
        </div>
    );
}
