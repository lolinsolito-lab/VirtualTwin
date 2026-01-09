import Navbar from "@/components/sections/Navbar";
import HeroEmotionalPunch from "@/components/home-viral/HeroEmotionalPunch";
import WallOfHooks from "@/components/home-viral/WallOfHooks";
import TodayTomorrowStories from "@/components/home-viral/TodayTomorrowStories";
import VisualProofSection from "@/components/home-viral/VisualProofSection";
import SocialProofBar from "@/components/home-viral/SocialProofBar";
import SolutionEnhanced from "@/components/sections/SolutionEnhanced";
import SetupStoryNarrative from "@/components/home-viral/SetupStoryNarrative";
import FeaturesEnhanced from "@/components/sections/FeaturesEnhanced";
import CommonMistakes from "@/components/home-viral/CommonMistakes";
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

        {/* SOCIAL PROOF BAR - Real numbers, instant trust */}
        <SocialProofBar />

        {/* WALL OF HOOKS - Punch lines library */}
        <WallOfHooks />

        {/* TODAY/TOMORROW DRAMATIC STORIES - 4 scenarios */}
        <TodayTomorrowStories />

        {/* VISUAL PROOF - Chat screenshots annotated */}
        <VisualProofSection />

        {/* SOLUTION (keep existing) */}
        <SolutionEnhanced />

        {/* SETUP NARRATIVE - 10 min journey */}
        <SetupStoryNarrative />

        {/* FEATURES (keep existing) */}
        <FeaturesEnhanced />

        {/* COMMON MISTAKES - Educational pain amplification */}
        <CommonMistakes />

        {/* PRICING (NON TOCCARE - user requirement) */}
        <PricingUltimate showToggle={true} />

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

