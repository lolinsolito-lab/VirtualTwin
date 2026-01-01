
"use client";

import React from 'react';

const Logic = () => {
    return (
        <section id="logic" className="py-72 px-10 lg:px-32 bg-champagne relative overflow-hidden perspective-3d">
            {/* Neural Grid Background */}
            <div className="absolute inset-0 neural-grid opacity-[0.02] z-0"></div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-64 items-center relative z-10">
                <div className="space-y-32 animate-soft-focus">
                    <div className="relative">
                        <div className="flex items-center gap-10 mb-16">
                            <span className="h-px w-24 bg-gold/30"></span>
                            <span className="text-gold text-[10px] uppercase tracking-[1.5em] block font-black italic opacity-60">Architettura Neurale</span>
                        </div>
                        <h2 className="font-serif text-[4rem] lg:text-[8rem] leading-[0.9] font-medium text-charcoal tracking-tighter">
                            Pensiero <br /> <span className="italic gold-text-gradient drop-shadow-2xl">Maestro.</span>
                        </h2>
                    </div>
                    <p className="text-charcoal/40 text-xl lg:text-2xl leading-relaxed font-serif italic max-w-xl border-l-[0.5px] border-gold/20 pl-10">
                        "Non chiamarlo bot. È la tua <span className="text-charcoal font-black not-italic px-2 py-1 bg-gold/5 rounded-lg border border-gold/10">Mente Maestra Digitale</span>. Un algoritmo di pura seta che ordisce vendite e relazioni mentre tu ti dedichi all'eccellenza."
                    </p>
                    <div className="grid grid-cols-2 gap-16 pt-24">
                        <div className="silk-card px-12 py-10 rounded-[3.5rem] border border-white/80 shadow-luxury holographic-glimmer transform transition-all duration-700 hover:-translate-y-4 hover:translate-z-10 group">
                            <div className="w-8 h-px bg-gold/30 mb-8 transition-all group-hover:w-16"></div>
                            <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black mb-4 block italic opacity-50">Latenza Neurale</span>
                            <p className="text-4xl font-serif text-charcoal italic tracking-tight">Real-time</p>
                        </div>
                        <div className="silk-card px-12 py-10 rounded-[3.5rem] border border-white/80 shadow-luxury holographic-glimmer transform transition-all duration-700 hover:-translate-y-4 hover:translate-z-10 group">
                            <div className="w-8 h-px bg-gold/30 mb-8 transition-all group-hover:w-16"></div>
                            <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black mb-4 block italic opacity-50">Precisione DNA</span>
                            <p className="text-4xl font-serif text-charcoal italic tracking-tight">Simbiosi 1:1</p>
                        </div>
                    </div>
                </div>

                {/* Cyber-Luxury Holographic Chat Module */}
                <div className="relative h-[850px] flex items-center justify-center perspective-3d group">
                    {/* Neural Connection Lines (SVG) - Enhanced for better depth */}
                    <svg className="absolute inset-0 w-full h-full z-0 opacity-15" viewBox="0 0 800 800">
                        <path d="M400 50 Q 700 400 400 750" stroke="url(#gold-grad)" fill="none" strokeWidth="0.35" className="animate-pulse" />
                        <path d="M50 400 Q 400 400 750 400" stroke="url(#gold-grad)" fill="none" strokeWidth="0.35" className="animate-pulse delay-700" />
                        <circle cx="400" cy="400" r="300" stroke="url(#gold-grad)" fill="none" strokeWidth="0.35" strokeDasharray="4 8" className="animate-spin [animation-duration:60s]" />
                        <defs>
                            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--gold)" />
                                <stop offset="50%" stopColor="var(--gold-light)" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="absolute w-[150%] h-[150%] bg-gold/[0.03] rounded-full blur-[250px] -z-10 animate-neural-pulse"></div>

                    <div className="silk-card w-full max-w-lg rounded-[4.5rem] p-16 relative border border-white shadow-[var(--shadow-mastermind)] overflow-hidden holographic-glimmer animate-floating-master hover:rotate-0 transition-all duration-1000">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/[0.03] blur-[150px] animate-pulse"></div>

                        <div className="flex items-center gap-8 mb-20 border-b border-charcoal/5 pb-12 relative">
                            <div className="relative">
                                <div className="w-20 h-20 gold-gradient rounded-full shadow-luxury flex items-center justify-center text-white text-2xl font-serif border border-white/60 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-[360deg]">VM</div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-xl animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-2xl font-serif italic text-charcoal tracking-tight">Mastermind Intelligence</p>
                                <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-black opacity-40">Neural Node: Active</p>
                            </div>
                        </div>

                        <div className="space-y-16 relative">
                            <div className="silk-card p-10 rounded-[3.5rem] rounded-tl-none bg-white/40 border border-white/70 shadow-sm -translate-x-4 transform transition-all duration-1000 hover:translate-x-0">
                                <p className="text-base italic text-charcoal/70 leading-relaxed font-serif">"È possibile che l'automazione mantenga il mio tono autoritario?"</p>
                            </div>
                            <div className="silk-card p-10 rounded-[3.5rem] rounded-tr-none bg-white border border-gold/15 ml-16 shadow-luxury translate-x-4 transform transition-all duration-1000 hover:translate-x-0">
                                <p className="text-[10px] text-gold font-black uppercase tracking-[0.5em] mb-3 italic flex items-center gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                                    AI Mastermind
                                </p>
                                <p className="text-lg leading-relaxed text-charcoal font-medium tracking-tight italic">"Certamente. Il protocollo assimila la sua autorità naturale per agire con sovranità in ogni interazione."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Logic;
