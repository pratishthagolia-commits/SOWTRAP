"use client";

import { useState } from "react";
import ChamberAccordion from "./ChamberAccordion";
import useIsMobile from "@/lib/useIsMobile";

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
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);

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
        <p className="pillars-kicker-sub reveal-left" style={{ transitionDelay: "0.1s" }}>
          Four Pillars. One Intelligent Delivery System
        </p>
      </div>

      <section className="pillars-chamber" id="framework">
        {isMobile ? (
          <div className="chamber-mobile-wrap">
            <ChamberAccordion
              points={PILLARS.map((p) => ({
                title: p.title,
                detail: `${p.tagline} ${p.body}`,
              }))}
            />
          </div>
        ) : (
          <>
            <div className="pillars-chamber-left">
              {/* all four pillars' content is stacked in the same grid
                  cell (only the active one visible) so the card's height
                  is always set by the tallest one, instead of growing and
                  shrinking as the user clicks between shorter/longer
                  pillars — no guessed pixel value, and nothing can
                  overflow since every variant is actually laid out */}
              <div className="pillars-chamber-stack">
                {PILLARS.map((pillar, i) => (
                  <div
                    key={pillar.code}
                    className={`pillars-chamber-content${i === active ? " is-active" : ""}`}
                    aria-hidden={i !== active}
                  >
                    <h3 className="pillars-chamber-title">{pillar.title}</h3>
                    <span className="pillars-chamber-divider" />
                    <p className="pillars-chamber-tagline">{pillar.tagline}</p>
                    <p className="pillars-chamber-body">{pillar.body}</p>
                  </div>
                ))}
              </div>
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
                  <span className="pillars-chamber-label">{pillar.title}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
