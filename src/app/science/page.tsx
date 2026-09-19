import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import ScienceHero from "@/components/science/ScienceHero";
import ScienceIntro from "@/components/science/ScienceIntro";
import BioactivesIntro from "@/components/science/BioactivesIntro";
import ScienceExperience from "@/components/science/ScienceExperience";
import ScienceFactors from "@/components/science/ScienceFactors";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Science | SowTrap™",
  description: "Follow a bioactive compound's journey through the body.",
};

export default function SciencePage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <ScienceHero />

      <BioactivesIntro />

      <ScienceExperience />

      <ScienceFactors />

      <ScienceIntro />

      <FooterCTA />
    </>
  );
}
