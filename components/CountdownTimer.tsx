'use client';

import { useState, useEffect } from 'react';
import { getTimeUntilLaunch } from '@/lib/waves';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ className = '' }: { className?: string }) {
    const [time, setTime] = useState(getTimeUntilLaunch());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getTimeUntilLaunch());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // If launch happened, don't show timer
    if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
        return null;
    }

    return (
        <div className={`inline-flex items-center gap-4 bg-gold/10 rounded-xl px-6 py-3 border border-gold/20 ${className}`}>
            <Clock className="w-5 h-5 text-gold" />
            <div className="flex items-center gap-3">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gold tabular-nums">{time.days}</div>
                    <div className="text-xs text-charcoal/60 uppercase tracking-wider">Days</div>
                </div>
                <span className="text-gold text-2xl font-bold">:</span>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gold tabular-nums">{String(time.hours).padStart(2, '0')}</div>
                    <div className="text-xs text-charcoal/60 uppercase tracking-wider">Hours</div>
                </div>
                <span className="text-gold text-2xl font-bold">:</span>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gold tabular-nums">{String(time.minutes).padStart(2, '0')}</div>
                    <div className="text-xs text-charcoal/60 uppercase tracking-wider">Min</div>
                </div>
                <span className="text-gold text-2xl font-bold">:</span>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gold tabular-nums">{String(time.seconds).padStart(2, '0')}</div>
                    <div className="text-xs text-charcoal/60 uppercase tracking-wider">Sec</div>
                </div>
            </div>
        </div>
    );
}
