"use client";

import { useEffect, useRef, useState } from "react";

type FailPoint = { title: string; detail: string };

const FAIL_POINTS: FailPoint[] = [
  {
    title: "Poor Bioavailability",
    detail:
      "Many nutrients are not efficiently absorbed due to poor dissolution, interactions with other ingredients, or chemical incompatibilities. Minerals can interact with other compounds, while sensitive actives may oxidize or degrade before they can be effectively utilized by the body.",
  },
  {
    title: "Unpleasant Taste",
    detail:
      "Many functional ingredients come with inherent sensory challenges, including metallic mineral notes, bitterness from botanicals, or strong off-notes from oils. These unpleasant characteristics can limit formulation flexibility and reduce consumer acceptance.",
  },
  {
    title: "Poor Stability During Processing, Handling and Storage",
    detail:
      "Heat, moisture, oxygen, light, and mechanical stress can compromise sensitive nutrients during manufacturing and throughout their shelf life. This may lead to loss of potency, changes in appearance, and reduced product performance.",
  },
  {
    title: "Poor Solubility",
    detail:
      "Several important nutrients, particularly oil-soluble compounds and hydrophobic bioactives, disperse poorly in aqueous formulations. This can result in uneven distribution, formulation challenges, and reduced availability for absorption.",
  },
  {
    title: "Limited Shelf Life",
    detail:
      "Nutrient potency can gradually decline over time due to oxidation, moisture exposure, ingredient interactions, and other environmental factors. Maintaining label claim and product quality throughout the intended shelf life can therefore be challenging.",
  },
  {
    title: "Nutrient Degradation During Gastrointestinal Digestion and Transit",
    detail:
      "Even when a nutrient remains stable in the final product, it may be exposed to harsh conditions after consumption. Changes in pH, digestive enzymes, bile salts, and other gastrointestinal conditions can degrade or alter sensitive actives before they reach their intended site of action.",
  },
  {
    title: "Inconsistent Absorption",
    detail:
      "The amount of a nutrient ultimately absorbed can vary depending on its formulation, food interactions, individual physiology, and gastrointestinal conditions. This variability can lead to inconsistent delivery and reduced predictability of nutritional benefits.",
  },
];

// same "chamber" pattern as PillarsSection, plus hover-to-preview: hovering
// a point shows its detail in the card temporarily; moving the mouse away
// reverts to whichever point was last clicked ("pinned"), and clicking a
// point re-pins the card to it.
//
// the reveal-on-scroll state is tracked locally (not via the global
// ScrollReveal + externally-added "in-view" class) because the buttons'
// className already changes dynamically with hover ("is-active") — if
// "in-view" were added by an outside IntersectionObserver instead of by
// React itself, every hover-triggered re-render would have React
// overwrite the whole className attribute back to its own last-known
// value, wiping out that externally-added class and making the text snap
// back to invisible. Keeping "revealed" as React state and folding it
// into the same className string React already computes avoids that.
export default function SupplementsFail() {
  const [pinned, setPinned] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const active = hovered ?? pinned;
  const current = FAIL_POINTS[active];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealClass = revealed ? " in-view" : "";

  return (
    <section className="fail-v2-chamber" ref={sectionRef}>
      <p className="fail-v2-heading">
        Why current
        <br />
        supplements fail
      </p>

      <div className="fail-v2-body">
        <div className={`fail-v2-card reveal${revealClass}`} style={{ transitionDelay: "0.15s" }}>
          <h3>{current.title}</h3>
          {current.detail && <p>{current.detail}</p>}
        </div>

        <div className="fail-v2-grid">
          {FAIL_POINTS.map((point, i) => (
            <button
              key={point.title}
              type="button"
              className={`fail-v2-item${i === active ? " is-active" : ""} reveal${revealClass}`}
              style={{ transitionDelay: `${0.15 + (i + 1) * 0.1}s` }}
              onClick={() => setPinned(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {point.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
