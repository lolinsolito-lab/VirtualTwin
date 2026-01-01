"use client";

import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Moon, MessageCircle, Zap, ArrowRight, Sparkles } from 'lucide-react';

const ProblemEnhanced = () => {
    const [mounted, setMounted] = useState(false);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setMounted(true);
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const beforeStats = [
        { label: "Tempo per rispondere", value: "15+ min" },
        { label: "Clienti che non aspettano", value: "72%" },
        { label: "Opportunità mancate/mese", value: "€3.2K" },
        { label: "Quando sei disponibile", value: "8h/giorno" },
    ];

    const afterStats = [
        { label: "Tempo di risposta", value: "<2 secondi", icon: Zap, color: "text-gold" },
        { label: "Clienti convertiti", value: "+340%", color: "text-green-400" },
        { label: "Nuovo fatturato", value: "+€8.5K", color: "text-green-400" },
        { label: "Quando lavora per te", value: "24/7/365", color: "text-gold" },
    ];

    return (
        <section ref={sectionRef} id="problem" className="py-16 lg:py-24 px-6 lg:px-12 bg-charcoal relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-red-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* PART 1: STORYTELLING */}
                <div className="text-center mb-12">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                        <Sparkles className="w-3 h-3 text-gold" />
                        <span className="text-white/50 text-[9px] uppercase tracking-[0.4em] font-bold">Riconosci Questo?</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Moon className="w-5 h-5 text-gold/60" />
                        <span className="font-mono text-gold text-3xl font-light">23:47</span>
                    </div>

                    {/* Narrative */}
                    <p className="text-white/40 text-lg font-serif italic mb-1">Il telefono vibra.</p>
                    <p className="text-white/60 text-lg mb-6">Un messaggio WhatsApp. Un potenziale cliente.</p>

                    {/* The Message */}
                    <div className="inline-block bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/10 max-w-md mx-auto mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className="text-white/40 text-xs">WhatsApp</span>
                        </div>
                        <p className="text-white text-base font-medium text-left leading-relaxed">
                            "Ciao! Ho visto il vostro servizio, mi interessa. Quanto costa e come funziona?"
                        </p>
                        <p className="text-white/30 text-xs text-right mt-2">23:47</p>
                    </div>

                    {/* Problem Statement */}
                    <p className="text-white/50 text-base mb-2">Ma tu stai dormendo. O sei a cena. O in palestra.</p>
                    <p className="text-white/70 text-lg font-medium">Rispondi la mattina dopo. <span className="text-red-400">Silenzio.</span></p>
                </div>

                {/* PART 2: DATA COMPARISON CARDS */}
                <div className="grid md:grid-cols-2 gap-4 lg:gap-6">

                    {/* BEFORE Card */}
                    <div className="bg-gradient-to-br from-red-950/40 to-red-900/20 rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-red-500/20">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                <X className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">La Tua Giornata Oggi</p>
                                <p className="text-red-400/60 text-[9px] uppercase tracking-wider">La realtà che conosci</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                            {beforeStats.map((stat, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                                    <span className="text-white/40 text-sm">{stat.label}</span>
                                    <span className="text-white font-medium text-sm">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quote */}
                        <div className="mt-5 px-4 py-3 bg-gold/10 rounded-lg border-l-2 border-gold/40">
                            <p className="text-white/50 text-xs italic">"Non riesco a stare dietro a tutti i messaggi..."</p>
                        </div>
                    </div>

                    {/* AFTER Card */}
                    <div className="bg-gradient-to-br from-green-950/30 to-emerald-900/15 rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-green-500/20">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">La Tua Giornata Domani</p>
                                <p className="text-gold text-[9px] uppercase tracking-wider">La realtà che meriti</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                            {afterStats.map((stat, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                                    <span className="text-white/40 text-sm">{stat.label}</span>
                                    <span className={`font-bold text-sm flex items-center gap-1 ${stat.color}`}>
                                        {stat.icon && <stat.icon className="w-3 h-3" />}
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <a
                            href="#solution"
                            className="mt-5 w-full gold-gradient py-3 rounded-lg text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg"
                        >
                            ✨ Mentre dormi, il tuo clone vende
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemEnhanced;
