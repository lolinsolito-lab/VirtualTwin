"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, Clock, Users, Shield, MessageCircle, X, Flame } from 'lucide-react';
import { siteConfig } from '@/lib/config';

const HeroUltimate = () => {
    const [mounted, setMounted] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [foundersLeft, setFoundersLeft] = useState(153);

    useEffect(() => {
        setMounted(true);
        // Simulate real-time scarcity (in production, this would be from DB)
        const stored = localStorage.getItem('vt_founders_left');
        if (stored) {
            setFoundersLeft(parseInt(stored));
        }
    }, []);

    // Close modal on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowDemo(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6 lg:px-24 pt-32 pb-20 bg-champagne">
            {/* FOUNDING MEMBER BANNER - URGENCY (thin, above navbar) */}
            <div className={`fixed top-0 left-0 right-0 z-[100] bg-charcoal text-white py-2 px-4 text-center transition-all duration-1000 ${mounted ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="font-bold text-gold">SOVEREIGN EDITION</span>
                    <span className="text-white/60">•</span>
                    <span className="hidden sm:inline">Solo 1,000 Founder.</span>
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                        {foundersLeft} rimasti
                    </span>
                    <span className="hidden md:inline text-white/50">• Prezzo bloccato</span>
                </div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-[10%] left-[60%] w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] transition-all duration-[3000ms] ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}></div>
                <div className={`absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] transition-all duration-[4000ms] delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}></div>

                <div className={`absolute top-[15%] right-[15%] w-32 h-32 rounded-full border border-gold/20 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
                <div className={`absolute bottom-[25%] left-[20%] w-20 h-20 rounded-full border border-gold/10 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
            </div>

            {/* VIDEO DEMO MODAL */}
            {showDemo && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl p-4"
                    onClick={() => setShowDemo(false)}
                >
                    <div
                        className="relative w-full max-w-5xl bg-charcoal rounded-[2rem] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDemo(false)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-charcoal transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="aspect-video w-full">
                            <iframe
                                src={`${siteConfig.demoVideoUrl}?autoplay=1&rel=0&modestbranding=1`}
                                title="VirtualTwin Demo"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        <div className="p-6 bg-gradient-to-t from-charcoal to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-serif italic text-white">Pronto a iniziare?</h3>
                                <p className="text-white/50 text-sm">{siteConfig.trialDays} giorni gratis, nessuna carta richiesta</p>
                            </div>
                            <Link
                                href="/auth/register"
                                className="group gold-gradient px-8 py-4 rounded-full text-white text-sm font-bold flex items-center gap-3 hover:scale-105 transition-all shadow-lg"
                            >
                                Provalo Tu Stesso
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* CENTERED CONTENT */}
            <div className="max-w-5xl mx-auto w-full relative z-10 text-center mt-8">
                {/* STORYTELLING BADGE */}
                <div className={`flex items-center justify-center gap-4 mb-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gold/5 border border-gold/10 rounded-full">
                        <Sparkles className="w-3 h-3 text-gold" />
                        <span className="text-gold text-[9px] uppercase tracking-[0.4em] font-black">Per chi sogna in grande</span>
                    </div>
                </div>

                {/* HEADLINE */}
                <h1 className={`font-serif text-[3rem] md:text-[5rem] lg:text-[7rem] font-medium leading-[0.9] tracking-[-0.03em] text-charcoal mb-10 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    Il Giorno in Cui Smetti <br />
                    di <span className="italic bg-gradient-to-r from-gold via-[#E8D5A3] to-gold bg-clip-text text-transparent animate-gradient-x">Rincorrere.</span>
                </h1>

                {/* SUBTITLE */}
                <p className={`text-charcoal/50 text-lg lg:text-2xl font-serif italic leading-relaxed max-w-2xl mx-auto mb-14 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    Immagina di avere un clone digitale che <span className="text-charcoal not-italic font-medium">parla come te</span>,
                    <span className="text-charcoal not-italic font-medium"> vende come te</span>,
                    ma lavora mentre tu vivi.
                </p>

                {/* CTA BUTTONS */}
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <Link
                        href="/auth/register"
                        className="group gold-gradient px-12 py-6 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-105 transition-all duration-300 shadow-xl"
                    >
                        Inizia il Tuo Viaggio
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                        onClick={() => setShowDemo(true)}
                        className="group flex items-center justify-center gap-4 px-10 py-6 rounded-full border border-charcoal/10 text-charcoal hover:border-gold hover:text-gold transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    >
                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all">
                            <Play className="w-5 h-5 text-gold group-hover:text-white fill-gold group-hover:fill-white ml-0.5" />
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.3em] font-black">Guarda la Storia</span>
                    </button>
                </div>

                {/* TRUST BADGES */}
                <div className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    {[
                        { icon: Clock, text: "5 minuti per cambiare tutto", color: "text-emerald-600" },
                        { icon: MessageCircle, text: "Il tuo tono, la tua voce", color: "text-blue-600" },
                        { icon: Users, text: `Unisciti a ${siteConfig.stats.users} visionari`, color: "text-purple-600" },
                        { icon: Shield, text: `${siteConfig.trialDays} giorni, zero rischi`, color: "text-amber-600" },
                    ].map((badge, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-5 py-3 rounded-full border border-charcoal/5 bg-white/80 backdrop-blur-sm hover:shadow-md hover:border-gold/20 transition-all duration-300"
                        >
                            <badge.icon className={`w-4 h-4 ${badge.color}`} />
                            <span className="text-charcoal/70 text-xs font-medium">{badge.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-charcoal/30 text-[9px] uppercase tracking-[0.4em] font-bold">Scopri di più</span>
                <div className="w-6 h-10 border border-charcoal/20 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-gold rounded-full animate-scroll-bounce"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroUltimate;
