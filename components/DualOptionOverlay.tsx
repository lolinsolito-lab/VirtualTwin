/**
 * Dual-Option Sold Out Overlay
 * Shows two options when Founder wave is sold out:
 * 1. Join waitlist for next wave (discount)
 * 2. Buy at public price now (immediate)
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import { getCurrentPublicPricing } from '@/lib/waves';

interface DualOptionOverlayProps {
    planId: string;
    planName: string;
    currentWaveName: string;
    nextWaveName?: string;
    nextWavePrice?: number;
    publicPrice: number;
    publicPriceId: string;
    onWaitlistClick: () => void;
}

export default function DualOptionOverlay({
    planId,
    planName,
    currentWaveName,
    nextWaveName,
    nextWavePrice,
    publicPrice,
    publicPriceId,
    onWaitlistClick
}: DualOptionOverlayProps) {
    return (
        <div className="absolute inset-0 z-30 rounded-[2rem] overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" />

            {/* Ribbon Badge */}
            <div className="absolute top-6 -right-14 w-52 transform rotate-45 z-40">
                <div className="gold-gradient text-white text-center py-2.5 shadow-xl">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black">
                        {currentWaveName} SOLD OUT
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/50 font-bold mb-2">
                    {planName}
                </p>

                {/* Options Container */}
                <div className="space-y-3 w-full max-w-sm mt-4">
                    {/* Option A: Waitlist (if next wave exists) */}
                    {nextWaveName && nextWavePrice && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-white/90 text-sm font-bold mb-2 flex items-center justify-center gap-2">
                                <span>📋</span>
                                <span>Aspetta {nextWaveName} Wave</span>
                            </p>
                            <p className="text-white/60 text-xs mb-3">
                                Prezzo: <span className="text-gold font-bold">€{nextWavePrice}</span>
                                {' '}(invece di <span className="line-through">€{publicPrice}</span>)
                            </p>
                            <button
                                onClick={onWaitlistClick}
                                className="w-full bg-white/20 hover:bg-white/30 text-white py-2.5 rounded-lg text-xs font-bold transition-all"
                            >
                                Entra in Waitlist →
                            </button>
                        </div>
                    )}

                    {/* Option B: Buy Public Now */}
                    <div className="bg-gold/20 backdrop-blur-sm rounded-xl p-4 border border-gold/40">
                        <p className="text-white/90 text-sm font-bold mb-2 flex items-center justify-center gap-2">
                            <span>⚡</span>
                            <span>Oppure Inizia Subito</span>
                        </p>
                        <p className="text-white/60 text-xs mb-3">
                            Prezzo Pubblico: <span className="text-gold font-bold">€{publicPrice}/mese</span>
                        </p>
                        <Link
                            href={`/auth/register?plan=${planId}&priceId=${publicPriceId}&tier=public`}
                            className="block w-full gold-gradient text-white py-2.5 rounded-lg text-xs font-bold text-center transition-all hover:scale-105"
                        >
                            💳 Compra al Prezzo Public
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
