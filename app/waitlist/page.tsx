'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Clock,
    Mail,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Bell,
    Users,
    Zap
} from 'lucide-react';

export default function WaitlistPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [plan, setPlan] = useState('pioniere');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const nextWaveInfo = {
        name: 'Pioneer',
        startDate: 'Aprile 2026',
        spots: 30,
        discount: '€50 di sconto rispetto a Genesis'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    full_name: name,
                    interested_plan: plan,
                    source: 'waitlist_page',
                    metadata: {
                        wave: 'pioneer',
                        referrer: typeof window !== 'undefined' ? document.referrer : null,
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Errore durante l\'iscrizione');
            }

            setIsSuccess(true);
        } catch (err) {
            setError('Si è verificato un errore. Riprova più tardi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success State
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-champagne via-white to-gold/5 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold text-charcoal mb-4">
                        Sei nella Lista! 🎉
                    </h1>

                    <p className="text-charcoal/60 mb-6">
                        Ti contatteremo appena la <strong>Pioneer Wave</strong> sarà disponibile
                        ({nextWaveInfo.startDate}).
                    </p>

                    <div className="bg-gold/10 rounded-2xl p-6 mb-8">
                        <p className="text-sm text-charcoal/70 mb-2">Cosa succede ora:</p>
                        <ul className="text-left space-y-2 text-charcoal">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Email di conferma inviata
                            </li>
                            <li className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-gold" />
                                Ti avviseremo prima degli altri
                            </li>
                            <li className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-gold" />
                                Accesso prioritario garantito
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 py-3 px-6 bg-charcoal/10 text-charcoal rounded-xl font-semibold hover:bg-charcoal/20 transition text-center"
                        >
                            Torna alla Home
                        </Link>
                        <Link
                            href="/start"
                            className="flex-1 py-3 px-6 bg-gold text-white rounded-xl font-semibold hover:bg-gold/90 transition text-center flex items-center justify-center gap-2"
                        >
                            <Zap className="w-4 h-4" />
                            Inizia Subito
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-champagne via-white to-gold/5">
            {/* Hero */}
            <div className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8"
                        >
                            <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-red-600 font-semibold text-sm">
                                Genesis Wave - SOLD OUT
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold text-charcoal mb-6"
                        >
                            I primi 20 posti sono{' '}
                            <span className="text-red-500">esauriti!</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-charcoal/60 mb-12 max-w-2xl mx-auto"
                        >
                            Ma non preoccuparti! La <strong className="text-gold">Pioneer Wave</strong> inizia
                            ad <strong>{nextWaveInfo.startDate}</strong> con altri <strong>{nextWaveInfo.spots} posti</strong> esclusivi.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto px-4 pb-24">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 border border-gold/10"
                    >
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto bg-gold/10 rounded-2xl flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-gold" />
                            </div>
                            <h2 className="text-2xl font-bold text-charcoal mb-2">
                                Iscriviti alla Waitlist
                            </h2>
                            <p className="text-charcoal/60 text-sm">
                                Sarai il primo a sapere quando apriremo la Pioneer Wave
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Il tuo nome
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-champagne/50 border border-charcoal/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
                                    placeholder="Mario Rossi"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-champagne/50 border border-charcoal/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
                                    placeholder="mario@azienda.com"
                                />
                            </div>

                            {/* Plan Interest */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Piano di interesse
                                </label>
                                <select
                                    value={plan}
                                    onChange={(e) => setPlan(e.target.value)}
                                    className="w-full px-4 py-3 bg-champagne/50 border border-charcoal/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
                                >
                                    <option value="esploratore">Esploratore (€197/mese)</option>
                                    <option value="pioniere">Pioniere (€397/mese) - Più Popolare</option>
                                    <option value="conquistatore">Conquistatore (€747/mese)</option>
                                </select>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-gold to-yellow-600 text-white rounded-xl font-bold text-lg hover:from-gold/90 hover:to-yellow-600/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Iscrizione in corso...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Iscrivimi alla Waitlist
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Info */}
                        <div className="mt-8 p-4 bg-gold/5 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-charcoal/70">
                                    <strong className="text-charcoal">Pioneer Wave: {nextWaveInfo.startDate}</strong>
                                    <br />
                                    {nextWaveInfo.spots} posti disponibili • Prezzo Founder esclusivo
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Alternative */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-charcoal/50 mb-4">
                            Non vuoi aspettare? Inizia subito con il prezzo pubblico.
                        </p>
                        <Link
                            href="/start"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal text-white rounded-xl font-semibold hover:bg-charcoal/90 transition"
                        >
                            <Zap className="w-5 h-5" />
                            Inizia Subito
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
