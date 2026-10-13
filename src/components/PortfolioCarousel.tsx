"use client";

import { useRef } from "react";
import Link from "next/link";

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

// previously a scroll-jacked slider: page scroll drove a JS-computed
// translateX on the card track every animation frame. That fractional,
// continuously-recalculated transform is exactly what left the card text
// soft/blurry while scrolling (and often still blurry once settled) on
// displays with fractional device-pixel ratios (Windows 125%/150% scaling
// in particular) — any element pinned to its own GPU-composited layer via
// a per-frame transform gets rasterized at a scale that doesn't match the
// page's own DPI, so the browser resamples it instead of drawing crisp
// text. Native horizontal scrolling never puts the text on a transformed
// layer at all, so there's no DPI mismatch to resample — this now uses
// the exact same plain overflow-x scroller + arrow-button pattern the
// phone layout already used successfully, just sized for desktop.
export default function PortfolioCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div id="portfolio-carousel" className="pf-wrapper">
      <div className="pf-arrows">
        <button
          type="button"
          className="pf-arrow-btn"
          aria-label="Previous ingredient categories"
          onClick={() => scrollByCard(-1)}
        >
          &#8249;
        </button>
        <button
          type="button"
          className="pf-arrow-btn"
          aria-label="Next ingredient categories"
          onClick={() => scrollByCard(1)}
        >
          &#8250;
        </button>
      </div>

      <div className="pf-track" ref={trackRef}>
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
