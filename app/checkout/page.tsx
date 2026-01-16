'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Gift, ArrowRight, Shield, Clock, Sparkles, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { SETUP_PREMIUM } from '@/lib/stripeConfig';

/**
 * Checkout Upsell Page
 * Shows selected plan + optional add-ons before redirecting to Stripe
 * 
 * URL: /checkout?plan=entrepreneur&priceId=price_xxx&tier=founder
 */

// Add-on products configuration (scalable for future products)
const ADD_ONS = [
    {
        id: 'setup_premium',
        name: 'Setup Premium',
        description: 'Configurazione Done-For-You in 48h con call strategica 1:1',
        priceId: SETUP_PREMIUM.promoPriceId,
        price: SETUP_PREMIUM.promoAmount,
        originalPrice: SETUP_PREMIUM.regularAmount,
        icon: Gift,
        features: [
            'Configurazione completa in 48h',
            'Call 1:1 strategica di onboarding',
            'Training personalità + Tone of Voice',
            'Integrazione di tutti i canali',
            'Importazione FAQ e knowledge base',
            'Test e ottimizzazione iniziale'
        ],
        recommended: true,
        preSelectedFor: ['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore']
    }
];

// Plan display names
const PLAN_NAMES: Record<string, string> = {
    curioso: 'Curioso (Trial)',
    solopreneur: 'Solopreneur',
    entrepreneur: 'Entrepreneur',
    conquistatore: 'Conquistatore',
    imperatore: 'Imperatore'
};

// Loading fallback component
function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne via-white to-champagne flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto mb-4" />
                <p className="text-charcoal/60">Caricamento...</p>
            </div>
        </div>
    );
}

// Main checkout content component (uses useSearchParams)
function CheckoutContent() {
    const searchParams = useSearchParams();

    const planId = searchParams.get('plan') || '';
    const priceId = searchParams.get('priceId') || '';
    const tier = searchParams.get('tier') || 'public';
    const planPrice = parseInt(searchParams.get('price') || '0');

    // State for selected add-ons
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-select add-ons based on plan
    useEffect(() => {
        const preSelected = ADD_ONS
            .filter(addon => addon.preSelectedFor.includes(planId))
            .map(addon => addon.id);
        setSelectedAddOns(preSelected);
    }, [planId]);

    // Calculate totals
    const addOnsTotal = selectedAddOns.reduce((total, addonId) => {
        const addon = ADD_ONS.find(a => a.id === addonId);
        return total + (addon?.price || 0);
    }, 0);

    const monthlyTotal = planPrice;
    const oneTimeTotal = addOnsTotal;

    // Toggle add-on selection
    const toggleAddOn = (addonId: string) => {
        setSelectedAddOns(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    // Handle checkout
    const handleCheckout = async () => {
        if (!priceId) {
            setError('Piano non valido');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Get selected add-on price IDs
            const addOnPriceIds = selectedAddOns
                .map(addonId => ADD_ONS.find(a => a.id === addonId)?.priceId)
                .filter(Boolean) as string[];

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId,
                    tier,
                    plan: planId,
                    addOnPriceIds // New parameter for add-ons
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Errore durante il checkout');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('URL checkout non disponibile');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Errore. Riprova.');
            setIsLoading(false);
        }
    };

    // If missing required params, redirect back
    if (!planId || !priceId) {
        return (
            <div className="min-h-screen bg-champagne flex items-center justify-center">
                <div className="text-center">
                    <p className="text-charcoal/60 mb-4">Parametri mancanti</p>
                    <Link href="/start#pricing" className="text-gold hover:underline">
                        Torna ai piani
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne via-white to-champagne">
            {/* Header */}
            <header className="py-6 px-6 border-b border-charcoal/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/start" className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm">Torna ai piani</span>
                    </Link>
                    <div className="flex items-center gap-2 text-charcoal/40">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs">Checkout Sicuro</span>
                    </div>
                </div>
            </header>

            <main className="py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-gold text-xs uppercase tracking-widest font-black mb-4">
                            <Sparkles className="w-4 h-4" />
                            Riepilogo Ordine
                        </span>
                        <h1 className="font-serif text-3xl md:text-5xl text-charcoal mb-4">
                            Completa il Tuo <span className="text-gold italic">Ordine</span>
                        </h1>
                        <p className="text-charcoal/50">
                            Rivedi il tuo piano e aggiungi servizi opzionali
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content - Plan & Add-ons */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Selected Plan */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-charcoal/10 shadow-lg"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-charcoal/40 font-black mb-1">Piano Selezionato</p>
                                        <h3 className="text-2xl font-serif text-charcoal">{PLAN_NAMES[planId] || planId}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-serif text-charcoal">€{planPrice}</p>
                                        <p className="text-xs text-charcoal/40">/mese</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <Check className="w-4 h-4" />
                                    <span>14 giorni di prova gratuita inclusi</span>
                                </div>
                                {tier === 'founder' && (
                                    <div className="mt-3 px-3 py-1.5 bg-gold/10 rounded-lg inline-flex items-center gap-2">
                                        <span className="text-gold text-xs font-bold">👑 Prezzo Founder bloccato a vita</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Add-ons Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-lg font-serif text-charcoal mb-4 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-gold" />
                                    Aggiungi Servizi Extra
                                </h3>

                                <div className="space-y-4">
                                    {ADD_ONS.map((addon) => {
                                        const isSelected = selectedAddOns.includes(addon.id);
                                        const Icon = addon.icon;

                                        return (
                                            <div
                                                key={addon.id}
                                                onClick={() => toggleAddOn(addon.id)}
                                                className={`
                                                    relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all
                                                    ${isSelected
                                                        ? 'border-gold shadow-lg ring-2 ring-gold/20'
                                                        : 'border-charcoal/10 hover:border-charcoal/20 hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                {/* Recommended Badge */}
                                                {addon.recommended && (
                                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gold text-charcoal text-[10px] uppercase tracking-widest font-black rounded-full">
                                                        ⚡ Consigliato
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-4">
                                                    {/* Checkbox */}
                                                    <div className={`
                                                        w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all
                                                        ${isSelected
                                                            ? 'bg-gold border-gold'
                                                            : 'border-charcoal/20'
                                                        }
                                                    `}>
                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                                                    <Icon className="w-5 h-5 text-gold" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-serif text-lg text-charcoal">{addon.name}</h4>
                                                                    <p className="text-sm text-charcoal/50">{addon.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xl font-serif text-charcoal">
                                                                    <span className="text-sm text-charcoal/30 line-through mr-2">€{addon.originalPrice}</span>
                                                                    €{addon.price}
                                                                </p>
                                                                <p className="text-xs text-green-600">Risparmia €{addon.originalPrice - addon.price}</p>
                                                            </div>
                                                        </div>

                                                        {/* Features */}
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                className="mt-4 pt-4 border-t border-charcoal/5"
                                                            >
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {addon.features.map((feature, i) => (
                                                                        <div key={i} className="flex items-center gap-2 text-sm text-charcoal/70">
                                                                            <Check className="w-3 h-3 text-gold flex-shrink-0" />
                                                                            <span>{feature}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar - Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-6 bg-charcoal rounded-2xl p-6 text-white">
                                <h3 className="font-serif text-xl mb-6">Riepilogo</h3>

                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">{PLAN_NAMES[planId]}</span>
                                        <span>€{planPrice}/mese</span>
                                    </div>

                                    {selectedAddOns.map(addonId => {
                                        const addon = ADD_ONS.find(a => a.id === addonId);
                                        if (!addon) return null;
                                        return (
                                            <div key={addonId} className="flex justify-between">
                                                <span className="text-white/70">{addon.name}</span>
                                                <span className="text-gold">+€{addon.price}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/10 my-6" />

                                {/* Totals */}
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Oggi paghi</span>
                                        <span className="text-gold font-bold">€{oneTimeTotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Dopo 14 giorni</span>
                                        <span>€{monthlyTotal}/mese</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="w-full py-4 gold-gradient text-charcoal rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 animate-spin" />
                                            Caricamento...
                                        </span>
                                    ) : (
                                        <>
                                            Procedi al Pagamento
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                                )}

                                {/* Trust Badges */}
                                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex items-center gap-2 text-white/50 text-xs">
                                        <Shield className="w-4 h-4" />
                                        <span>Pagamento sicuro con Stripe</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-xs">
                                        <Check className="w-4 h-4" />
                                        <span>Cancella quando vuoi</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Default export with Suspense boundary (required for useSearchParams)
export default function CheckoutPage() {
    return (
        <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
        </Suspense>
    );
}
