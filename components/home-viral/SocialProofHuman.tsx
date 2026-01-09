"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Clock, Heart } from 'lucide-react';

/**
 * Social Proof Human Component
 * 
 * WARM TESTIMONIALS: Real people, real emotions, real results
 * 
 * Usage: Homepage social proof - humanize with faces, stories, outcomes
 */
export default function SocialProofHuman() {
    const testimonials = [
        {
            name: "Laura Bianchi",
            role: "Coach Mindset & Business",
            avatar: "👩‍💼",
            story: "Prima passavo 2 ore ogni sera a rispondere agli stessi 'mi mandi info?'. Zero vita personale. Il mio gemello digitale ora gestisce tutto. Io intervengo solo per le call. Risultato?",
            results: [
                "+3 clienti a settimana",
                "15 ore/mese recuperate",
                "Prima vacanza in 2 anni senza perdere vendite"
            ],
            emotion: "Libertà ritrovata",
            rating: 5,
            color: "from-purple-500 to-violet-600"
        },
        {
            name: "Marco Ferretti",
            role: "Studio Odontoiatrico",
            avatar: "👨‍⚕️",
            story: "La segretaria era sommersa. Clienti aspettavano ore per una risposta. Il gemello ora filtra, qualifica, manda il form pre-visita e fissa appuntamenti. La segretaria si occupa solo di casi complessi.",
            results: [
                "-60% carico segreteria",
                "+40% appuntamenti fissati",
                "Zero perdita di pazienti per lentezza"
            ],
            emotion: "Controllo totale",
            rating: 5,
            color: "from-blue-500 to-indigo-600"
        },
        {
            name: "Sofia Romano",
            role: "E-commerce Moda",
            avatar: "👗",
            story: "Perdevo vendite notturne perché non rispondevo ai DM dopo le 22:00. Il mio gemello risponde 24/7, qualifica, manda link prodotto e codice sconto. Vendo letteralmente mentre dormo.",
            results: [
                "+30% conversioni notturne",
                "€2.4K extra/mese (media)",
                "Clienti felici: 'risposta immediata!'"
            ],
            emotion: "Vendite automatiche",
            rating: 5,
            color: "from-pink-500 to-rose-600"
        },
        {
            name: "Alessandro Conti",
            role: "Consulente Marketing",
            avatar: "📈",
            story: "Facevo 20 call esplorative a settimana. L'80% erano 'curiosi' non buyer. Time wasted. Ora il gemello qualifica PRIMA. Io parlo solo con chi è pronto a comprare.",
            results: [
                "Da 20 call a 6 call/settimana",
                "Tasso chiusura: 35% → 78%",
                "Risparmiati €12.400 di fee (Prezzo Founder bloccato)"
            ],
            emotion: "Focus sui deal veri",
            rating: 5,
            color: "from-green-500 to-emerald-600"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-champagne/20 to-white">
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
                            Chi Ha Già <span className="text-gold italic">Il Suo Gemello</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto">
                            Non sono solo testimonianze. Sono <strong className="text-charcoal">storie reali</strong> di persone che hanno fatto la scelta di duplicarsi.
                        </p>
                    </motion.div>

                    {/* Testimonial Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-charcoal/10 hover:shadow-2xl transition-shadow"
                            >
                                {/* Header with Avatar */}
                                <div className={`bg-gradient-to-r ${testimonial.color} px-8 py-6`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-xl">
                                            {testimonial.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-serif text-white font-bold">
                                                {testimonial.name}
                                            </h3>
                                            <p className="text-white/80">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex gap-1 mt-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                        ))}
                                    </div>
                                </div>

                                {/* Story */}
                                <div className="p-8">
                                    <p className="text-charcoal/80 leading-relaxed text-lg mb-6">
                                        "{testimonial.story}"
                                    </p>

                                    {/* Results */}
                                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 mb-4">
                                        <h4 className="text-sm uppercase font-black text-green-700 mb-3 tracking-wider">
                                            ✅ RISULTATI REALI
                                        </h4>
                                        <ul className="space-y-2">
                                            {testimonial.results.map((result, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-charcoal/80 font-medium">
                                                        {result}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Emotion Badge */}
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-gold" />
                                        <p className="text-gold font-bold italic">
                                            {testimonial.emotion}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Community Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-br from-gold/10 to-amber-100 rounded-3xl p-10 border-2 border-gold/40 text-center"
                    >
                        <h3 className="text-3xl font-serif text-charcoal mb-6">
                            Unisciti a <span className="text-gold">500+ Professionisti</span>
                        </h3>

                        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div>
                                <p className="text-5xl font-black text-gold mb-2">500+</p>
                                <p className="text-charcoal/70">Gemelli Digitali Attivi</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-gold mb-2">1.2M+</p>
                                <p className="text-charcoal/70">Conversazioni Gestite</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-gold mb-2">€3.4M+</p>
                                <p className="text-charcoal/70">Vendite Automatizzate</p>
                            </div>
                        </div>

                        <p className="text-charcoal/50 text-sm mt-8 italic">
                            📊 Dati aggiornati - Gennaio 2026
                        </p>
                    </motion.div>

                    {/* Video Placeholder Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 text-center bg-charcoal/5 rounded-2xl p-8 border-2 border-charcoal/10"
                    >
                        <p className="text-charcoal/60 text-sm">
                            🎬 <strong>Video testimonial UGC</strong> verranno integrati qui<br />
                            (30-sec snippets clienti reali che raccontano risultati)
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
