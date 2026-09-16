"use client";

import { useEffect, useRef, useState } from "react";

type EngagementModel = { name: string; image: string; tagline: string; description: string };

const MODELS: EngagementModel[] = [
  {
    name: "Contract R&D",
    image: "/images/partnership-stage-contract-rd.jpeg",
    tagline: "Develop the science behind your next ingredient.",
    description:
      "For brands and ingredient companies seeking scientific expertise to investigate, formulate, optimize, and validate challenging bioactives and delivery systems.",
  },
  {
    name: "Custom Formulation",
    image: "/images/partnership-stage-custom-formulation.jpeg",
    tagline: "Engineer the delivery system around your application.",
    description:
      "For partners seeking application-specific encapsulated ingredients engineered for stability, solubility, release, sensory performance, and processing compatibility.",
  },
  {
    name: "Technology Development",
    image: "/images/partnership-stage-technology-development.jpeg",
    tagline: "Turn a formulation challenge into a new delivery solution.",
    description:
      "For partners seeking to develop novel, differentiated, or proprietary delivery systems for specific bioactives, applications, or performance requirements.",
  },
  {
    name: "Scale-Up & Manufacturing",
    image: "/images/partnership-stage-scaleup-manufacturing.jpeg",
    tagline: "Move validated innovation from laboratory to market.",
    description:
      "For partners ready to translate an optimized formulation into reproducible pilot-scale and commercial production.",
  },
  {
    name: "Scientific Collaboration",
    image: "/images/partnership-stage-scientific-collaboration.jpeg",
    tagline: "Build evidence through collaborative research.",
    description:
      "For universities, research institutions, clinical organizations, and scientific partners seeking to collaborate on technology development, analytical research, bioavailability, clinical studies, and scientific publications.",
  },
];

// same pinned scroll-jack mechanic as TechStages ("stage / what we
// evaluate") — the navy/white band layout stays fixed, only the photo,
// tagline/description, and model-name caption crossfade between the 5
// engagement models as the user scrolls.
export default function PartnershipEngagement() {
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

  const activeIndex = Math.min(MODELS.length - 1, Math.floor(progress * MODELS.length));

  return (
    <section
      className="partnership-stages-scroll"
      ref={wrapperRef}
      style={{ height: `${MODELS.length * 100}vh` }}
    >
      <div className="partnership-stages-sticky">
        <div className="partnership-stages-header">
          <span className="reveal-left">Model</span>
          <span className="reveal-right">How we help</span>
        </div>

        <div className="partnership-stages-white-band" />
        <div className="partnership-stages-divider" />

        <div className="partnership-stages-photo-col">
          {MODELS.map((model, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={model.name}
              src={model.image}
              alt={model.name}
              className={`partnership-stages-photo${i === activeIndex ? " is-active" : ""}`}
            />
          ))}
        </div>

        <div className="partnership-stages-caption">
          {MODELS.map((model, i) => (
            <span
              key={model.name}
              className={`partnership-stages-caption-item${i === activeIndex ? " is-active" : ""}`}
            >
              {model.name}
            </span>
          ))}
        </div>

        <div className="partnership-stages-evaluate-col">
          {MODELS.map((model, i) => (
            <div
              key={model.name}
              className={`partnership-stages-evaluate-item${i === activeIndex ? " is-active" : ""}`}
            >
              <p className="partnership-stages-evaluate-name">{model.name}</p>
              <p className="partnership-stages-evaluate-heading">{model.tagline}</p>
              <p className="partnership-stages-evaluate-desc">{model.description}</p>
            </div>
          ))}
        </div>

        <div className="partnership-stages-progress">
          {MODELS.map((model, i) => (
            <span key={model.name} className={`partnership-stages-progress-dot${i === activeIndex ? " active" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
