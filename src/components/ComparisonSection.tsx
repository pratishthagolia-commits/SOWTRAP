"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/lib/useIsMobile";

type ComparisonRow = { con: string; pro: string };

const ROWS: ComparisonRow[] = [
  {
    con: "Prone to Degradation – vulnerable to heat, moisture, and oxidation, potentially reducing shelf life.",
    pro: "Protected Bioactives – Heat, moisture and oxidation resistant for longer shelf life.",
  },
  {
    con: "Uncontrolled Release – Unprecedented release leads to suboptimal performance.",
    pro: "Controlled release – Sustained release delivery for optimal effect.",
  },
  {
    con: "Low Bioavailability – Poor absorption and Low systemic uptake.",
    pro: "Enhanced Bioavailability – Improves absorption and gives better bioavailability.",
  },
  {
    con: "Poor consumer Acceptance – Strong taste, odor, or texture can affect product palatability and compliance.",
    pro: "Improved consumer Acceptance – Taste and odor masking can improve palatability and overall product experience.",
  },
  {
    con: "Low stability – Higher risk of degradation during storage.",
    pro: "Extended stability – protective barrier, supporting stability throughout processing and storage.",
  },
  {
    con: "Poor water solubility – Poorly water-soluble actives may clump, separate, or leave residue.",
    pro: "Cold-water dispersion – Improved cold-water solubility/dispersibility.",
  },
];

// how far the section overlaps up into Pillars once fully scrolled in
const MAX_OVERLAP = 340;

// two staggered rows (photo + navy pill list, offset alternating sides)
// under a chamber-style navy/white header block — the rows themselves are
// plain static content, no scroll-jack, but the section's overlap onto
// Pillars above it is scroll-driven: margin-top animates from 0 to
// -340px as the section scrolls into view, instead of always sitting at
// its final overlapped position. Plain margin-top (not transform), and
// no position:sticky anywhere in this component, so this doesn't touch
// any of the fragile sticky/pin mechanics used elsewhere on the site.
export default function ComparisonSection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        // captured once, on the first frame — at that point overlap is
        // still 0 so this reflects the section's true unshifted position,
        // not one already affected by its own animated margin
        if (naturalTopRef.current === null) {
          naturalTopRef.current = el.getBoundingClientRect().top + window.scrollY;
        }
        const naturalViewportTop = naturalTopRef.current - window.scrollY;
        // grows from 0 to 1 over the 400px before the section's natural
        // position would reach the bottom of the viewport
        const raw = (window.innerHeight - naturalViewportTop) / 400;
        setOverlap(Math.min(1, Math.max(0, raw)));
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      className="cmp-section"
      id="comparison"
      ref={sectionRef}
      style={{ marginTop: `${-MAX_OVERLAP * overlap}px` }}
    >
      <div className="cmp-header">
        <div className="cmp-header-block" />
        <div className="cmp-header-text">
          <p className="cmp-heading">
            <span className="cmp-heading-sm">Comparison Between </span>
            <span className="cmp-heading-lg">Conventional</span>
            <span className="cmp-heading-sm"> and </span>
            <span className="cmp-heading-lg">Encapsulated</span>
            <span className="cmp-heading-sm"> Bioactives</span>
          </p>
        </div>
      </div>

      <div className="cmp-row cmp-row-con">
        {!isMobile && (
          <div className="cmp-row-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/comparison-conventional.jpeg" alt="Loose capsules spilled on a grey surface" />
          </div>
        )}
        <div className="cmp-row-content">
          <div className="cmp-intro">
            <p className="cmp-tagline reveal">Make Every Molecule Work Smarter.</p>
            <p className="cmp-intro-body reveal" style={{ transitionDelay: "0.1s" }}>
              SowTrap&trade; encapsulation protects, optimizes and delivers bioactives far beyond what
              conventional forms can achieve
            </p>
          </div>
          <p className="cmp-row-banner reveal" style={{ transitionDelay: "0.2s" }}>
            Conventional Bioactive :
          </p>
          <div className="cmp-row-list">
            {ROWS.map((row, i) => (
              <p className="cmp-pill reveal" key={row.con} style={{ transitionDelay: `${0.3 + i * 0.1}s` }}>
                {row.con}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="cmp-row cmp-row-pro">
        <div className="cmp-row-content">
          <p className="cmp-row-banner reveal">SowTrap&trade; Encapsulated Bioactive :</p>
          <div className="cmp-row-list">
            {ROWS.map((row, i) => (
              <p className="cmp-pill reveal" key={row.pro} style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
                {row.pro}
              </p>
            ))}
          </div>
        </div>
        {!isMobile && (
          <div className="cmp-row-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/comparison-encapsulated.jpeg" alt="Glass vial filled with encapsulated beads" />
          </div>
        )}
      </div>
    </section>
  );
}
