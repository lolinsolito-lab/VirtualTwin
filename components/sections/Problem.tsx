"use client";

import React from 'react';
import { MessageCircle, Clock, TrendingDown } from 'lucide-react';

const Problem = () => {
    const stats = [
        { icon: MessageCircle, value: "72%", label: "Lead persi", sub: "per risposta lenta" },
        { icon: Clock, value: "15min", label: "Tempo medio", sub: "di risposta aziendale" },
        { icon: TrendingDown, value: "€3.2K", label: "Persi ogni mese", sub: "in vendite mancate" },
    ];

    return (
        <section className="py-32 lg:py-48 px-6 lg:px-12 bg-charcoal relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Label */}
                <div className="text-center mb-20">
                    <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black">Il Problema</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 text-center group hover:bg-white/10 transition-all duration-500"
                        >
                            <stat.icon className="w-8 h-8 text-gold/60 mx-auto mb-6" />
                            <p className="text-5xl lg:text-6xl font-serif text-white mb-3 tracking-tight">{stat.value}</p>
                            <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                            <p className="text-white/40 text-xs">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Quote */}
                <div className="text-center max-w-3xl mx-auto">
                    <p className="text-white/60 text-xl lg:text-2xl font-serif italic leading-relaxed border-l-2 border-gold/30 pl-8 text-left">
                        "Ogni minuto di ritardo nella risposta costa clienti.
                        <span className="text-white font-medium"> L'automazione intelligente non è più un lusso</span>,
                        è sopravvivenza competitiva."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Problem;
