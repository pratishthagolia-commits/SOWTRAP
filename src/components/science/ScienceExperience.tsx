"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ScienceScene = dynamic(() => import("./ScienceScene"), { ssr: false });

const CHECKPOINTS = [
  {
    title: "01 — Food / Supplement",
    body: "The bioactive enters the body through the selected delivery format.",
  },
  {
    title: "02 — Digestion",
    body: "The active encounters changing pH, digestive enzymes, bile, and the gastrointestinal environment.",
  },
  {
    title: "03 — Absorption",
    body: "The compound must become available in a form that can cross the intestinal barrier.",
  },
  {
    title: "04 — Transport",
    body: "Once absorbed, the bioactive is transported through circulation to relevant tissues.",
  },
  {
    title: "05 — Cellular Interaction",
    body: "The active interacts with specific molecular or cellular targets.",
  },
  {
    title: "06 — Health Benefit",
    body: "The biological interaction contributes to the intended physiological or functional outcome.",
  },
];

// overlap is a fraction of the viewport height — wraps this section up
// over BioactivesIntro above it as the user scrolls, same scroll-tracked-
// margin technique used elsewhere on this page. Captured from a separate
// natural-top ref so it doesn't interfere with the checkpoint progress
// tracking below (which reads this same element's live rect.top for a
// different purpose — its own pinned-scene stepping).
const MAX_OVERLAP_RATIO = 0.35;

export default function ScienceExperience() {
  const wrapperRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const naturalTopRef = useRef<number | null>(null);
  const [overlapPx, setOverlapPx] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = wrapperRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? -rect.top / total : 0;
        setProgress(Math.min(1, Math.max(0, p)));

        if (naturalTopRef.current === null) {
          naturalTopRef.current = rect.top + window.scrollY;
        }
        const naturalViewportTop = naturalTopRef.current - window.scrollY;
        const wrapProgress = Math.min(
          1,
          Math.max(0, (window.innerHeight - naturalViewportTop) / (window.innerHeight * 0.4))
        );
        setOverlapPx(window.innerHeight * MAX_OVERLAP_RATIO * wrapProgress);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      className="science-scroll"
      ref={wrapperRef}
      style={{ height: `${CHECKPOINTS.length * 100}vh`, marginTop: `${-overlapPx}px` }}
    >
      <div className="science-sticky">
        <div className="science-canvas-wrap">
          <ScienceScene progress={progress} />
        </div>

        <div className="science-overlay container">
          {CHECKPOINTS.map((cp, i) => {
            const activeIndex = Math.min(CHECKPOINTS.length - 1, Math.floor(progress * CHECKPOINTS.length));
            const isActive = i === activeIndex;
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <div
                key={cp.title}
                className={`science-checkpoint science-checkpoint--${side}${isActive ? " is-active" : ""}`}
              >
                <span className="science-checkpoint-eyebrow">The Bioactive Journey</span>
                <h3>{cp.title}</h3>
                <p>{cp.body}</p>
              </div>
            );
          })}
        </div>

        <div className="science-progress">
          {CHECKPOINTS.map((cp, i) => {
            const seg = 1 / CHECKPOINTS.length;
            const active = progress >= seg * i && progress < seg * (i + 1);
            return (
              <span
                key={cp.title}
                className={`science-progress-dot${active ? " active" : ""}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
