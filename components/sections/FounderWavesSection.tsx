"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Rocket, Diamond, ArrowRight, Clock } from 'lucide-react';
import { getCurrentWaveSpotsRemaining, getFoundersSold } from '@/lib/waves';

/**
 * Founder Waves Section - ELEGANT TIMELINE DESIGN
 * 
 * Beautiful visual timeline showing the 3 Founder Waves with progression
 */
export default function FounderWavesSection() {
    const [spotsRemaining, setSpotsRemaining] = useState(20);
    const [activeWave, setActiveWave] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const spots = await getCurrentWaveSpotsRemaining();
                setSpotsRemaining(spots);
            } catch (e) {
                console.log('Using default spots');
            }
        };
        fetchData();
    }, []);

    const waves = [
        {
            name: "Genesis Wave",
            emoji: "🌱",
            icon: Sparkles,
            status: "Ora Disponibile",
            period: "Gen-Giu 2026",
            spots: "1-20",
            color: "from-emerald-500 to-green-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-400",
            textColor: "text-emerald-700",
            prices: { entrepreneur: 147, conquistatore: 347, imperatore: 697 },
            isActive: true
        },
        {
            name: "Pioneer Wave",
            emoji: "🚀",
            icon: Rocket,
            status: "+34%",
            period: "Lug-Dic 2026",
            spots: "21-40",
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-300",
            textColor: "text-blue-700",
            prices: { entrepreneur: 197, conquistatore: 447, imperatore: 897 },
            isActive: false
        },
        {
            name: "Elite Wave",
            emoji: "💎",
            icon: Diamond,
            status: "+68%",
            period: "Gen-Giu 2027",
            spots: "41-60",
            color: "from-purple-500 to-violet-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-300",
            textColor: "text-purple-700",
            prices: { entrepreneur: 247, conquistatore: 547, imperatore: 1097 },
            isActive: false
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-charcoal via-charcoal to-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold/10 border border-gold/20 rounded-full mb-8">
                            <Lock className="w-4 h-4 text-gold" />
                            <span className="text-gold text-[11px] uppercase tracking-[0.4em] font-black">Prezzo Bloccato a Vita</span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-7xl text-white mb-6 tracking-tight">
                            Founder <span className="italic text-gold">Waves</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Chi entra prima paga meno. <strong className="text-white/80">Per sempre.</strong>
                        </p>

                        {/* Spots Counter */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full"
                        >
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-400 font-bold">
                                {spotsRemaining} posti Genesis Wave disponibili
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Waves Timeline */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {waves.map((wave, index) => {
                            const Icon = wave.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    onMouseEnter={() => setActiveWave(index)}
                                    className={`relative group cursor-pointer ${!wave.isActive ? 'opacity-70 hover:opacity-100' : ''} transition-all duration-500`}
                                >
                                    {/* Glow Effect */}
                                    {wave.isActive && (
                                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl" />
                                    )}

                                    {/* Card */}
                                    <div className={`relative h-full ${wave.bgColor} ${wave.borderColor} border-2 rounded-3xl p-8 ${wave.isActive ? 'shadow-2xl' : ''}`}>
                                        {/* Status Badge */}
                                        {wave.isActive ? (
                                            <div className="absolute -top-3 left-6 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg">
                                                <Clock className="w-3 h-3" />
                                                {wave.status}
                                            </div>
                                        ) : (
                                            <div className={`absolute -top-3 left-6 px-4 py-1.5 ${wave.textColor} bg-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md`}>
                                                {wave.status} vs Genesis
                                            </div>
                                        )}

                                        {/* Header */}
                                        <div className="flex items-center gap-4 mt-4 mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${wave.color} flex items-center justify-center shadow-lg`}>
                                                <span className="text-2xl">{wave.emoji}</span>
                                            </div>
                                            <div>
                                                <h3 className={`text-2xl font-serif italic ${wave.textColor}`}>
                                                    {wave.name}
                                                </h3>
                                                <p className={`text-sm ${wave.textColor} opacity-60`}>
                                                    Spot {wave.spots} • {wave.period}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Prices */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60">
                                                <span className="text-charcoal/60">Entrepreneur</span>
                                                <span className={`font-bold text-lg ${wave.textColor}`}>€{wave.prices.entrepreneur}/m</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60">
                                                <span className="text-charcoal/60">Conquistatore</span>
                                                <span className={`font-bold text-lg ${wave.textColor}`}>€{wave.prices.conquistatore}/m</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60">
                                                <span className="text-charcoal/60">Imperatore</span>
                                                <span className={`font-bold text-lg ${wave.textColor}`}>€{wave.prices.imperatore}/m</span>
                                            </div>
                                        </div>

                                        {/* Lock Icon for future waves */}
                                        {!wave.isActive && (
                                            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-charcoal/30" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <motion.a
                            href="/founder"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gold to-amber-500 text-charcoal rounded-full font-black uppercase tracking-widest text-sm shadow-2xl hover:shadow-gold/40 transition-all"
                        >
                            Blocca il Tuo Prezzo
                            <ArrowRight className="w-5 h-5" />
                        </motion.a>
                        <p className="mt-6 text-white/30 text-sm italic">
                            "Il prezzo di oggi è il prezzo di sempre. Nessun aumento. Mai."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
