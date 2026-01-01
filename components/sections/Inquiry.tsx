
"use client";

import React from 'react';

const Inquiry = () => {
    return (
        <section className="py-80 bg-champagne relative overflow-hidden perspective-3d">
            {/* Neural Grid Grid */}
            <div className="absolute inset-0 neural-grid opacity-[0.03] z-0"></div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.15)_0%,_transparent_75%)] opacity-40"></div>
            <div className="max-w-6xl mx-auto px-8 text-center relative z-10 animate-soft-focus">
                <h2 className="font-serif text-[6.5rem] lg:text-[14rem] mb-40 italic text-charcoal leading-[0.75] tracking-tighter">Esclusività <br /> <span className="gold-text-gradient drop-shadow-2xl">Olografica.</span></h2>

                <div className="silk-card p-24 lg:p-48 rounded-[7rem] border border-white/90 shadow-luxury relative overflow-hidden holographic-glimmer perspective-3d group">
                    <div className="absolute inset-0 bg-white/50 pointer-events-none transition-opacity group-hover:opacity-30"></div>

                    {/* Floating Neural Pulse Core Icon */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 gold-gradient rounded-full flex items-center justify-center shadow-luxury animate-neural-pulse border border-white/60 z-20 overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        <svg className="w-18 h-18 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <div className="relative z-10 transform transition-transform group-hover:translate-z-10">
                        <p className="text-gold mb-36 uppercase text-[13px] tracking-[1.8em] font-black italic opacity-80 flex items-center justify-center gap-6">
                            <span className="w-10 h-[0.5px] bg-gold/30"></span>
                            Accesso Riservato Mastermind
                            <span className="w-10 h-[0.5px] bg-gold/30"></span>
                        </p>

                        <form className="space-y-28 max-w-3xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group/input">
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-6 h-6 border-[0.5px] border-gold/30 rounded-full opacity-0 group-focus-within/input:opacity-100 transition-all duration-700"></div>
                                <input
                                    type="text"
                                    placeholder="IDENTITÀ O ISTITUZIONE D'ELITE"
                                    className="w-full bg-transparent border-b border-charcoal/5 py-12 outline-none focus:border-gold transition-all duration-1000 text-center font-serif text-[2.5rem] lg:text-[3.5rem] italic text-charcoal placeholder:text-charcoal/10 tracking-tight"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold group-focus-within/input:w-full transition-all duration-[1.5s]"></div>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-6 h-6 border-[0.5px] border-gold/30 rounded-full opacity-0 group-focus-within/input:opacity-100 transition-all duration-700"></div>
                                <input
                                    type="email"
                                    placeholder="CANALE EMAIL DIREZIONALE"
                                    className="w-full bg-transparent border-b border-charcoal/5 py-12 outline-none focus:border-gold transition-all duration-1000 text-center font-serif text-[2.5rem] lg:text-[3.5rem] italic text-charcoal placeholder:text-charcoal/10 tracking-tight"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold group-focus-within/input:w-full transition-all duration-[1.5s]"></div>
                            </div>

                            <div className="pt-24 relative overflow-hidden">
                                <button className="w-full py-14 gold-gradient text-white font-black uppercase tracking-[1.2em] rounded-full hover:scale-105 transition-all duration-1000 shadow-luxury text-[13px] holographic-glimmer">
                                    Sottoponi alla Mente Maestra
                                </button>
                                <div className="mt-16 flex flex-col gap-4">
                                    <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.5em] font-black italic">Protocollo Virtual Intelligence Sovereign Attivo</p>
                                    <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Cyber-Luxury 3D Grid Patter in background of card */}
                    <div className="absolute inset-x-0 bottom-0 h-40 neural-grid opacity-[0.05] z-0"></div>
                </div>
            </div>
        </section>
    );
};

export default Inquiry;
