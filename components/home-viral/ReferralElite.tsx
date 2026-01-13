"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Gift, Star, ArrowRight, ShieldCheck, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ReferralData {
    referralCode: string | null;
    referralsCount: number;
    referralLink: string | null;
    rewardStatus: {
        message: string;
        progress: number;
        unlocked: boolean;
    };
}

/**
 * Referral Elite Component (Model A: Founder Privilege)
 * 
 * Strategic incentivization for early adopters.
 * Now connected to real API for link generation.
 */
export default function ReferralElite() {
    const [referralData, setReferralData] = useState<ReferralData | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Get real userId from Supabase Auth
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                setIsLoggedIn(true);
            }
        };
        checkAuth();
    }, []);

    const handleGenerateLink = async () => {
        if (!userId) return;
        setLoading(true);

        try {
            const response = await fetch('/api/referral/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                const data = await response.json();
                setReferralData(data);
            }
        } catch (error) {
            console.error('Failed to generate referral link:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (referralData?.referralLink) {
            navigator.clipboard.writeText(referralData.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section id="referral" className="relative py-24 bg-charcoal text-white overflow-hidden">
            {/* Background luxury accents */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gold rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gold rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black italic mb-6 block">Legacy Expansion</span>
                            <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight tracking-tighter">
                                Il Potere della <br />
                                <span className="text-gold italic">Tua Cerchia.</span>
                            </h2>
                            <p className="text-xl text-white/60 mb-12 italic leading-relaxed">
                                "La libertà è più preziosa quando è condivisa. Aiuta altri 3 Founder a riprendersi il proprio tempo e sblocca il livello massimo della Genesis Wave."
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-white/80">
                                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                                        <Gift className="w-5 h-5 text-gold" />
                                    </div>
                                    <span className="text-lg"><strong>1 Mese Gratis</strong> (€147 di valore istantaneo)</span>
                                </div>
                                <div className="flex items-center gap-4 text-white/80">
                                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                                        <Star className="w-5 h-5 text-gold" />
                                    </div>
                                    <span className="text-lg">Accesso al Badge <strong>"Genesis Insider"</strong></span>
                                </div>
                                <div className="flex items-center gap-4 text-white/80">
                                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                                        <Users className="w-5 h-5 text-gold" />
                                    </div>
                                    <span className="text-lg">Priority Access alle future <strong>Early Features</strong></span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - The "Card" */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative"
                        >
                            <div className="absolute -top-4 -right-4 px-6 py-2 bg-gold text-charcoal font-black text-xs uppercase tracking-widest rounded-full shadow-lg">
                                Founder Privilege
                            </div>

                            <h3 className="text-2xl font-serif italic mb-8">Cosa ottengono i tuoi amici:</h3>

                            <div className="space-y-8 mb-12">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gold font-bold">20% SCONTO</span>
                                        <ShieldCheck className="w-4 h-4 text-gold opacity-40 group-hover:opacity-100" />
                                    </div>
                                    <p className="text-sm text-white/40">Sconto riservato sul primo mese di attivazione della propria Identità Digitale.</p>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gold font-bold">SETUP CALL GRATUITA</span>
                                        <Star className="w-4 h-4 text-gold opacity-40 group-hover:opacity-100" />
                                    </div>
                                    <p className="text-sm text-white/40">Valore €200. I tuoi amici verranno guidati personalmente nella creazione del loro Gemello.</p>
                                </div>
                            </div>

                            {!referralData ? (
                                <button
                                    onClick={handleGenerateLink}
                                    disabled={loading}
                                    className="w-full bg-gold text-charcoal font-bold py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-gold/10 group disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Share2 className="w-5 h-5 group-hover:animate-pulse" />
                                    )}
                                    <span>{loading ? 'Generando...' : "Genera Link d'Élite"}</span>
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    {/* Generated Link */}
                                    <div className="p-4 rounded-xl bg-white/10 border border-gold/30">
                                        <p className="text-[10px] uppercase tracking-widest text-gold mb-2 font-black">Il Tuo Link Esclusivo</p>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 text-sm text-white/80 bg-white/5 px-3 py-2 rounded-lg truncate">
                                                {referralData.referralLink}
                                            </code>
                                            <button
                                                onClick={handleCopyLink}
                                                className="p-2 bg-gold/20 rounded-lg hover:bg-gold/30 transition"
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gold" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-white/60">Inviti completati</span>
                                            <span className="text-gold font-bold">{referralData.referralsCount}/3</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gold rounded-full transition-all duration-500"
                                                style={{ width: `${referralData.rewardStatus.progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-white/40 mt-2">{referralData.rewardStatus.message}</p>
                                    </div>
                                </div>
                            )}

                            <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mt-6">
                                Riservato ai Membri della Genesis Wave
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
