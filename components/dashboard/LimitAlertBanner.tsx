'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { X, AlertTriangle, XCircle, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LimitStatus = 'ok' | 'warning' | 'critical' | 'exceeded';

interface LimitInfo {
    status: LimitStatus;
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
    nextTier: { name: string; price: number } | null;
}

// Tier limits
const TIER_LIMITS: Record<string, number> = {
    'curioso': 100,
    'esploratore': 500,
    'pioniere': 2000,
    'conquistatore': 5000,
    'imperatore': 50000,
};

const TIER_UPGRADES: Record<string, { name: string; price: number }> = {
    'curioso': { name: 'Esploratore', price: 147 },
    'esploratore': { name: 'Pioniere', price: 347 },
    'pioniere': { name: 'Conquistatore', price: 697 },
    'conquistatore': { name: 'Imperatore', price: 1497 },
};

export function LimitAlertBanner() {
    const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchLimitStatus();
    }, []);

    async function fetchLimitStatus() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from('profiles')
            .select('messages_used_this_month, subscription_tier, is_founder')
            .eq('id', user.id)
            .single();

        if (!profile || profile.is_founder) return;

        const tier = profile.subscription_tier || 'curioso';
        const limit = TIER_LIMITS[tier] || 100;
        const used = profile.messages_used_this_month || 0;
        const percentage = (used / limit) * 100;
        const remaining = Math.max(0, limit - used);

        let status: LimitStatus = 'ok';
        if (percentage >= 100) status = 'exceeded';
        else if (percentage >= 90) status = 'critical';
        else if (percentage >= 75) status = 'warning';

        if (status !== 'ok') {
            setLimitInfo({
                status,
                used,
                limit,
                remaining,
                percentage,
                nextTier: TIER_UPGRADES[tier] || null
            });

            // Auto-show modal for exceeded
            if (status === 'exceeded') {
                setShowModal(true);
            }
        }
    }

    if (!limitInfo || dismissed) return null;

    const { status, used, limit, remaining, percentage, nextTier } = limitInfo;
    const daysRemaining = used > 0 ? Math.max(1, Math.ceil(remaining / (used / 30))) : 30;
    const potentialLoss = Math.floor((used / 30) * daysRemaining * 0.3 * 80);

    // Style variants
    const styles = {
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-400',
            text: 'text-yellow-900',
            icon: AlertTriangle,
            iconColor: 'text-yellow-600'
        },
        critical: {
            bg: 'bg-orange-50',
            border: 'border-orange-500',
            text: 'text-orange-900',
            icon: AlertTriangle,
            iconColor: 'text-orange-600'
        },
        exceeded: {
            bg: 'bg-red-50',
            border: 'border-red-600',
            text: 'text-red-900',
            icon: XCircle,
            iconColor: 'text-red-600'
        }
    };

    const style = status === 'ok' ? styles.warning : styles[status];
    const Icon = style.icon;

    // Exceeded Modal
    if (showModal && status === 'exceeded') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-center">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Clone AI Bloccato</h2>
                        <p className="text-red-100 mt-2">Limite {limit} messaggi raggiunto</p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Impact */}
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <h3 className="font-bold text-red-900 mb-2">📱 Cosa sta succedendo:</h3>
                            <ul className="space-y-1 text-red-800 text-sm">
                                <li>❌ I lead ricevono "assistente in pausa"</li>
                                <li>❌ Nessuna risposta AI attiva</li>
                                <li>💸 Perdita stimata: €{potentialLoss.toLocaleString()}</li>
                            </ul>
                        </div>

                        {/* Upgrade Option */}
                        {nextTier && (
                            <a
                                href={`/dashboard/billing?upgrade=true&emergency=true&tier=${nextTier.name.toLowerCase()}`}
                                className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all mb-4"
                            >
                                <Zap className="inline w-5 h-5 mr-2" />
                                Riattiva Clone - {nextTier.name} €{nextTier.price}/m
                            </a>
                        )}

                        {/* Secondary action */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full text-center py-3 text-charcoal/50 hover:text-charcoal text-sm"
                        >
                            Chiudi (clone resterà bloccato)
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    // Banner for warning/critical
    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`${style.bg} border-b-4 ${style.border} overflow-hidden`}
            >
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`p-2 rounded-full ${style.bg} ${status === 'critical' ? 'animate-pulse' : ''}`}>
                            <Icon className={`w-6 h-6 ${style.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {status === 'warning' && (
                                <>
                                    <h3 className={`font-bold ${style.text}`}>
                                        ⚠️ 75% Limite Raggiunto
                                    </h3>
                                    <p className={`text-sm ${style.text} opacity-80 mt-1`}>
                                        Hai usato {used}/{limit} messaggi.
                                        Restano {remaining} messaggi (~{daysRemaining} giorni).
                                    </p>
                                </>
                            )}

                            {status === 'critical' && (
                                <>
                                    <h3 className={`font-bold ${style.text}`}>
                                        🚨 URGENTE: Solo {remaining} Messaggi!
                                    </h3>
                                    <p className={`text-sm ${style.text} opacity-80 mt-1`}>
                                        Il clone si bloccherà tra ~{daysRemaining} giorni.
                                        I lead riceveranno "in pausa".
                                    </p>
                                </>
                            )}

                            {/* CTA */}
                            {nextTier && (
                                <div className="mt-3 flex flex-wrap gap-3">
                                    <a
                                        href={`/dashboard/billing?upgrade=true&tier=${nextTier.name.toLowerCase()}`}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${status === 'critical'
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-gold text-white hover:bg-gold/90'
                                            }`}
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        Upgrade a {nextTier.name} - €{nextTier.price}/m
                                    </a>

                                    {status === 'warning' && (
                                        <button
                                            onClick={() => setDismissed(true)}
                                            className="text-sm text-charcoal/50 hover:text-charcoal"
                                        >
                                            Ricordamelo dopo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dismiss (only warning) */}
                        {status === 'warning' && (
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-1 hover:bg-black/10 rounded-full"
                            >
                                <X className="w-5 h-5 text-charcoal/40" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
