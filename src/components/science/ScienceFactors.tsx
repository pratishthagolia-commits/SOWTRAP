"use client";

import { useEffect, useRef, useState } from "react";
import ChamberAccordion from "@/components/ChamberAccordion";
import useIsMobile from "@/lib/useIsMobile";

type Factor = { num: string; title: string; desc: string; influencedBy: string[] };

const FACTORS: Factor[] = [
  {
    num: "01",
    title: "Bioavailability",
    desc: "The amount of an ingested bioactive that becomes available for biological action.",
    influencedBy: ["Solubility", "Digestion", "Absorption", "Metabolism", "Elimination"],
  },
  {
    num: "02",
    title: "Stability",
    desc: "The ability of a bioactive to maintain its chemical and functional integrity throughout processing, storage, and biological transit.",
    influencedBy: ["Heat", "Moisture", "Oxygen", "pH", "Processing", "Storage"],
  },
  {
    num: "03",
    title: "Metabolism",
    desc: "The biological transformation of a bioactive after ingestion and absorption, which can influence its form, concentration, activity, and duration within the body.",
    influencedBy: [
      "Enzymatic Activity",
      "First Pass Metabolism",
      "Chemical Structure",
      "Food/Matrix Interactions",
      "Gut Microbiota",
      "Individual Physiology",
    ],
  },
];

// overlap is a fraction of the viewport height — wraps this section up
// over the 3D body experience above it as the user scrolls, same
// scroll-tracked-margin technique as BioactivesIntro wrapping the hero
// photo and ComparisonSection wrapping the pillars chamber.
const MAX_OVERLAP_RATIO = 0.4;

// same "chamber" click-to-select pattern as PillarsSection/SupplementsFail,
// mirrored (navy list on the left, white card on the right instead of the
// other way around) to match this section's reference layout.
export default function ScienceFactors() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const current = FACTORS[active];
  const sectionRef = useRef<HTMLElement>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [overlapPx, setOverlapPx] = useState(0);

  // capture this section's natural (unshifted) top once on the first
  // frame — before any margin is ever applied — to avoid a feedback loop
  // with its own animated position, then grow the negative margin purely
  // off window.scrollY as it approaches the viewport top.
  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        if (naturalTopRef.current === null) {
          naturalTopRef.current = el.getBoundingClientRect().top + window.scrollY;
        }
        const naturalViewportTop = naturalTopRef.current - window.scrollY;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - naturalViewportTop) / (window.innerHeight * 0.4)));
        setOverlapPx(window.innerHeight * MAX_OVERLAP_RATIO * progress);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="sci-factors" ref={sectionRef} style={{ marginTop: `${-overlapPx}px` }}>
      <p className="sci-factors-kicker reveal-left">Why science matters:</p>
      <h2 className="sci-factors-heading reveal-left" style={{ transitionDelay: "0.15s" }}>
        From Nature&apos;s Potential to Functional Performance
      </h2>
      <p className="sci-factors-intro reveal-right">
        Nature provides a vast spectrum of bioactive compounds— from botanical phytochemicals and
        essential oils to vitamins, minerals, amino acids, and other specialized functional
        ingredients. However, the presence of a bioactive does not always translate into its
        effective biological performance. To deliver its intended benefit, a bioactive must
        successfully navigate a complex journey through formulation, digestion, absorption,
        transport, metabolism, and cellular interaction. Its performance can be influenced by three
        fundamental factors:
      </p>

      {isMobile ? (
        <div className="chamber-mobile-wrap">
          <ChamberAccordion
            points={FACTORS.map((f) => ({
              title: f.title,
              detail: `${f.desc} Influenced by: ${f.influencedBy.join(" • ")}`,
            }))}
          />
        </div>
      ) : (
        <div className="sci-factors-chamber">
          <div className="sci-factors-list">
            {FACTORS.map((f, i) => (
              <button
                key={f.title}
                type="button"
                className={`sci-factors-item${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="sci-factors-item-title">{f.title}</span>
              </button>
            ))}
          </div>

          <div className="sci-factors-card">
            <h3>{current.title} :</h3>
            <div className="sci-factors-card-content">
              <p className="sci-factors-card-desc">{current.desc}</p>
              <div>
                <p className="sci-factors-card-label">Influenced by:</p>
                <p className="sci-factors-card-tags">{current.influencedBy.join(" • ")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
