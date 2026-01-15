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
import SocialProofHuman from "@/components/home-viral/SocialProofHuman";
import FinalCTAUltimate from "@/components/sections/FinalCTAUltimate";
import Footer from "@/components/sections/Footer";

/**
 * START PAGE - PUBLIC FACING
 * 
 * Uses same viral sections as landing page
 * PricingUltimate with pricingMode="public"
 */
export default function StartPage() {
    return (
        <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
            <Navbar />
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
                            "L'unico modo per essere <span className="text-gold">ovunque</span> è smettere di essere <span className="text-charcoal/10">solo carne e ossa.</span>"
                        </p>
                    </motion.div>
                </div>

                {/* IDENTITY PRESERVATION */}
                <IdentityPreservation />

                {/* MARKET UNIVERSAL TRUTHS - Mastermind Path */}
                <MarketUniversalTruths />

                {/* VIRAL NUGGET 2 */}
                <div className="py-24 bg-charcoal">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto text-center px-6"
                    >
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black mb-6 block">Il Verdetto</span>
                        <p className="font-serif text-3xl md:text-6xl text-white leading-none mb-4">
                            La libertà non è un lusso. <br />
                            <span className="text-gold italic">È la struttura.</span>
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

                {/* PRICING - PUBLIC MODE */}
                <PricingUltimate pricingMode="public" />

                {/* SOCIAL PROOF HUMAN */}
                <SocialProofHuman />

                {/* FINAL CTA */}
                <FinalCTAUltimate />
            </main>
            <Footer />
        </div>
    );
}
