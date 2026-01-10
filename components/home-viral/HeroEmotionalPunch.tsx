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

                        {/* DIGITAL TWIN VISUAL HOOK - Italian Elite Edition */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative group mt-12 mb-16"
                        >
                            <div className="absolute -inset-2 bg-gold/10 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative rounded-[2.5rem] overflow-hidden border border-gold/30 shadow-luxury-gold aspect-[4/3] md:aspect-auto">
                                <img
                                    src="/digital_twin_hologram.png"
                                    alt="VirtualTwin in Action - Milano, Roma, Firenze"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-8 left-0 right-0 px-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/80 backdrop-blur-md rounded-full border border-gold/20 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                        <span className="text-[10px] uppercase tracking-widest text-white/90 font-black">Sovereign Presence: Live 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

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

                            {/* CTA HIERARCHY - Gap 2 Fix */}
                            <div className="mt-12 flex flex-col items-center gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gold via-amber-300 to-gold rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                                    <button
                                        onClick={() => {
                                            const pricing = document.getElementById('pricing');
                                            pricing?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="relative flex flex-col items-center px-12 py-6 bg-charcoal text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all"
                                    >
                                        Attiva Ora il Tuo Gemello Digitale
                                        <span className="text-[10px] text-gold/60 mt-1 lowercase tracking-wider font-medium font-sans">
                                            Scopri i piani · No carta richiesta
                                        </span>
                                    </button>
                                </motion.div>

                                <a href="/auth/login" className="text-charcoal/40 hover:text-gold transition-colors text-sm font-medium tracking-wide flex items-center gap-2 group">
                                    Hai già un account? <span className="underline decoration-charcoal/10 group-hover:decoration-gold/40">Accedi →</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
