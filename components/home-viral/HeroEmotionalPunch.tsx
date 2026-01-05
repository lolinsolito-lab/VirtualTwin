"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell } from 'lucide-react';

/**
 * Hero Emotional Punch Component
 * 
 * STORYTELLING: 3AM vendita scenario - warm & outcome-focused
 * 
 * Usage: Homepage hero - emotional hook for cold audience
 */
export default function HeroEmotionalPunch() {
    return (
        <section className="relative z-10 py-20 md:py-32 bg-gradient-to-b from-champagne/30 via-white to-champagne/20">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Timeline Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-8 mb-12"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2 shadow-xl">
                                <Moon className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-sm font-mono text-charcoal/60">03:00 AM</p>
                        </div>

                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="flex-1 h-0.5 bg-gradient-to-r from-purple-400 via-gold to-amber-400"
                        />

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-gold flex items-center justify-center mb-2 shadow-xl animate-pulse">
                                <Bell className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-sm font-mono text-charcoal/60">09:00 AM</p>
                        </div>

                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                            className="flex-1 h-0.5 bg-gradient-to-r from-gold to-green-400"
                        />

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2 shadow-xl">
                                <Sun className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-sm font-mono text-charcoal/60">Risultato</p>
                        </div>
                    </motion.div>

                    {/* Main Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-8"
                    >
                        {/* Night Scene */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-purple-200">
                            <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed mb-4">
                                <strong className="text-purple-700">Ore 03:17.</strong> Mentre dormi profondamente,<br />
                                un potenziale cliente scrive su WhatsApp:
                            </p>
                            <div className="inline-block bg-white rounded-2xl px-6 py-4 shadow-lg">
                                <p className="text-charcoal/60 italic">"Ciao, mi mandi info sul servizio?"</p>
                            </div>
                        </div>

                        {/* Action Scene */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 border-2 border-gold/40">
                            <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed mb-4">
                                <strong className="text-gold">Il tuo gemello digitale</strong> (non un bot, ma <em>la versione di te</em> che non dorme)<br />
                                risponde in <strong>2 secondi</strong>.
                            </p>
                            <p className="text-charcoal/70 leading-relaxed">
                                Qualifica il lead. Risponde alle domande.<br />
                                Manda il link al pagamento.<br />
                                <strong className="text-gold">Chiude la vendita.</strong>
                            </p>
                        </div>

                        {/* Result Scene */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-400">
                            <p className="text-lg md:text-xl text-charcoal/80 leading-relaxed mb-4">
                                <strong className="text-green-700">Ore 09:00.</strong> Ti svegli.<br />
                                Notifica sul telefono:
                            </p>
                            <div className="inline-block bg-green-600 text-white rounded-2xl px-8 py-4 shadow-xl font-bold text-xl">
                                ✅ Nuova vendita completata: +€347
                            </div>
                            <p className="text-charcoal/60 mt-4 text-sm italic">
                                Tu hai dormito. Lui ha venduto.
                            </p>
                        </div>

                        {/* Punch Line */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="pt-8"
                        >
                            <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6 leading-tight">
                                Uno di Te <span className="text-gold italic">Vive.</span><br />
                                L'Altro <span className="text-gold italic">Vende 24/7.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed">
                                Non è fantascienza. È VirtualTwin.<br />
                                <strong className="text-charcoal">La tua voce. Il tuo modo di vendere. Moltiplicato per infinito.</strong>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
