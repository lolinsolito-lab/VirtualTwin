"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, TrendingUp, Clock, Moon, Sparkles, ChevronDown } from 'lucide-react';

/**
 * Today Tomorrow Stories Component - INTERACTIVE ACCORDION
 * 
 * ELITE DESIGN: 4 collapsible cards that expand on click
 * 
 * Usage: Homepage transformation section - click to reveal before/after
 */
export default function TodayTomorrowStories() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const stories = [
        {
            title: "L'Erosione della Vita",
            subtitle: "Cena con la famiglia interrotta",
            icon: Clock,
            color: "from-amber-500 to-orange-600",
            today: {
                scene: "Cena sacra con la famiglia. Una vibrazione interrompe il presente.",
                result: "Presenza distrutta. Energia dissipata."
            },
            tomorrow: {
                scene: "Il telefono resta silenzioso. Il presente è intatto.",
                result: "Tu proteggi il tuo tempo. Lui fa crescere il business."
            }
        },
        {
            title: "Il Fallimento del Limite",
            subtitle: "Client alle 3 di notte",
            icon: Moon,
            color: "from-indigo-500 to-purple-600",
            today: {
                scene: "Il mercato richiede verità alle 3 del mattino. Tu dormi (perché sei umano).",
                result: "Silenzio assordante. Lead congelato o perso."
            },
            tomorrow: {
                scene: "Un buyer in un altro fuso orario cerca la tua autorità.",
                result: "Ti svegli davanti a una realtà già espansa. Senza sforzo biologico."
            }
        },
        {
            title: "Saturazione Cognitiva",
            subtitle: "20+ messaggi ogni mattina",
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-600",
            today: {
                scene: "20+ anime cercano la tua attenzione. Il rumore è insopportabile.",
                result: "Saturazione. Creatività annientata dalla routine."
            },
            tomorrow: {
                scene: "I 20 messaggi sono già stati filtrati, educati e convertiti dal Clone.",
                result: "Lavori SUL futuro, non NEL passato. 15 ore di ossigeno recuperate."
            }
        },
        {
            title: "Il Deserto del 'Ci Penso'",
            subtitle: "Follow-up che non tornano",
            icon: Check,
            color: "from-rose-500 to-pink-600",
            today: {
                scene: "Investi 15 minuti a spiegare. Scrivi con passione.",
                result: "Frustrazione. Il valore percepito crolla nel follow-up manuale."
            },
            tomorrow: {
                scene: "Il Clone gestisce l'educazione e le obiezioni con perfezione.",
                result: "Il cliente dice: 'Indistinguibile'. Tu intervieni solo per il brindisi finale."
            }
        }
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-champagne/10 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-gold text-[9px] uppercase tracking-[0.6em] font-black italic mb-8 block opacity-50">Prima e Dopo</span>
                        <h2 className="font-serif text-5xl md:text-8xl text-charcoal mb-8 leading-[0.85] tracking-tighter">
                            La Libertà del <br />
                            <span className="text-gold italic">Silenzio.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-charcoal/40 max-w-2xl mx-auto leading-relaxed">
                            Clicca su ogni scenario per vedere la trasformazione.
                        </p>
                    </motion.div>

                    {/* Accordion Cards */}
                    <div className="space-y-4">
                        {stories.map((story, index) => {
                            const isOpen = openIndex === index;
                            const Icon = story.icon;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="overflow-hidden"
                                >
                                    {/* Card Header - Always Visible */}
                                    <button
                                        onClick={() => handleToggle(index)}
                                        className={`w-full flex items-center gap-6 p-6 md:p-8 rounded-2xl transition-all duration-500 group ${isOpen
                                                ? 'bg-charcoal text-white rounded-b-none'
                                                : 'bg-white hover:bg-charcoal/5 border-2 border-charcoal/10 hover:border-gold/30'
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isOpen
                                                ? 'bg-gold/20'
                                                : 'bg-gradient-to-br ' + story.color + ' bg-opacity-10'
                                            }`}>
                                            <Icon className={`w-7 h-7 md:w-8 md:h-8 transition-colors duration-500 ${isOpen ? 'text-gold' : 'text-white'
                                                }`} />
                                        </div>

                                        {/* Title & Subtitle */}
                                        <div className="flex-1 text-left">
                                            <h3 className={`text-xl md:text-2xl font-serif italic tracking-tight transition-colors duration-500 ${isOpen ? 'text-white' : 'text-charcoal'
                                                }`}>
                                                {story.title}
                                            </h3>
                                            <p className={`text-sm mt-1 transition-colors duration-500 ${isOpen ? 'text-white/60' : 'text-charcoal/40'
                                                }`}>
                                                {story.subtitle}
                                            </p>
                                        </div>

                                        {/* Chevron */}
                                        <motion.div
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isOpen ? 'bg-gold/20' : 'bg-charcoal/5 group-hover:bg-gold/10'
                                                }`}
                                        >
                                            <ChevronDown className={`w-5 h-5 transition-colors duration-500 ${isOpen ? 'text-gold' : 'text-charcoal/40 group-hover:text-gold'
                                                }`} />
                                        </motion.div>
                                    </button>

                                    {/* Expandable Content */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="bg-white border-2 border-t-0 border-charcoal/10 rounded-b-2xl">
                                                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-charcoal/10">
                                                        {/* IL VECCHIO MONDO */}
                                                        <div className="p-8 md:p-10 relative">
                                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 to-transparent" />
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <X className="w-5 h-5 text-red-400" />
                                                                <span className="text-[10px] uppercase font-black text-red-900/40 tracking-[0.3em]">
                                                                    Il Vecchio Mondo
                                                                </span>
                                                            </div>
                                                            <p className="text-charcoal/60 leading-relaxed mb-6 text-base">
                                                                {story.today.scene}
                                                            </p>
                                                            <p className="text-red-600/80 font-serif text-lg italic border-l-2 border-red-400/30 pl-4">
                                                                → {story.today.result}
                                                            </p>
                                                        </div>

                                                        {/* LA NUOVA REALTÀ */}
                                                        <div className="p-8 md:p-10 relative bg-gradient-to-br from-gold/5 to-transparent">
                                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent" />
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <Sparkles className="w-5 h-5 text-gold" />
                                                                <span className="text-[10px] uppercase font-black text-gold tracking-[0.3em]">
                                                                    La Nuova Realtà
                                                                </span>
                                                            </div>
                                                            <p className="text-charcoal leading-relaxed mb-6 text-base">
                                                                {story.tomorrow.scene}
                                                            </p>
                                                            <p className="text-gold font-serif text-lg italic border-l-2 border-gold pl-4 font-medium">
                                                                → {story.tomorrow.result}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Hint Text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center text-charcoal/30 text-sm mt-12 italic"
                    >
                        💡 {openIndex === null ? 'Tocca una card per esplorare' : 'Tocca un\'altra card per vedere altri scenari'}
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
