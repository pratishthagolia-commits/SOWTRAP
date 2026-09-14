"use client";

import { useEffect, useRef, useState } from "react";

const PARAGRAPH =
  "From essential vitamins and minerals to complex adaptogenic blends, our micro-encapsulated ingredients are engineered for enhanced performance across diverse applications. Our encapsulation-driven platform is designed to address the unique challenges of each category while maintaining a unified approach to stability, bioavailability, and performance. By combining scientific precision with advanced delivery technologies, we ensure that every product delivers maximum efficacy, consistency, and consumer acceptability.";

const WORDS = PARAGRAPH.split(" ");
const GREY = "rgb(201, 201, 201)";
const BLACK = "#000000";

// same mechanic as AboutUsV2 / ResearchGapV2: a fixed-shape notch+panel
// unit, moved as one rigid piece by a single translateY, over a static
// background photo that never moves on its own. Comparison's section ends
// right before this one begins, so the photo being instantly, fully
// visible the moment this section's sticky pin engages already reads as
// the photo "wrapping over" what came before — no extra animation on the
// photo itself needed (that was tried and just left the pinned box blank
// for a stretch while it caught up). The word-by-word grey-to-black
// reveal is tied to the same progress value.
export default function PortfolioHeader() {
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

  // panel slides up fast (front-loaded easing) so it's in place early,
  // then the words reveal through the remaining scroll
  const eased = 1 - Math.pow(1 - progress, 3);
  const slideOffset = (1 - eased) * 100; // 100% (hidden) -> 0% (in place)

  const wordProgress = Math.min(1, Math.max(0, (progress - 0.3) / 0.7));
  const activeCount = Math.round(wordProgress * WORDS.length);

  return (
    <div className="portfolio-header-wrapper" ref={wrapperRef}>
      <div className="portfolio-header-sticky">
        <div className="portfolio-header-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/portfolio-header-bg.jpeg" alt="Gloved hand holding a jar of encapsulated beads" />
        </div>

        <div className="portfolio-header-slide" style={{ transform: `translateY(${slideOffset}%)` }}>
          <p className="portfolio-heading">
            INGREDIENT
            <br />
            PORTFOLIO
          </p>
          <div className="portfolio-header-panel">
            <p className="portfolio-header-para">
              {WORDS.map((word, i) => (
                <span key={i} style={{ color: i < activeCount ? BLACK : GREY }}>
                  {word}
                  {i < WORDS.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
            <a href="#portfolio-carousel" className="btn btn-lime portfolio-header-cta">
              Explore Our Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
