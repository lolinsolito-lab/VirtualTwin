'use client';

import React from 'react';
import { useSovereign } from '@/components/providers/SovereignProvider';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PlanTier } from '@/lib/pricing';

interface ImperialGateProps {
    children: React.ReactNode;
    tier: PlanTier;
    featureName?: string;
    description?: string;
    waveId?: string;
    className?: string;
}

/**
 * ImperialGate - A premium gating component that blurs content and shows
 * an "aspiration landing" overlay if the user does not have the required tier.
 */
export const ImperialGate: React.FC<ImperialGateProps> = ({
    children,
    tier,
    featureName = "Questa funzione",
    description,
    waveId,
    className = ""
}) => {
    const { isFeatureAccessible, user } = useSovereign();

    // Check tier access
    const hasTierAccess = isFeatureAccessible(tier);

    // Check wave access (if waveId specified)
    // A user has wave access if:
    // 1. No waveId is required
    // 2. User's wave_id matches the required waveId
    // 3. User is an admin
    const hasWaveAccess = !waveId || user?.wave_id === waveId || user?.role === 'admin';

    const hasAccess = hasTierAccess && hasWaveAccess;

    // Custom description for wave locking
    const lockDescription = description || (
        !hasWaveAccess
            ? `${featureName} è riservato esclusivamente ai membri della Wave ${waveId?.toUpperCase()}.`
            : `${featureName} è sbloccabile solo per i membri del tier ${tier.charAt(0).toUpperCase() + tier.slice(1)} o superiore.`
    );

    if (hasAccess) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div className={`relative group ${className}`}>
            {/* Blurred Content Overlay */}
            <div className="filter blur-md pointer-events-none select-none opacity-40 transition-all duration-700 group-hover:blur-sm">
                {children}
            </div>

            {/* Imperial Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
                <div className="bg-white/90 backdrop-blur-xl border border-gold/30 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-gold/20">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Lock className="w-8 h-8 text-gold" />
                    </div>

                    <h3 className="font-serif text-2xl text-charcoal mb-3 italic leading-none">
                        Accesso <span className="gold-text-gradient">Riservato</span>
                    </h3>

                    <p className="text-charcoal/60 text-sm mb-6 leading-relaxed px-2">
                        {lockDescription}
                    </p>

                    <Link
                        href="/dashboard/billing"
                        className="flex items-center justify-center gap-2 w-full py-4 gold-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-gold-sm transition-all shadow-lg"
                    >
                        Sblocca il Potere <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest text-charcoal/30 font-extrabold">
                        <Sparkles className="w-3 h-3 text-gold/50" />
                        Imperial Protocol Standard
                        <Sparkles className="w-3 h-3 text-gold/50" />
                    </div>
                </div>
            </div>
        </div>
    );
};
