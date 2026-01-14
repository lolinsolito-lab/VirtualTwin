"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Shield, Headphones, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Pricing Final CTA - ELEGANT CLOSING SECTION
 * 
 * Final push with savings highlight and trust badges
 */
export default function PricingFinalCTA() {
    const trustBadges = [
        { icon: Gift, text: "Cancella quando vuoi", color: "text-emerald-600" },
        { icon: Shield, text: "Nessun costo nascosto", color: "text-blue-600" },
        { icon: Headphones, text: "Supporto italiano", color: "text-purple-600" }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white to-champagne/10">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Main CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 via-amber-500/20 to-gold/20 rounded-[3rem] blur-2xl" />

                        {/* Card */}
                        <div className="relative bg-gradient-to-r from-charcoal via-charcoal to-gray-900 rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
                            {/* Grid Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
                                                      linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }} />
                            </div>

                            <div className="relative z-10 text-center">
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full mb-8"
                                >
                                    <Gift className="w-5 h-5 text-gold" />
                                    <span className="text-gold font-black uppercase tracking-wider text-sm">
                                        Risparmia fino a €78.000 in 5 anni
                                    </span>
                                </motion.div>

                                {/* Heading */}
                                <h2 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight">
                                    Entra nella <span className="italic text-gold">Genesis Wave</span><br />
                                    e blocca il prezzo per sempre.
                                </h2>

                                {/* Subheading */}
                                <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 italic">
                                    "Il costo di non agire è più alto di qualsiasi abbonamento."
                                </p>

                                {/* CTA Button */}
                                <motion.a
                                    href="/founder"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-gold via-amber-500 to-gold text-charcoal rounded-full font-black uppercase tracking-widest text-base shadow-2xl hover:shadow-gold/40 transition-all"
                                >
                                    <Sparkles className="w-6 h-6" />
                                    Diventa Founder Ora
                                    <ArrowRight className="w-6 h-6" />
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-8 mt-12"
                    >
                        {trustBadges.map((badge, index) => {
                            const Icon = badge.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 text-charcoal/60"
                                >
                                    <div className={`w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${badge.color}`} />
                                    </div>
                                    <span className="font-medium">{badge.text}</span>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
