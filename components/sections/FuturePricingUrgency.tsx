"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, ArrowUpRight } from 'lucide-react';

export default function FuturePricingUrgency() {
    const futurePrices = [
        { name: "Entrepreneur", current: "€147", future: "€697-797", increase: "4.8x" },
        { name: "Conquistatore", current: "€347", future: "€1.197-1.397", increase: "3.5x" },
        { name: "Imperatore", current: "€697", future: "€1.997-2.197", increase: "2.9x" }
    ];

    return (
        <div className="mt-16 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/40 backdrop-blur-xl border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                            <div className="flex items-center gap-2 text-red-600 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-[0.3em]">Proiezione Luglio 2027</span>
                            </div>
                            <h3 className="font-serif text-3xl md:text-4xl text-charcoal">
                                📅 Prezzi <span className="italic text-red-600">Pubblici</span>
                            </h3>
                        </div>
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-red-700 text-[10px] uppercase font-black tracking-widest">Nessun lock-in</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        {futurePrices.map((plan, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-charcoal/5 group hover:border-red-500/30 transition-all duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                                    <span className="font-serif text-xl text-charcoal/80">{plan.name}</span>
                                </div>
                                <div className="flex items-center gap-6 text-right">
                                    <div className="hidden md:block">
                                        <p className="text-[8px] uppercase font-black text-charcoal/30 tracking-widest">Prezzo Oggi</p>
                                        <p className="text-charcoal/40 line-through font-medium">{plan.current}/m</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[8px] uppercase font-black text-red-600 tracking-widest">Prezzo 2027</p>
                                        <p className="text-2xl font-serif text-charcoal font-bold">{plan.future}<span className="text-sm">/m</span></p>
                                    </div>
                                    <div className="w-16 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                        <span className="text-red-700 text-[10px] font-black">{plan.increase}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="flex items-start gap-4 p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
                            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            <p className="text-sm text-red-900/70 leading-relaxed italic">
                                ⚠️ <strong className="text-red-600">Pagherai 3-5x di più</strong> se aspetti i prezzi pubblici. Chi entra oggi blocca la tariffa per sempre.
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-charcoal/50 text-xs italic mb-2">
                                *I prezzi pubblici aumentano ogni 6 mesi e non sono mai bloccati.
                            </p>
                            <div className="inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px]">
                                Blocca il prezzo ora <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] animate-[shine_6s_ease-in-out_infinite]" />
            </motion.div>
        </div>
    );
}
