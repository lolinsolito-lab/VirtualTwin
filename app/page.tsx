
import Navbar from "@/components/sections/Navbar";
import HeroUltimate from "@/components/sections/HeroUltimate";
import ProblemEnhanced from "@/components/sections/ProblemEnhanced";
import SolutionEnhanced from "@/components/sections/SolutionEnhanced";
import HowItWorksEnhanced from "@/components/sections/HowItWorksEnhanced";
import FeaturesEnhanced from "@/components/sections/FeaturesEnhanced";
import PricingUltimate from "@/components/sections/PricingUltimate";
import SocialProofEnhanced from "@/components/sections/SocialProofEnhanced";
import FinalCTAUltimate from "@/components/sections/FinalCTAUltimate";
import Footer from "@/components/sections/Footer";
import ExitIntentPopup from "@/components/ExitIntentPopup";

export default function Home() {
  return (
    <div className="selection:bg-gold selection:text-black min-h-screen bg-champagne overflow-x-hidden">
      <Navbar />
      <main>
        <HeroUltimate />
        <ProblemEnhanced />
        <SolutionEnhanced />
        <HowItWorksEnhanced />
        <FeaturesEnhanced />
        <PricingUltimate />
        <SocialProofEnhanced />
        <FinalCTAUltimate />
      </main>
      <Footer />
      <ExitIntentPopup />
    </div>
  );
}
