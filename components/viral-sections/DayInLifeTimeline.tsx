"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, Calendar, Moon } from 'lucide-react';

/**
 * Day in Life Timeline Component
 * 
 * VIRAL-READY: Each time slot = 1 Instagram Story frame
 * 
 * Usage: Perfect for "day transformation" content, B-roll videos, Stories sequence
 */
export default function DayInLifeTimeline() {
    const timeSlots = [
        {
            time: "8:00",
            icon: Clock,
            title: "Sveglia Senza Stress",
            description: "Ti svegli e trovi 3 conversazioni già chiuse dal Clone e 2 appuntamenti fissati in calendario.",
            color: "from-amber-500 to-yellow-500",
            bg: "bg-amber-50",
            border: "border-amber-200"
        },
        {
            time: "14:00",
            icon: MessageSquare,
            title: "Focus Sul Business",
            description: "Mentre sei in call strategica, il Clone risponde alle obiezioni su prezzo e invia il link al checkout.",
            color: "from-blue-500 to-indigo-500",
            bg: "bg-blue-50",
            border: "border-blue-200"
        },
        {
            time: "19:00",
            icon: Calendar,
            title: "Cena con la Famiglia",
            description: "Nessun telefono a tavola. Il Clone continua a qualificare i lead e fissare appuntamenti per domani.",
            color: "from-green-500 to-emerald-500",
            bg: "bg-green-50",
            border: "border-green-200"
        },
        {
            time: "23:00",
            icon: Moon,
            title: "Mentre Dormi, Lui Vende",
            description: "Arriva un DM: 'mi mandi info?'. Il Clone risponde, qualifica, manda preventivo. Tu scopri la vendita domattina.",
            color: "from-purple-500 to-violet-500",
            bg: "bg-purple-50",
            border: "border-purple-200"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-champagne/20 via-white to-champagne/20">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                            Un Giorno <span className="text-gold italic">con il Tuo Clone</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
                            Mentre i tuoi competitor perdono 3-5 ore in chat, tu vivi la tua vita. Ecco come cambia una giornata tipo.
                        </p>
                    </motion.div>

                    {/* Timeline - PERFECT FOR STORIES SEQUENCE */}
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-amber-400 to-gold opacity-30"></div>

                        {/* Time Slots */}
                        <div className="space-y-12">
                            {timeSlots.map((slot, index) => (
                                <motion.div
                                    key={slot.time}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Time Badge */}
                                    <div className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${slot.color} flex items-center justify-center shadow-xl relative z-10`}>
                                        <div className="text-center">
                                            <slot.icon className="w-8 h-8 text-white mx-auto mb-1" />
                                            <p className="text-white font-black text-sm">{slot.time}</p>
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`flex-1 ${slot.bg} border-2 ${slot.border} rounded-2xl p-6 shadow-lg`}>
                                        <h3 className="text-xl font-serif text-charcoal mb-2 font-bold">{slot.title}</h3>
                                        <p className="text-charcoal/70 leading-relaxed">
                                            {slot.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Script Note for Video */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="text-center mt-16 p-6 bg-gold/10 border-2 border-gold/20 rounded-2xl"
                    >
                        <p className="text-charcoal/80 font-medium">
                            💡 <strong className="text-gold">Script Reel:</strong> "Oggi ti mostro la mia giornata tipo da quando ho il Clone AI..."
                        </p>
                        <p className="text-charcoal/60 text-sm mt-2 italic">
                            Ogni orario = frame video con screenshot simulato
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
