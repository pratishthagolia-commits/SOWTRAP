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
// manually). Scrolling also flips each card automatically, but only for
// one full in-then-back cycle: it flips to info as it passes through a
// band in the middle of the viewport, then flips back to its photo once
// it scrolls out the other side — after that one cycle, scroll no longer
// touches that card at all, and hover/click are the only way to flip it
// again. The grid is 3 columns x 2 rows, so cards 0-2 (row one) cross
// that band together, then cards 3-5 (row two) follow as the user keeps
// scrolling, with row one settling back to its photo around the same
// time.
export default function PartnershipEvaluate() {
  const isMobile = useIsMobile();
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const enteredOnceRef = useRef<Set<number>>(new Set());
  const settledRef = useRef<Set<number>>(new Set());

  function toggle(i: number) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  useEffect(() => {
    if (isMobile) return;
    const io = new IntersectionObserver(
      (entries) => {
        setFlipped((prev) => {
          let next: Set<number> | null = null;
          entries.forEach((entry) => {
            const index = cardRefs.current.indexOf(entry.target as HTMLButtonElement);
            // already completed its one auto in/out cycle — scroll
            // no longer drives this card, only hover/click do
            if (index === -1 || settledRef.current.has(index)) return;

            if (entry.isIntersecting) {
              enteredOnceRef.current.add(index);
              if (!prev.has(index)) {
                if (!next) next = new Set(prev);
                next.add(index);
              }
            } else if (enteredOnceRef.current.has(index)) {
              // the exit after having entered once — flip back and retire
              settledRef.current.add(index);
              if ((next ?? prev).has(index)) {
                if (!next) next = new Set(prev);
                next.delete(index);
              }
            }
          });
          return next ?? prev;
        });
      },
      // shrinks the observed region to the middle half of the viewport —
      // a card counts as "intersecting" (flipped) only while passing
      // through that band, not for the whole time it's anywhere on screen
      { threshold: 0, rootMargin: "-25% 0px -25% 0px" }
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
            className={`partnership-eval-card${flipped.has(i) ? " is-active" : ""}`}
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
