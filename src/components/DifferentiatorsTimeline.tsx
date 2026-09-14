"use client";

import { useEffect, useRef, useState } from "react";

type TimelineItem = { title: string; body: string };

const ITEMS: TimelineItem[] = [
  {
    title: "Science-Driven Encapsulation Platforms",
    body: "Every matrix is engineered from first principles — matching physicochemical properties of the active to the optimal encapsulant for peak performance.",
  },
  {
    title: "Advanced Multi-Layer Encapsulation Technologies",
    body: "We employ matrix-based and multilayer microencapsulation approaches to address the specific chemical and physical sensitivities of bioactive compounds during processing and storage.",
  },
  {
    title: "Engineered Release Profiles",
    body: "Immediate release, delayed release, or sustained release — our matrices are tunable to deliver nutrients at the right site, at the right time.",
  },
  {
    title: "Optimized Encapsulation Efficiency",
    body: "Formulation composition and process parameters are systematically optimized to achieve high encapsulation efficiency and active retention, while maintaining the desired particle characteristics.",
  },
  {
    title: "Rational Material Selection",
    body: "All our coating materials are selected for active compatibility, physicochemical performance, processing and regulatory requirements, with a focus on clean-label, consumer-friendly, and environmentally responsible solutions.",
  },
  {
    title: "Broad Ingredient Compatibility",
    body: "Our technology platforms are designed to accommodate a broad spectrum of bioactives, including vitamins, minerals, botanical extracts, amino acids, probiotics, adaptogens, antioxidants, enzymes, and other sensitive functional ingredients.",
  },
  {
    title: "Application-Ready Ingredient Systems",
    body: "Our microencapsulated ingredients are engineered for seamless integration into a wide range of product formats, including powders, capsules, tablets, gummies, sachets, functional beverages, dairy, bakery, confectionery, and other functional food applications.",
  },
  {
    title: "Process Development & Scale-Up",
    body: "From lab-scale development to commercial-scale production — our contract manufacturing capabilities support your full product lifecycle.",
  },
  {
    title: "Analytical Characterization & Quality Assessment",
    body: "Our rigorous analytical characterization ensures consistent quality, reproducibility, and performance of every encapsulated system.",
  },
  {
    title: "Data-Driven Optimization",
    body: "We use experimental design, statistical analysis, and performance data to develop robust formulations and reproducible encapsulation processes.",
  },
];

export default function DifferentiatorsTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [growth, setGrowth] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>(() => ITEMS.map(() => false));

  // the central line grows top-down tracking scroll progress through the
  // whole timeline (reaches full length once the timeline's bottom edge
  // nears the upper part of the viewport), same rAF pattern used for the
  // About-section lines and the word-reveal effects elsewhere. Each box's
  // reveal state is recomputed every frame from the line's current tip —
  // not just latched on once true — so scrolling back up past a row hides
  // it again and it replays the reveal animation on the way back down,
  // instead of staying permanently revealed after the first time.
  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = timelineRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const start = window.innerHeight * 0.9;
        const end = -rect.height + window.innerHeight * 0.4;
        const raw = (start - rect.top) / (start - end);
        const g = Math.min(1, Math.max(0, raw));
        setGrowth(g);

        const lineLength = g * rect.height;
        setRevealed((prev) => {
          let changed = false;
          const next = prev.map((was, i) => {
            const rowEl = rowRefs.current[i];
            if (!rowEl) return was;
            const rowTop = rowEl.getBoundingClientRect().top - rect.top;
            const isNow = lineLength >= rowTop;
            if (isNow !== was) changed = true;
            return isNow;
          });
          return changed ? next : prev;
        });
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="dt-section">
      <div className="dt-header-plain">
        <p className="dt-heading">WHAT MAKES SowTrap&trade; DIFFERENT</p>
      </div>

      <div className="dt-timeline" ref={timelineRef}>
        <div className="dt-timeline-line" style={{ transform: `scaleY(${growth})` }} aria-hidden="true" />
        {ITEMS.map((item, i) => (
          <div
            className={`dt-row ${i % 2 === 0 ? "is-left dt-reveal-left" : "is-right dt-reveal-right"} ${
              revealed[i] ? "is-visible" : ""
            }`}
            key={item.title}
            ref={(node) => {
              rowRefs.current[i] = node;
            }}
          >
            <div className="dt-box">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
