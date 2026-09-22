import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Watermark from "@/components/Watermark";
import ScrollReveal from "@/components/ScrollReveal";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Whistleblowing | SowTrap™",
  description: "SowTrap™'s whistleblowing policy statement.",
};

export default function WhistleblowingPage() {
  return (
    <>
      <Watermark />
      <Nav />
      <ScrollReveal />

      <section className="legal-page">
        <p className="legal-page-eyebrow">Legal</p>
        <h1>Whistleblowing</h1>
        <p className="legal-page-meta">Effective Date: — &nbsp;·&nbsp; Last Updated: —</p>

        <p>
          ScienceOnWheels Bio Pvt. Ltd. guarantees its maximum internal and external dissemination, while
          respecting the obligations of confidentiality and the prerogatives of autonomy and independence
          of each company belonging to ScienceOnWheels Bio Pvt. Ltd.
        </p>
      </section>

      <FooterCTA />
    </>
  );
}
