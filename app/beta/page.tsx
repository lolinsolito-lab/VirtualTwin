'use client';

import { useState } from 'react';
import { Crown, Zap, Shield, Gift, ArrowRight, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/**
 * Beta Founder Landing Page
 * URL: /beta
 * 
 * Simplified page for early adopter signups
 */
export default function BetaPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;

        setLoading(true);
        setError('');

        try {
            // Save to waitlist
            const { error: dbError } = await supabase
                .from('waitlist')
                .insert({
                    email,
                    full_name: name,
                    source: 'beta_page',
                    metadata: {
                        referrer: typeof window !== 'undefined' ? document.referrer : '',
                        timestamp: new Date().toISOString()
                    }
                });

            if (dbError) {
                if (dbError.code === '23505') {
                    setError('Sei già nella lista! Ti contatteremo presto.');
                } else {
                    throw dbError;
                }
            } else {
                setSubmitted(true);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Qualcosa è andato storto. Riprova!');
        } finally {
            setLoading(false);
        }
    };

    const benefits = [
        { icon: Gift, text: 'Accesso Pioneer GRATIS (valore €97/mese)' },
        { icon: Crown, text: 'Status Founder per sempre' },
        { icon: Zap, text: 'Setup 1:1 personalizzato' },
        { icon: Shield, text: 'Priorità sulle nuove features' },
    ];

    const requirements = [
        '15 minuti per una call iniziale',
        'Feedback onesto sul prodotto',
        'Video testimonial se funziona',
    ];

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-champagne to-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-charcoal mb-4">
                        Sei dentro! 🎉
                    </h1>
                    <p className="text-charcoal/70 mb-6">
                        Ti contatterò personalmente entro 24 ore per il setup del tuo clone AI.
                    </p>
                    <p className="text-sm text-charcoal/50 mb-8">
                        Controlla la tua email (anche lo spam!)
                    </p>
                    <Link
                        href="/"
                        className="text-gold hover:underline"
                    >
                        ← Torna alla home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-champagne to-white">
            {/* Header */}
            <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-gold" />
                    <span className="font-cormorant text-xl font-bold text-charcoal">VirtualTwin</span>
                </Link>
                <span className="px-3 py-1 bg-red-500/10 text-red-600 text-sm rounded-full font-medium">
                    🔥 Solo 10 posti
                </span>
            </nav>

            {/* Hero */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-sm font-medium text-charcoal">Beta Founder Program</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-charcoal mb-6 leading-tight">
                        Vuoi un Clone AI che
                        <span className="block text-gold">Risponde per Te 24/7?</span>
                    </h1>

                    <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                        Cerco <strong>10 professionisti</strong> per testare VirtualTwin
                        gratuitamente. In cambio, chiedo solo feedback onesto.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left: Benefits */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-charcoal/5">
                        <h2 className="text-xl font-bold text-charcoal mb-6">
                            🎁 Cosa Ottieni
                        </h2>

                        <div className="space-y-4 mb-8">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                                        <benefit.icon className="w-4 h-4 text-gold" />
                                    </div>
                                    <span className="text-charcoal/80">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-xl font-bold text-charcoal mb-4">
                            📋 Cosa Chiedo
                        </h2>

                        <div className="space-y-2">
                            {requirements.map((req, i) => (
                                <div key={i} className="flex items-center gap-2 text-charcoal/70">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-charcoal rounded-2xl p-8 text-white">
                        <h2 className="text-2xl font-bold mb-6">
                            Candidati per un Posto
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Marco Rossi"
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-gold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="marco@azienda.it"
                                    required
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-gold"
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gold text-charcoal font-bold rounded-lg hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    'Invio in corso...'
                                ) : (
                                    <>
                                        Candidati Ora
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-sm text-white/40 mt-4 text-center">
                            Ti rispondo personalmente entro 24 ore
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-12 text-charcoal/50 text-sm">
                    <p>
                        Hai domande? Scrivimi su{' '}
                        <a href="https://linkedin.com/in/michael" className="text-gold hover:underline">
                            LinkedIn
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}
