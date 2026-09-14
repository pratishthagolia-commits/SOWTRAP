"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/lib/useIsMobile";

const QUOTE =
  "“Most nutrients don’t fail because they are ineffective— they fail because they never reach where they’re needed.”";
const PARAGRAPH =
  "Despite advances in nutrition science, micronutrient deficiencies continue to affect billions of people worldwide. Addressing this challenge requires scientifically developed, bioavailable nutrient solutions that complement a balanced diet and support long-term health, wellness, and disease prevention.";

const QUOTE_WORDS = QUOTE.split(" ");
const PARA_WORDS = PARAGRAPH.split(" ");
const TOTAL_WORDS = QUOTE_WORDS.length + PARA_WORDS.length;

// light grey -> black, interpolated by reveal progress
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

// same mechanic as AboutUsV2: a fixed-shape notch+panel unit, moved as one
// rigid piece by a single translateY driven by continuous scroll progress,
// over a static background photo that never moves on its own. The
// word-by-word grey-to-black reveal is tied to the same progress value
// (rather than the text's own live viewport position) since the panel is
// pinned in place for most of the scroll once it slides into view.
export default function ResearchGapV2() {
  const isMobile = useIsMobile();
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
  // then the words reveal through the remaining scroll — vertical only,
  // same as About Us/Portfolio Header (a horizontal entrance was tried
  // here and reverted — it read as coming in from a side corner instead
  // of from below)
  const eased = 1 - Math.pow(1 - progress, 3);
  const slideOffset = (1 - eased) * 100; // 100% (hidden) -> 0% (in place)

  // the quote+paragraph block fades in quickly, ahead of the word-by-word
  // grey-to-black reveal, instead of just appearing already in place
  const textOpacity = Math.min(1, progress / 0.25);

  const wordProgress = Math.min(1, Math.max(0, (progress - 0.3) / 0.7));
  const activeCount = Math.round(wordProgress * TOTAL_WORDS);

  return (
    <div className="research-v2-wrapper" ref={wrapperRef}>
      <div className="research-v2-sticky">
        <div className="research-v2-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/research-gap-v2-bg.jpeg" alt="Macro close-up of encapsulated beads" />
        </div>

        <div className="research-v2-slide" style={{ transform: `translateY(${slideOffset}%)` }}>
          <div className="research-v2-notch">
            <h2 className="research-v2-heading">
              RESEARCH
              <br />
              GAP
            </h2>
          </div>
          <div className="research-v2-panel">
            {/* phone drops the per-word colour reveal (a style recalc on
                every word on every scroll frame) and just shows the text;
                the panel's own slide/overlap motion is untouched */}
            <blockquote className="research-v2-quote" style={isMobile ? undefined : { opacity: textOpacity }}>
              {isMobile ? (
                QUOTE_WORDS.join(" ")
              ) : (
                <RevealWords words={QUOTE_WORDS} startIndex={0} activeCount={activeCount} />
              )}
            </blockquote>
            <p className="research-v2-para" style={isMobile ? undefined : { opacity: textOpacity }}>
              {isMobile ? (
                PARA_WORDS.join(" ")
              ) : (
                <RevealWords words={PARA_WORDS} startIndex={QUOTE_WORDS.length} activeCount={activeCount} />
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
