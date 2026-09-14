"use client";

import { useState } from "react";

type Stage = { num: string; title: string; desc: string };

const STAGES: Stage[] = [
  {
    num: "01",
    title: "Ingredient-Led Design",
    desc: "We begin with the active ingredient — understanding its functional characteristics, limitations and delivery challenges. From stability, solubility and sensory properties to dose and bioavailability, we identify the key factors that influence performance and define opportunities for improvement.",
  },
  {
    num: "02",
    title: "Tailored Delivery Solution",
    desc: "Every ingredient presents a unique challenge. We combine suitable encapsulation materials, formulation strategies and processing approaches to create a delivery system tailored to the specific properties of the active and the desired performance outcome.",
  },
  {
    num: "03",
    title: "Performance Optimisation",
    desc: "Each system is carefully engineered to achieve the right balance of protection, active loading, release, dispersibility and sensory performance. Key formulation and process parameters are optimised to maximise functionality while maintaining the integrity of the active.",
  },
  {
    num: "04",
    title: "Application-Ready Innovation",
    desc: "The final ingredient is designed not simply to work in isolation, but to integrate effectively into the intended food, beverage or nutraceutical application. We consider processing conditions, product matrix compatibility, storage requirements, reconstitution and sensory expectations to create solutions ready for real-world food, beverage and nutraceutical applications.",
  },
];

// same click-to-select chamber pattern as ScienceFactors/PillarsSection —
// navy list of stages on the left, white card with the active stage's
// full description on the right.
export default function TechApproach() {
  const [active, setActive] = useState(0);
  const current = STAGES[active];

  return (
    <section className="tech-approach">
      <h2 className="tech-approach-heading">Our Approach to Ingredient Innovation</h2>

      <div className="tech-approach-chamber">
        <div className="tech-approach-list">
          {STAGES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`tech-approach-item${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="tech-approach-item-title">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="tech-approach-card">
          <h3>{current.title}</h3>
          <p>{current.desc}</p>
        </div>
      </div>
    </section>
  );
}
