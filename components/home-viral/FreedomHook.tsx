"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface CountdownState {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState<CountdownState>({
        days: 21,
        hours: 9,
        minutes: 49,
        seconds: 10
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ label, value }: { label: string; value: number }) => (
        <div className="flex flex-col items-center">
            <div
                suppressHydrationWarning
                className="text-2xl md:text-3xl font-serif text-charcoal tabular-nums"
            >
                {value.toString().padStart(2, '0')}
            </div>
            <div className="text-[7px] md:text-[8px] uppercase tracking-widest text-charcoal/40 font-black mt-1">
                {label}
            </div>
        </div>
    );

    return (
        <div className="inline-flex items-center gap-4 md:gap-8 px-8 md:px-12 py-4 md:py-6 bg-gold/5 border border-gold/10 rounded-2xl md:rounded-[2rem] backdrop-blur-sm self-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-gold/60" />
            <div className="flex items-center gap-3 md:gap-6">
                <TimeUnit label="Days" value={timeLeft.days} />
                <span className="text-gold/30 font-serif text-xl border-none">:</span>
                <TimeUnit label="Hours" value={timeLeft.hours} />
                <span className="text-gold/30 font-serif text-xl border-none">:</span>
                <TimeUnit label="Min" value={timeLeft.minutes} />
                <span className="text-gold/30 font-serif text-xl border-none">:</span>
                <TimeUnit label="Sec" value={timeLeft.seconds} />
            </div>
        </div>
    );
};

export default function FreedomHook() {
    const scrollToPricing = () => {
        const element = document.getElementById('pricing');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden bg-champagne">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16 md:mb-24">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/5 border border-gold/10 mb-8"
                    >
                        <Sparkles className="w-3 h-3 text-gold" />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-black">La Tua Scelta</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif text-charcoal tracking-tight mb-8 leading-[1.1]"
                    >
                        Quanto Vale la Tua{' '}
                        <span className="text-gold italic">Libertà</span>?
                    </motion.h1>

                    {/* Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-sm md:text-lg text-charcoal/50 font-medium tracking-wide max-w-2xl mb-12"
                    >
                        14 giorni per provare. Nessuna carta richiesta.{' '}
                        <span className="text-charcoal font-bold">Zero rischi.</span>
                    </motion.p>

                    {/* Countdown */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <CountdownTimer />
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="pt-8"
                    >
                        <button
                            onClick={() => {
                                const pricing = document.getElementById('pricing');
                                pricing?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group relative inline-flex flex-col items-center px-12 py-5 bg-charcoal text-white rounded-2xl font-black text-lg md:text-xl uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Attiva Ora la Tua Libertà
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-[10px] text-gold/60 mt-1 lowercase tracking-wider font-medium font-sans relative z-10">
                                Scopri i piani · Zero rischi
                            </span>

                            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        </button>

                        <p className="mt-4 text-charcoal/30 text-[10px] uppercase tracking-[0.2em] font-bold">
                            Disponibilità limitata per la Genesis Wave
                        </p>
                    </motion.div>
                </div>

                {/* Visual Comparison Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto">
                    {/* Cons: Traditional Stress */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group relative"
                    >
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-charcoal/10 shadow-luxury overflow-hidden">
                            <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                            <img
                                src="/traditional_stress_cons.png"
                                alt="Lo Stress Tradizionale"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                            />

                            {/* Overlay labels */}
                            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/30 w-fit">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-[10px] uppercase tracking-widest text-white font-black">Metodo Tradizionale</span>
                                </div>
                                <p className="text-white text-lg font-serif italic drop-shadow-lg">Gestione manuale, stress costante, lead persi.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pros: Sovereign Freedom */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group relative"
                    >
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-gold/30 shadow-luxury-gold overflow-hidden">
                            <div className="absolute inset-0 bg-gold/5 group-hover:bg-transparent transition-colors duration-700 z-10" />
                            <img
                                src="/sovereign_freedom_pros.png"
                                alt="La Libertà Sovereign"
                                className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
                            />

                            {/* Overlay labels */}
                            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3 text-right items-end">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gold/80 backdrop-blur-md rounded-xl border border-white/30 w-fit">
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                    <span className="text-[10px] uppercase tracking-widest text-white font-black">Vicolo Sovereign</span>
                                </div>
                                <p className="text-white text-lg font-serif italic drop-shadow-lg">Autonomia totale, crescita costante, libertà reale.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mt-20"
                >
                    <button
                        onClick={scrollToPricing}
                        className="group flex items-center gap-4 px-10 py-6 bg-charcoal text-white rounded-full hover:bg-gold transition-all duration-700 shadow-luxury"
                    >
                        <span className="text-[11px] uppercase tracking-[0.3em] font-black">Scegli la Tua Libertà</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <p className="mt-6 text-[10px] text-charcoal/30 uppercase tracking-[0.2em] font-bold italic">Unisciti a 847+ Founder che hanno già scelto.</p>
                </motion.div>
            </div>
        </section>
    );
}
