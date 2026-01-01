"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, AlertTriangle, ArrowRight, Clock, Shield, Sparkles } from 'lucide-react';

export default function ExitIntentPopup() {
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('');
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        // Check if already triggered this session
        const triggered = sessionStorage.getItem('exit_popup_shown');
        if (triggered) {
            setHasTriggered(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger when mouse moves to top of page (about to close tab)
            if (e.clientY <= 0 && !hasTriggered) {
                setShowPopup(true);
                setHasTriggered(true);
                sessionStorage.setItem('exit_popup_shown', 'true');
            }
        };

        // Desktop: Mouse leave detection
        document.addEventListener('mouseleave', handleMouseLeave);

        // Mobile: Time-based trigger (30 seconds)
        const mobileTimer = setTimeout(() => {
            if (!hasTriggered && window.innerWidth < 768) {
                setShowPopup(true);
                setHasTriggered(true);
                sessionStorage.setItem('exit_popup_shown', 'true');
            }
        }, 30000);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(mobileTimer);
        };
    }, [hasTriggered]);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowPopup(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (!showPopup) return null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-charcoal/80 backdrop-blur-md p-4"
            onClick={() => setShowPopup(false)}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 hover:bg-charcoal hover:text-white transition-all"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 pt-10 pb-6 border-b border-charcoal/5">
                    <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Aspetta!</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl text-center text-charcoal leading-tight">
                        Stai perdendo clienti <span className="italic text-gold">adesso</span>
                    </h3>
                    <p className="text-center text-charcoal/50 mt-2 text-sm">
                        Mentre sei su questa pagina, qualcuno sta scrivendo e non riceve risposta.
                    </p>
                </div>

                {/* Content */}
                <div className="px-8 py-8">
                    {/* Quick Stats */}
                    <div className="flex justify-center gap-6 mb-8">
                        {[
                            { icon: Clock, label: "Setup", value: "5 min" },
                            { icon: Shield, label: "Rischio", value: "Zero" },
                            { icon: Sparkles, label: "Trial", value: "14 gg" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <stat.icon className="w-5 h-5 text-gold mx-auto mb-1" />
                                <p className="text-lg font-serif text-charcoal font-bold">{stat.value}</p>
                                <p className="text-[10px] uppercase tracking-wider text-charcoal/40">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Email Capture */}
                    <div className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="La tua email migliore..."
                            className="w-full px-6 py-4 rounded-full border border-charcoal/10 focus:outline-none focus:border-gold transition-colors text-center"
                        />
                        <Link
                            href={`/auth/register?email=${encodeURIComponent(email)}`}
                            className="group w-full gold-gradient flex items-center justify-center gap-3 px-8 py-5 rounded-full text-white font-bold text-sm uppercase tracking-wider hover:scale-[1.02] transition-all shadow-lg"
                        >
                            Inizia Gratis in 47 Secondi
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[10px] text-charcoal/40 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> No carta richiesta
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> 14gg gratis
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Cancella quando vuoi
                        </span>
                    </div>
                </div>

                {/* Skip Link */}
                <div className="text-center pb-6">
                    <button
                        onClick={() => setShowPopup(false)}
                        className="text-charcoal/30 text-xs hover:text-charcoal/60 transition-colors"
                    >
                        No grazie, preferisco rispondere manualmente
                    </button>
                </div>
            </div>
        </div>
    );
}
