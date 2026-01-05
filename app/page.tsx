
import Navbar from "@/components/sections/Navbar";
import HeroEmotionalPunch from "@/components/home-viral/HeroEmotionalPunch";
import TodayTomorrowStories from "@/components/home-viral/TodayTomorrowStories";
import SolutionEnhanced from "@/components/sections/SolutionEnhanced";
import SetupStoryNarrative from "@/components/home-viral/SetupStoryNarrative";
import FeaturesEnhanced from "@/components/sections/FeaturesEnhanced";
import PricingUltimate from "@/components/sections/PricingUltimate";
import SocialProofHuman from "@/components/home-viral/SocialProofHuman";
import FinalCTAUltimate from "@/components/sections/FinalCTAUltimate";
import Footer from "@/components/sections/Footer";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function Home() {
  return (
    <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
      <Navbar />
      <main>
        {/* VIRAL EMOTIONAL HERO - 3AM Story */}
        <HeroEmotionalPunch />

        {/* TODAY/TOMORROW DRAMATIC STORIES - 4 scenarios */}
        <TodayTomorrowStories />

        {/* SOLUTION (keep existing) */}
        <SolutionEnhanced />

        {/* SETUP NARRATIVE - 10 min journey */}
        <SetupStoryNarrative />

        {/* FEATURES (keep existing) */}
        <FeaturesEnhanced />

        {/* PRICING (NON TOCCARE - user requirement) */}
        <PricingUltimate />

        {/* SOCIAL PROOF HUMAN - warm testimonials */}
        <SocialProofHuman />

        {/* FINAL CTA (keep existing) */}
        <FinalCTAUltimate />
      </main>
      <Footer />
      <ExitIntentPopup />
    </div>
  );
}

