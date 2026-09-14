"use client";

import { useEffect, useRef, useState } from "react";

// pixels pulled up for every pixel the section naturally enters from the
// trigger line — gentler than Achieve's own rate since even a small
// scroll was covering too much ground here.
const PULL_RATE = 0.6;
// "What We Help You Achieve" is itself taller than one viewport, so this
// section's own natural top doesn't reach the bottom of the screen until
// almost all of Achieve has already scrolled past. Starting the trigger
// line a full viewport-height earlier than that means the pull is
// already dragging this section into view while Achieve is still
// substantially visible, instead of only kicking in right at its tail end.
const EARLY_START_VH = 0.25;
// how much of the remaining distance to the target overlap is closed
// each frame — without this, one big scroll (a large trackpad fling or
// fast wheel scroll, which most users actually do) jumps the target
// value in one huge step and the section snaps to it instantly instead
// of visibly sliding; easing toward the target instead of jumping
// straight to it keeps the motion smooth regardless of scroll speed.
const EASE = 0.045;

type Point = { title: string; desc: string };

const LEFT_POINTS: Point[] = [
  {
    title: "Discover",
    desc: "Understand the ingredient, product, challenge, and commercial objective.",
  },
  {
    title: "Develop",
    desc: "Characterize, formulate, select materials and technology, and optimize.",
  },
  {
    title: "Validate",
    desc: "Establish analytical, functional, stability, and—where applicable—clinical evidence.",
  },
];

const RIGHT_POINTS: Point[] = [
  {
    title: "Scale",
    desc: "Translate the validated process to pilot and commercial scale.",
  },
  {
    title: "Commercialize",
    desc: "Support manufacturing, technical documentation, and market-ready ingredient development.",
  },
];

// "How We Create Value" — same layout as PartnershipWho: points on either
// side of a centered photo (3 left / 2 right, since this list has 5
// stages instead of 6).
export default function PartnershipValue() {
  const sectionRef = useRef<HTMLElement>(null);
  const currentOverlapRef = useRef(0);
  const [overlapPx, setOverlapPx] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        // derived live instead of captured once on mount — a one-time
        // snapshot goes stale as soon as PartnershipAchieve (right above
        // this one) applies its OWN growing negative margin, which
        // shrinks the document flow above this section over time; a
        // frozen reference doesn't see that shrinkage, so the trigger
        // silently drifts later and later the more Achieve pulls itself
        // up. Adding back this section's own currently-applied overlap
        // to its live rect undoes only its own contribution, leaving a
        // "natural" position that's correct no matter what anything
        // above it is doing.
        const liveTop = el.getBoundingClientRect().top;
        const naturalViewportTop = liveTop + currentOverlapRef.current;
        const triggerLine = window.innerHeight * (1 + EARLY_START_VH);
        const entered = Math.max(0, triggerLine - naturalViewportTop);
        const target = Math.min(window.innerHeight, entered * PULL_RATE);
        currentOverlapRef.current += (target - currentOverlapRef.current) * EASE;
        setOverlapPx(currentOverlapRef.current);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section
      className="partnership-who partnership-value"
      ref={sectionRef}
      style={{ marginTop: `${-overlapPx}px` }}
    >
      <h2 className="partnership-who-heading reveal-up">How We Create Value</h2>
      <p className="partnership-who-subheading reveal-up">Structured Path from Concept to Commercialization</p>

      <div className="partnership-who-body">
        <div className="partnership-who-points partnership-who-points--left reveal-left">
          {LEFT_POINTS.map((p) => (
            <div className="partnership-who-point" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="partnership-who-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/partnership-value.jpeg"
            alt="SowTrap's concept-to-commercialization development pathway"
            className="partnership-who-image"
          />
        </div>

        <div className="partnership-who-points partnership-who-points--right reveal-right">
          {RIGHT_POINTS.map((p) => (
            <div className="partnership-who-point" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
