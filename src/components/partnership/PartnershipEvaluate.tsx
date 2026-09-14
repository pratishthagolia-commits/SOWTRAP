"use client";

import { useState } from "react";

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
  const [active, setActive] = useState<number | null>(null);

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

      <div className="partnership-eval-grid">
        {STEPS.map((step, i) => (
          <button
            type="button"
            className={`partnership-eval-card${active === i ? " is-active" : ""}`}
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

      <p className="partnership-eval-closing reveal-right">
        Our objective is not simply to determine whether an ingredient meets specifications. We seek
        to understand what the ingredient can do, what limits its performance, and how science and
        technology can unlock its full application potential.
      </p>
    </section>
  );
}
