import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import TechnologyHero from "@/components/technology/TechnologyHero";
import TechIntro from "@/components/technology/TechIntro";
import TechPhilosophy from "@/components/technology/TechPhilosophy";
import TechApproach from "@/components/technology/TechApproach";
import TechStages from "@/components/technology/TechStages";
import TechPlatform from "@/components/technology/TechPlatform";
import TechEncapsulation from "@/components/technology/TechEncapsulation";
import TechMaterials from "@/components/technology/TechMaterials";
import ScientificValidation from "@/components/technology/ScientificValidation";
import TechEvidence from "@/components/technology/TechEvidence";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Technology | SowTrap™",
  description: "How SowTrap selects and engineers the right delivery technology for each active.",
};

export default function TechnologyPage() {
  return (
    <>
      <Nav />
      <ScrollReveal />

      <TechnologyHero />

      <TechIntro />

      <TechPhilosophy />

      <TechApproach />

      <TechStages />

      <TechPlatform />

      <TechEncapsulation />

      <TechMaterials />

      <ScientificValidation />

      <TechEvidence />

      <FooterCTA />
    </>
  );
}
