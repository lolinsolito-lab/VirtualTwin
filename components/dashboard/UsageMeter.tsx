'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Zap, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';

interface UsageMeterProps {
    className?: string;
}

// Tier limits
const TIER_LIMITS: Record<string, number> = {
    'curioso': 100,
    'esploratore': 500,
    'pioniere': 2000,
    'conquistatore': 5000,
    'imperatore': 50000,
};

// Tier upgrade info
const TIER_UPGRADES: Record<string, { name: string; price: number }> = {
    'curioso': { name: 'Esploratore', price: 147 },
    'esploratore': { name: 'Pioniere', price: 347 },
    'pioniere': { name: 'Conquistatore', price: 697 },
    'conquistatore': { name: 'Imperatore', price: 1497 },
};

export function UsageMeter({ className = '' }: UsageMeterProps) {
    const [usage, setUsage] = useState({ used: 0, limit: 100, tier: 'curioso', isFounder: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsage() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('messages_used_this_month, subscription_tier, is_founder')
                .eq('id', user.id)
                .single();

            if (profile) {
                const tier = profile.subscription_tier || 'curioso';
                setUsage({
                    used: profile.messages_used_this_month || 0,
                    limit: profile.is_founder ? 999999 : (TIER_LIMITS[tier] || 100),
                    tier,
                    isFounder: profile.is_founder || false
                });
            }
            setLoading(false);
        }

        fetchUsage();

        // Refresh every 30 seconds
        const interval = setInterval(fetchUsage, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className={`bg-white/50 rounded-xl p-4 animate-pulse ${className}`}>
                <div className="h-4 bg-charcoal/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-charcoal/10 rounded w-full"></div>
            </div>
        );
    }

    // Founders have unlimited
    if (usage.isFounder) {
        return (
            <div className={`bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl p-4 border border-gold/20 ${className}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal/70">Messaggi AI</span>
                    <span className="flex items-center gap-1 text-gold text-sm font-bold">
                        <Zap className="w-4 h-4" />
                        ∞ Illimitati
                    </span>
                </div>
                <div className="text-xs text-charcoal/50">
                    👑 Founder Edition - Nessun limite
                </div>
            </div>
        );
    }

    const percentage = Math.min(100, (usage.used / usage.limit) * 100);
    const remaining = Math.max(0, usage.limit - usage.used);
    const daysRemaining = usage.used > 0 ? Math.ceil(remaining / (usage.used / 30)) : 30;

    // Status colors
    let statusColor = 'bg-green-500';
    let statusBg = 'bg-green-50';
    let statusBorder = 'border-green-200';
    let StatusIcon = TrendingUp;
    let showUpgrade = false;

    if (percentage >= 100) {
        statusColor = 'bg-red-500';
        statusBg = 'bg-red-50';
        statusBorder = 'border-red-300';
        StatusIcon = XCircle;
        showUpgrade = true;
    } else if (percentage >= 90) {
        statusColor = 'bg-orange-500';
        statusBg = 'bg-orange-50';
        statusBorder = 'border-orange-300';
        StatusIcon = AlertTriangle;
        showUpgrade = true;
    } else if (percentage >= 75) {
        statusColor = 'bg-yellow-500';
        statusBg = 'bg-yellow-50';
        statusBorder = 'border-yellow-300';
        StatusIcon = AlertTriangle;
        showUpgrade = true;
    }

    const nextTier = TIER_UPGRADES[usage.tier];

    return (
        <div className={`${statusBg} rounded-xl p-4 border ${statusBorder} ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${percentage >= 90 ? 'text-red-500' : percentage >= 75 ? 'text-yellow-600' : 'text-green-600'}`} />
                    <span className="text-sm font-medium text-charcoal">Messaggi AI</span>
                </div>
                <span className={`text-sm font-bold ${percentage >= 100 ? 'text-red-600' : percentage >= 75 ? 'text-orange-600' : 'text-charcoal'}`}>
                    {usage.used.toLocaleString()}/{usage.limit.toLocaleString()}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner mb-2">
                <div
                    className={`h-full ${statusColor} transition-all duration-500 ease-out ${percentage >= 90 ? 'animate-pulse' : ''}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Status Text */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal/60">
                    {percentage >= 100
                        ? '❌ Clone bloccato'
                        : `${remaining.toLocaleString()} rimasti (~${daysRemaining}gg)`
                    }
                </span>
                <span className={`font-medium ${percentage >= 75 ? 'text-orange-600' : 'text-charcoal/50'}`}>
                    {Math.round(percentage)}%
                </span>
            </div>

            {/* Upgrade CTA */}
            {showUpgrade && nextTier && (
                <a
                    href={`/dashboard/billing?upgrade=true&tier=${nextTier.name.toLowerCase()}`}
                    className={`mt-3 block w-full text-center py-2 px-4 rounded-lg text-sm font-bold transition-all ${percentage >= 100
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gold/20 text-gold hover:bg-gold hover:text-white'
                        }`}
                >
                    {percentage >= 100
                        ? `🚀 Riattiva Clone - ${nextTier.name} €${nextTier.price}/m`
                        : `Upgrade a ${nextTier.name} →`
                    }
                </a>
            )}
        </div>
    );
}
