"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageSquare, Crown } from 'lucide-react';

export default function SocialProofBar() {
    const stats = [
        {
            value: "847+",
            label: "Founder Attivi",
            icon: Users
        },
        {
            value: "€3.4M+",
            label: "Revenue Generato",
            icon: TrendingUp
        },
        {
            value: "1.2M+",
            label: "Conversazioni Gestite",
            icon: MessageSquare
        }
    ];

    return (
        <section className="relative z-10 py-12 bg-charcoal">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center md:items-start text-center md:text-left"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                                        <stat.icon className="w-5 h-5 text-gold" />
                                    </div>
                                    <span className="text-4xl md:text-5xl font-black text-white font-serif italic tracking-tight">
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-gold/60 text-[10px] uppercase font-black tracking-[0.4em] ml-14">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40 grayscale contrast-125">
                        <span className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-black mb-4 md:mb-0">Powered by the Future:</span>
                        <div className="flex flex-wrap items-center justify-center gap-12">
                            {/* Simple text logos for now as placeholders */}
                            <span className="text-white font-serif text-xl italic opacity-80">TechElite</span>
                            <span className="text-white font-serif text-xl italic opacity-80">VisionaryCorp</span>
                            <span className="text-white font-serif text-xl italic opacity-80">InsolitaNexus</span>
                            <span className="text-white font-serif text-xl italic opacity-80">SovereignLabs</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-full bg-gold/5 blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-full bg-white/5 blur-[60px] -z-10" />
        </section>
    );
}
