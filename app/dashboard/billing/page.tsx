"use client";

import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Lock, Code, Headphones, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getPlanAvailability, PlanAvailability } from '@/lib/founderAvailability';
import { getDisplayPricing, getCurrentPublicPricing } from '@/lib/waves';

const plans = [
    {
        id: "solopreneur",
        name: "Solopreneur",
        price: "€49",
        publicPrice: "€49",
        period: "/mese",
        description: "Il primo passo nel tuo impero",
        features: [
            "1 Clone AI",
            "500 msg/mese",
            "1 Canale",
            "Template",
            "Corso",
            "Community"
        ],
        icon: Sparkles,
        color: "text-green-600",
        bg: "bg-gradient-to-br from-green-50 to-emerald-50",
        btn: "bg-green-600 text-white hover:bg-green-700",
        badge: "🌱 Entry-Level"
    },
    {
        id: "entrepreneur",
        name: "Entrepreneur",
        price: "€147",
        publicPrice: "€697",
        period: "/mese",
        description: "Il più scelto dai Professionisti",
        features: [
            "1 Clone AI",
            "5.000 msg/mese",
            "3 Canali",
            "A/B Test (20%)",
            "Full Analytics",
            "Priority Support"
        ],
        icon: Zap,
        color: "text-gold",
        bg: "bg-gradient-to-br from-gold/5 to-gold/15",
        btn: "gold-gradient text-white shadow-lg",
        glow: true,
        popular: true
    },
    {
        id: "conquistatore",
        name: "Conquistatore",
        price: "€347",
        publicPrice: "€1.197",
        period: "/mese",
        description: "Per agenzie e scale-up",
        features: [
            "3 Cloni AI",
            "20.000 msg/mese",
            "5 Canali",
            "Priority Support",
            "API Access",
            "Custom Logic"
        ],
        icon: Crown,
        color: "text-gold",
        bg: "bg-gradient-to-br from-champagne to-white",
        btn: "bg-charcoal text-white hover:bg-gold transition-all shadow-luxury"
    },
    {
        id: "imperatore",
        name: "Imperatore",
        price: "€697",
        publicPrice: "€1.997",
        period: "/mese",
        description: "Il trono digitale supremo",
        features: [
            "10 Cloni AI",
            "50.000 msg/mese",
            "Canali Illimitati",
            "White-label",
            "Account Manager",
            "Sovereign Vault"
        ],
        icon: Crown,
        color: "text-white/80",
        bg: "gold-gradient !border-transparent",
        btn: "bg-white text-gold hover:bg-champagne transition-all shadow-luxury",
        isDark: true
    }
];

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [availability, setAvailability] = useState<Record<string, PlanAvailability> | null>(null);
    const [displayPricing, setDisplayPricing] = useState<Awaited<ReturnType<typeof getDisplayPricing>> | null>(null);
    const [currentPlan, setCurrentPlan] = useState<string>('curioso'); // User's current plan

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser();

            const [availData, pricingData] = await Promise.all([
                getPlanAvailability(),
                getDisplayPricing()
            ]);

            setAvailability(availData);
            setDisplayPricing(pricingData);

            // Fetch user's current plan
            if (user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('plan_tier')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setCurrentPlan(profileData.plan_tier || 'curioso');
                }
            }
        }
        fetchData();
    }, []);

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
                    priceId: displayPricing?.stripePriceIds?.[planId],
                    tier: planId === 'solopreneur' ? 'public' : displayPricing?.tier // Solopreneur is always public pricing logic
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
                    <span className="text-gold text-[8px] lg:text-[10px] uppercase tracking-[1em] font-black italic shadow-gold">COMMERCE ENGINE</span>
                    <span className="h-[1px] w-10 bg-gold/30"></span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-serif text-3xl lg:text-7xl italic text-charcoal leading-none tracking-tight mb-6"
                >
                    La tua <span className="gold-text-gradient">Sovranità</span> d&apos;Elite.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-charcoal/40 font-serif italic text-base border-x border-gold/10 px-8 lg:px-12"
                >
                    &ldquo;Il lusso non è un&apos;opzione, è uno standard. Solo per i primi Founder.&rdquo;
                </motion.p>
            </header>

            <div className="flex flex-col lg:flex-row gap-3 h-auto lg:h-[520px] max-w-full mx-auto items-stretch px-2 lg:px-4">
                {plans.map((p, i) => {
                    const isHovered = hoveredIndex === i;
                    const isAnyHovered = hoveredIndex !== null;
                    const planAvail = availability?.[p.id];
                    const isSoldOut = planAvail?.isSoldOut || false;

                    // Aspirante is standalone, always €49 (not in waves)
                    let price = 0;
                    let isFounderPrice = false;
                    let publicPrice = 0;

                    if (p.id === 'solopreneur') {
                        price = 49; // Fixed price
                        publicPrice = 49; // No discount
                    } else {
                        publicPrice = getCurrentPublicPricing().prices[p.id as keyof ReturnType<typeof getCurrentPublicPricing>['prices']];
                        price = displayPricing?.prices?.[p.id as string] || 0;
                        isFounderPrice = displayPricing?.tier === 'founder';
                    }

                    return (
                        <motion.div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={{
                                flex: isHovered ? 2.2 : isAnyHovered ? 0.85 : 1,
                                filter: isAnyHovered && !isHovered ? 'blur(1px) grayscale(0.6)' : 'none',
                                opacity: isAnyHovered && !isHovered ? 0.6 : 1,
                                scale: isHovered ? 1.02 : 1
                            }}
                            className={`silk-card p-5 lg:p-7 rounded-[2.5rem] border border-white/60 flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${p.bg} shadow-luxury-sm hover:shadow-luxury`}
                        >
                            {isSoldOut ? (
                                <div className="absolute top-5 right-5 flex items-center gap-2 bg-charcoal/80 px-2.5 py-1 rounded-full border border-white/10 z-20">
                                    <span className="text-[6px] text-white font-black uppercase tracking-widest leading-none">SOLD OUT</span>
                                </div>
                            ) : p.id === currentPlan ? (
                                <div className="absolute top-5 right-5 flex items-center gap-2 bg-green-600/90 px-2.5 py-1 rounded-full border border-white/20 z-20">
                                    <Check className="w-2 h-2 text-white" />
                                    <span className="text-[6px] text-white font-black uppercase tracking-widest leading-none">PIANO ATTUALE</span>
                                </div>
                            ) : p.popular && (
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
                                        <span className={`text-3xl lg:text-5xl font-serif tracking-tighter ${p.isDark ? 'text-white' : 'text-charcoal'}`}>€{price}</span>
                                        <span className={`text-[8px] lg:text-[9px] uppercase tracking-widest opacity-40 font-bold ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.period}</span>
                                    </div>
                                    {!isSoldOut && p.id !== 'curioso' && isFounderPrice && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[9px] line-through opacity-30 ${p.isDark ? 'text-white' : 'text-charcoal'}`}>€{publicPrice}</span>
                                            <span className="text-[8px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight">FOUNDER</span>
                                        </div>
                                    )}
                                    {(!isFounderPrice || isSoldOut) && p.id !== 'curioso' && (
                                        <div className="mt-1">
                                            <span className="text-[7px] uppercase tracking-widest font-black opacity-30">Prezzo Pubblico Attivo</span>
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
                                    disabled={loading === p.id || p.id === currentPlan}
                                    className={`w-full py-3.5 rounded-full text-[8px] lg:text-[9px] uppercase tracking-[0.4em] font-black transition-all duration-500 border overflow-hidden ${p.id === currentPlan ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600' : p.btn}`}
                                >
                                    {loading === p.id
                                        ? '...'
                                        : p.id === currentPlan
                                            ? '✓ PIANO ATTIVO'
                                            : isHovered ? (isSoldOut ? 'GET ELITE ACCESS' : `SCEGLI ${p.name.toUpperCase()}`) : (isSoldOut ? 'Join the Elite' : `Scegli ${p.name}`)}
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
