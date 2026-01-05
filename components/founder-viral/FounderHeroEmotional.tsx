"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingDown, Zap } from 'lucide-react';

/**
 * Founder Hero Emotional Component
 * 
 * ELITE: Emotional headline with privilege messaging
 * 
 * Usage: /founder top section - scarcity + savings amplification
 */

interface FounderHeroEmotionalProps {
    spotsLeft: number;
    totalSpots: number;
    isBeforeLaunch?: boolean;
}

export default function FounderHeroEmotional({ spotsLeft, totalSpots, isBeforeLaunch = false }: FounderHeroEmotionalProps) {
    const savings5Years = 12000; // Genesis €697 vs Public €1997 = €1300/mo * 12 * 5 = €78K vs €119K

    return (
        <section className="relative py-16 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] bg-gold/3 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Crown Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center shadow-2xl">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-white mb-6"
                    >
                        Solo <span className="text-gold italic">{totalSpots} Persone</span><br />
                        nel Mondo Avranno<br />
                        <span className="bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent">
                            Questo Privilegio.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/90 font-serif italic mb-4"
                    >
                        Per sempre.
                    </motion.p>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Non è un piano. È un <strong className="text-gold">impero</strong>.<br />
                        Costruito mentre dormi, venduto a prezzo bloccato, tuo per l&apos;eternità.
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto"
                    >
                        {/* Spots Remaining */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                            <div className="flex flex-col items-center">
                                <Zap className="w-6 h-6 text-gold mb-2" />
                                <div className="text-4xl font-bold text-gold mb-1">
                                    {isBeforeLaunch ? totalSpots : spotsLeft}
                                </div>
                                <div className="text-white/40 text-[10px] uppercase tracking-widest font-black">
                                    {isBeforeLaunch ? 'Spots Totali' : `Posti Rimasti su ${totalSpots}`}
                                </div>
                            </div>
                        </div>

                        {/* Savings */}
                        <div className="bg-gradient-to-br from-gold/10 to-amber-500/10 backdrop-blur-md border border-gold/20 rounded-2xl p-6 md:scale-105 shadow-2xl">
                            <div className="flex flex-col items-center">
                                <TrendingDown className="w-6 h-6 text-gold mb-2" />
                                <div className="text-4xl font-bold text-gold mb-1">
                                    €{savings5Years.toLocaleString()}
                                </div>
                                <div className="text-white/80 text-[10px] uppercase tracking-widest font-black">
                                    Risparmiati in 5 Anni
                                </div>
                            </div>
                        </div>

                        {/* Price Locked */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-6">
                            <div className="flex flex-col items-center">
                                <Crown className="w-6 h-6 text-gold mb-2" />
                                <div className="text-4xl font-bold text-gold mb-1">
                                    ∞
                                </div>
                                <div className="text-white/40 text-[10px] uppercase tracking-widest font-black">
                                    Prezzo Bloccato Per Sempre
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Warning Message */}
                    {!isBeforeLaunch && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-12 bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-2xl mx-auto"
                        >
                            <p className="text-red-400 text-lg">
                                ⚠️ <strong>Attenzione:</strong> Una volta esauriti i {totalSpots} posti Founder,<br />
                                il prezzo sale a <span className="text-red-300 font-bold">€1,997/mese</span>. Per sempre.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
