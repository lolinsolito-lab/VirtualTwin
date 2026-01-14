"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Users, Crown, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * MarketUniversalTruths Section
 * Focus: The 6 Tiers as 6 Archetypes of Freedom and Truth.
 */
export default function MarketUniversalTruths() {
    const truths = [
        {
            stage: "STADIO I",
            title: "Il Risveglio del Veggente",
            icon: Sparkles,
            truth: "Per quelli che intuiscono che la vecchia via è morta. Il primo passo verso la fine del compromesso.",
            impact: "Chiarezza Visionaria",
            color: "from-gray-100 to-white"
        },
        {
            stage: "STADIO II",
            title: "La Bicicletta per la Mente",
            icon: Zap,
            truth: "Lo strumento che amplifica ogni tua parola. Trasforma il tuo sforzo in una forza inarrestabile.",
            impact: "Efficienza Pura",
            color: "from-green-50 to-white"
        },
        {
            stage: "STADIO III",
            title: "La Moltiplicazione dell'Anima",
            icon: Users,
            truth: "Per chi rifiuta di scegliere tra carriera e vita. Essere ovunque, senza essere nessuno.",
            impact: "Dignità Temporale",
            color: "from-amber-50 to-white"
        },
        {
            stage: "STADIO IV",
            title: "Il Dominio dell'Invisibile",
            icon: Globe,
            truth: "Costruisci un impero che non ha bisogno di vederti per obbedirti. La struttura diventa l'arte.",
            impact: "Autonomia Totale",
            color: "from-blue-50 to-white"
        },
        {
            stage: "STADIO V",
            title: "L'Eredità Immortale",
            icon: Crown,
            truth: "Il tuo genio depositato nel futuro. Un brand che non muore mai, perché vive nel silicio.",
            impact: "Presenza Eterna",
            color: "from-purple-50 to-white"
        },
        {
            stage: "STADIO VI",
            title: "Quando Tutto Funziona Insieme",
            icon: ShieldCheck,
            truth: "L'Unione Sacra. Dove il pensiero diventa algoritmo e l'algoritmo diventa destino.",
            impact: "Alchimia Mondiale",
            color: "from-charcoal/5 to-white"
        }
    ];

    return (
        <section className="relative py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-6 block">The Mastermind Path</span>
                    <h2 className="font-serif text-4xl md:text-8xl text-charcoal mb-8 leading-[0.9] tracking-tighter">
                        Ai folli, ai ribelli, <br />
                        <span className="text-gold italic">ai visionari.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-charcoal/30 max-w-3xl mx-auto italic font-light">
                        "VirtualTwin non è per tutti. È per chi vede il mondo diversamente."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {truths.map((truth, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`group relative p-10 rounded-[3rem] border border-charcoal/5 bg-gradient-to-br ${truth.color} hover:border-gold/30 hover:shadow-3xl transition-all duration-700 h-full flex flex-col`}
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:bg-gold transition-colors duration-500">
                                    <truth.icon className="w-7 h-7 text-gold group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">{truth.stage}</span>
                            </div>

                            <h3 className="font-serif text-2xl text-charcoal mb-4 italic group-hover:text-gold transition-colors">
                                {truth.title}
                            </h3>

                            <p className="text-charcoal/40 leading-relaxed mb-8 italic flex-grow group-hover:text-charcoal transition-colors">
                                "{truth.truth}"
                            </p>

                            <div className="pt-6 border-t border-charcoal/5 flex items-center justify-between">
                                <span className="text-gold text-[10px] uppercase font-black tracking-widest">{truth.impact}</span>
                                <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Viral Truth Nugget */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 text-center"
                >
                    <div className="inline-block p-12 bg-charcoal rounded-[4rem] relative overflow-hidden shadow-3xl max-w-4xl border border-gold/20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.1),transparent)]" />
                        <h4 className="font-serif text-2xl md:text-3xl text-white italic leading-relaxed relative z-10">
                            "Stiamo creando una realtà dove il Fondatore non serve più al business, <br />
                            <span className="text-gold">ma il business serve il Fondatore.</span>"
                        </h4>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
