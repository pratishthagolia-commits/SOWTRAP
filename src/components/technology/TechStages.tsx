"use client";

import { useEffect, useRef, useState } from "react";

type Stage = {
  name: string;
  image: string;
  evaluateHeading: string;
  evaluate: string[];
};

// content moved over from TechPhilosophy's horizontal ingredient-challenge
// cards (that section is now removed from the page) — kept this design
// (the pinned photo/navy-band scroll-jack) rather than the card carousel,
// per the client's direction. title -> name, solution -> evaluateHeading,
// benefit -> the single-line "evaluate" list.
//
// images: the 7 original per-stage photos are reused here (assignment is
// arbitrary — the client said any photo on any point is fine). Challenge
// #8, "Process Sensitivity", now has its own dedicated photo.
const STAGES: Stage[] = [
  {
    name: "Sensory Challenges",
    image: "/images/tech-stage-understand-active.jpeg",
    evaluateHeading: "Taste-masked and sensory-optimised formats",
    evaluate: ["Reduced bitterness, metallic notes and undesirable odour."],
  },
  {
    name: "Low Bioavailability",
    image: "/images/tech-stage-delivery-challenge.jpeg",
    evaluateHeading: "Bioaccessibility focused delivery systems",
    evaluate: ["Improved availability of the active during digestion."],
  },
  {
    name: "Targeted Release",
    image: "/images/tech-stage-end-application.jpeg",
    evaluateHeading: "Controlled and application-specific release systems",
    evaluate: ["Delivery at the desired site of action."],
  },
  {
    name: "High Active Load",
    image: "/images/tech-stage-microencapsulation-material.jpeg",
    evaluateHeading: "Optimised high-load formulations",
    evaluate: ["Higher active delivery with efficient use of carrier materials."],
  },
  {
    name: "Poor Solubility",
    image: "/images/tech-stage-encapsulation-technology.jpeg",
    evaluateHeading: "Enhanced dispersibility and delivery systems",
    evaluate: ["Improved solubility and more uniform distribution in the final product."],
  },
  {
    name: "Active Instability",
    image: "/images/tech-stage-engineer-process.jpeg",
    evaluateHeading: "Protective encapsulation systems",
    evaluate: ["Improved stability against heat, oxygen, light and moisture."],
  },
  {
    name: "Formulation Challenges",
    image: "/images/tech-stage-validate-performance.jpeg",
    evaluateHeading: "Application ingredient formats",
    evaluate: ["Improved compatibility, handling and formulation flexibility."],
  },
  {
    name: "Process Sensitivity",
    image: "/images/tech-stage-process-sensitivity.jpeg",
    evaluateHeading: "Process-compatible protective systems",
    evaluate: ["Better active retention during manufacturing."],
  },
];

// pinned scroll-jack, same mechanic as ScienceExperience — a tall wrapper
// with a position:sticky inner view. The background layout (navy/white
// bands, column headers, divider) stays fixed the whole time; only the
// photo, "what we create" list, and stage-name caption crossfade
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
          <span className="reveal-left">We Solve</span>
          <span className="reveal-right">What we create</span>
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
              <p className="tech-stages-evaluate-name">{stage.name}</p>
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
