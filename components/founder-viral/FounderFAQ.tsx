"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

/**
 * Founder FAQ Component
 * 
 * OBJECTIONS: Address founder-specific questions
 * 
 * Usage: /founder page - handle objections + clarify value
 */

export default function FounderFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Cosa succede se finite i posti Founder?",
            answer: "Passi automaticamente al pricing pubblico (attualmente €1,997/mese per Imperatore vs €697/mese Founder). Una volta esauriti i 60 posti totali Founder (20 Genesis + 20 Pioneer + 20 Elite), NON ci sarà più accesso al pricing privilegiato. Mai più."
        },
        {
            question: "Il prezzo è bloccato PER SEMPRE?",
            answer: "Sì. Letteralmente per sempre. Se entri Genesis a €697/mese, pagherai €697/mese anche nel 2030, 2035, 2050. Anche quando il prezzo pubblico sarà €5,000/mese. È un contratto lifetime garantito contrattualmente nelle Terme & Conditions Stripe."
        },
        {
            question: "Posso upgradare a Imperatore dopo se sono Pioniere Founder?",
            answer: "Sì, puoi upgradare, MA pagherai la DIFFERENZA al prezzo pubblico corrente, non Founder. Esempio: Sei Pioniere Genesis (€147/mo). Vuoi Imperatore. Pagherai €147/mo (Founder) + €1,300/mo (upgrade pubblico) = €1,447/mo tot. Conviene entrare subito al piano target."
        },
        {
            question: "Se cancello, perdo il prezzo Founder per sempre?",
            answer: "Sì. Se cancelli la subscription Founder e poi ti re-iscrivi dopo, ripartirà pricing pubblico corrente. Non ci sono eccezioni. Il pricing Founder è legato alla continuità della subscription. Pausa = perdi privilegio. Per sempre."
        },
        {
            question: "Posso vedere differenze tra Genesis, Pioneer, Elite?",
            answer: "Funzionalità identiche. Cambia SOLO il prezzo. Genesis €697/mo, Pioneer €897/mo, Elite €1,097/mo (Imperatore). Dopo Elite, pricing pubblico €1,997/mo. Chi entra prima risparmia di più. Semplice matematica."
        },
        {
            question: "C'è trial per Founder?",
            answer: "Sì, 14 giorni gratis come tutti i piani. MA attenzione: se non confermi il piano Founder entro 14gg e nel frattempo Genesis si esaurisce, perdi il pricing. Il posto è 'riservato' solo durante trial attivo. Scadenza trial senza conferma = posto rilasciato."
        }
    ];

    return (
        <section className="relative py-20 bg-gradient-to-b from-white via-champagne/10 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border-2 border-gold/30 rounded-full mb-6">
                            <HelpCircle className="w-5 h-5 text-gold" />
                            <span className="text-gold text-sm font-black uppercase tracking-wider">
                                Domande Frequenti
                            </span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-6xl text-charcoal mb-6">
                            Tutto Quello Che Devi <span className="text-gold italic">Sapere</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-2xl mx-auto">
                            Zero ambiguità. Risposte dirette.
                        </p>
                    </motion.div>

                    {/* FAQ List */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-lg border-2 border-charcoal/10 overflow-hidden hover:shadow-xl transition-all"
                            >
                                {/* Question */}
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-champagne/20 transition-colors"
                                >
                                    <span className="text-lg font-bold text-charcoal pr-4">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-6 h-6 text-gold flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Answer */}
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-5 pt-2 border-t border-charcoal/5">
                                                <p className="text-charcoal/70 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-charcoal/50 text-sm italic">
                            💬 Altre domande? <a href="mailto:support@virtualtwin.app" className="text-gold hover:underline font-bold not-italic">support@virtualtwin.app</a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
