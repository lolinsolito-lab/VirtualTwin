"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, TrendingUp, Clock } from 'lucide-react';

/**
 * Today Tomorrow Stories Component - LUXURY EDITION
 * 
 * ELITE DESIGN: Sophisticated before/after scenarios with elegant palette
 * 
 * Usage: Homepage transformation section - relatable pain → solution stories
 */
export default function TodayTomorrowStories() {
    const stories = [
        {
            title: "Il Sabato Sera Perso",
            icon: "🍽️",
            today: {
                time: "Sabato 22:00",
                scene: "Cena con la famiglia. Il telefono vibra.",
                message: "'Mi mandi info?'",
                dilemma: "Scelta impossibile: ignori il cliente o rovini la serata?",
                result: "Cliente perso o serata rovinata.",
                emotion: "Frustrazione"
            },
            tomorrow: {
                time: "Sabato 22:00",
                scene: "Cena con la famiglia. Il telefono vibra.",
                action: "Il tuo gemello digitale risponde, qualifica, invia preventivo.",
                result: "Tu godi la serata. Lui lavora. Notifica mattina: +€347 vendita notturna.",
                emotion: "Libertà"
            }
        },
        {
            title: "Le 3 di Notte",
            icon: "🌙",
            today: {
                time: "Domenica 03:00 AM",
                scene: "Lead motivato scrive mentre tu dormi.",
                message: "Aspetta la tua risposta...",
                dilemma: "Alle 11:00 rispondi. Troppo tardi.",
                result: "Il competitor ha già risposto alle 03:05. Vendita persa.",
                emotion: "Opportunità bruciata"
            },
            tomorrow: {
                time: "Domenica 03:00 AM",
                scene: "Lead motivato scrive.",
                action: "Il tuo gemello risponde in 2 secondi. Qualifica. Manda link pagamento.",
                result: "Tu dormi tranquillo. Lui chiude. Al risveglio: +€197 vendita.",
                emotion: "Vendite mentre sogni"
            }
        },
        {
            title: "Il Lunedì Infernale",
            icon: "📱",
            today: {
                time: "Lunedì 09:00",
                scene: "20+ messaggi 'info?' accumulati nel weekend.",
                message: "3 ore per rispondere a tutti manualmente.",
                dilemma: "La metà ha già comprato altrove. L'altra metà ti ghosterà.",
                result: "15 ore/settimana buttate. Nessuna vendita.",
                emotion: "Overwhelm totale"
            },
            tomorrow: {
                time: "Lunedì 09:00",
                scene: "20+ messaggi gestiti automaticamente dal gemello.",
                action: "80% qualificati. 12 call fissate. Solo lead caldi ti aspettano.",
                result: "Lavori SUL business, non NEL business. 15h/settimana recuperate.",
                emotion: "Controllo e focus"
            }
        },
        {
            title: "Il 'Mi Penso' Eterno",
            icon: "💭",
            today: {
                time: "Martedì pomeriggio",
                scene: "Cliente: 'Mi mandi info?'",
                message: "Spieghi tutto per 10 minuti. Copy-paste FAQ.",
                dilemma: "'Ci penso, ti faccio sapere.' Ghost mode attivato.",
                result: "Tempo sprecato. Zero vendite. Frustrazione.",
                emotion: "Tempo divorato"
            },
            tomorrow: {
                time: "Martedì pomeriggio",
                scene: "Cliente: 'Mi mandi info?'",
                action: "Gemello: FAQ personalizzate, pricing, case study, testimonianze in 2 minuti.",
                result: "Cliente: 'Perfetto, procedo!' Tu intervieni solo per chiudere deal caldi.",
                emotion: "Efficienza pura"
            }
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-champagne/10 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            La Tua Giornata <span className="text-gold italic">Trasformata</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                            Non sono promesse. Sono scenari reali che vivono <strong className="text-charcoal">500+ professionisti</strong> ogni giorno.
                        </p>
                    </motion.div>

                    {/* Story Cards - LUXURY GRID */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {stories.map((story, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-charcoal/10 hover:shadow-2xl transition-all"
                            >
                                {/* Story Title - LUXURY HEADER */}
                                <div className="bg-gradient-to-r from-charcoal to-charcoal/90 px-8 py-6 relative overflow-hidden">
                                    {/* Subtle gold accent */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />

                                    <div className="flex items-center gap-4 relative z-10">
                                        <span className="text-5xl opacity-80">{story.icon}</span>
                                        <div>
                                            <h3 className="text-2xl font-serif text-white font-bold">
                                                {story.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* TODAY (Problem) - Subtle red accents */}
                                <div className="p-8 bg-gradient-to-br from-red-50/50 to-rose-50/30 border-b-2 border-red-200/40">
                                    <div className="flex items-start gap-3 mb-4">
                                        <X className="w-6 h-6 text-red-700 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h4 className="text-sm uppercase font-black text-red-800 tracking-wider mb-2">
                                                OGGI (senza gemello)
                                            </h4>
                                            <p className="text-charcoal/80 font-medium mb-2">
                                                <Clock className="w-4 h-4 inline mr-2 text-red-600" />
                                                {story.today.time}
                                            </p>
                                            <p className="text-charcoal/70 leading-relaxed mb-3">
                                                {story.today.scene}
                                            </p>
                                            <div className="bg-white/80 rounded-xl p-3 mb-3 border-l-4 border-red-400/60 shadow-sm">
                                                <p className="text-charcoal/60 italic text-sm">
                                                    {story.today.message}
                                                </p>
                                            </div>
                                            <p className="text-charcoal/70 leading-relaxed mb-3">
                                                {story.today.dilemma}
                                            </p>
                                            <p className="text-red-800 font-bold">
                                                → {story.today.result}
                                            </p>
                                            <p className="text-red-600 text-sm italic mt-2">
                                                Emozione: {story.today.emotion}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* TOMORROW (Solution) - Subtle green accents */}
                                <div className="p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
                                    <div className="flex items-start gap-3">
                                        <Check className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h4 className="text-sm uppercase font-black text-green-800 tracking-wider mb-2">
                                                DOMANI (con il tuo gemello)
                                            </h4>
                                            <p className="text-charcoal/80 font-medium mb-2">
                                                <TrendingUp className="w-4 h-4 inline mr-2 text-green-700" />
                                                {story.tomorrow.time}
                                            </p>
                                            <p className="text-charcoal/70 leading-relaxed mb-3">
                                                {story.tomorrow.scene}
                                            </p>
                                            <p className="text-charcoal/70 leading-relaxed mb-3">
                                                <strong className="text-green-800">Il gemello:</strong> {story.tomorrow.action}
                                            </p>
                                            <p className="text-green-800 font-bold">
                                                → {story.tomorrow.result}
                                            </p>
                                            <p className="text-green-700 text-sm italic mt-2">
                                                Emozione: {story.tomorrow.emotion}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Source Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-12"
                    >
                        <p className="text-charcoal/50 text-sm italic">
                            📊 Dati basati su oltre <strong className="text-gold">500+ professionisti</strong> che usano VirtualTwin
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

