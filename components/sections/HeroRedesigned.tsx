"use client";

import React from 'react';
import Link from 'next/link';

const HeroRedesigned = () => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-champagne px-6 lg:px-12">
            {/* Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-0">
                <div className="absolute inset-0 bg-gold/5 blur-[150px] rounded-full"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-5xl mx-auto py-[20vh]">
                {/* Label */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className="h-[1px] w-12 bg-gold/40"></span>
                    <span className="text-gold text-[9px] uppercase tracking-[0.4em] font-black">
                        VirtualTwin Sovereign
                    </span>
                    <span className="h-[1px] w-12 bg-gold/40"></span>
                </div>

                {/* Main Title */}
                <h1 className="font-serif text-[3rem] md:text-[5rem] lg:text-[7rem] font-medium leading-[0.95] tracking-[-0.03em] text-charcoal mb-8">
                    Il Tuo Clone <br />
                    <span className="italic font-light gold-text-gradient">Digitale.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-charcoal/50 text-lg md:text-xl lg:text-2xl font-serif italic max-w-2xl mx-auto mb-16 leading-relaxed tracking-tight">
                    Risponde, qualifica e vende su WhatsApp, Instagram e Messenger. <br className="hidden lg:block" />
                    24 ore su 24, mentre tu ti dedichi all'eccellenza.
                </p>

                {/* Dual CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/auth/register"
                        className="gold-gradient px-12 py-5 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-luxury hover:scale-105 transition-all duration-500"
                    >
                        Inizia Gratis
                    </Link>
                    <Link
                        href="#demo"
                        className="px-12 py-5 rounded-full border border-charcoal/10 text-charcoal font-black text-[10px] uppercase tracking-[0.4em] hover:bg-charcoal hover:text-white transition-all duration-500"
                    >
                        Guarda Demo
                    </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-24 flex items-center justify-center gap-8 text-charcoal/30 text-[9px] uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        100% Italiano
                    </span>
                    <span className="hidden sm:block h-4 w-px bg-charcoal/10"></span>
                    <span>Setup in 5 min</span>
                    <span className="hidden sm:block h-4 w-px bg-charcoal/10"></span>
                    <span>7 giorni free trial</span>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-30 animate-bounce">
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold/50 to-transparent"></div>
                <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-charcoal">Scopri</span>
            </div>
        </section>
    );
};

export default HeroRedesigned;
