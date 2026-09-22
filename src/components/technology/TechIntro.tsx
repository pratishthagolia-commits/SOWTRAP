"use client";

import { useEffect, useRef, useState } from "react";

// overlap is a fraction of the viewport height — wraps this section up
// over the full-screen hero photo above it as the user scrolls, same
// scroll-tracked-margin technique as BioactivesIntro wrapping ScienceHero.
const MAX_OVERLAP_RATIO = 0.55;

export default function TechIntro() {
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
    <section className="tech-intro" ref={sectionRef} id="slide-two" style={{ marginTop: `${-overlapPx}px` }}>
      <h1 className="tech-hero-tab">TECHNOLOGY</h1>
      <p className="tech-intro-body reveal-up">
        SowTrap&trade; integrates material science, formulation engineering, encapsulation
        technology, and process optimization to convert challenging bioactives into stable,
        functional, and application-ready delivery systems. Rather than applying a single
        encapsulation method to every ingredient, we engineer the delivery system around the
        specific properties, intended use, and performance requirements of the active.
      </p>
    </section>
  );
}
