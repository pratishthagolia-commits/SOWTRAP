"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/lib/useIsMobile";

type BioactiveClass = { num: string; title: string; desc: string; image: string };

const CLASSES: BioactiveClass[] = [
  {
    num: "01",
    title: "Vitamins",
    desc: "Essential micronutrients that support metabolic, cellular, and physiological functions.",
    image: "/images/bioactive-vitamins.jpeg",
  },
  {
    num: "02",
    title: "Minerals",
    desc: "Essential elements involved in enzymatic activity, structural functions, electrolyte balance, and numerous biological processes.",
    image: "/images/bioactive-minerals.jpeg",
  },
  {
    num: "03",
    title: "Polyphenols & Phytochemicals",
    desc: "Plant-derived compounds with diverse biological activities, including antioxidant, cellular signalling, and metabolic effects.",
    image: "/images/bioactive-polyphenols.jpeg",
  },
  {
    num: "04",
    title: "Probiotics",
    desc: "Live microorganisms that, when consumed in adequate amounts, can provide beneficial effects on the host.",
    image: "/images/bioactive-probiotics.jpeg",
  },
  {
    num: "05",
    title: "Amino Acids",
    desc: "Building blocks of proteins that also participate in neurotransmission, metabolism, signalling, and other physiological processes.",
    image: "/images/bioactive-amino-acids.jpeg",
  },
  {
    num: "06",
    title: "Adaptogens",
    desc: "Botanical or natural compounds studied for their role in supporting the body's response to physiological and environmental stress.",
    image: "/images/bioactive-adaptogens.jpeg",
  },
  {
    num: "07",
    title: "Essential and Natural Oils",
    desc: "Concentrated volatile plant compounds with characteristic aromas and diverse functional properties.",
    image: "/images/bioactive-essential-oils.jpeg",
  },
  {
    num: "08",
    title: "Functional Lipids",
    desc: "Specialised lipids that provide nutritional and physiological functions beyond their role as an energy source.",
    image: "/images/bioactive-functional-lipids.jpeg",
  },
  {
    num: "09",
    title: "Antioxidants",
    desc: "Compounds that help protect cells and biomolecules from oxidative stress by neutralising or modulating reactive species.",
    image: "/images/bioactive-antioxidants.jpeg",
  },
  {
    num: "10",
    title: "Enzymes",
    desc: "Biological catalysts that support specific biochemical reactions and can contribute to digestive, metabolic, and other physiological functions.",
    image: "/images/bioactive-enzymes.jpeg",
  },
  {
    num: "11",
    title: "Other Speciality Functional Bioactives",
    desc: "A broad range of specialised compounds, such as cognitive-support ingredients, functional compounds, and emerging bioactives, developed for targeted nutritional and wellness applications.",
    image: "/images/bioactive-other-speciality.jpeg",
  },
];

// overlap is a fraction of the viewport height (the hero photo is now a
// full 100vh, so this is measured relative to it directly instead of a
// fixed pixel amount) — 0.55 means the wrap climbs past half the photo.
const MAX_OVERLAP_RATIO = 0.55;

// exclusive accordion — clicking a point closes whichever one was
// previously open. The expand/collapse itself uses a CSS
// grid-template-rows 0fr->1fr transition rather than a max-height guess,
// so it animates to the exact content height (the "curtain/blind" reveal)
// regardless of how long any given description is.
export default function BioactivesIntro() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<number | null>(null);
  // which class's photo is fronted in the gallery — set (not toggled) on
  // every click, so the picture stays put even after its curtain closes,
  // instead of disappearing along with the description.
  const [activeImage, setActiveImage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [overlapPx, setOverlapPx] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  // tilt the active photo toward wherever the cursor sits, like it's
  // turning to face it
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
    setActiveImage(i);
  }

  // tracked against the whole window (normalized by half the viewport
  // size, clamped to ±1) rather than just the gallery's own small
  // bounding box — the gallery-box version snapped straight back to flat
  // the instant the cursor crossed its edge, which read as a jump rather
  // than a smooth motion. The raw target is only ever read by a damped
  // rAF loop below (not applied directly to state on every mousemove
  // event) — setting state straight from the event retargeted the CSS
  // transition dozens of times a second, which is what caused the
  // stagger/rocking right around the center where the sign of x/y flips
  // on the smallest hand tremor.
  useEffect(() => {
    // no cursor to follow on a phone, and the photo stack this drives
    // isn't rendered there — skip the permanent rAF loop entirely
    if (isMobile) return;
    function handlePointerMove(e: globalThis.MouseEvent) {
      const el = galleryRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / (window.innerWidth / 2);
      const relY = (e.clientY - centerY) / (window.innerHeight / 2);
      targetTiltRef.current = {
        x: Math.max(-1, Math.min(1, relX)),
        y: Math.max(-1, Math.min(1, relY)),
      };
    }
    window.addEventListener("mousemove", handlePointerMove);

    let frameId = 0;
    function tick() {
      const current = currentTiltRef.current;
      const target = targetTiltRef.current;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      setTilt({ x: current.x, y: current.y });
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      cancelAnimationFrame(frameId);
    };
  }, [isMobile]);

  // scroll-tracked wrap: capture this section's natural (unshifted) top
  // once on the first frame (before any margin is ever applied, to avoid
  // a feedback loop with its own animated position), then grow the
  // negative margin purely off window.scrollY as it approaches the
  // science hero photo above it — same technique as ComparisonSection's
  // wrap over the pillars chamber.
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
    <section
      className="bioactives-intro"
      ref={sectionRef}
      style={{ marginTop: `${-overlapPx}px` }}
    >
      <h2 className="bioactives-title">SCIENCE</h2>

      <div className="bioactives-what">
        <h3 className="bioactives-what-heading reveal-left">
          What are
          <br />
          bioactive ingredients?
        </h3>
        <div className="bioactives-what-panel">
          <div className="bioactives-what-tab">
            <p className="reveal-right">
              More Than Ingredients.
              <br />
              Molecules That Influence Biological Function.
            </p>
          </div>
          <p className="bioactives-what-body reveal-right" style={{ transitionDelay: "0.15s" }}>
            Bioactive ingredients are naturally derived or scientifically developed compounds that can
            influence specific biological processes and support physiological functions. Their
            effectiveness depends not only on the amount consumed, but also on their stability,
            absorption, metabolism, and availability at the site of action.
          </p>
        </div>
      </div>

      <div className="bioactives-classes">
        <h3 className="bioactives-classes-banner">
          <span className="reveal-left">Key classes of</span>{" "}
          <span className="bioactives-classes-banner-accent reveal-left" style={{ transitionDelay: "0.15s" }}>bioactives</span>
        </h3>

        <div className="bioactives-classes-body">
          <div className="bioactives-list">
            {CLASSES.map((item, i) => {
              const isOpen = open === i;
              return (
                <div className={`bioactives-item${isOpen ? " is-open" : ""}`} key={item.title}>
                  <button type="button" className="bioactives-item-head" onClick={() => toggle(i)}>
                    <span className="bioactives-item-title">{item.title}</span>
                  </button>
                  <div className="bioactives-item-desc-wrap">
                    <div className="bioactives-item-desc-inner">
                      <p className="bioactives-item-desc">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* floating photo stack — the active class's photo comes to the
              front sharp and tagged with its name, its neighbours peek out
              blurred behind it, same motif as kommakomma.is's project
              gallery (referenced by the user). Phone drops it entirely:
              the list beside it already carries the same content as
              tap-to-expand rows. */}
          {!isMobile && (
          <div className="bioactives-gallery" ref={galleryRef}>
            {CLASSES.map((item, i) => {
              const prevIndex = (activeImage - 1 + CLASSES.length) % CLASSES.length;
              const nextIndex = (activeImage + 1) % CLASSES.length;
              let state: "active" | "prev" | "next" | "hidden" = "hidden";
              if (i === activeImage) state = "active";
              else if (i === prevIndex) state = "prev";
              else if (i === nextIndex) state = "next";

              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.title}
                  src={item.image}
                  alt={item.title}
                  className={`bioactives-gallery-photo bioactives-gallery-photo--${state}`}
                  style={
                    state === "active"
                      ? { transform: `perspective(900px) rotateX(${tilt.y * -14}deg) rotateY(${tilt.x * 14}deg) scale(1.03)` }
                      : undefined
                  }
                />
              );
            })}
            <span className="bioactives-gallery-tag">{CLASSES[activeImage].title}</span>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
