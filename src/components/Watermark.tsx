"use client";

import { useEffect, useState } from "react";

// a single fixed-position instance instead of duplicating this into every
// section component — it stays on screen through normal scrolling, so it
// reads as "present on every slide" without needing to touch ~10 files.
// Hidden while the hero itself is in view (it already has the real
// logo/wordmark), fades in once scrolled past it.
//
// Watches #home with the exact same IntersectionObserver Nav.tsx uses to
// decide when to swap its full logo-badge for the bare hamburger — every
// page's hero section carries id="home" (Hero.tsx included), so this also
// works unmodified on every other page, not just "/". Previously this used
// its own scroll-position heuristic (scrollY vs. heroHeight - 50vh), which
// fired a full half-viewport *before* Nav actually hid the real logo —
// the two logos overlapped on screen for a stretch, then the real one cut
// out abruptly instead of a clean crossfade. Sharing Nav's own trigger
// removes that mismatch entirely.
export default function Watermark() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // kept identical to Nav.tsx's own #home observer — see its comment
    // for why it watches #home directly (not the section after it) —
    // must stay in sync or the double-logo overlap this was written to
    // fix comes back.
    const hero = document.getElementById("home");
    if (!hero) return;

    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
      rootMargin: "0px 0px -50% 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <p className={`watermark${visible ? " is-visible" : ""}`} aria-hidden="true">
      SowTrap
    </p>
  );
}
