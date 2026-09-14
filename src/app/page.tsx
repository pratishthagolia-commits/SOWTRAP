import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ScrollReveal from "@/components/ScrollReveal";
import Watermark from "@/components/Watermark";
import FooterCTA from "@/components/FooterCTA";
import AboutUsV2 from "@/components/AboutUsV2";
import CoreExpertiseSection from "@/components/CoreExpertiseSection";
import ResearchGapV2 from "@/components/ResearchGapV2";
import SupplementsFail from "@/components/SupplementsFail";
import PillarsSection from "@/components/PillarsSection";
import ComparisonSection from "@/components/ComparisonSection";
import PortfolioHeader from "@/components/PortfolioHeader";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import DifferentiatorsTimeline from "@/components/DifferentiatorsTimeline";
import IndustriesSection from "@/components/IndustriesSection";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Watermark />
      <Nav />
      <Hero />

      <AboutUsV2 />

      <CoreExpertiseSection />

      <ResearchGapV2 />

      <SupplementsFail />

      {/* 4S FRAMEWORK — static two-panel "chamber": left card shows the
          active pillar's description, right side lists clickable pointers */}
      <PillarsSection />

      {/* kept outside LightWaveZone: its overflow:hidden was clipping the
          header's negative-margin overlap onto the pillars chamber above
          it (same reason PillarsSection/PortfolioCarousel are outside it) */}
      <ComparisonSection />

      {/* INGREDIENT PORTFOLIO — kept outside LightWaveZone (now unused
          here): its own sticky-pin/slide mechanic needs the same overflow
          clearance PillarsSection/ComparisonSection required */}
      <PortfolioHeader />

      {/* kept outside LightWaveZone: that wrapper's overflow:hidden breaks a
          position:sticky child's stick/release math, which this section
          relies on for its scroll-jacked pin (same reason as PillarsCarousel). */}
      <PortfolioCarousel />

      <DifferentiatorsTimeline />

      <IndustriesSection />

      <FooterCTA />
    </>
  );
}
