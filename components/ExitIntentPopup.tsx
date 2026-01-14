"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, AlertTriangle, ArrowRight, Clock, Shield, Sparkles, Heart } from 'lucide-react';

/**
 * Exit Intent Popup - PREMIUM URGENCY VERSION
 * 
 * With visual image showing missed opportunity
 */
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
            className="fixed inset-0 z-[300] flex items-center justify-center bg-charcoal/90 backdrop-blur-md p-4"
            onClick={() => setShowPopup(false)}
        >
            <div
                className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal/40 hover:bg-charcoal hover:text-white transition-all shadow-lg"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Visual Image Header */}
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src="/images/popup/exit_urgency.png"
                        alt="La tua opportunità"
                        fill
                        className="object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

                    {/* Urgency Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-lg animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase tracking-wider">Fermati!</span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 -mt-8 relative z-10">
                    {/* Main Message */}
                    <div className="text-center mb-6">
                        <h3 className="font-serif text-2xl md:text-3xl text-charcoal leading-tight mb-3">
                            Non lasciare che il tuo futuro <br />
                            <span className="italic text-gold">ti sfugga di mano.</span>
                        </h3>
                        <p className="text-charcoal/60 text-sm">
                            Mentre esiti, i tuoi concorrenti stanno già automatizzando.<br />
                            <strong className="text-charcoal/80">Siamo qui per aiutarti.</strong>
                        </p>
                    </div>

                    {/* Urgency Stats */}
                    <div className="flex justify-center gap-8 mb-6 py-4 bg-charcoal/5 rounded-2xl">
                        {[
                            { icon: Clock, label: "Setup", value: "5 min" },
                            { icon: Shield, label: "Rischio", value: "Zero" },
                            { icon: Heart, label: "Supporto", value: "24/7" },
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
                            placeholder="Inserisci la tua email migliore..."
                            className="w-full px-6 py-4 rounded-full border-2 border-charcoal/10 focus:outline-none focus:border-gold transition-colors text-center text-sm"
                        />
                        <Link
                            href={`/auth/register?email=${encodeURIComponent(email)}`}
                            className="group w-full bg-gradient-to-r from-gold via-amber-500 to-gold flex items-center justify-center gap-3 px-8 py-5 rounded-full text-white font-bold text-sm uppercase tracking-wider hover:scale-[1.02] transition-all shadow-lg shadow-gold/30"
                        >
                            <Sparkles className="w-4 h-4" />
                            Prova Gratis Per 14 Giorni
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-[10px] text-charcoal/50 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Nessuna carta richiesta
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Cancella quando vuoi
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Setup guidato
                        </span>
                    </div>
                </div>

                {/* Skip Link */}
                <div className="text-center pb-6 px-8">
                    <button
                        onClick={() => setShowPopup(false)}
                        className="text-charcoal/30 text-xs hover:text-charcoal/60 transition-colors"
                    >
                        No grazie, continuerò a perdere tempo rispondendo manualmente
                    </button>
                </div>
            </div>
        </div>
    );
}
