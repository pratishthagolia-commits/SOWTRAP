"use client";

import { useEffect, useRef, useState } from "react";

const PARAGRAPHS = [
  "SowTrap™ is the advanced microencapsulation technology platform of ScienceOnWheels Bio Pvt. Ltd., dedicated to developing scientifically engineered ingredient delivery systems that improve the stability, bioavailability, functionality, and performance of bioactive compounds. Leveraging cutting-edge encapsulation technologies, material science, and formulation expertise, SowTrap™ transforms sensitive nutraceutical, botanical, probiotic, pharmaceutical, and functional food ingredients into high-performance solutions tailored for modern product applications. We engineer advanced delivery systems that convert unstable, poorly bioavailable bioactives into highly stable, bioavailable, and commercially scalable ingredients.",
  "From concept development and formulation optimization to pilot-scale validation and commercial manufacturing, SowTrap™ delivers innovative ingredient systems that enable superior product efficacy, improved shelf life, enhanced processing stability, and consistent consumer experience.",
  "At SowTrap™, every solution is developed through a science-first approach, combining rigorous research, application-focused formulation, and scalable manufacturing to help partners accelerate innovation and bring differentiated, high-quality products to market.",
];

const PARAGRAPH_WORDS = PARAGRAPHS.map((p) => p.split(" "));
const PARAGRAPH_START_INDICES = PARAGRAPH_WORDS.reduce<number[]>((indices, words, i) => {
  indices.push(i === 0 ? 0 : indices[i - 1] + PARAGRAPH_WORDS[i - 1].length);
  return indices;
}, []);
const TOTAL_WORDS = PARAGRAPH_WORDS.reduce((sum, words) => sum + words.length, 0);

// light grey -> black, interpolated by reveal progress — same effect as
// the Research Gap section
const GREY = { r: 0xc9, g: 0xc9, b: 0xc9 };
const BLACK = { r: 0, g: 0, b: 0 };
function mixColor(t: number) {
  const r = Math.round(GREY.r + (BLACK.r - GREY.r) * t);
  const g = Math.round(GREY.g + (BLACK.g - GREY.g) * t);
  const b = Math.round(GREY.b + (BLACK.b - GREY.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function RevealWords({
  words,
  startIndex,
  activeCount,
}: {
  words: string[];
  startIndex: number;
  activeCount: number;
}) {
  return (
    <>
      {words.map((word, i) => {
        const globalIndex = startIndex + i;
        const color = mixColor(activeCount > globalIndex ? 1 : 0);
        return (
          <span key={i} style={{ color }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
}

// folder-style expanding panel over a static background photo: the image
// never moves or resizes — only the white panel's own box grows, driven by
// continuous scroll progress (rAF + getBoundingClientRect, same pattern
// used elsewhere on the site) so the growth reads as one smooth motion
// instead of stepped jumps.
export default function AboutUsV2() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = wrapperRef.current;
      if (el) {
        const travel = el.offsetHeight - window.innerHeight;
        const rect = el.getBoundingClientRect();
        const raw = travel > 0 ? -rect.top / travel : 0;
        setProgress(Math.min(1, Math.max(0, raw)));
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // the first slice of the scroll range is a pure hold — the full
  // background photo sits still with no panel growth at all, so the user
  // sees the whole image before anything starts sliding up. Progress is
  // remapped so growth only begins after that hold ends.
  const holdFraction = 0.18;
  const growthProgress = Math.max(0, (progress - holdFraction) / (1 - holdFraction));

  // ease-out quadratic — gentler front-load than cubic, so visible motion
  // keeps happening later into the scroll instead of finishing early and
  // leaving a "stuck" dead zone before the section releases
  const eased = 1 - Math.pow(1 - growthProgress, 2);

  // the notch (heading tab) and the panel (paragraphs) are built as one
  // fixed-shape unit in normal document flow — notch on top, panel below
  // it, exactly like a real folder icon — and never resize themselves.
  // The whole unit is moved by a single translateY: 100% (its own full
  // height, fully hidden below the viewport) down to 0% (final resting
  // spot). One shape, one value — nothing can move independently.
  const slideOffset = (1 - eased) * 100; // 100% (hidden) -> 0% (in place)

  // words go grey -> black through the back half of the scroll, once the
  // panel is mostly in place (same effect and same progress-tied approach
  // as Research Gap)
  const wordProgress = Math.min(1, Math.max(0, (progress - 0.55) / 0.45));
  const activeCount = Math.round(wordProgress * TOTAL_WORDS);

  return (
    <div className="about-v2-wrapper" ref={wrapperRef}>
      <div className="about-v2-sticky">
        <div className="about-v2-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about-v2-bg.jpeg" alt="Microscope objective lenses" />
        </div>

        <div className="about-v2-slide" style={{ transform: `translateY(${slideOffset}%)` }}>
          <div className="about-v2-notch">
            <h2 className="about-v2-heading">ABOUT US</h2>
          </div>
          <div className="about-v2-panel">
            <div className="about-v2-body">
              {PARAGRAPH_WORDS.map((words, i) => (
                <p key={PARAGRAPHS[i].slice(0, 24)}>
                  <RevealWords
                    words={words}
                    startIndex={PARAGRAPH_START_INDICES[i]}
                    activeCount={activeCount}
                  />
                </p>
              ))}
            </div>
          </div>

          {/* attached to the very bottom of the same fixed shape — moves
              with the About Us panel as one piece, not a separate section
              with its own scroll-jack */}
          <div className="expertise-notch">
            <h2 className="expertise-heading">
              OUR CORE
              <br />
              EXPERTISE
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
