"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// overlap is a fraction of the viewport height — wraps this panel up over
// the full-screen photo above it as the user scrolls, same scroll-
// tracked-margin technique as ContactHero wrapping ContactHeroPhoto.
const MAX_OVERLAP_RATIO = 0.55;

// navy intro panel — "PRODUCT" folder-notch tab, breadcrumb, page
// heading, and a short statement about the portfolio, wrapping up over
// ProductsHeroPhoto.
export default function ProductsHero() {
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
    <section className="products-hero" ref={sectionRef} id="slide-two" style={{ marginTop: `${-overlapPx}px` }}>
      <h2 className="products-hero-tab">PRODUCT</h2>

      <p className="products-hero-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Products</span>
      </p>
      <h1 className="products-hero-heading">Our Ingredient Portfolio</h1>
      <p className="products-hero-body">
        Every ingredient in the SowTrap&trade; is engineered around the same principle:
        protect the active, mask what needs masking, and deliver it intact to where it works.
        Explore our encapsulated herbal extracts, vitamins, minerals, bioactives, biopeptides, and
        microbial ingredients.
      </p>
    </section>
  );
}
