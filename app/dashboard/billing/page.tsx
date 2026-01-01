"use client";

import React, { useState } from 'react';
import { Check, Shield, Zap, Crown, Globe, Lock, Code, Headphones } from 'lucide-react';

const plans = [
    {
        id: "curioso",
        name: "Curioso",
        price: "€0",
        period: "per sempre",
        description: "Perfetto per testare l'essenza dell'IA.",
        features: [
            "100 Messaggi / mese",
            "1 Clone AI (Sovereign Core)",
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
        description: "Per chi inizia a costruire il proprio impero.",
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
            "Custom Domain (Presto)",
            "Accesso API Prioritario"
        ],
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
        description: "L'apice della sovranità digitale illimitata.",
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

import { supabase } from '@/lib/supabase';

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);

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
                    isFounder: true // Default to founder pricing for this sprint
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
            alert("Errore durante l'avvio del checkout. Verifica la configurazione Stripe.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="p-12 lg:p-24 min-h-screen bg-champagne animate-soft-focus">
            <header className="text-center mb-32">
                <div className="flex items-center justify-center gap-6 mb-8">
                    <span className="h-[1px] w-16 bg-gold/30"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[1.2em] font-black italic">Investment Strategy</span>
                    <span className="h-[1px] w-16 bg-gold/30"></span>
                </div>
                <h1 className="font-serif text-7xl lg:text-8xl italic text-charcoal leading-none tracking-tight mb-12">
                    Scegli la tua <span className="gold-text-gradient">Sovranità.</span>
                </h1>
                <p className="text-charcoal/40 font-serif italic text-xl max-w-2xl mx-auto border-l-[0.5px] border-r-[0.5px] border-gold/10 px-12">
                    "Il valore dell'influenza automatizzata è misurabile solo attraverso la libertà che essa genera."
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {plans.map((p, i) => (
                    <div
                        key={i}
                        className={`silk-card p-12 rounded-[4rem] border border-white/60 flex flex-col justify-between group transform transition-all duration-1000 hover:-translate-y-4 hover:translate-z-10 perspective-3d shadow-luxury relative overflow-hidden ${p.bg}`}
                    >
                        {p.popular && (
                            <div className="absolute top-10 right-10 flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full border border-gold/20">
                                <Zap className="w-3 h-3 text-gold" />
                                <span className="text-[7px] text-gold font-black uppercase tracking-widest">Più Scelto</span>
                            </div>
                        )}

                        <div>
                            <p className={`text-[10px] uppercase tracking-[0.5em] font-black mb-8 italic ${p.isDark ? 'text-white/40' : 'text-charcoal/30'}`}>{p.name}</p>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className={`text-6xl font-serif tracking-tighter ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.price}</span>
                                <span className={`text-[10px] uppercase tracking-widest opacity-40 font-bold ${p.isDark ? 'text-white' : 'text-charcoal'}`}>{p.period}</span>
                            </div>
                            <p className={`text-sm italic font-serif leading-relaxed mb-12 ${p.isDark ? 'text-white/60' : 'text-charcoal/40'}`}>{p.description}</p>

                            <div className="space-y-6 mb-16">
                                {p.features.map((f, j) => (
                                    <div key={j} className="flex items-center gap-4 group/item">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 group-hover/item:scale-125 ${p.isDark ? 'bg-white/10 text-white' : 'bg-gold/5 text-gold'}`}>
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold ${p.isDark ? 'text-white/70' : 'text-charcoal/60'}`}>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => handleSubscribe(p.id)}
                            disabled={loading === p.id}
                            className={`w-full py-6 rounded-full text-[10px] uppercase tracking-[0.5em] font-black transition-all duration-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border ${p.btn}`}
                        >
                            {loading === p.id ? 'Inizializzazione...' : p.id === 'curioso' ? 'Piano Attivo' : `Inizia con ${p.name}`}
                        </button>
                    </div>
                ))}
            </div>

            {/* Support & Security Footer */}
            <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-20 border-t border-charcoal/5 pt-20">
                <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-gold border border-gold/10 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-sm">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/30 mb-2">Sicurezza Totale</p>
                        <p className="text-sm italic font-serif text-charcoal/60">Transazioni protette da protocolli bancari d'élite.</p>
                    </div>
                </div>
                <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-gold border border-gold/10 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-sm">
                        <Code className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/30 mb-2">API d'Impresa</p>
                        <p className="text-sm italic font-serif text-charcoal/60">Integrazione fluida nei tuoi sistemi esistenti.</p>
                    </div>
                </div>
                <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 glass-card rounded-2xl flex items-center justify-center text-gold border border-gold/10 group-hover:bg-gold group-hover:text-white transition-all duration-700 shadow-sm">
                        <Headphones className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/30 mb-2">Priorità Sovrana</p>
                        <p className="text-sm italic font-serif text-charcoal/60">Il nostro team è al servizio della tua visione 24/7.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
