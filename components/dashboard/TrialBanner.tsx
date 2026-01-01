"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, AlertTriangle, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getTrialStatus, formatTrialCountdown, getTrialWarningLevel, TrialStatus } from '@/lib/trialManager';

export default function TrialBanner() {
    const [trial, setTrial] = useState<TrialStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTrial = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            const status = await getTrialStatus(session.user.id);
            setTrial(status);
            setLoading(false);
        };

        checkTrial();
    }, []);

    if (loading || !trial || !trial.isTrialing) return null;

    const level = getTrialWarningLevel(trial.daysRemaining);
    if (level === 'none') return null;

    const bgColor = level === 'critical'
        ? 'bg-red-500'
        : level === 'warning'
            ? 'bg-amber-500'
            : 'bg-blue-500';

    const Icon = level === 'critical' ? AlertTriangle : Clock;

    return (
        <div className={`${bgColor} text-white px-4 py-3 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">
                    Trial: {formatTrialCountdown(trial.daysRemaining)}
                </span>
            </div>
            <Link
                href="/dashboard/billing"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
                <Zap className="w-4 h-4" />
                Upgrade Ora
            </Link>
        </div>
    );
}
