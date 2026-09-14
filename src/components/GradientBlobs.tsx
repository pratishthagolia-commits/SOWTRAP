"use client";

import { useEffect, useRef, type RefObject } from "react";

// each patch mostly *follows the cursor* (high driftX/driftY) with a small
// ambient sine wobble layered on top — the patches themselves are sized well
// below the viewport (see .cta-blob) so their position is actually visible
// against the base gradient, instead of a shape so big it covers the whole
// screen regardless of where it's centered.
// ampX/ampY/driftX/driftY are all fractions (0-1) of the *container's*
// actual measured width/height — resolved to real pixels in tick(), not
// left to CSS's translate(%) which resolves against the element's own box.
const BANDS = [
  { baseY: 0.18, phase: 0.0, speed: 0.4, ampY: 0.04, ampX: 0.035, driftX: 0.65, driftY: 0.55 },
  { baseY: 0.42, phase: 1.8, speed: 0.32, ampY: 0.05, ampX: 0.04, driftX: 0.8, driftY: 0.68 },
  { baseY: 0.65, phase: 3.4, speed: 0.36, ampY: 0.045, ampX: 0.038, driftX: 0.72, driftY: 0.6 },
  { baseY: 0.86, phase: 5.1, speed: 0.28, ampY: 0.035, ampX: 0.03, driftX: 0.58, driftY: 0.5 },
];

export default function GradientBlobs({
  targetRef,
  variant = "dark",
}: {
  targetRef: RefObject<HTMLElement | null>;
  variant?: "dark" | "light";
}) {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const blob4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refs = [blob1Ref, blob2Ref, blob3Ref, blob4Ref];
    const target = { x: 0.5, y: 0.5 }; // fraction of container, 0-1
    const current = { x: 0.5, y: 0.5 };
    const size = { w: window.innerWidth, h: window.innerHeight };
    let frameId = 0;
    let t = 0;

    // scrolling gives the wave field a temporary "kick" (in px) that decays away,
    // on top of the pointer bias and the constant ambient undulation
    let lastScrollY = window.scrollY;
    let scrollKick = 0;

    function measure() {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      size.w = rect.width;
      size.h = rect.height;
    }

    function onPointerMove(e: PointerEvent) {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
    }
    function onPointerLeave() {
      target.x = 0.5;
      target.y = 0.5;
    }
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      scrollKick = Math.max(-140, Math.min(140, scrollKick + delta * 0.4));
    }

    const el = targetRef.current;
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    measure();

    function tick() {
      t += 0.012;
      current.x += (target.x - current.x) * 0.065;
      current.y += (target.y - current.y) * 0.065;
      scrollKick *= 0.93;

      const mouseOffsetXpx = (current.x - 0.5) * size.w;
      const mouseOffsetYpx = (current.y - 0.5) * size.h;

      BANDS.forEach((band, i) => {
        const bandEl = refs[i].current;
        if (!bandEl) return;
        const waveYpx = Math.sin(t * band.speed + band.phase) * band.ampY * size.h;
        const waveXpx = Math.cos(t * band.speed * 0.8 + band.phase) * band.ampX * size.w;
        const xpx = size.w / 2 + mouseOffsetXpx * band.driftX + waveXpx;
        const ypx =
          band.baseY * size.h + mouseOffsetYpx * band.driftY + waveYpx + scrollKick * band.driftY;
        bandEl.style.transform = `translate(-50%, -50%) translate(${xpx}px, ${ypx}px)`;
      });

      frameId = requestAnimationFrame(tick);
    }

    el?.addEventListener("pointermove", onPointerMove);
    el?.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    frameId = requestAnimationFrame(tick);

    return () => {
      el?.removeEventListener("pointermove", onPointerMove);
      el?.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [targetRef]);

  const variantClass = variant === "light" ? " light" : "";

  return (
    <>
      <div className={`cta-blob${variantClass} b1`} ref={blob1Ref} />
      <div className={`cta-blob${variantClass} b2`} ref={blob2Ref} />
      <div className={`cta-blob${variantClass} b3`} ref={blob3Ref} />
      <div className={`cta-blob${variantClass} b4`} ref={blob4Ref} />
    </>
  );
}
