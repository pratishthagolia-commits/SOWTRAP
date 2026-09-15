"use client";

import { useEffect, useRef, useState } from "react";
import ChamberAccordion from "@/components/ChamberAccordion";
import useIsMobile from "@/lib/useIsMobile";

type EvalStep = { num: string; title: string; desc: string; image: string };

const STEPS: EvalStep[] = [
  {
    num: "1",
    title: "Raw Material Assessment",
    desc: "Comprehensive evaluation of raw materials, quality verification, and documentation review to establish traceability and chain of custody.",
    image: "/images/partnership-eval-raw-material.jpeg",
  },
  {
    num: "2",
    title: "Bench-Scale Extraction & Process Development",
    desc: "Laboratory-scale extraction and process optimization are used to maximize bioactive recovery while preserving their integrity and functionality.",
    image: "/images/partnership-eval-bench-scale.jpeg",
  },
  {
    num: "3",
    title: "Extract Feasibility & Application Assessment",
    desc: "We assess extract quality, functionality, and application potential, supported by relevant analytical and technical documentation.",
    image: "/images/partnership-eval-extract-feasibility.jpeg",
  },
  {
    num: "4",
    title: "Phytochemical & Functional Profiling",
    desc: "Advanced profiling of phytochemicals and bioactives to characterize key constituents, assess quality, and guide formulation and encapsulation development.",
    image: "/images/partnership-eval-phytochemical.jpeg",
  },
  {
    num: "5",
    title: "Analytical & Technical Documentation",
    desc: "Scientific findings are translated into structured technical evidence to support formulation, quality assurance, and commercial evaluation.",
    image: "/images/partnership-eval-analytical-doc.jpeg",
  },
  {
    num: "6",
    title: "Innovation & Commercialization Roadmap",
    desc: "We translate research outcomes into commercially viable solutions through a structured roadmap spanning formulation, encapsulation, validation, scale-up, and commercialization.",
    image: "/images/partnership-eval-innovation-roadmap.jpeg",
  },
];

// "We Care How We Evaluate Your Ingredients" — a 3x2 grid of photo cards.
// Hovering a card turns it slightly and fades in a white info overlay
// with the step's title/description; clicking does the same (toggling),
// so it also works on touch devices where hover doesn't apply.
export default function PartnershipEvaluate() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState<number | null>(null);
  // auto-flip each card the first time it scrolls into view, in addition
  // to the existing hover/click flip — the grid is 3 columns x 2 rows, so
  // cards 0-2 (row one) naturally intersect on an earlier point in the
  // scroll than cards 3-5 (row two), giving the "first three flip on the
  // first scroll, next three flip on the second scroll" behaviour without
  // hardcoding two separate scroll thresholds.
  const [autoFlipped, setAutoFlipped] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isMobile) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = cardRefs.current.indexOf(entry.target as HTMLButtonElement);
          if (index === -1) return;
          setAutoFlipped((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    cardRefs.current.forEach((card) => card && io.observe(card));
    return () => io.disconnect();
  }, [isMobile]);

  return (
    <section className="partnership-eval">
      <h2 className="partnership-eval-heading reveal-right">We Care How We Evaluate Your Ingredients.</h2>

      <p className="partnership-eval-intro reveal-left">
        At SowTrap&trade; we systematically evaluate ingredient attributes to understand the
        quality, bioactive potential, processing feasibility, and application opportunities of each
        ingredient before progressing to formulation and encapsulation development.
      </p>
      <p className="partnership-eval-intro reveal-left">
        Our evaluation pathway connects raw material quality with scientific characterization and
        commercial application.
      </p>

      {isMobile ? (
        <div className="chamber-mobile-wrap">
          <ChamberAccordion points={STEPS.map((s) => ({ title: s.title, detail: s.desc }))} />
        </div>
      ) : (
      <div className="partnership-eval-grid">
        {STEPS.map((step, i) => (
          <button
            type="button"
            ref={(el) => { cardRefs.current[i] = el; }}
            className={`partnership-eval-card${active === i || autoFlipped.has(i) ? " is-active" : ""}`}
            key={step.title}
            onClick={() => setActive((prev) => (prev === i ? null : i))}
          >
            <div className="partnership-eval-card-inner">
              <div className="partnership-eval-card-front">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt={step.title} className="partnership-eval-photo" />
              </div>
              <div className="partnership-eval-card-back">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt="" className="partnership-eval-photo" />
                <div className="partnership-eval-card-back-wash">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      )}

      <p className="partnership-eval-closing reveal-right">
        Our objective is not simply to determine whether an ingredient meets specifications. We seek
        to understand what the ingredient can do, what limits its performance, and how science and
        technology can unlock its full application potential.
      </p>
    </section>
  );
}
