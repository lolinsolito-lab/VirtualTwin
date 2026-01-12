"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, TrendingUp, Clock, Moon, Sparkles } from 'lucide-react';

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
            title: "L'Erosione della Vita",
            icon: Clock,
            today: {
                time: "Sabato Sera · Attrito",
                scene: "Cena sacra con la famiglia. Una vibrazione interrompe il presente.",
                message: "'Mi mandi info? Vorrei iniziare subito.'",
                dilemma: "La scelta è tra il furto di tempo ai tuoi cari o l'abbandono di un'opportunità.",
                result: "Presenza distrutta. Energia dissipata.",
                emotion: "Schiavitù Operativa"
            },
            tomorrow: {
                time: "Sabato Sera · Grazia",
                scene: "Il telefono resta silenzioso. Il presente è intatto.",
                action: "Il tuo gemello sovrano accoglie il lead, educa, risolve dubbi e posiziona il valore.",
                result: "Tu proteggi il tuo tempo sacro. Lui costruisce il tuo impero.",
                emotion: "Sovranità"
            }
        },
        {
            title: "Il Fallimento del Limite",
            icon: Moon,
            today: {
                time: "Ore 03:00 · Vulnerabilità",
                scene: "Il mercato richiede verità alle 3 del mattino. Tu dormi (perché sei umano).",
                message: "Il potenziale buyer cerca una connessione immediata.",
                dilemma: "Il mondo non tace mentre tu ti rigeneri. Il tempo è il nemico.",
                result: "Silenzio assordante. Lead congelato o perso.",
                emotion: "Impoverimento Strategico"
            },
            tomorrow: {
                time: "Ore 03:00 · Presenza d'Anima",
                scene: "Un buyer in un altro fuso orario cerca la tua autorità.",
                action: "Il gemello risponde con la tua saggezza istantanea. Qualifica e chiude.",
                result: "Ti svegli davanti a una realtà già espansa. Senza sforzo biologico.",
                emotion: "Evoluzione Continua"
            }
        },
        {
            title: "Saturazione Cognitiva",
            icon: TrendingUp,
            today: {
                time: "Lunedì Mattina · Caos",
                scene: "20+ anime cercano la tua attenzione. Il rumore è insopportabile.",
                message: "3 ore di digitazione meccanica, template sterili, ripetizioni estenuanti.",
                dilemma: "Sei un Fondatore o un operatore di data-entry dei tuoi stessi pensieri?",
                result: "Saturazione. Creatività annientata dalla routine.",
                emotion: "Burnout Aziendale"
            },
            tomorrow: {
                time: "Lunedì Mattina · Purezza",
                scene: "I 20 messaggi sono già stati filtrati, educati e convertiti dal gemello.",
                action: "Solo il 5% che richiede il tuo genio creativo arriva alla tua attenzione.",
                result: "Lavori SUL futuro, non NEL passato. 15 ore di ossigeno recuperate.",
                emotion: "Chiarezza Mentale"
            }
        },
        {
            title: "Il Deserto del 'Ci Penso'",
            icon: Check,
            today: {
                time: "Pomeriggio · Ghosting",
                scene: "Investi 15 minuti a spiegare. Scrivi con passione.",
                message: "Cliente: 'Grazie, ci farò sapere.' Mai più visto.",
                dilemma: "Hai scambiato il tuo ossigeno per un 'forse'. Un baratto fallimentare.",
                result: "Frustrazione. Il valore percepito crolla nel follow-up manuale.",
                emotion: "Svalutazione del Sé"
            },
            tomorrow: {
                time: "Pomeriggio · Autorità",
                scene: "Il gemello gestisce l'educazione e le obiezioni con perfezione neutrale.",
                action: "Case study, FAQ e link arrivano in tempo reale, mantenendo il desiderio al massimo.",
                result: "Il cliente dice: 'Indistinguibile'. Tu intervieni solo per il brindisi finale.",
                emotion: "Eccellenza Sistematica"
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
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="text-center mb-24"
                        >
                            <span className="text-gold text-[9px] uppercase tracking-[0.6em] font-black italic mb-8 block opacity-50">L'Invisibile Potere del Genio</span>
                            <h2 className="font-serif text-5xl md:text-9xl text-charcoal mb-12 leading-[0.8] tracking-tighter">
                                La Libertà del <br />
                                <span className="text-gold italic">Silenzio.</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-charcoal/20 max-w-4xl mx-auto leading-relaxed font-light italic">
                                "La tecnologia perfetta è quella che scompare. <br />
                                <strong className="text-charcoal/40 font-medium">Non aggiungiamo rumore al tuo business. Lo eliminiamo alla radice."</strong>
                            </p>
                        </motion.div>
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
                                <div className="bg-charcoal px-12 py-10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gold/5" />

                                    <div className="flex items-center gap-8 relative z-10">
                                        <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center backdrop-blur-3xl group-hover:border-gold/30 transition-all duration-1000">
                                            <story.icon className="w-8 h-8 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-serif text-white italic tracking-tight">
                                                {story.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* TODAY (Problem) - Subtle red accents */}
                                <div className="p-12 border-b border-charcoal/5 group-hover:bg-rose-50/10 transition-colors duration-1000">
                                    <div className="flex items-start gap-6 mb-4">
                                        <X className="w-5 h-5 text-red-900/20 flex-shrink-0 mt-2" />
                                        <div className="flex-1">
                                            <h4 className="text-[9px] uppercase font-black text-charcoal/20 tracking-[0.4em] mb-4">
                                                Il Vecchio Mondo
                                            </h4>
                                            <p className="text-charcoal/40 leading-relaxed mb-4 text-lg italic">
                                                {story.today.scene}
                                            </p>
                                            <p className="text-red-900/60 font-serif text-xl italic mb-4">
                                                → {story.today.result}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* TOMORROW (Solution) - Pure Magic */}
                                <div className="p-12 group-hover:bg-gold/5 transition-colors duration-1000">
                                    <div className="flex items-start gap-6">
                                        <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-2" />
                                        <div className="flex-1">
                                            <h4 className="text-[9px] uppercase font-black text-gold tracking-[0.4em] mb-4">
                                                La Nuova Realtà
                                            </h4>
                                            <p className="text-charcoal leading-relaxed mb-4 text-lg italic">
                                                {story.tomorrow.scene}
                                            </p>
                                            <p className="text-gold font-serif text-2xl italic">
                                                → {story.tomorrow.result}
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
                            📈 Basato su proiezioni di mercato e analisi dell'automazione sovrana.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

