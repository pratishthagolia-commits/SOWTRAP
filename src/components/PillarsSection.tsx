"use client";

import { useState } from "react";

type Pillar = { code: string; title: string; tagline: string; body: string };

const PILLARS: Pillar[] = [
  {
    code: "S1",
    title: "Stability",
    tagline: "Maximum protection. Maximum performance.",
    body: "Advanced encapsulation shields sensitive bioactives from heat, moisture, oxygen, light, and processing stresses, preserving ingredient integrity, potency, and functionality throughout manufacturing and storage.",
  },
  {
    code: "S2",
    title: "Shelf Life",
    tagline: "Longer stability. Greater reliability.",
    body: "Engineered protective matrices extend product shelf life by minimising degradation, ensuring consistent quality, efficacy, and performance across transportation, storage, and consumer use.",
  },
  {
    code: "S3",
    title: "Solubility",
    tagline: "Better solubility. Better performance.",
    body: "We transform challenging bioactives into highly dispersible, application-ready ingredients. This improves water dispersibility, enhances formulation flexibility, and enables seamless incorporation into diverse food, beverage, and nutraceutical formats.",
  },
  {
    code: "S4",
    title: "Systemic Bioavailability",
    tagline: "Higher absorption. Superior outcomes.",
    body: "Optimised delivery systems improve nutrient absorption through enhanced dissolution and controlled-release technologies, helping maximise bioavailability and support consistent physiological performance.",
  },
];

// two-panel "chamber" pattern: a white card on the left shows the active
// pillar's full description, and a static list of clickable pointers on
// the right (navy, not the reference's near-black) swaps which one is
// active. No scroll-jack — just click-to-select state.
export default function PillarsSection() {
  const [active, setActive] = useState(0);
  const current = PILLARS[active];

  return (
    <>
      <div className="pillars-heading-slide">
        <p className="pillars-kicker reveal-left">
          <span className="pillars-kicker-light">SowTrap&trade;:</span>
          <br />
          <span className="pillars-kicker-big">
            BRIDGING
            <br />
            NUTRITION GAP
          </span>
        </p>
      </div>

      <section className="pillars-chamber" id="framework">
        <div className="pillars-chamber-left">
          <p className="pillars-chamber-code">{current.code}</p>
          <h3 className="pillars-chamber-title">{current.title}</h3>
          <span className="pillars-chamber-divider" />
          <p className="pillars-chamber-tagline">{current.tagline}</p>
          <p className="pillars-chamber-body">{current.body}</p>
        </div>

        <div className="pillars-chamber-grid">
          {PILLARS.map((pillar, i) => (
            <button
              key={pillar.code}
              type="button"
              className={`pillars-chamber-item${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="pillars-chamber-plus">{i === active ? "–" : "+"}</span>
              <span className="pillars-chamber-label">
                {pillar.code} – {pillar.title}
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
