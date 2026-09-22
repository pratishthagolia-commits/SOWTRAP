"use client";

import { useEffect, useRef, useState } from "react";

// overlap is a fraction of the viewport height — wraps this panel up over
// the full-screen photo above it as the user scrolls, same scroll-
// tracked-margin technique as PartnershipIntro wrapping PartnershipHero.
const MAX_OVERLAP_RATIO = 0.55;

// navy header — "CONTACT" folder-notch tab, the main heading, and an
// intro paragraph, wrapping up over ContactHeroPhoto.
export default function ContactHero() {
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
    <section
      className="contact-hero"
      ref={sectionRef}
      id="slide-two"
      style={{ marginTop: `${-overlapPx}px` }}
    >
      <h2 className="contact-hero-tab">CONTACT</h2>

      <p className="contact-hero-kicker">Contact</p>
      <h1 className="contact-hero-heading">Let&apos;s build your next innovation&mdash;together</h1>
      <p className="contact-hero-intro">
        Connect with the SowTrap&trade; scientific team to discuss your requirements and explore the
        right pathway for ingredient development, encapsulation, validation, scale-up, or commercial
        manufacturing.
      </p>
    </section>
  );
}
