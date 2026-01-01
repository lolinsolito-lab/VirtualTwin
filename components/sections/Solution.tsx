"use client";

import React from 'react';

const Solution = () => {
    return (
        <section className="py-32 lg:py-48 px-6 lg:px-12 bg-champagne relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        {/* Label */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-[1px] w-12 bg-gold/40"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.4em] font-black">La Soluzione</span>
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal mb-8">
                            La Tua <br />
                            <span className="italic gold-text-gradient">Mente Maestra.</span>
                        </h2>

                        {/* Description */}
                        <p className="text-charcoal/50 text-lg lg:text-xl font-serif italic leading-relaxed mb-12 max-w-lg">
                            Un clone digitale che <span className="text-charcoal font-medium not-italic">parla come te</span>,
                            <span className="text-charcoal font-medium not-italic"> vende come te</span>,
                            ma lavora <span className="text-charcoal font-medium not-italic">24 ore su 24</span>.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4">
                            {[
                                "Risponde in meno di 2 secondi",
                                "Qualifica i lead automaticamente",
                                "Mantiene il tuo tono di voce",
                                "Funziona su WhatsApp, Instagram e Messenger"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                                        <span className="text-gold group-hover:text-white text-xs">✓</span>
                                    </div>
                                    <span className="text-charcoal/70 text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Mockup */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-10 border border-charcoal/5 relative overflow-hidden">
                            {/* Phone Header */}
                            <div className="flex items-center gap-4 pb-6 border-b border-charcoal/5 mb-6">
                                <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-white font-serif text-lg shadow-lg">
                                    VM
                                </div>
                                <div>
                                    <p className="text-charcoal font-medium">VirtualTwin AI</p>
                                    <p className="text-green-500 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="space-y-4">
                                {/* Incoming */}
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                    <p className="text-charcoal/80 text-sm">Ciao! Quanto costa il vostro servizio?</p>
                                    <p className="text-charcoal/30 text-[10px] mt-2">14:32</p>
                                </div>

                                {/* Outgoing (AI) */}
                                <div className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tr-none p-4 max-w-[85%] ml-auto">
                                    <p className="text-[9px] text-gold font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <span className="w-1 h-1 bg-gold rounded-full"></span>
                                        AI Clone
                                    </p>
                                    <p className="text-charcoal text-sm leading-relaxed">
                                        Certamente! Abbiamo piani a partire da €97/mese. Posso inviarti i dettagli personalizzati in base alle tue esigenze. Quanti messaggi gestisci mensilmente?
                                    </p>
                                    <p className="text-charcoal/30 text-[10px] mt-2 text-right">14:32</p>
                                </div>

                                {/* Typing indicator */}
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[30%]">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-charcoal/30 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-charcoal/30 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                                        <span className="w-2 h-2 bg-charcoal/30 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    </div>
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/10 blur-[80px] rounded-full"></div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-charcoal/5">
                            <p className="text-[9px] text-charcoal/50 uppercase tracking-wider mb-1">Tempo risposta</p>
                            <p className="text-2xl font-serif text-charcoal tracking-tight">&lt;2s</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Solution;
