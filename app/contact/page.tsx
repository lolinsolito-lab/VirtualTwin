"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Mail, Phone, MapPin, MessageCircle, Check, Building2 } from 'lucide-react';

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        plan: 'agency',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send an email or save to Supabase
        setSubmitted(true);
    };

    // Auto-detect plan and reason from URL
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const plan = params.get('plan');
            const reason = params.get('reason');

            if (plan) {
                setFormData(prev => ({ ...prev, plan: plan }));
                if (reason === 'bonifico') {
                    setFormData(prev => ({
                        ...prev,
                        message: `Richiesta coordinate per pagamento con Bonifico Bancario per il piano: ${plan.toUpperCase()}. Desidero attivare l'abbonamento annuale con sconto 15%.`
                    }));
                }
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-champagne">
            {/* Header */}
            <header className="px-6 lg:px-24 py-8">
                <Link href="/" className="inline-flex items-center gap-3 text-charcoal/60 hover:text-gold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Torna alla Home</span>
                </Link>
            </header>

            <div className="px-6 lg:px-24 pb-24">
                <div className="max-w-6xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-8">
                            <Building2 className="w-4 h-4 text-gold" />
                            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-black">Piano Imperatore</span>
                        </div>
                        <h1 className="font-serif text-[3rem] lg:text-[5rem] text-charcoal leading-[0.9] mb-6">
                            Costruiamo il Tuo <span className="italic gold-text-gradient">Impero.</span>
                        </h1>
                        <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                            Il piano Agency è pensato per chi vuole scalare. Parliamone insieme.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-charcoal/5">
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Nome Completo</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-5 py-4 bg-champagne border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                            placeholder="Mario Rossi"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Email Aziendale</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-5 py-4 bg-champagne border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                            placeholder="mario@azienda.it"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Azienda</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-5 py-4 bg-champagne border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                            placeholder="La Tua Azienda S.r.l."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Messaggio</label>
                                        <textarea
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-5 py-4 bg-champagne border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors resize-none"
                                            placeholder="Raccontaci le tue esigenze..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full gold-gradient px-8 py-5 rounded-xl text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg"
                                    >
                                        <Send className="w-4 h-4" />
                                        Invia Richiesta
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 mx-auto mb-6 gold-gradient rounded-full flex items-center justify-center">
                                        <Check className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-serif italic text-charcoal mb-3">Ricevuto!</h3>
                                    <p className="text-charcoal/60 mb-6">Ti contatteremo entro 24 ore per discutere il tuo piano personalizzato.</p>
                                    <Link href="/" className="text-gold font-bold text-sm hover:underline">
                                        Torna alla Home
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-8">
                            <div className="bg-charcoal rounded-[2rem] p-10 text-white">
                                <h3 className="font-serif text-2xl italic mb-6">Piano Imperatore Include:</h3>
                                <ul className="space-y-4">
                                    {[
                                        "10 Cloni AI personalizzati",
                                        "50,000 messaggi/mese",
                                        "White-label completo",
                                        "API Priority (300 req/min)",
                                        "Account Manager dedicato",
                                        "Priority Support <6h",
                                        "Onboarding 2h incluso",
                                        "Fair Use Policy"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Check className="w-5 h-5 text-gold" />
                                            <span className="text-white/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-white/40 text-sm">A partire da</p>
                                    <p className="text-4xl font-serif text-gold">€697<span className="text-lg text-white/40">/mese</span></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <a href="mailto:enterprise@virtualtwin.ai" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-charcoal/5 hover:shadow-lg hover:border-gold/20 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-charcoal font-medium">enterprise@virtualtwin.ai</p>
                                        <p className="text-charcoal/40 text-sm">Risposta in 24h</p>
                                    </div>
                                </a>
                                <a href="tel:+390212345678" className="flex items-center gap-4 p-5 bg-white rounded-xl border border-charcoal/5 hover:shadow-lg hover:border-gold/20 transition-all">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-charcoal font-medium">+39 02 1234 5678</p>
                                        <p className="text-charcoal/40 text-sm">Lun-Ven 9:00-18:00</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
