"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/lib/useIsMobile";

// pixels pulled up for every pixel the section naturally enters from the
// trigger line — reaches full cover (fully overlapping "Who We Partner
// With") after just a third of the trigger distance.
const PULL_RATE = 1;
// "Who We Partner With" is itself taller than one viewport, so this
// section's own natural top doesn't reach the bottom of the screen until
// almost all of Who has already scrolled past. Starting the trigger line
// a full viewport-height earlier than that means the pull is already
// dragging this section into view while Who is still substantially
// visible, instead of only kicking in right at Who's tail end.
const EARLY_START_VH = 0.08;
// how much of the remaining distance to the target overlap is closed
// each frame — without this, one big scroll (a large trackpad fling or
// fast wheel scroll, which most users actually do) jumps the target
// value in one huge step and the section snaps to it instantly instead
// of visibly sliding; easing toward the target instead of jumping
// straight to it keeps the motion smooth regardless of scroll speed.
const EASE = 0.12;

type Point = { title: string; desc: string };

const LEFT_POINTS: Point[] = [
  {
    title: "Improve Stability",
    desc: "Protect sensitive bioactives from heat, oxygen, moisture, light, and processing.",
  },
  {
    title: "Improve Solubility & Dispersibility",
    desc: "Enable better incorporation into challenging product matrices.",
  },
  {
    title: "Control Delivery",
    desc: "Engineer release behaviour according to the intended application.",
  },
];

const RIGHT_POINTS: Point[] = [
  {
    title: "Improve Application Performance",
    desc: "Address processing, sensory, storage, and formulation challenges.",
  },
  {
    title: "Create Differentiated Ingredients",
    desc: "Transform conventional ingredients into higher-value delivery systems.",
  },
  {
    title: "Scale Innovation",
    desc: "Move from laboratory development to pilot and commercial production.",
  },
];

// "What We Help You Achieve" — same layout as PartnershipWho: three
// points on either side of a centered photo.
export default function PartnershipAchieve() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const currentOverlapRef = useRef(0);
  const [overlapPx, setOverlapPx] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        // derived live instead of captured once on mount — a one-time
        // snapshot goes stale the moment a PRECEDING section (like
        // PartnershipWho, if it ever gained its own wrap) changes the
        // document flow above this one; adding back this section's own
        // currently-applied overlap to its live rect undoes only its own
        // contribution, so the "natural" position stays correct however
        // much space anything above it opens or closes over time.
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
      className="partnership-who partnership-achieve"
      ref={sectionRef}
      style={{ marginTop: `${-overlapPx}px` }}
    >
      <h2 className="partnership-who-heading reveal-up">What We Help You Achieve</h2>
      <p className="partnership-who-subheading reveal-up">From Challenge to Opportunity</p>

      <div className="partnership-who-body">
        <div className="partnership-who-points partnership-who-points--left reveal-left">
          {LEFT_POINTS.map((p) => (
            <div className="partnership-who-point" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        {!isMobile && (
          <div className="partnership-who-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/partnership-achieve.jpeg"
              alt="Encapsulated bioactive ingredient formats"
              className="partnership-who-image"
            />
          </div>
        )}

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
