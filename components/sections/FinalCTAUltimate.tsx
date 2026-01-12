"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Crown, Check, Lock, Shield, TrendingUp } from 'lucide-react';
import { getCurrentWaveSpotsRemaining, getDisplayPricing, getDaysUntilPriceIncrease } from '@/lib/waves';

const FinalCTAUltimate = () => {
    const [inView, setInView] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sector, setSector] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [pricingInfo, setPricingInfo] = useState<{ tier: string, waveName?: string } | null>(null);
    const [daysToIncrease, setDaysToIncrease] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const fetchWaves = async () => {
            const [spots, pricing] = await Promise.all([
                getCurrentWaveSpotsRemaining(),
                getDisplayPricing()
            ]);
            setSpotsLeft(spots);
            setPricingInfo(pricing);
            setDaysToIncrease(getDaysUntilPriceIncrease());
        };
        fetchWaves();

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accepted) {
            setSubmitted(true);
            setSpotsLeft(prev => Math.max(0, prev - 1));
        }
    };

    const sectors = [
        "E-commerce",
        "Consulenza",
        "Agenzia",
        "SaaS",
        "Coaching",
        "Real Estate",
        "Altro"
    ];

    return (
        <section ref={sectionRef} className="py-12 lg:py-20 px-6 lg:px-12 bg-charcoal relative overflow-hidden">
            <div className={`max-w-5xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {!submitted ? (
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* LEFT SIDE - Info */}
                        <div>
                            {/* Crown Icon */}
                            <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                <Crown className="w-8 h-8 text-white" />
                            </div>

                            {/* Title */}
                            <h2 className="font-serif text-3xl lg:text-4xl text-white font-medium mb-4">
                                Ingresso <span className="italic text-gold">VIP Elite</span>
                            </h2>

                            {/* Subtitle */}
                            <p className="text-white/50 text-sm lg:text-base mb-8 max-w-sm leading-relaxed">
                                {pricingInfo?.tier === 'founder'
                                    ? `L'opportunità ${pricingInfo.waveName || 'Genesis'} Founder chiude per sempre. Entra ora o pagherai prezzi pieni.`
                                    : `I prezzi della wave H1 2026 stanno per scadere. Blocca ora il tuo piano prima dell'aumento.`}
                            </p>

                            {/* Scarcity Badge */}
                            <div className="inline-flex items-center gap-3 px-5 py-3 gold-gradient rounded-full mb-8 shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse">
                                <Crown className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-bold uppercase tracking-wider">
                                    {pricingInfo?.tier === 'founder'
                                        ? `Solo ${spotsLeft} posti rimasti!`
                                        : `Aumento tra ${daysToIncrease} giorni!`}
                                </span>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
                                <Shield className="w-4 h-4" />
                                <span>Dati sicuri & Crittografati</span>
                            </div>

                            {/* Social Proof Placeholder - Cleaned for Launch */}
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-gold" />
                                    </div>
                                </div>
                                <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-black">
                                    Sviluppato con Tecnologia AI d'Avanguardia
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Form */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name & Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-2 block">Nome</label>
                                        <input
                                            type="text"
                                            placeholder="Il tuo nome"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold transition-colors text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-2 block">Email *</label>
                                        <input
                                            type="email"
                                            placeholder="la.tua@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-gold transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Sector Dropdown */}
                                <div>
                                    <label className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-2 block">Settore</label>
                                    <select
                                        value={sector}
                                        onChange={(e) => setSector(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 focus:outline-none focus:border-gold transition-colors text-sm appearance-none cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                                    >
                                        <option value="" className="bg-charcoal">Seleziona il tuo ambito...</option>
                                        {sectors.map((s, i) => (
                                            <option key={i} value={s} className="bg-charcoal">{s}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Checkbox */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="accept"
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                        className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-gold focus:ring-gold cursor-pointer"
                                    />
                                    <label htmlFor="accept" className="text-white/40 text-xs cursor-pointer">
                                        Accetto la <span className="text-gold">Privacy Policy</span> e i <span className="text-gold">Termini di Servizio</span>. I tuoi dati sono al sicuro.
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!accepted || !email}
                                    className="group w-full bg-white/10 hover:gold-gradient disabled:bg-white/5 disabled:cursor-not-allowed py-4 rounded-lg text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300"
                                >
                                    Entra nella Waitlist
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                {/* Footer Note */}
                                <p className="text-white/30 text-[10px] text-center flex items-center justify-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    Zero spam. Solo accesso al lancio.
                                </p>
                            </form>
                        </div>
                    </div>
                ) : (
                    /* SUCCESS STATE */
                    <div className="text-center py-8">
                        <div className="w-20 h-20 mx-auto mb-6 gold-gradient rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="font-serif text-2xl text-white mb-2">Sei nella Lista VIP!</h3>
                        <p className="text-white/50 text-sm max-w-md mx-auto">
                            Ti contatteremo entro 24 ore con il tuo accesso prioritario al prezzo Founder.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FinalCTAUltimate;
