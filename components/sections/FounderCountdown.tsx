"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Users, Crown } from 'lucide-react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(deadline: Date): TimeLeft {
    const difference = deadline.getTime() - new Date().getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
    };
}

interface FounderCountdownProps {
    spotsRemaining?: number;
}

export default function FounderCountdown({ spotsRemaining = 153 }: FounderCountdownProps) {
    const deadline = new Date('2026-03-31T23:59:59');
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(deadline));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(deadline));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

    const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 &&
        timeLeft.minutes === 0 && timeLeft.seconds === 0;

    if (isExpired) {
        return (
            <div className="bg-charcoal text-white rounded-2xl p-6 text-center">
                <Crown className="w-8 h-8 text-gold mx-auto mb-3" />
                <h3 className="text-lg font-bold">Founder Program Chiuso</h3>
                <p className="text-white/60 text-sm mt-2">
                    Iscriviti alla lista d&apos;attesa per la prossima apertura.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-charcoal to-charcoal/90 text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">🔥 Founder Program</h3>
                    <p className="text-white/60 text-sm">Chiusura 31 Marzo 2026</p>
                </div>
            </div>

            {/* Countdown Grid */}
            <div className="relative z-10 grid grid-cols-4 gap-3 mb-6">
                {[
                    { value: timeLeft.days, label: 'Giorni' },
                    { value: timeLeft.hours, label: 'Ore' },
                    { value: timeLeft.minutes, label: 'Min' },
                    { value: timeLeft.seconds, label: 'Sec' }
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-gold font-mono">
                            {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Spots remaining */}
            <div className="relative z-10 flex items-center gap-3 bg-gold/10 rounded-xl p-4">
                <Users className="w-5 h-5 text-gold" />
                <div>
                    <span className="text-gold font-bold">{spotsRemaining}</span>
                    <span className="text-white/70 text-sm"> posti Founder rimasti</span>
                </div>
            </div>

            {/* Benefits */}
            <div className="relative z-10 mt-6 space-y-2">
                {[
                    '✓ Prezzo bloccato per SEMPRE',
                    '✓ Risparmio fino a €36,120 in 5 anni',
                    '✓ Badge Legacy Founder esclusivo',
                    '✓ Support Tier 0 (priorità assoluta)'
                ].map((benefit, i) => (
                    <p key={i} className="text-white/70 text-sm">{benefit}</p>
                ))}
            </div>
        </div>
    );
}
