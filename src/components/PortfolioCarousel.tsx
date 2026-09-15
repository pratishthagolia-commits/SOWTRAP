"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useIsMobile from "@/lib/useIsMobile";

type PortfolioItem = { title: string; body: string };

const ITEMS: PortfolioItem[] = [
  {
    title: "Encapsulated Vitamins (Natural & Vegan)",
    body: "We use advanced encapsulation technologies to protect vitamins from environmental stressors, supporting stability throughout processing and storage. Our delivery systems enhance dispersibility, particularly for fat-soluble vitamins enabling optimized release and absorption.",
  },
  {
    title: "Encapsulated Minerals",
    body: "Our encapsulation approach helps isolate mineral ions, from unwanted interactions, supporting improved stability and absorption. They can also reduce metallic taste, minimize gastrointestinal discomfort, and improve handling and formulation performance.",
  },
  {
    title: "Encapsulated Botanical & Herbal Extracts",
    body: "We stabilize sensitive phytochemicals through specialized encapsulation matrices, to help preserve their activity and stability. Enhanced dispersibility and absorption, together with taste and aroma masking, enable improved formulation performance and consumer acceptance.",
  },
  {
    title: "Adaptogenic Blends - Targeted health and wellness",
    body: "Our advanced delivery systems are designed to accommodate complex combinations of adaptogens and functional bioactives. Microencapsulation can improve ingredient compatibility, protect sensitive actives, and enable tailored release profiles for targeted wellness applications.",
  },
  {
    title: "Encapsulated Essential & Natural Oil Powders",
    body: "We transform volatile and oxidation-sensitive oils into stable, free-flowing and dispersible powder formats using microencapsulation. This helps protect against oxidation, improves compatibility with aqueous formulations, and enables controlled release while masking strong taste and aroma.",
  },
  {
    title: "Speciality Functional Ingredient Systems",
    body: "We develop tailored encapsulation and delivery solutions for specialized bioactives and functional ingredients, including amino acids, nootropics, and other performance-oriented compounds. From ingredient selection and formulation design to application-specific delivery, we provide solutions designed to meet the unique requirements of each product and end-use format.",
  },
  {
    title: "Custom Encapsulation Solutions",
    body: "Every active presents a unique delivery challenge. We develop purpose-built encapsulation solutions that align with your ingredient, product concept, dosage requirements, and intended application.",
  },
];

// same horizontal scroll-jacking mechanic as PillarsCarousel: page scroll
// drives translateX on the card track while the section stays pinned.
// Wrapper height = 100vh + travel distance, sticky child pins at top:0, and
// rect.top going from 0 to -maxTranslate maps 1:1 to track x.
export default function PortfolioCarousel() {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    // phone swaps the scroll-jack for a plain native-scroll strip, so none
    // of this measuring or the permanent rAF loop below is needed there
    if (isMobile) return;
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      setMaxTranslate(Math.max(0, track.scrollWidth - window.innerWidth));
    }
    measure();

    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);

    let frameId = 0;
    function tick() {
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrolled = Math.min(maxTranslate, Math.max(0, -rect.top));
        setX(scrolled);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frameId);
    };
  }, [maxTranslate, isMobile]);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  if (isMobile) {
    return (
      <div id="portfolio-carousel" className="pf-wrapper pf-wrapper--mobile">
        <div className="portfolio-mobile-arrows">
          <button
            type="button"
            className="portfolio-mobile-arrow"
            aria-label="Previous ingredient categories"
            onClick={() => scrollByCard(-1)}
          >
            &#8249;
          </button>
          <button
            type="button"
            className="portfolio-mobile-arrow"
            aria-label="Next ingredient categories"
            onClick={() => scrollByCard(1)}
          >
            &#8250;
          </button>
        </div>
        <div className="portfolio-mobile-scroller" ref={trackRef}>
          {ITEMS.map((item) => (
            <div className="pf-card" key={item.title}>
              <div className="pf-card-tab">{item.title}</div>
              <div className="pf-card-body">
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/products" className="btn btn-lime pf-cta">Explore Our Products</Link>
      </div>
    );
  }

  return (
    <>
      {/* .pf-wrapper's height is a JS-computed fixed value sized purely
          for the scroll-jack's own travel distance (often 2000px+) — any
          content nested inside it inherits that leftover space as blank
          dead air below it. The CTA has to live outside, as a normal
          sibling, so it sits flush right after the pinned section ends
          instead of floating at the top of a mostly-empty box. */}
      <div
        id="portfolio-carousel"
        className="pf-wrapper"
        ref={wrapperRef}
        style={{ height: `calc(100vh + ${maxTranslate}px)` }}
      >
        <div className="pf-sticky">
          <div className="pf-track" ref={trackRef} style={{ transform: `translateX(-${x}px)` }}>
            {ITEMS.map((item) => (
              <div className="pf-card" key={item.title}>
                <div className="pf-card-tab">{item.title}</div>
                <div className="pf-card-body">
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <span className="pf-arrow" aria-hidden="true">&gt;</span>
        </div>
      </div>
      <Link href="/products" className="btn btn-lime pf-cta">Explore Our Products</Link>
    </>
  );
}
