"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Video } from 'lucide-react';

/**
 * FAQ Video-Ready Component
 * 
 * VIRAL-READY: Each FAQ = 30-45 sec retargeting video script
 * 
 * Usage: Objection-handling retargeting ads, educational content, FAQ carousel
 */
export default function FAQVideoReady() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "E se il Clone sbaglia risposta e perde un cliente?",
            answer: [
                "🔍 Riconoscimento: Capisco la paura. Il cliente è prezioso e non vuoi rischiare.",
                "💡 Spiegazione: Il Clone viene addestrato sui TUOI contenuti, le TUE FAQ, il TUO modo di rispondere. Le prime 5-10 conversazioni le supervisioni TU in tempo reale.",
                "✅ Reassurance: Hai sempre il controllo. Puoi intervenire manualmente in qualsiasi momento. Il Clone impara dai tuoi feedback e migliora ogni giorno."
            ],
            videoHook: "Paura che il Clone AI ti rovini un client? Ti spiego perché è l'opposto..."
        },
        {
            question: "Quanto tempo serve davvero per addestrare il Clone?",
            answer: [
                "🔍 Riconoscimento: Non voglio perdere giorni per configurare un tool. È legittimo.",
                "💡 Spiegazione: Setup iniziale = 10-15 minuti. Rispondi a domande sul tuo business, carichi 2-3 FAQ, colleghi il canale. Fine.",
                "✅ Reassurance: Il Clone inizia subito a rispondere. Le prime conversazioni le usi per AFFINARE, non per costruire da zero. È operativo dal giorno 1."
            ],
            videoHook: "Setup complicato? In 10 minuti hai il Clone live..."
        },
        {
            question: "Il mio business è troppo particolare, l'AI non può capirlo",
            answer: [
                "🔍 Riconoscimento: Ogni business è unico. Hai ragione. La tua offerta, il tuo linguaggio, il tuo pubblico sono specifici.",
                "💡 Spiegazione: Proprio per questo il Clone si ADATTA. Non usa risposte generiche. Gli insegni il TUO linguaggio, le TUE obiezioni, le TUE soluzioni.",
                "✅ Reassurance: Abbiamo Clone attivi in 30+ nicchie diverse: coach, agenzie, e-commerce, studi professionali, corsi online. Ognuno parla come il suo founder."
            ],
            videoHook: "Il tuo business è troppo particolare per l'AI? Non proprio..."
        },
        {
            question: "Costa troppo rispetto ad assumere un'assistente virtuale?",
            answer: [
                "🔍 Riconoscimento: Budget limitato, ogni euro conta. Assistente virtuale sembra più economica.",
                "💡 Spiegazione: Assistente umana = €800-1.200/mese, lavora 8h/giorno, si ammala, va in ferie. Clone = €47-347/mese, lavora 24/7, non si stanca, non sbaglia mai lo stesso errore.",
                "✅ Reassurance: In 30 giorni recuperi il costo solo con il tempo risparmiato. Hai sempre l'opzione di scalare o fermarti. Zero contratti annuali."
            ],
            videoHook: "Clone AI vs Assistente Virtuale: ecco i numeri reali..."
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-champagne/10 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                            Domande <span className="text-gold italic">Frequenti</span>
                        </h2>
                        <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
                            Le obiezioni più comuni (e come risponderle). Ogni FAQ = script video per retargeting.
                        </p>
                    </motion.div>

                    {/* FAQ Accordion - VIDEO SCRIPT READY */}
                    <div className="space-y-4 mb-12">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border-2 border-charcoal/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            >
                                {/* Question */}
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-champagne/20 transition-colors"
                                >
                                    <span className="font-serif text-xl text-charcoal font-bold pr-4">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-6 h-6 text-gold flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Answer */}
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-charcoal/10"
                                    >
                                        <div className="p-6 space-y-4">
                                            {faq.answer.map((line, i) => (
                                                <p key={i} className="text-charcoal/70 leading-relaxed">
                                                    {line}
                                                </p>
                                            ))}

                                            {/* Video Script Hook */}
                                            <div className="mt-6 pt-6 border-t border-gold/20 bg-gold/5 -mx-6 -mb-6 px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <Video className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs uppercase font-black text-gold mb-1 tracking-wider">
                                                            🎬 Hook Video
                                                        </p>
                                                        <p className="text-charcoal/80 text-sm italic">
                                                            "{faq.videoHook}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Retargeting Strategy Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="bg-gradient-to-r from-gold/10 via-amber-50 to-gold/10 border-2 border-gold/30 rounded-2xl p-8"
                    >
                        <h3 className="text-xl font-black text-charcoal mb-4 text-center">
                            📹 Strategia Retargeting Video:
                        </h3>
                        <div className="space-y-3 text-charcoal/70 text-sm">
                            <p>
                                <strong className="text-gold">Giorno 1-3:</strong> Visitor homepage → Video FAQ "E se sbaglia?"
                            </p>
                            <p>
                                <strong className="text-gold">Giorno 4-7:</strong> Visitor pricing → Video FAQ "Costa troppo?"
                            </p>
                            <p>
                                <strong className="text-gold">Giorno 8-14:</strong> Add to cart non completato → Video FAQ "Tempo setup"
                            </p>
                            <p className="text-xs text-charcoal/50 italic mt-4 pt-4 border-t border-gold/20">
                                Ogni FAQ = 30-45 sec talking-head | Formato: 1:1 o 9:16 | CTA: "Prova 7 giorni gratis"
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
