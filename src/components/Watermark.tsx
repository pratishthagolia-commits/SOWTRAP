"use client";

import useScrolledPastHero from "@/lib/useScrolledPastHero";

// a single fixed-position instance instead of duplicating this into every
// section component — it stays on screen through normal scrolling, so it
// reads as "present on every slide" without needing to touch ~10 files.
// Hidden while the hero itself is in view (it already has the real
// logo/wordmark), fades in once scrolled past it.
//
// Shares the exact same useScrolledPastHero hook Nav.tsx uses to decide
// when to swap its full logo-badge for the bare hamburger — every page's
// hero section carries id="home" (Hero.tsx included), so this also works
// unmodified on every other page, not just "/". Must stay on the same
// hook as Nav or the double-logo overlap this was written to fix comes
// back (see the hook's own comment for why it polls scroll position
// instead of using IntersectionObserver).
export default function Watermark() {
  const visible = useScrolledPastHero();

  return (
    <p className={`watermark${visible ? " is-visible" : ""}`} aria-hidden="true">
      SowTrap
    </p>
  );
}
