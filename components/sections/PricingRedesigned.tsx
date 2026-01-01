"use client";

import React from 'react';
import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const PricingRedesigned = () => {
    const plans = [
        {
            name: "Free",
            price: "€0",
            period: "per sempre",
            desc: "Perfetto per testare",
            features: ["1 Clone AI", "1 Landing Page", "500 messaggi/mese", "Watermark VirtualTwin"],
            cta: "Prova Gratis",
            href: "/auth/register",
            style: "bg-white border-charcoal/10"
        },
        {
            name: "Starter",
            price: "€97",
            period: "/mese",
            desc: "Per freelancer e piccole attività",
            features: ["1 Clone AI", "5 Landing Page", "2.000 messaggi/mese", "Nessun Watermark", "Analytics Base"],
            cta: "Inizia Ora",
            href: "/auth/register?plan=starter",
            style: "bg-white border-gold/30 shadow-xl",
            popular: true
        },
        {
            name: "Pro",
            price: "€197",
            period: "/mese",
            desc: "Per PMI e agenzie",
            features: ["3 Cloni AI", "Landing Illimitate", "10.000 messaggi/mese", "A/B Testing", "Custom Domain"],
            cta: "Upgrade",
            href: "/auth/register?plan=pro",
            style: "bg-white border-charcoal/10"
        },
        {
            name: "Agency",
            price: "€397",
            period: "/mese",
            desc: "White-label per agenzie",
            features: ["10 Cloni AI", "Tutto illimitato", "White-label completo", "Gestione Clienti", "Supporto Prioritario"],
            cta: "Contattaci",
            href: "/contact",
            style: "bg-charcoal text-white border-transparent",
            dark: true
        }
    ];

    return (
        <section id="pricing" className="py-32 lg:py-48 px-6 lg:px-12 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black mb-4 block">Investimento</span>
                    <h2 className="font-serif text-[2.5rem] md:text-[4rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal mb-6">
                        Scegli il Tuo <span className="italic gold-text-gradient">Livello.</span>
                    </h2>
                    <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                        14 giorni di prova gratuita. Nessuna carta di credito richiesta.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative rounded-3xl p-8 border ${plan.style} flex flex-col transition-all duration-500 hover:-translate-y-2`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[9px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                                    <Zap className="w-3 h-3" />
                                    Più Scelto
                                </div>
                            )}

                            {/* Plan Name */}
                            <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-4 ${plan.dark ? 'text-white/50' : 'text-charcoal/40'}`}>
                                {plan.name}
                            </p>

                            {/* Price */}
                            <div className="mb-4">
                                <span className={`text-5xl font-serif tracking-tight ${plan.dark ? 'text-white' : 'text-charcoal'}`}>
                                    {plan.price}
                                </span>
                                <span className={`text-sm ml-1 ${plan.dark ? 'text-white/50' : 'text-charcoal/40'}`}>
                                    {plan.period}
                                </span>
                            </div>

                            {/* Description */}
                            <p className={`text-sm mb-8 ${plan.dark ? 'text-white/60' : 'text-charcoal/50'}`}>
                                {plan.desc}
                            </p>

                            {/* Features */}
                            <div className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.dark ? 'bg-white/10' : 'bg-gold/10'}`}>
                                            <Check className={`w-3 h-3 ${plan.dark ? 'text-white' : 'text-gold'}`} />
                                        </div>
                                        <span className={`text-sm ${plan.dark ? 'text-white/80' : 'text-charcoal/70'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href={plan.href}
                                className={`block w-full text-center py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 ${plan.dark
                                    ? 'bg-white text-charcoal hover:bg-gold hover:text-white'
                                    : plan.popular
                                        ? 'gold-gradient text-white shadow-lg hover:shadow-xl'
                                        : 'border border-charcoal/10 text-charcoal hover:bg-charcoal hover:text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingRedesigned;
