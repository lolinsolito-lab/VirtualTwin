"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check, ArrowRight } from 'lucide-react';

/**
 * Visual Proof Section Component
 * 
 * SCREENSHOTS: Real conversation demos showing clone in action
 * 
 * Usage: Homepage proof section - visual social proof with annotated chats
 */
export default function VisualProofSection() {
    const conversations = [
        {
            title: "Qualifica in 2 Minuti",
            description: "Il gemello capisce subito se il lead è serio",
            messages: [
                { from: "lead", text: "Ciao, mi mandi info sul servizio?" },
                { from: "clone", text: "Certo! Prima di inviarti tutto, una domanda veloce: hai già un sistema per gestire i lead o parti da zero?" },
                { from: "lead", text: "Parto da zero, ricevo 20-30 DM al giorno ma non riesco a gestirli" },
                { from: "clone", text: "Perfetto, è esattamente il caso d'uso ideale. Ti mando il link con tutte le info e un video di 3 minuti che spiega come funziona. Quando preferisci una call per vedere il sistema live?" }
            ],
            annotation: "✅ Lead qualificato e call fissata in 2 min",
            color: "from-green-500 to-emerald-600"
        },
        {
            title: "Gestisce Obiezioni",
            description: "Risponde all'obiezione 'è troppo caro' come faresti tu",
            messages: [
                { from: "lead", text: "Interessante, ma € 147/mese mi sembra caro..." },
                { from: "clone", text: "Ti capisco! Considera però: se risparmi anche solo 5 ore al mese (che puoi dedicare a clienti paganti), stai già recuperando l'investimento. Molti nostri clienti hanno calcolato che perdevano €2-4K/mese in vendite perse per lentezza nelle risposte." },
                { from: "lead", text: "È vero, non ci avevo pensato così. Fammi vedere meglio" },
                { from: "clone", text: "Certo! Hai 14 giorni di prova, zero rischi. Se non ti convince, cancelli. Ti mando il link per partire 👇" }
            ],
            annotation: "✅ Obiezione gestita + conversione",
            color: "from-blue-500 to-indigo-600"
        },
        {
            title: "Chiude la Vendita",
            description: "Invia link pagamento e chiude autonomamente",
            messages: [
                { from: "lead", text: "Ok, voglio provare. Come faccio?" },
                { from: "clone", text: "Perfetto! 🎉 Ecco come parti:\n\n1. Attivi il piano Pioniere (€147/mese, cancelli quando vuoi)\n2. Setup guidato in 10 minuti\n3. Sei live\n\n👉 Link diretto: virtualtwin.app/start\n\nProva 14 giorni gratis, nessun vincolo." },
                { from: "lead", text: "Fatto! Ho completato l'acquisto 👍" },
                { from: "clone", text: "Grande! 🚀 Riceverai email con accesso. Benvenuto in VirtualTwin!" }
            ],
            annotation: "✅ Vendita completata autonomamente",
            color: "from-purple-500 to-violet-600"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-white via-gray-50 to-white">
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
                            Così Lavora <span className="text-gold italic">Il Tuo Gemello</span>
                        </h2>
                        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed">
                            Non sono messaggi generici. Sono <strong className="text-charcoal">le TUE parole</strong>.<br />
                            Il TUO modo di vendere. I clienti parlano con TE.<br />
                            <span className="text-gold font-bold">Solo che sei tu, moltiplicato.</span>
                        </p>
                    </motion.div>

                    {/* Conversation Mockups */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {conversations.map((conv, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-charcoal/10"
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-r ${conv.color} px-6 py-4`}>
                                    <h3 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5" />
                                        {conv.title}
                                    </h3>
                                    <p className="text-white/80 text-sm mt-1">
                                        {conv.description}
                                    </p>
                                </div>

                                {/* Chat Mockup */}
                                <div className="p-6 bg-gray-50 min-h-[400px] space-y-3">
                                    {conv.messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.from === 'clone' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.from === 'clone'
                                                        ? 'bg-gradient-to-r ' + conv.color + ' text-white rounded-br-sm'
                                                        : 'bg-white border-2 border-charcoal/10 text-charcoal/80 rounded-bl-sm'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed whitespace-pre-line">
                                                    {msg.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Annotation */}
                                <div className="px-6 py-4 bg-green-50 border-t-2 border-green-200">
                                    <div className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-green-700 font-bold text-sm">
                                            {conv.annotation}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 text-center"
                    >
                        <a
                            href="#pricing"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-charcoal rounded-xl font-black text-lg uppercase tracking-wider hover:bg-amber-400 transition-all shadow-2xl hover:shadow-gold/50 hover:scale-105"
                        >
                            Crea Il Tuo Gemello
                            <ArrowRight className="w-5 h-5" />
                        </a>
                        <p className="text-charcoal/50 text-sm mt-4">
                            Setup in 10 minuti • 14 giorni gratis • Zero rischi
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
