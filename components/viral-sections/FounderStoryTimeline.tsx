"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Founder Story Timeline Component
 * 
 * VIRAL-READY: Each card = 1 carousel slide for Meta Ads
 * 
 * Usage: Perfect for founder-story ads, carousel posts, video script
 */
export default function FounderStoryTimeline() {
    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-champagne/20 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                            Come È Nato <span className="text-gold italic">VirtualTwin</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
                            La storia di come un imprenditore stanco ha trasformato un problema personale in una soluzione per 200+ professionisti.
                        </p>
                    </motion.div>

                    {/* Timeline 3 Cards - PERFECT FOR CAROUSEL ADS */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* PRIMA */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 relative"
                        >
                            <div className="absolute -top-4 left-8 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-black uppercase">
                                ❌ Prima
                            </div>
                            <div className="mt-6">
                                <h3 className="text-2xl font-serif text-charcoal mb-4">Il Nightmare</h3>
                                <p className="text-charcoal/70 leading-relaxed mb-4">
                                    "Passavo le <strong>serate fino a mezzanotte</strong> a rispondere ai DM dei clienti dei miei progetti."
                                </p>
                                <p className="text-charcoal/70 leading-relaxed">
                                    Ogni richiesta 'mi mandi info?' era <strong className="text-red-600">5-10 minuti persi</strong>.
                                    Niente tempo per famiglia, niente tempo per scalare.
                                </p>
                            </div>
                        </motion.div>

                        {/* SVOLTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-400 rounded-3xl p-8 relative shadow-xl transform scale-105"
                        >
                            <div className="absolute -top-4 left-8 bg-gradient-to-r from-gold to-amber-600 text-white px-4 py-2 rounded-full text-sm font-black uppercase shadow-lg">
                                💡 Svolta
                            </div>
                            <div className="mt-6">
                                <h3 className="text-2xl font-serif text-charcoal mb-4">La Soluzione AI</h3>
                                <p className="text-charcoal/70 leading-relaxed mb-4">
                                    "Ho costruito un <strong className="text-gold">Clone AI</strong> che rispondeva al posto mio,
                                    in italiano, sui canali che già usavo."
                                </p>
                                <p className="text-charcoal/70 leading-relaxed">
                                    Prima settimana: <strong>80% delle prime risposte automatizzate</strong>.
                                    Ho recuperato 15 ore di vita.
                                </p>
                            </div>
                        </motion.div>

                        {/* DOPO */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-green-50 border-2 border-green-400 rounded-3xl p-8 relative"
                        >
                            <div className="absolute -top-4 left-8 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-black uppercase">
                                ✅ Dopo
                            </div>
                            <div className="mt-6">
                                <h3 className="text-2xl font-serif text-charcoal mb-4">L'Impero Scalato</h3>
                                <p className="text-charcoal/70 leading-relaxed mb-4">
                                    "Oggi VirtualTwin ha gestito <strong className="text-green-600">oltre 1M+ messaggi</strong>
                                    per 200+ imprenditori in tutta Italia."
                                </p>
                                <p className="text-charcoal/70 leading-relaxed">
                                    La media? <strong>3-5 ore risparmiate al giorno</strong>.
                                    Il risultato? Business che scala mentre dormi.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Script Note for Ads */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-12"
                    >
                        <p className="text-charcoal/50 italic text-sm">
                            "Non è magia. È solo tecnologia che finalmente lavora PER te, non CONTRO di te."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
