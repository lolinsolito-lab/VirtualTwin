"use client";

import React, { useState } from 'react';
import { Check, Shield, Zap, Crown, Lock, Code, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const plans = [
    {
        id: "curioso",
        name: "Curioso",
        price: "€0",
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
        period: "/mese",
        description: "Potenza superiore per professionisti d'elite.",
        features: [
            "5.000 Messaggi / mese",
            "3 Cloni AI (Dominio Multiplo)",
            "Personalità AI Avanzata",
            "A/B Testing Neurale",
            "Custom Domain",
            "Accesso API Prioritario"
        ],
        popular: false,
        icon: Shield,
        color: "text-charcoal",
        bg: "bg-white/80",
        btn: "bg-charcoal text-white hover:bg-black transition-all shadow-xl"
    },
    {
        id: "imperatore",
        name: "Imperatore",
        price: "€397",
        period: "/mese",
        description: "Sovranità totale. L'apice del lusso tecnologico.",
        features: [
            "Messaggi ILLIMITATI",
            "White-label Totale",
            "Gestione Clienti (Presto)",
            "10 Cloni AI",
            "Supporto Prioritario H24",
            "Setup Strategico Dedicato"
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
        <div className="p-8 lg:p-12 min-h-screen bg-transparent overflow-hidden">
            <header className="text-center mb-16 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-6 mb-4"
                >
                    <span className="h-[1px] w-12 bg-gold/30"></span>
                    <span className="text-gold text-[8px] lg:text-[10px] uppercase tracking-[1em] font-black italic">Investment Strategy</span>
                    <span className="h-[1px] w-12 bg-gold/30"></span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-serif text-4xl lg:text-7xl italic text-charcoal leading-none tracking-tight mb-8"
                >
                    La tua <span className="gold-text-gradient">Sovranità</span> Interattiva.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-charcoal/40 font-serif italic text-lg border-x border-gold/10 px-12"
                >
                    "L'eccellenza non si guarda, si vive. Passa il mouse su una card."
                </motion.p>
            </header>

            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[550px] max-w-7xl mx-auto items-stretch">
                {plans.map((p, i) => {
                    const isHovered = hoveredIndex === i;
                    const isAnyHovered = hoveredIndex !== null;

                    return (
                        <motion.div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={{
                                flex: isHovered ? 2.5 : isAnyHovered ? 0.6 : 1,
                                filter: isAnyHovered && !isHovered ? 'blur(2px) grayscale(0.5)' : 'none',
                                opacity: isAnyHovered && !isHovered ? 0.7 : 1,
                                scale: isHovered ? 1.02 : 1
                            }}
                            className={`silk-card p-6 lg:p-8 rounded-[3rem] border border-white/60 flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${p.bg} shadow-luxury-sm hover:shadow-luxury`}
                        >
                            {p.popular && (
                                <div className="absolute top-6 right-6 flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 z-20">
                                    <Zap className="w-2.5 h-2.5 text-gold" />
                                    <span className="text-[6px] text-gold font-black uppercase tracking-widest leading-none">Più Scelto</span>
                                </div>
                            )}

                            <div className="flex-grow flex flex-col min-w-[180px]">
                                <p className={`text-[8px] uppercase tracking-[0.4em] font-black mb-4 ${p.isDark ? 'text-white/40' : 'text-charcoal/30'}`}>
                                    {p.name}
                                </p>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className={`text-3xl lg:text-5xl font-serif tracking-tighter ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.price}</span>
                                    <span className={`text-[8px] uppercase tracking-widest opacity-40 font-bold ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.period}</span>
                                </div>

                                <motion.p
                                    className={`text-[10px] italic font-serif leading-relaxed mb-6 h-12 overflow-hidden ${p.isDark ? 'text-white/60' : 'text-charcoal/40'}`}
                                >
                                    {p.description}
                                </motion.p>

                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-3 flex-grow py-4 border-t border-gold/5"
                                        >
                                            {p.features.map((f, j) => (
                                                <div key={j} className="flex items-start gap-2">
                                                    <div className={`mt-1 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${p.isDark ? 'bg-white/10 text-white' : 'bg-gold/5 text-gold'}`}>
                                                        <Check className="w-1.5 h-1.5" />
                                                    </div>
                                                    <span className={`text-[8.5px] uppercase tracking-wider font-bold leading-tight ${p.isDark ? 'text-white/70' : 'text-charcoal/60'}`}>{f}</span>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.div
                                className="mt-auto pt-4"
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    scale: isHovered ? 1 : 0.95
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSubscribe(p.id);
                                    }}
                                    disabled={loading === p.id}
                                    className={`w-full py-4 rounded-full text-[8px] uppercase tracking-[0.4em] font-black transition-all duration-500 border ${p.btn}`}
                                >
                                    {loading === p.id ? 'Inizializzazione...' : p.id === 'curioso' ? 'Piano Attivo' : 'Scegli Sovranità'}
                                </button>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <footer className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto opacity-40 hover:opacity-100 transition-opacity duration-1000">
                {[
                    { icon: Lock, title: "Sicurezza", desc: "Protocolli d'élite." },
                    { icon: Code, title: "Developer", desc: "Integrazione API." },
                    { icon: Headphones, title: "Supporto", desc: "Sempre al tuo fianco." }
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center text-gold border border-gold/10">
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
