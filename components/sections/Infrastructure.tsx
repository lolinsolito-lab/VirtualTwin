
"use client";

import React from 'react';

const Infrastructure = () => {
    return (
        <section id="stack" className="py-72 px-10 bg-white border-y border-charcoal/5 relative overflow-hidden perspective-3d">
            {/* Neural Grid Overlay */}
            <div className="absolute inset-0 neural-grid opacity-[0.04] z-0"></div>

            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[150px] rounded-full animate-neural-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 animate-soft-focus">
                <div className="text-center mb-56">
                    <div className="flex items-center justify-center gap-10 mb-12">
                        <span className="h-[1px] w-16 bg-gold/40"></span>
                        <span className="text-gold text-[12px] uppercase tracking-[1.5em] block font-black italic">Architettura Sovrana</span>
                        <span className="h-[1px] w-16 bg-gold/40"></span>
                    </div>
                    <h3 className="font-serif text-[5.5rem] lg:text-[11rem] text-charcoal italic leading-none tracking-tighter">Mente Maestra <br /> <span className="gold-text-gradient">Automata.</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
                    {[
                        {
                            cat: "Framework",
                            tech: "Next.js 14",
                            desc: "Reattività istantanea controllata da algoritmi di routing predittivo."
                        },
                        {
                            cat: "Caveau Digitale",
                            tech: "Supabase",
                            desc: "Crittografia militare per la sovranità assoluta di ogni bit del tuo impero."
                        },
                        {
                            cat: "Motore Neurale",
                            tech: "Gemini 2.5",
                            desc: "L'apice dell'intelligenza, sintetizzando il tuo pensiero in logica pura."
                        },
                        {
                            cat: "Network Elite",
                            tech: "Official WABA",
                            desc: "Integrazione diretta nel protocollo WhatsApp per una presenza onnipresente."
                        }
                    ].map((item, i) => (
                        <div key={i} className="group perspective-3d">
                            <div className="silk-card aspect-square rounded-[4.5rem] mb-14 flex items-center justify-center border border-white/80 group-hover:gold-gradient group-hover:rotate-y-12 transition-all duration-1000 shadow-luxury overflow-hidden relative holographic-glimmer transform hover:translate-z-20">
                                <div className="absolute inset-0 bg-gold/[0.03] group-hover:bg-transparent"></div>
                                <span className="font-serif text-[6.5rem] text-gold group-hover:text-white transition-colors duration-700 italic opacity-80">0{i + 1}</span>
                                <div className="absolute inset-0 border-[0.5px] border-gold/10 group-hover:border-white/20 transition-all rounded-full scale-[1.2] group-hover:scale-100 opacity-0 group-hover:opacity-100 duration-1000"></div>
                            </div>
                            <div className="px-8">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                                    <span className="text-[11px] uppercase tracking-[0.6em] text-gold font-black italic opacity-80">{item.cat}</span>
                                </div>
                                <h4 className="text-3xl font-serif mb-6 text-charcoal italic tracking-tight">{item.tech}</h4>
                                <p className="text-charcoal/40 text-[14px] leading-relaxed font-serif italic opacity-90">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Infrastructure;
