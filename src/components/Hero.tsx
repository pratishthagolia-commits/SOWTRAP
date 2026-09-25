"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import MatrixRain from "./MatrixRain";
import GradientBlobs from "./GradientBlobs";
import useIsMobile from "@/lib/useIsMobile";

export default function Hero() {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    function fitWordmark() {
      const el = wordRef.current;
      if (!el) return;
      const containerWidth = el.parentElement?.clientWidth ?? window.innerWidth;
      const probeSize = 100;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const family = getComputedStyle(el).fontFamily;
      const text = el.textContent || "SowTrap";
      // weight must match .hero-wordmark's actual font-weight (800) —
      // measuring at a different weight than what's rendered throws the
      // fit off, since bolder/lighter glyphs measure different widths
      ctx.font = `800 ${probeSize}px ${family}`;
      const textWidth = ctx.measureText(text).width;
      // 0.94x container width — fills edge to edge with just a small
      // margin, was 0.78 which left a lot of unused space on both sides
      const fittedSize = probeSize * ((containerWidth * 0.94) / textWidth);
      el.style.fontSize = `${fittedSize}px`;

      // .hero-about used to close the gap to this wordmark with a flat
      // -168px CSS margin, tuned by eye on one screen. That only holds
      // up when the wordmark happens to render at the same size it did
      // there — but its font-size is fit to viewport WIDTH (above)
      // while .hero-fold's own box is sized off viewport HEIGHT (95vh),
      // so on any other aspect ratio the two drift apart: too much
      // leftover gap on some screens, the "p"'s descender overlapping
      // "Elevating Nutrition..." on others (reported across several
      // different laptops/monitors). Measuring the wordmark's actual
      // rendered bottom edge here and pulling .hero-about up to sit a
      // fixed, small gap below it makes the spacing identical on every
      // screen by construction, instead of hoping a flat pixel guess
      // still lines up.
      const about = aboutRef.current;
      if (about) {
        about.style.marginTop = "0px";
        const wordmarkBottom = el.getBoundingClientRect().bottom;
        const aboutTop = about.getBoundingClientRect().top;
        const gap = 32;
        about.style.marginTop = `${wordmarkBottom + gap - aboutTop}px`;
      }

      // shift the "Elevating Nutrition..." block (heading + lead + CTA
      // row move together, as one unit) so the heading's own right edge
      // — the "e" that ends "...Delivery Science" — lands under the "a"
      // in "SowTrap" above. Measured with canvas the same way the
      // wordmark's own size is, instead of a guessed offset, since the
      // "a"'s position shifts with the wordmark's fitted size on every
      // screen. Desktop/tablet only — this was asked for specifically on
      // desktop ("checked on 4 different desktops"), and on phone the
      // heading wraps to two lines (white-space: normal there), so its
      // bounding box's "right" edge is whichever line happens to be
      // wider, not the end of "Science" — targeting that threw the whole
      // block visibly off-center instead of aligning anything.
      const heading = headingRef.current;
      const banner = bannerRef.current;
      const isPhoneWidth = window.matchMedia("(max-width: 640px)").matches;
      if (heading && banner) {
        if (isPhoneWidth) {
          banner.style.transform = "";
        } else {
          ctx.font = `800 ${fittedSize}px ${family}`;
          const aIndex = text.toLowerCase().indexOf("a");
          if (aIndex !== -1) {
            const upToAndIncludingA = text.slice(0, aIndex + 1);
            const aRightWidth = ctx.measureText(upToAndIncludingA).width;
            const wordmarkBox = el.getBoundingClientRect();
            // the wordmark's rendered glyph run is exactly containerWidth
            // * 0.94 wide (that's what fittedSize was solved for above),
            // centered within the full-width box via text-align: center
            const renderedTextWidth = containerWidth * 0.94;
            const textLeft = wordmarkBox.left + (wordmarkBox.width - renderedTextWidth) / 2;
            const aRightAbs = textLeft + aRightWidth;

            banner.style.transform = "translateX(0px)";
            const headingRight = heading.getBoundingClientRect().right;
            const shift = aRightAbs - headingRight;
            banner.style.transform = `translateX(${shift}px)`;
          }
        }
      }
    }

    document.fonts.ready.then(fitWordmark);
    window.addEventListener("resize", fitWordmark);
    return () => window.removeEventListener("resize", fitWordmark);
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* GradientBlobs is a mouse-interaction effect (no mouse on touch
          devices), so it stays off on phone — MatrixRain is back on
          phone per client request, it's the ambient background rather
          than an interaction */}
      {!isMobile && <GradientBlobs targetRef={heroRef} />}
      <MatrixRain />

      <div className="hero-fold">
        <h1 className="hero-wordmark" ref={wordRef}>SowTrap</h1>
      </div>

      <div className="hero-about reveal" id="about" ref={aboutRef}>
        <div className="container hero-banner-container center" ref={bannerRef}>
          <h2 ref={headingRef}>Elevating Nutrition Through Intelligent Delivery Science</h2>
          <p className="lead">
            Scientifically engineered micronutrients for better absorption and performance.
          </p>
          <div className="hero-banner-cta">
            <Link href="/technology" className="btn btn-lime">Explore Technology</Link>
            <Link href="/products" className="btn btn-outline-light">View Products</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
