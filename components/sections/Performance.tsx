
"use client";

import React from 'react';

const Performance = () => {
    return (
        <section id="performance" className="py-72 bg-champagne relative overflow-hidden perspective-3d">
            {/* Neural Pattern Background */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
            <div className="absolute inset-0 neural-grid opacity-[0.02] z-0"></div>

            <div className="max-w-7xl mx-auto px-10 relative z-10 animate-soft-focus">
                <div className="text-center mb-64">
                    <span className="text-gold text-[10px] uppercase tracking-[2em] mb-12 block font-black italic opacity-60">Architettura Finanziaria Neurale</span>
                    <h3 className="font-serif text-[5rem] lg:text-[9.5rem] font-medium text-charcoal italic leading-[0.85] tracking-tighter">Valore <br /> <span className="gold-text-gradient drop-shadow-2xl">Liquido.</span></h3>
                    <div className="w-[0.5px] h-32 bg-gold/20 mx-auto mt-16"></div>
                </div>

                <div className="grid lg:grid-cols-12 gap-24 items-stretch">
                    <div className="lg:col-span-7 silk-card p-20 lg:p-28 rounded-[4.5rem] flex flex-col justify-center border border-white shadow-luxury holographic-glimmer perspective-3d group">
                        <div className="flex items-center gap-8 mb-16 border-b border-charcoal/5 pb-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse"></div>
                            <h4 className="text-3xl font-serif italic tracking-tight">Proiezione Sovrana</h4>
                            <div className="h-px flex-1 bg-gold/10"></div>
                        </div>

                        <div className="space-y-12">
                            {[
                                { label: "Punto di Svolta (M5)", val: "20 Elite", elite: true },
                                { label: "Target M12", val: "€14.550", elite: false },
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-end border-b border-charcoal/5 pb-10 group/row transition-all duration-700">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-charcoal/40 text-[9px] uppercase tracking-[0.6em] font-black">{item.label}</span>
                                        <div className="w-0 h-[0.5px] bg-gold/40 group-hover/row:w-full transition-all duration-1000"></div>
                                    </div>
                                    <span className={`text-5xl font-serif ${item.elite ? 'text-gold italic' : 'text-charcoal'} group-hover/row:translate-x-[-8px] transition-transform duration-700`}>{item.val}</span>
                                </div>
                            ))}

                            <div className="flex justify-between items-end pt-20 group/total">
                                <div className="flex flex-col gap-4">
                                    <span className="text-gold text-[14px] uppercase tracking-[0.6em] font-black italic">Profitto Netto</span>
                                    <span className="text-charcoal/25 text-[9px] uppercase tracking-[0.3em] font-bold">Protocollo Mastermind v2.5</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-8xl font-serif text-charcoal drop-shadow-2xl tracking-tighter group-hover/total:scale-105 transition-transform duration-1000 origin-right block">€22.293</span>
                                    <span className="text-[7px] uppercase tracking-[0.4em] text-gold/40 font-black">AI Accuracy: 99.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 gap-12">
                        {[
                            { label: "Elite Access", val: "150", sub: "Licenze Annuali", color: "gold" },
                            { label: "Maintenance", val: "€56", sub: "Cloud Fee", color: "charcoal" },
                            { label: "Scalabilità", val: "∞", sub: "Neural Node", color: "charcoal" },
                            { label: "Rendimento", val: "94%", sub: "Efficiency AI", color: "gold" }
                        ].map((stat, i) => (
                            <div key={i} className="silk-card p-12 rounded-[3.5rem] group border border-white hover:bg-white/50 duration-1000 flex flex-col justify-between holographic-glimmer perspective-3d hover:-translate-y-4 shadow-luxury">
                                <div className="flex justify-between items-start mb-10">
                                    <p className="text-[9px] uppercase tracking-[0.7em] text-gold font-black italic opacity-60">{stat.label}</p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold/30 animate-neural-pulse"></div>
                                </div>
                                <div>
                                    <p className={`text-6xl font-serif ${stat.color === 'gold' ? 'text-gold italic' : 'text-charcoal'} mb-6 group-hover:scale-105 transition-transform duration-1000 tracking-tighter origin-left`}>{stat.val}</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[0.5px] w-6 bg-charcoal/10 group-hover:w-12 transition-all duration-1000"></div>
                                        <p className="text-[9px] text-charcoal/30 uppercase tracking-[0.4em] font-black">{stat.sub}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom pattern */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/20 to-transparent"></div>
        </section>
    );
};

export default Performance;
