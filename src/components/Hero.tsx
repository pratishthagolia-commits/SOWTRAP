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

      // previously shifted this block right so the heading's own edge
      // landed under the "a" in "SowTrap" above — asked for, then asked
      // back out ("it's more towards the right, I don't like that"), so
      // this now just stays on the plain centered layout .center/
      // .hero-about's own flex centering already gives it.
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
        <div className="container hero-banner-container center">
          <h2>Elevating Nutrition Through Intelligent Delivery Science</h2>
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
