import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import PartnershipHero from "@/components/partnership/PartnershipHero";
import PartnershipIntro from "@/components/partnership/PartnershipIntro";
import PartnershipWho from "@/components/partnership/PartnershipWho";
import PartnershipAchieve from "@/components/partnership/PartnershipAchieve";
import PartnershipValue from "@/components/partnership/PartnershipValue";
import PartnershipModels from "@/components/partnership/PartnershipModels";
import PartnershipEngagement from "@/components/partnership/PartnershipEngagement";
import PartnershipClosing from "@/components/partnership/PartnershipClosing";
import PartnershipEvaluate from "@/components/partnership/PartnershipEvaluate";
import PartnershipBrands from "@/components/partnership/PartnershipBrands";
import PartnershipTouchHero from "@/components/partnership/PartnershipTouchHero";
import PartnershipTouch from "@/components/partnership/PartnershipTouch";
import PartnershipGrowers from "@/components/partnership/PartnershipGrowers";
import PartnershipBuildCTA from "@/components/partnership/PartnershipBuildCTA";
import PartnershipFarmClosing from "@/components/partnership/PartnershipFarmClosing";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Partnership | SowTrap™",
  description: "Science-led partnerships across the ingredient value chain.",
};

export default function PartnershipPage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <PartnershipHero />

      <PartnershipIntro />

      <PartnershipWho />

      <PartnershipAchieve />

      <PartnershipValue />

      <PartnershipModels />

      <PartnershipEngagement />

      <PartnershipClosing />

      <PartnershipEvaluate />

      <PartnershipBrands />

      <PartnershipTouchHero />

      <PartnershipTouch />

      <PartnershipGrowers />

      <PartnershipBuildCTA />

      <PartnershipFarmClosing />

      <FooterCTA />
    </>
  );
}
