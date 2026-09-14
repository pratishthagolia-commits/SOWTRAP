"use client";

import { useEffect, useState } from "react";

// a single fixed-position instance instead of duplicating this into every
// section component — it stays on screen through normal scrolling, so it
// reads as "present on every slide" without needing to touch ~10 files.
// Hidden while Hero itself is in view (it already has the full-size
// wordmark), fades in once scrolled past it.
export default function Watermark() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function check() {
      const hero = document.querySelector(".hero");
      const heroHeight = hero ? hero.getBoundingClientRect().height : window.innerHeight * 2;
      setVisible(window.scrollY > heroHeight - window.innerHeight * 0.5);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <p className={`watermark${visible ? " is-visible" : ""}`} aria-hidden="true">
      SowTrap
    </p>
  );
}
