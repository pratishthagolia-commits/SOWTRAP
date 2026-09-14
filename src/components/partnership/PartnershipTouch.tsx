"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// same scroll-tracked pull technique as PartnershipAchieve wrapping
// "Who We Partner With" — pixels pulled up for every pixel this section
// naturally enters from the trigger line, eased toward the target each
// frame instead of jumping straight to it.
const PULL_RATE = 1;
const EARLY_START_VH = 0.08;
const EASE = 0.12;

// "Get in touch & Book an appointment" — a generic, mid-page contact CTA
// banner sitting between the audience-specific "For Brands" and "For
// Growers & Suppliers" sections.
export default function PartnershipTouch() {
  const sectionRef = useRef<HTMLElement>(null);
  const currentOverlapRef = useRef(0);
  const [overlapPx, setOverlapPx] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        // derived live instead of captured once on mount — see
        // PartnershipAchieve for why a frozen snapshot goes stale.
        const liveTop = el.getBoundingClientRect().top;
        const naturalViewportTop = liveTop + currentOverlapRef.current;
        const triggerLine = window.innerHeight * (1 + EARLY_START_VH);
        const entered = Math.max(0, triggerLine - naturalViewportTop);
        const target = Math.min(window.innerHeight, entered * PULL_RATE);
        currentOverlapRef.current += (target - currentOverlapRef.current) * EASE;
        setOverlapPx(currentOverlapRef.current);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="partnership-touch" ref={sectionRef} style={{ marginTop: `${-overlapPx}px` }}>
      <h2 className="partnership-touch-heading reveal-left">Get in touch &amp; Book an appointment</h2>
      <p className="partnership-touch-body reveal-right">
        Have a formulation challenge or an idea for your next product?
        <br />
        Our scientific and formulation experts are committed to helping you develop innovative,
        high-performance ingredient solutions tailored to your business needs.
      </p>

      <div className="partnership-touch-links">
        <div className="partnership-touch-link">
          <p>
            Have a Project in mind ?
            <br />
            Connect with our experts&ndash;
          </p>
          <Link href="/contact" className="btn btn-lime">Contact Us</Link>
        </div>
        <div className="partnership-touch-link">
          <p>Explore encapsulation technologies&ndash;</p>
          <Link href="/technology" className="btn btn-lime">Technology</Link>
        </div>
        <div className="partnership-touch-link">
          <p>Explore Products&ndash;</p>
          <Link href="/products" className="btn btn-lime">Products</Link>
        </div>
      </div>
    </section>
  );
}
