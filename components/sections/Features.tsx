"use client";

import React from 'react';
import { MessageCircle, Brain, BarChart3, Zap, Shield, Instagram } from 'lucide-react';

const Features = () => {
    const features = [
        { icon: MessageCircle, title: "Multi-Canale", desc: "WhatsApp, Instagram DM e Messenger in un'unica dashboard" },
        { icon: Brain, title: "AI Gemini 2.0", desc: "Comprende testo, voce e immagini con precisione umana" },
        { icon: BarChart3, title: "CRM Integrato", desc: "Pipeline visuale con drag-and-drop e analytics avanzate" },
        { icon: Zap, title: "Real-time", desc: "Risposte in meno di 2 secondi, 24 ore su 24" },
        { icon: Shield, title: "GDPR Ready", desc: "Dati protetti e conformi alle normative europee" },
        { icon: Instagram, title: "Auto-Sync", desc: "Sincronizzazione automatica con Google Sheets e CRM" },
    ];

    return (
        <section className="py-32 lg:py-48 px-6 lg:px-12 bg-champagne relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black mb-4 block">Caratteristiche</span>
                    <h2 className="font-serif text-[2.5rem] md:text-[4rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal">
                        Tutto Ciò Che <span className="italic gold-text-gradient">Serve.</span>
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl p-8 lg:p-10 border border-charcoal/5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold transition-colors duration-300">
                                <feature.icon className="w-6 h-6 text-gold group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-serif italic text-charcoal mb-3">{feature.title}</h3>
                            <p className="text-charcoal/50 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
