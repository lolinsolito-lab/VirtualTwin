"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Calendar, Lock, ArrowUpRight } from 'lucide-react';

/**
 * Future Pricing Warning - ELEGANT URGENCY DESIGN
 * 
 * Shows 2027 price projections with visual urgency
 */
export default function FuturePricingWarning() {
    const futurePrices = [
        {
            name: "Entrepreneur",
            current: 147,
            future: "697-797",
            increase: "4.8x",
            savings: "€6.600/anno"
        },
        {
            name: "Conquistatore",
            current: 347,
            future: "1.197-1.397",
            increase: "3.5x",
            savings: "€10.200/anno"
        },
        {
            name: "Imperatore",
            current: 697,
            future: "1.997-2.197",
            increase: "2.9x",
            savings: "€15.600/anno"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-white via-red-50/30 to-white relative overflow-hidden">
            {/* Subtle Warning Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_1px,transparent_1px,transparent_20px)]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-red-100 border border-red-200 rounded-full mb-8">
                            <Calendar className="w-4 h-4 text-red-600" />
                            <span className="text-red-700 text-[11px] uppercase tracking-[0.3em] font-black">Proiezione Luglio 2027</span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-4 tracking-tight">
                            Prezzi <span className="italic text-red-600">Pubblici</span>
                        </h2>
                        <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                            Senza tariffa Founder, ecco cosa pagherai nel 2027.
                        </p>
                    </motion.div>

                    {/* Price Comparison Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {futurePrices.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative bg-white rounded-3xl border border-red-200 p-8 shadow-xl overflow-hidden group hover:border-red-400 transition-all"
                            >
                                {/* Increase Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-100 rounded-full">
                                    <span className="text-red-700 text-sm font-black">{plan.increase}</span>
                                </div>

                                {/* Plan Name */}
                                <h3 className="font-serif text-2xl italic text-charcoal mb-6">
                                    {plan.name}
                                </h3>

                                {/* Price Comparison */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-charcoal/40 text-sm">Prezzo Founder</span>
                                        <span className="text-emerald-600 font-bold line-through opacity-60">€{plan.current}/m</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-red-600 text-sm font-bold">Prezzo 2027</span>
                                        <span className="text-3xl font-serif text-red-700 font-bold">€{plan.future}<span className="text-lg">/m</span></span>
                                    </div>
                                </div>

                                {/* Visual Bar */}
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.min(parseFloat(plan.increase) * 18, 100)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5, duration: 1 }}
                                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                                    />
                                </div>

                                {/* Savings */}
                                <div className="text-center p-3 bg-red-50 rounded-xl">
                                    <p className="text-red-600 text-sm">
                                        Risparmi <strong className="text-red-700">{plan.savings}</strong> bloccando ora
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Warning Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
                    >
                        {/* Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite]" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-serif italic mb-2">
                                        Pagherai 3-5x di più.
                                    </h3>
                                    <p className="text-white/70 max-w-lg">
                                        I prezzi pubblici aumentano ogni 6 mesi. Chi entra oggi blocca la tariffa Founder <strong className="text-white">per sempre</strong>.
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-white text-red-600 rounded-full font-black uppercase tracking-widest text-sm shadow-xl hover:bg-red-50 transition-all"
                            >
                                Blocca Ora
                                <ArrowUpRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Disclaimer */}
                    <p className="text-center mt-8 text-charcoal/30 text-sm italic">
                        *I prezzi pubblici aumentano ogni 6 mesi e non sono mai bloccati. Solo i Founder mantengono la tariffa iniziale.
                    </p>
                </div>
            </div>
        </section>
    );
}
