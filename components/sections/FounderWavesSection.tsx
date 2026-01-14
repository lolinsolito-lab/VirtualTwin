"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Rocket, Diamond, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import {
    getCurrentWave,
    getCurrentWaveSpotsRemaining,
    getNextWave,
    WAVES,
    Wave
} from '@/lib/waves';

/**
 * Founder Waves Section - SMART AUTOMATIC VERSION
 * 
 * Uses lib/waves.ts for automatic wave detection and switching
 */
export default function FounderWavesSection() {
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [nextWave, setNextWave] = useState<Wave | null>(null);
    const [spotsRemaining, setSpotsRemaining] = useState(20);
    const [daysUntilClose, setDaysUntilClose] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWaveData = async () => {
            try {
                const [current, next, spots] = await Promise.all([
                    getCurrentWave(),
                    getNextWave(),
                    getCurrentWaveSpotsRemaining()
                ]);

                setCurrentWave(current);
                setNextWave(next);
                setSpotsRemaining(spots);

                // Calculate days until wave closes
                if (current) {
                    const endDate = new Date(current.endDate);
                    const now = new Date();
                    const diffTime = endDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setDaysUntilClose(Math.max(0, diffDays));
                }
            } catch (e) {
                console.log('Using default wave data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchWaveData();
    }, []);

    // Wave display configuration
    const waveConfig: Record<string, { emoji: string; color: string; bgColor: string; borderColor: string; textColor: string }> = {
        genesis: {
            emoji: "🌱",
            color: "from-emerald-500 to-green-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-400",
            textColor: "text-emerald-700"
        },
        pioneer: {
            emoji: "🚀",
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-400",
            textColor: "text-blue-700"
        },
        elite: {
            emoji: "💎",
            color: "from-purple-500 to-violet-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-400",
            textColor: "text-purple-700"
        }
    };

    // Determine urgency level
    const isUrgent = daysUntilClose <= 7;
    const isCritical = daysUntilClose <= 3;
    const spotsUrgent = spotsRemaining <= 5;

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

                        {/* SMART: Dynamic Status based on current wave */}
                        {currentWave && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className={`mt-8 inline-flex items-center gap-4 px-6 py-3 rounded-full ${isCritical
                                        ? 'bg-red-500/20 border border-red-500/40'
                                        : isUrgent || spotsUrgent
                                            ? 'bg-amber-500/20 border border-amber-500/40'
                                            : 'bg-emerald-500/10 border border-emerald-500/30'
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full animate-pulse ${isCritical ? 'bg-red-500' : isUrgent || spotsUrgent ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`} />
                                <span className={`font-bold ${isCritical ? 'text-red-400' : isUrgent || spotsUrgent ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>
                                    {isCritical
                                        ? `⚠️ Ultimi ${daysUntilClose} giorni ${currentWave.name} Wave!`
                                        : isUrgent
                                            ? `⏰ ${daysUntilClose} giorni alla chiusura`
                                            : spotsUrgent
                                                ? `🔥 Solo ${spotsRemaining} posti rimasti!`
                                                : `${spotsRemaining} posti ${currentWave.name} Wave disponibili`
                                    }
                                </span>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Waves Timeline - SMART: Auto-detects which is current */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {WAVES.map((wave, index) => {
                            const config = waveConfig[wave.id];
                            const isCurrent = currentWave?.id === wave.id;
                            const isPast = currentWave ? WAVES.findIndex(w => w.id === currentWave.id) > index : false;
                            const isFuture = currentWave ? WAVES.findIndex(w => w.id === currentWave.id) < index : true;

                            // Format period
                            const startMonth = new Date(wave.startDate).toLocaleDateString('it-IT', { month: 'short' });
                            const endMonth = new Date(wave.endDate).toLocaleDateString('it-IT', { month: 'short' });
                            const year = new Date(wave.startDate).getFullYear();

                            return (
                                <motion.div
                                    key={wave.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className={`relative group transition-all duration-500 ${isPast ? 'opacity-40 pointer-events-none' :
                                            isFuture ? 'opacity-60 hover:opacity-80' : ''
                                        }`}
                                >
                                    {/* Glow Effect for current */}
                                    {isCurrent && (
                                        <div className={`absolute -inset-2 bg-gradient-to-r ${config.color.replace('from-', 'from-').replace('to-', 'to-')}/20 rounded-3xl blur-xl`} />
                                    )}

                                    {/* Card */}
                                    <div className={`relative h-full ${config.bgColor} ${config.borderColor} border-2 rounded-3xl p-8 ${isCurrent ? 'shadow-2xl' : ''}`}>
                                        {/* Status Badge */}
                                        {isCurrent ? (
                                            <div className={`absolute -top-3 left-6 px-4 py-1.5 bg-gradient-to-r ${config.color} text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-lg`}>
                                                <Clock className="w-3 h-3" />
                                                Ora Attiva
                                            </div>
                                        ) : isPast ? (
                                            <div className="absolute -top-3 left-6 px-4 py-1.5 bg-gray-400 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                                Completata
                                            </div>
                                        ) : (
                                            <div className={`absolute -top-3 left-6 px-4 py-1.5 ${config.textColor} bg-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md`}>
                                                +{Math.round(((wave.prices.entrepreneur - WAVES[0].prices.entrepreneur) / WAVES[0].prices.entrepreneur) * 100)}% vs Genesis
                                            </div>
                                        )}

                                        {/* Header */}
                                        <div className="flex items-center gap-4 mt-4 mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
                                                <span className="text-2xl">{config.emoji}</span>
                                            </div>
                                            <div>
                                                <h3 className={`text-2xl font-serif italic ${config.textColor}`}>
                                                    {wave.name} Wave
                                                </h3>
                                                <p className={`text-sm ${config.textColor} opacity-60`}>
                                                    Spot {wave.id === 'genesis' ? '1-20' : wave.id === 'pioneer' ? '21-40' : '41-60'} • {startMonth.charAt(0).toUpperCase() + startMonth.slice(1)}-{endMonth.charAt(0).toUpperCase() + endMonth.slice(1)} {year}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Prices */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60">
                                                <span className="text-charcoal/60">Entrepreneur</span>
                                                <span className={`font-bold text-lg ${config.textColor}`}>€{wave.prices.entrepreneur}/m</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60">
                                                <span className="text-charcoal/60">Conquistatore</span>
                                                <span className={`font-bold text-lg ${config.textColor}`}>€{wave.prices.conquistatore}/m</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/60">
                                                <span className="text-charcoal/60">Imperatore</span>
                                                <span className={`font-bold text-lg ${config.textColor}`}>€{wave.prices.imperatore}/m</span>
                                            </div>
                                        </div>

                                        {/* Lock Icon for future waves */}
                                        {isFuture && (
                                            <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                                                <Lock className="w-4 h-4 text-charcoal/30" />
                                            </div>
                                        )}

                                        {/* Sold out badge for past waves */}
                                        {isPast && (
                                            <div className="absolute inset-0 bg-gray-100/50 rounded-3xl flex items-center justify-center">
                                                <span className="text-gray-500 font-bold uppercase tracking-widest text-sm">Esaurita</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Urgency Alert - Only shows when close to wave end */}
                    {currentWave && (isUrgent || spotsUrgent) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`mt-12 p-6 rounded-2xl flex items-center gap-4 ${isCritical
                                    ? 'bg-red-500/20 border border-red-500/30'
                                    : 'bg-amber-500/20 border border-amber-500/30'
                                }`}
                        >
                            <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${isCritical ? 'text-red-400' : 'text-amber-400'}`} />
                            <div>
                                <p className={`font-bold text-lg ${isCritical ? 'text-red-300' : 'text-amber-300'}`}>
                                    {isCritical
                                        ? `⚠️ La ${currentWave.name} Wave chiude tra ${daysUntilClose} giorni!`
                                        : spotsUrgent
                                            ? `🔥 Solo ${spotsRemaining} posti rimasti nella ${currentWave.name} Wave`
                                            : `⏰ ${daysUntilClose} giorni alla chiusura`
                                    }
                                </p>
                                <p className="text-white/50 text-sm">
                                    {nextWave
                                        ? `Dopo inizierà la ${nextWave.name} Wave con prezzi +${Math.round(((nextWave.prices.entrepreneur - currentWave.prices.entrepreneur) / currentWave.prices.entrepreneur) * 100)}% più alti.`
                                        : 'Questa è l\'ultima opportunità Founder.'
                                    }
                                </p>
                            </div>
                        </motion.div>
                    )}

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
