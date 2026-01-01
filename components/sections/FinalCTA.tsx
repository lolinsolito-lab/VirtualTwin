"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const FinalCTA = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        setSubmitted(true);
    };

    return (
        <section className="py-32 lg:py-48 px-6 lg:px-12 bg-charcoal relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Gold Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 blur-[200px] rounded-full"></div>

            <div className="max-w-2xl mx-auto text-center relative z-10">
                {/* Title */}
                <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-medium leading-[0.95] tracking-[-0.02em] text-white mb-8">
                    Pronto a <span className="italic gold-text-gradient">Clonarti?</span>
                </h2>

                {/* Subtitle */}
                <p className="text-white/50 text-lg lg:text-xl font-serif italic mb-12 max-w-lg mx-auto">
                    Unisciti a centinaia di professionisti che hanno automatizzato le loro vendite.
                </p>

                {/* Form */}
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="La tua email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-gold transition-colors text-sm"
                        />
                        <button
                            type="submit"
                            className="gold-gradient px-8 py-4 rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Inizia
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <div className="bg-white/10 border border-gold/30 rounded-2xl p-8 max-w-md mx-auto">
                        <p className="text-gold text-lg font-serif italic mb-2">Grazie!</p>
                        <p className="text-white/60 text-sm">Ti contatteremo presto con i dettagli per iniziare.</p>
                    </div>
                )}

                {/* Trust Text */}
                <p className="mt-8 text-white/30 text-sm">
                    14 giorni gratis · Nessuna carta richiesta · Cancella quando vuoi
                </p>
            </div>
        </section>
    );
};

export default FinalCTA;
