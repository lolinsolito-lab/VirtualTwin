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
    const demoResponses: Record<string, string> = {
        "default": "Buongiorno. 👋 Sono l'Essenza Sovrana di Sarah. Chiedimi qualsiasi cosa sul potenziale di VirtualTwin: la visione, la scalabilità o il setup dell'Impero.",
        "prezzo": "L'investimento nella tua libertà parte da €39/mese. 🌱 Vuoi esplorare i dettagli dei piani?",
        "funziona": "Sincronizzazione in 10 minuti: 15 domande strategiche → Analisi del Tono → Integrazione Invisibile. ♾️",
    };
    const conversations = [
        {
            title: "Qualifica & Appuntamento",
            description: "WhatsApp d'Élite",
            image: "/whatsapp_proof_real_mockup_1768242467395.png",
            annotation: "✅ Lead qualificato e link pagamento inviato in 2 min",
            color: "from-green-500/10 to-emerald-500/5",
            borderColor: "border-green-400/20"
        },
        {
            title: "Gestione Obiezioni",
            description: "Instagram Direct",
            image: "/instagram_proof_real_mockup_1768242485974.png",
            annotation: "✅ Obiezione prezzo gestita con empatia",
            color: "from-purple-500/10 to-pink-500/5",
            borderColor: "border-purple-400/20"
        },
        {
            title: "Supporto H24",
            description: "Messenger Notturno",
            image: "/messenger_proof_real_mockup_1768242505400.png",
            annotation: "✅ Risposta tecnica precisa alle 3:14 AM",
            color: "from-blue-500/10 to-cyan-500/5",
            borderColor: "border-blue-400/20"
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

                                {/* iPhone Mockup Visual */}
                                <div className="p-4 bg-charcoal/5 min-h-[450px]">
                                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-charcoal aspect-[9/19.5]">
                                        <img
                                            src={conv.image}
                                            alt={conv.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
                                    </div>
                                </div>

                                {/* Explainer Note */}
                                <div className="mt-6 bg-gradient-to-r from-gold/5 to-champagne/20 rounded-2xl p-5 border border-gold/20">
                                    <p className="text-charcoal/80 text-sm leading-relaxed">
                                        <strong className="text-gold">👆 Questa è pura magia tecnologica.</strong><br />
                                        Sarah ha creato la sua <strong className="text-charcoal">Presenza Sovrana</strong> che governa il mercato per lei 24/7.<br />
                                        <span className="text-charcoal/60 text-xs">Mettila alla prova. È esattamente l'effetto che farà il TUO Gemello.</span>
                                    </p>
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

                    {/* Dashboard Sovereign Hub Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mt-32 relative"
                    >
                        <div className="text-center mb-12">
                            <h3 className="font-serif text-3xl md:text-5xl text-charcoal mb-4">
                                Un Pannello di Comando <span className="italic gold-text-gradient">Imperiale</span>
                            </h3>
                            <p className="text-charcoal/50 max-w-2xl mx-auto">
                                Sovereign Hub: Dove la tua visione incontra il controllo assoluto. <br />
                                Monitora ogni conversazione, analisi e conversione in tempo reale.
                            </p>
                        </div>

                        <div className="relative group p-4 bg-charcoal rounded-[2.5rem] shadow-3xl border border-gold/20 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent pointer-events-none" />
                            <img
                                src="/elite_dashboard_mockup_1_1768242446427.png"
                                alt="Sovereign Hub Dashboard"
                                className="w-full h-auto rounded-3xl shadow-2xl group-hover:scale-[1.01] transition-transform duration-1000"
                            />

                            {/* Dashboard Floating Badges */}
                            <div className="absolute top-10 left-10 hidden md:flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
                                <span className="text-xs text-white font-bold uppercase tracking-widest">Sovereign Link Active</span>
                            </div>
                        </div>
                    </motion.div>

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
