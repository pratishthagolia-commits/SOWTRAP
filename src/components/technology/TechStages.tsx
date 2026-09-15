"use client";

import { useEffect, useRef, useState } from "react";

type Stage = {
  name: string;
  image: string;
  evaluateHeading: string;
  evaluate: string[];
};

const STAGES: Stage[] = [
  {
    name: "Understand the Active",
    image: "/images/tech-stage-understand-active.jpeg",
    evaluateHeading: "Solubility & polarity",
    evaluate: [
      "Molecular characteristics",
      "Thermal stability",
      "pH sensitivity",
      "Oxidative/light sensitivity",
      "Hygroscopicity",
      "Dose requirement",
      "Taste & odour",
    ],
  },
  {
    name: "Define the Delivery Challenge",
    image: "/images/tech-stage-delivery-challenge.jpeg",
    evaluateHeading: "Stability protection",
    evaluate: [
      "Solubility/dispersibility",
      "Taste masking",
      "Protection during processing",
      "Controlled/sustained release",
      "Improved bioaccessibility",
      "Compatibility with formulation",
    ],
  },
  {
    name: "Define End Application",
    image: "/images/tech-stage-end-application.jpeg",
    evaluateHeading: "Product format",
    evaluate: [
      "Processing conditions",
      "Storage conditions",
      "Target dose",
      "Reconstitution/dispersibility",
      "Sensory requirements",
      "Matrix compatibility",
      "Intended release profile",
    ],
  },
  {
    name: "Select Microencapsulation Material",
    image: "/images/tech-stage-microencapsulation-material.jpeg",
    evaluateHeading: "Compatibility",
    evaluate: [
      "Solubility",
      "Barrier properties",
      "Processing tolerance",
      "Release behaviour",
      "Regulatory suitability",
      "Sensory impact",
      "Moisture protection",
    ],
  },
  {
    name: "Select Encapsulation Technology",
    image: "/images/tech-stage-encapsulation-technology.jpeg",
    evaluateHeading: "Active sensitivity",
    evaluate: [
      "Material compatibility",
      "Encapsulation efficiency",
      "Particle-size requirements",
      "Thermal exposure",
      "Desired release profile",
      "Scale-up feasibility",
      "Application suitability",
    ],
  },
  {
    name: "Engineer the Process",
    image: "/images/tech-stage-engineer-process.jpeg",
    evaluateHeading: "Feed composition",
    evaluate: [
      "Core-to-wall ratio",
      "Total solids",
      "Temperature profile",
      "Feed rate",
      "Atomization conditions",
      "Residence time",
      "Drying conditions",
      "Process yield",
    ],
  },
  {
    name: "Validate Performance",
    image: "/images/tech-stage-validate-performance.jpeg",
    evaluateHeading: "Encapsulation efficiency",
    evaluate: [
      "Active retention",
      "Particle size & morphology",
      "Moisture content",
      "Solubility/dispersibility",
      "Stability",
      "Release profile",
      "Bioaccessibility",
      "Application performance",
    ],
  },
];

// pinned scroll-jack, same mechanic as ScienceExperience — a tall wrapper
// with a position:sticky inner view. The background layout (navy/white
// bands, column headers, divider) stays fixed the whole time; only the
// photo, "what we evaluate" list, and stage-name caption crossfade
// between stages as the user scrolls, per the reference design.
export default function TechStages() {
  const wrapperRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? -rect.top / total : 0;
        setProgress(Math.min(1, Math.max(0, p)));
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // hard-switch to a single active stage instead of blending by distance
  // — the previous distance-based crossfade left two stages' photo/text
  // both partially visible for a wide stretch of the scroll range,
  // reading as ghosting/double exposure rather than a clean transition.
  const activeIndex = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));

  return (
    <section
      className="tech-stages-scroll"
      ref={wrapperRef}
      style={{ height: `${STAGES.length * 100}vh` }}
    >
      <div className="tech-stages-sticky">
        <div className="tech-stages-header">
          <span className="reveal-left">Stage</span>
          <span className="reveal-right">What we evaluate</span>
        </div>

        <div className="tech-stages-white-band" />
        <div className="tech-stages-divider" />

        <div className="tech-stages-photo-col">
          {STAGES.map((stage, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={stage.name}
              src={stage.image}
              alt={stage.name}
              className={`tech-stages-photo${i === activeIndex ? " is-active" : ""}`}
            />
          ))}
        </div>

        <div className="tech-stages-caption">
          {STAGES.map((stage, i) => (
            <span
              key={stage.name}
              className={`tech-stages-caption-item${i === activeIndex ? " is-active" : ""}`}
            >
              {stage.name}
            </span>
          ))}
        </div>

        <div className="tech-stages-evaluate-col">
          {STAGES.map((stage, i) => (
            <div
              key={stage.name}
              className={`tech-stages-evaluate-item${i === activeIndex ? " is-active" : ""}`}
            >
              <p className="tech-stages-evaluate-heading">{stage.evaluateHeading}</p>
              <p className="tech-stages-evaluate-list">{stage.evaluate.join(" • ")}</p>
            </div>
          ))}
        </div>

        <div className="tech-stages-progress">
          {STAGES.map((stage, i) => (
            <span key={stage.name} className={`tech-stages-progress-dot${i === activeIndex ? " active" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
