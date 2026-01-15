'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/sections/Navbar";
import HeroEmotionalPunch from "@/components/home-viral/HeroEmotionalPunch";
import SocialProofBar from "@/components/home-viral/SocialProofBar";
import WallOfHooks from "@/components/home-viral/WallOfHooks";
import TodayTomorrowStories from "@/components/home-viral/TodayTomorrowStories";
import IdentityPreservation from "@/components/sections/IdentityPreservation";
import MarketUniversalTruths from "@/components/sections/MarketUniversalTruths";
import SolutionEnhanced from "@/components/sections/SolutionEnhanced";
import SetupStoryNarrative from "@/components/home-viral/SetupStoryNarrative";
import FeaturesEnhanced from "@/components/sections/FeaturesEnhanced";
import CommonMistakes from "@/components/home-viral/CommonMistakes";
import ViralCompareMode from "@/components/home-viral/ViralCompareMode";
import SuperiorityMatrix from "@/components/home-viral/SuperiorityMatrix";
import PricingUltimate from "@/components/sections/PricingUltimate";
import FounderWavesSection from "@/components/sections/FounderWavesSection";
import SocialProofHuman from "@/components/home-viral/SocialProofHuman";
import FinalCTAUltimate from "@/components/sections/FinalCTAUltimate";
import Footer from "@/components/sections/Footer";
import { Crown, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, Wave, isPreLaunch } from '@/lib/waves';

/**
 * FOUNDER PAGE - EXCLUSIVE ACCESS
 * 
 * Uses same viral sections as landing page
 * PricingUltimate with pricingMode="founder"
 * Includes FounderWavesSection for wave timeline
 */
export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [isSoldOut, setIsSoldOut] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const [wave, remaining] = await Promise.all([
                getCurrentWave(),
                getCurrentWaveSpotsRemaining()
            ]);
            const beforeLaunch = isPreLaunch();
            setCurrentWave(wave);
            setSpotsLeft(remaining);
            setIsSoldOut(!beforeLaunch && remaining === 0);
        }
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
            <Navbar />

            {/* FOUNDER EXCLUSIVE BANNER */}
            <div className="bg-charcoal text-white text-center py-3 text-sm font-medium mt-20">
                {!isSoldOut ? (
                    <>
                        <Crown className="w-4 h-4 inline-block mr-2 text-gold" />
                        <span className="animate-pulse">🔥</span> {currentWave?.nameFull || 'Genesis Wave'} · Solo <strong className="text-gold">{spotsLeft}</strong> Posti Rimasti · Prezzo Bloccato LIFETIME
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Programma Founder Chiuso · I Prezzi Pubblici Sono Ora Attivi
                    </>
                )}
            </div>

            <main>
                {/* VIRAL EMOTIONAL HERO */}
                <HeroEmotionalPunch />

                {/* SOCIAL PROOF BAR */}
                <SocialProofBar />

                {/* WALL OF HOOKS - 3 Verità */}
                <WallOfHooks />

                {/* TODAY/TOMORROW STORIES */}
                <TodayTomorrowStories />

                {/* VIRAL NUGGET 1 */}
                <div className="py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-3xl mx-auto px-6"
                    >
                        <p className="font-serif text-3xl md:text-5xl text-charcoal/30 italic leading-tight">
                            "I primi arrivati non pagano il prezzo del mercato. <span className="text-gold">Diventano il mercato.</span>"
                        </p>
                    </motion.div>
                </div>

                {/* IDENTITY PRESERVATION */}
                <IdentityPreservation />

                {/* MARKET UNIVERSAL TRUTHS - Mastermind Path */}
                <MarketUniversalTruths />

                {/* VIRAL NUGGET 2 - FOUNDER SPECIFIC */}
                <div className="py-24 bg-charcoal">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto text-center px-6"
                    >
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Accesso Esclusivo</span>
                        <p className="font-serif text-3xl md:text-6xl text-white leading-none mb-4">
                            I Fondatori possiedono il futuro. <br />
                            <span className="text-gold italic">Per sempre.</span>
                        </p>
                    </motion.div>
                </div>

                {/* SOLUTION */}
                <SolutionEnhanced />

                {/* SETUP NARRATIVE */}
                <SetupStoryNarrative />

                {/* FEATURES */}
                <FeaturesEnhanced />

                {/* COMMON MISTAKES */}
                <CommonMistakes />

                {/* VIRAL COMPARE MODE */}
                <ViralCompareMode />

                {/* SUPERIORITY MATRIX */}
                <SuperiorityMatrix />

                {/* PRICING - FOUNDER MODE */}
                <PricingUltimate pricingMode="founder" />

                {/* FOUNDER WAVES TIMELINE */}
                <FounderWavesSection />

                {/* SOCIAL PROOF HUMAN */}
                <SocialProofHuman />

                {/* FINAL CTA */}
                <FinalCTAUltimate />
            </main>
            <Footer />
        </div>
    );
}
