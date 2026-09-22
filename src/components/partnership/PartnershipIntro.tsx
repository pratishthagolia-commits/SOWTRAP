"use client";

import { useEffect, useRef, useState } from "react";

// overlap is a fraction of the viewport height — wraps this section up
// over the full-screen hero photo above it as the user scrolls, same
// scroll-tracked-margin technique as TechIntro wrapping TechnologyHero.
const MAX_OVERLAP_RATIO = 0.55;

// same two-column layout as BioactivesIntro's "what are bioactive
// ingredients?" section — right-aligned heading on the left, panel with
// a paragraph on the right, plus a CTA button beneath it.
export default function PartnershipIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [overlapPx, setOverlapPx] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        if (naturalTopRef.current === null) {
          naturalTopRef.current = el.getBoundingClientRect().top + window.scrollY;
        }
        const naturalViewportTop = naturalTopRef.current - window.scrollY;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - naturalViewportTop) / (window.innerHeight * 0.4)));
        setOverlapPx(window.innerHeight * MAX_OVERLAP_RATIO * progress);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="partnership-intro" ref={sectionRef} id="slide-two" style={{ marginTop: `${-overlapPx}px` }}>
      <h1 className="partnership-hero-tab">PARTNERSHIP</h1>

      <div className="partnership-what">
        <h2 className="partnership-what-heading reveal-left">
          From Source to Science.
          <br />
          From Science to Market.
        </h2>
        <div className="partnership-what-panel">
          <p className="partnership-what-body reveal-right">
            SowTrap&trade; builds science-led partnerships across the ingredient value chain&mdash;from
            growers and ingredient suppliers to brands, manufacturers, and research organizations.
          </p>
        </div>
      </div>
    </section>
  );
}
