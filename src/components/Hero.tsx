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
      // weight must match .hero-wordmark's actual font-weight (800) —
      // measuring at a different weight than what's rendered throws the
      // fit off, since bolder/lighter glyphs measure different widths
      ctx.font = `800 ${probeSize}px ${family}`;
      const textWidth = ctx.measureText(el.textContent || "SowTrap").width;
      // 0.94x container width — fills edge to edge with just a small
      // margin, was 0.78 which left a lot of unused space on both sides
      el.style.fontSize = `${probeSize * ((containerWidth * 0.94) / textWidth)}px`;
    }

    document.fonts.ready.then(fitWordmark);
    window.addEventListener("resize", fitWordmark);
    return () => window.removeEventListener("resize", fitWordmark);
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      {/* both are canvas loops running every frame; .hero already paints
          its own navy gradient underneath them, so a phone just gets that */}
      {!isMobile && <GradientBlobs targetRef={heroRef} />}
      {!isMobile && <MatrixRain />}

      <div className="hero-fold">
        <h1 className="hero-wordmark" ref={wordRef}>SowTrap</h1>
      </div>

      <div className="hero-about reveal" id="about">
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
