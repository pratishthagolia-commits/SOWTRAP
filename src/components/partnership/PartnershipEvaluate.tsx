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
// with the step's title/description; clicking does the same (toggling
// manually). Scrolling also drives one synchronized sequence for the two
// rows, tied to the grid's own position as it scrolls through the
// viewport (not each card independently):
//   stage 0 — both rows on their photo (the resting state before/after)
//   stage 1 — row one (cards 0-2) flips to text, row two stays photo
//   stage 2 — row one flips back to photo, row two flips to text
//   stage 3 — row two flips back to photo — settled; from here on only
//             hover/click flip a card, scroll no longer touches any of
//             them
// Stage only ever advances (never regresses on scrolling back up), so
// the sequence plays through once per visit and then leaves hover fully
// in control, matching how a card that's "stuck" flipped with no visible
// change on hover would otherwise be indistinguishable from a working one.
export default function PartnershipEvaluate() {
  const isMobile = useIsMobile();
  const [stage, setStage] = useState(0);
  const [clicked, setClicked] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  function toggle(i: number) {
    setClicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  useEffect(() => {
    if (isMobile) return;
    let frameId = 0;
    function tick() {
      const el = gridRef.current;
      if (el) {
        const top = el.getBoundingClientRect().top;
        setStage((prev) => {
          if (prev < 1 && top < window.innerHeight * 0.75) return 1;
          if (prev < 2 && top < window.innerHeight * 0.35) return 2;
          if (prev < 3 && top < 0) return 3;
          return prev;
        });
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isMobile]);

  function isAutoFlipped(i: number) {
    const row = i < 3 ? 1 : 2;
    if (stage === 1) return row === 1;
    if (stage === 2) return row === 2;
    return false;
  }

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
      <div className="partnership-eval-grid" ref={gridRef}>
        {STEPS.map((step, i) => (
          <button
            type="button"
            className={`partnership-eval-card${isAutoFlipped(i) || clicked.has(i) ? " is-active" : ""}`}
            key={step.title}
            onClick={() => toggle(i)}
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
