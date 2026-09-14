"use client";

import { useEffect, useRef, useState } from "react";
import ChamberAccordion from "@/components/ChamberAccordion";
import useIsMobile from "@/lib/useIsMobile";

type ValidationPoint = { title: string; detail: string; cta?: string };

const VALIDATION_POINTS: ValidationPoint[] = [
  {
    title: "Analytical and Performance Studies",
    detail:
      "We begin by characterizing the encapsulated system to assess active protection, stability, release, and performance under relevant processing and biological conditions, establishing its suitability for the intended application.",
  },
  {
    title: "Clinical studies",
    detail:
      "Where applicable, analytical findings are translated into in-vitro and in-vivo studies to evaluate whether the delivery system improves biological performance, including bioavailability, functional outcomes, safety, and tolerability compared with conventional forms.",
  },
  {
    title: "Technical Evidence",
    detail:
      "Scientific findings are translated into structured technical documentation to support formulation, quality assessment, and product development. Our technical data and supporting reports provide transparent evidence of ingredient quality, performance, and application suitability.",
  },
  {
    title: "Patents",
    detail:
      "Innovation arising from our research and technology development is supported through intellectual property covering novel formulations, delivery systems, materials, processes, and application-specific solutions, where applicable. This protects technological innovation while establishing the scientific and technical foundation of our platform.",
    cta: "Explore Patents",
  },
  {
    title: "Scientific Collaborations & Publications",
    detail:
      "We collaborate with academic institutions, research organizations, clinical partners, and industry experts to independently investigate and strengthen the evidence behind our technologies. Collaborative research, peer-reviewed publications, scientific presentations, and application studies contribute to the broader scientific validation and credibility of our delivery systems.",
    cta: "Explore Collaborations",
  },
];

// exact same "chamber" pattern as SupplementsFail on the home page —
// folder-notch tab, white card on the left showing the active point's
// detail, two-column grid of clickable pointers on the right (hover to
// preview, click to pin) — plus a "From Encapsulation to Evidence"
// statement between the tab and the chamber, and CTA buttons on the two
// points that call for one (Patents, Scientific Collaborations &
// Publications).
// overlap is a fraction of the viewport height — wraps this section up
// over TechEncapsulation above it as the user scrolls, same
// scroll-tracked-margin technique used elsewhere on this page.
const MAX_OVERLAP_RATIO = 0.25;

export default function ScientificValidation() {
  const isMobile = useIsMobile();
  const [pinned, setPinned] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [overlapPx, setOverlapPx] = useState(0);
  const active = hovered ?? pinned;
  const current = VALIDATION_POINTS[active];

  // same local-IntersectionObserver reveal as SupplementsFail — the grid
  // buttons' className already changes with hover/pin state, so folding
  // "in-view" into React's own className string (instead of letting an
  // outside observer add it to the DOM directly) avoids it getting wiped
  // on every hover.
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
        // ramps over a much longer scroll distance than the usual 0.4x
        // viewport height — TechMaterials (the section this wraps over)
        // ends with a long accordion list, and the shorter ramp used
        // elsewhere started covering its last item before the user had
        // scrolled far enough to actually read it
        const progress = Math.min(1, Math.max(0, (window.innerHeight - naturalViewportTop) / (window.innerHeight * 1.4)));
        setOverlapPx(window.innerHeight * MAX_OVERLAP_RATIO * progress);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const revealClass = revealed ? " in-view" : "";

  return (
    <section className="sci-validation-chamber" ref={sectionRef} style={{ marginTop: `${-overlapPx}px` }}>
      <p className="sci-validation-tab">Scientific Validation</p>

      <div className="sci-validation-intro">
        <h2 className="sci-validation-heading reveal-left">From Encapsulation to Evidence</h2>
        <p className="sci-validation-intro-body reveal-right">
          Our encapsulation technologies are supported by rigorous scientific evaluation to ensure
          consistent performance, quality, and functionality across diverse applications.
        </p>
      </div>

      {isMobile ? (
        <div className="chamber-mobile-wrap">
          <ChamberAccordion
            points={VALIDATION_POINTS.map((v) => ({ title: v.title, detail: v.detail }))}
          />
        </div>
      ) : (
      <div className="sci-validation-body">
        <div className={`sci-validation-card reveal${revealClass}`} style={{ transitionDelay: "0.15s" }}>
          <h3>{current.title}</h3>
          {current.detail && <p>{current.detail}</p>}
          {current.cta && (
            <button type="button" className="btn btn-outline-dark sci-validation-cta">
              {current.cta}
            </button>
          )}
        </div>

        <div className="sci-validation-grid">
          {VALIDATION_POINTS.map((point, i) => (
            <button
              key={point.title}
              type="button"
              className={`sci-validation-item${i === active ? " is-active" : ""} reveal-up${revealClass}`}
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
      )}
    </section>
  );
}
