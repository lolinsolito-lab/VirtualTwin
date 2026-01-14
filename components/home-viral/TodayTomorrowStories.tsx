"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Clock, Moon, TrendingUp, Check, ArrowRight } from 'lucide-react';

/**
 * Today Tomorrow Stories Component - AUTO-ANIMATED EDITION
 * 
 * DESIGN: Cards auto-animate between "today" and "tomorrow" states
 * No user interaction required - perfect for mobile
 */
export default function TodayTomorrowStories() {
    const [activeStates, setActiveStates] = useState<boolean[]>([false, false, false, false]);

    // Auto-animate each card with staggered timing
    useEffect(() => {
        const intervals = [
            setInterval(() => setActiveStates(prev => [!prev[0], prev[1], prev[2], prev[3]]), 4000),
            setInterval(() => setActiveStates(prev => [prev[0], !prev[1], prev[2], prev[3]]), 4000),
            setInterval(() => setActiveStates(prev => [prev[0], prev[1], !prev[2], prev[3]]), 4000),
            setInterval(() => setActiveStates(prev => [prev[0], prev[1], prev[2], !prev[3]]), 4000),
        ];

        // Stagger the start times
        setTimeout(() => intervals[1], 1000);
        setTimeout(() => intervals[2], 2000);
        setTimeout(() => intervals[3], 3000);

        return () => intervals.forEach(clearInterval);
    }, []);

    const stories = [
        {
            title: "L'Erosione della Vita",
            icon: Clock,
            gradient: "from-rose-500 via-red-500 to-orange-500",
            bgGlow: "bg-rose-500/20",
            today: {
                label: "OGGI",
                scene: "Cena con la famiglia. Una notifica interrompe tutto.",
                result: "Presenza distrutta."
            },
            tomorrow: {
                label: "CON VIRTUALTWIN",
                scene: "Il telefono è silenzioso. Il Clone risponde per te.",
                result: "Il tuo tempo è sacro."
            }
        },
        {
            title: "Il Limite Biologico",
            icon: Moon,
            gradient: "from-indigo-500 via-purple-500 to-violet-500",
            bgGlow: "bg-indigo-500/20",
            today: {
                label: "OGGI",
                scene: "Alle 3 di notte un cliente cerca aiuto. Tu dormi.",
                result: "Lead perso per sempre."
            },
            tomorrow: {
                label: "CON VIRTUALTWIN",
                scene: "Il Clone risponde alle 3AM con il tuo stile.",
                result: "Ti svegli con un nuovo cliente."
            }
        },
        {
            title: "Saturazione Cognitiva",
            icon: TrendingUp,
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            bgGlow: "bg-emerald-500/20",
            today: {
                label: "OGGI",
                scene: "20+ messaggi ogni mattina. Rispondi uno a uno.",
                result: "3 ore bruciate. Zero creatività."
            },
            tomorrow: {
                label: "CON VIRTUALTWIN",
                scene: "Il Clone ha già filtrato, risposto e qualificato.",
                result: "15 ore/settimana recuperate."
            }
        },
        {
            title: "Il Deserto del Follow-up",
            icon: Check,
            gradient: "from-amber-500 via-orange-500 to-yellow-500",
            bgGlow: "bg-amber-500/20",
            today: {
                label: "OGGI",
                scene: "Spendi 15 minuti a spiegare. 'Ci penso.'",
                result: "Mai più sentito."
            },
            tomorrow: {
                label: "CON VIRTUALTWIN",
                scene: "Il Clone educa, gestisce obiezioni, converte.",
                result: "Tu intervieni solo per il brindisi."
            }
        }
    ];

    return (
        <section className="relative z-10 py-24 bg-gradient-to-b from-charcoal via-charcoal to-black overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">La Trasformazione</span>
                        </span>
                        <h2 className="font-serif text-5xl md:text-8xl text-white mb-6 leading-[0.9] tracking-tight">
                            Prima e <span className="italic text-gold">Dopo.</span>
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto">
                            Guarda come cambia tutto con il tuo Clone AI.
                        </p>
                    </motion.div>

                    {/* Cards Grid - 2x2 */}
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {stories.map((story, index) => {
                            const Icon = story.icon;
                            const isActive = activeStates[index];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setActiveStates(prev => {
                                        const newStates = [...prev];
                                        newStates[index] = !newStates[index];
                                        return newStates;
                                    })}
                                    className="relative group cursor-pointer"
                                >
                                    {/* Card Container */}
                                    <div className={`relative h-[340px] md:h-[380px] rounded-3xl overflow-hidden transition-all duration-700 ${isActive ? 'scale-[1.02] shadow-2xl' : 'scale-100'
                                        }`}>

                                        {/* Background Glow */}
                                        <div className={`absolute -inset-2 ${story.bgGlow} rounded-3xl blur-2xl transition-opacity duration-700 ${isActive ? 'opacity-60' : 'opacity-20'
                                            }`} />

                                        {/* Main Card */}
                                        <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">

                                            {/* Gradient Top Bar */}
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${story.gradient}`} />

                                            {/* Content */}
                                            <div className="relative h-full p-8 md:p-10 flex flex-col">
                                                {/* Header */}
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center shadow-lg`}>
                                                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                                    </div>
                                                    <h3 className="text-xl md:text-2xl font-serif text-white italic">
                                                        {story.title}
                                                    </h3>
                                                </div>

                                                {/* Before/After Content with Animation */}
                                                <div className="flex-1 relative">
                                                    {/* TODAY State */}
                                                    <motion.div
                                                        animate={{
                                                            opacity: isActive ? 0 : 1,
                                                            y: isActive ? -20 : 0,
                                                            scale: isActive ? 0.95 : 1
                                                        }}
                                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                                        className="absolute inset-0"
                                                    >
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <X className="w-4 h-4 text-red-400" />
                                                            <span className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-black">
                                                                {story.today.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-base md:text-lg text-white/60 leading-relaxed mb-4">
                                                            {story.today.scene}
                                                        </p>
                                                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                                            <p className="text-red-400 font-serif text-lg italic">
                                                                → {story.today.result}
                                                            </p>
                                                        </div>
                                                    </motion.div>

                                                    {/* TOMORROW State */}
                                                    <motion.div
                                                        animate={{
                                                            opacity: isActive ? 1 : 0,
                                                            y: isActive ? 0 : 20,
                                                            scale: isActive ? 1 : 0.95
                                                        }}
                                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                                        className="absolute inset-0"
                                                    >
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Sparkles className="w-4 h-4 text-gold" />
                                                            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-black">
                                                                {story.tomorrow.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-base md:text-lg text-white leading-relaxed mb-4">
                                                            {story.tomorrow.scene}
                                                        </p>
                                                        <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30">
                                                            <p className="text-gold font-serif text-xl italic font-medium">
                                                                → {story.tomorrow.result}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                {/* State Indicator */}
                                                <div className="flex items-center justify-center gap-2 mt-4">
                                                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${!isActive ? 'bg-red-400 scale-100' : 'bg-white/20 scale-75'}`} />
                                                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-gold scale-100' : 'bg-white/20 scale-75'}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <p className="text-white/30 text-sm italic mb-6">
                            "La tecnologia perfetta scompare. Resta solo la libertà."
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gold to-amber-500 text-charcoal rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:shadow-gold/30 transition-all"
                        >
                            Inizia la Trasformazione
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
