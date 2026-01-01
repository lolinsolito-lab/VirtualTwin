
"use client";

import React from 'react';

const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-champagne animate-soft-focus perspective-3d">
            {/* Neural Grid Overlay */}
            <div className="absolute inset-0 neural-grid opacity-[0.03] z-1"></div>

            {/* Cyber-Luxury Mastermind Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 opacity-10">
                <div className="absolute inset-0 bg-gold/10 blur-[120px] rounded-full animate-neural-pulse"></div>
                <div className="absolute inset-[20%] border-[0.5px] border-gold/20 rounded-full animate-neural-pulse [animation-duration:15s]"></div>
                <div className="absolute inset-[35%] border-[0.5px] border-gold/30 rounded-full animate-neural-pulse [animation-direction:reverse]"></div>
            </div>

            <div className="relative z-20 text-center max-w-7xl px-8 flex flex-col items-center">
                <div className="mb-20">
                    <span className="text-gold text-[10px] uppercase tracking-[2em] block font-black italic opacity-50">
                        Virtualtwin Mastermind Intelligence
                    </span>
                    <div className="w-40 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-6"></div>
                </div>

                <div className="relative transform-style-3d group">
                    <h1 className="font-serif text-[4.5rem] lg:text-[10rem] font-medium leading-[0.9] mb-24 tracking-tighter text-charcoal transition-transform duration-1000 group-hover:translate-z-10">
                        L'Essenza <br />
                        <span className="italic font-light gold-text-gradient drop-shadow-2xl">Aumentata.</span>
                    </h1>

                    {/* Cyber-Luxury Floating Silk Card - Repositioned to avoid overlap */}
                    <div className="absolute -top-40 -right-[28rem] hidden 2xl:block silk-card p-14 rounded-[3.5rem] w-80 text-left rotate-[5deg] border border-white/60 shadow-luxury holographic-glimmer animate-floating-master hover:rotate-0 transition-all duration-1000">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full gold-gradient shadow-luxury flex items-center justify-center text-white text-[10px]">
                                <span className="animate-pulse">AI</span>
                            </div>
                            <div className="h-px flex-1 bg-gold/20"></div>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-black mb-4 italic">Neural Mastermind</p>
                        <p className="text-base text-charcoal/40 font-serif italic tracking-wide leading-relaxed mb-6">
                            "L'architettura metabolizza il tuo pensiero, rendendo l'automazione un'opera d'arte."
                        </p>
                        <div className="flex justify-between items-center text-[7px] uppercase tracking-widest text-gold/40 font-black border-t border-charcoal/5 pt-4">
                            <span>Status: Active</span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                                Synced
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-lg lg:text-2xl text-charcoal/40 font-serif italic tracking-tight mb-32 max-w-3xl mx-auto leading-relaxed opacity-90 px-10 border-l-[0.5px] border-r-[0.5px] border-gold/10">
                    "Oltre la realtà, una proiezione perfetta. Il tuo Virtualtwin ordisce il tuo impero con la precisione di una mente maestra artificiale."
                </p>

                <div className="group relative">
                    <div className="absolute -inset-12 bg-gold/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <button className="relative gold-gradient px-40 py-12 rounded-full text-white font-black uppercase tracking-[0.8em] hover:scale-105 hover:px-44 transition-all duration-1000 shadow-[0_20px_50px_-10px_rgba(212,175,55,0.3)] text-[10px] holographic-glimmer overflow-hidden">
                        <span className="relative z-10">Inizia la Proiezione</span>
                        <div className="absolute inset-x-0 bottom-0 h-px bg-white/40"></div>
                    </button>
                </div>
            </div>

            <div className="absolute bottom-16 flex flex-col items-center gap-14 opacity-40">
                <div className="w-[0.5px] h-64 bg-gradient-to-b from-transparent via-gold/50 to-transparent"></div>
                <span className="text-[8px] uppercase tracking-[3em] font-black text-charcoal italic translate-x-[1.5em]">Automated Sovereignty</span>
            </div>
        </section>
    );
};

export default Hero;
