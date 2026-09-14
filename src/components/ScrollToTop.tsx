"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// useEffect fires after the browser has already painted the new page at
// the old scroll position, so the reset shows up as a visible jump.
// useLayoutEffect runs synchronously before paint, so the reset happens
// before the user ever sees the wrong position. Guarded for SSR, since
// useLayoutEffect is a no-op (with a console warning) on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Next's own scroll-to-top-on-navigation isn't reliable in this app —
// pages like /products are very tall (a long filtered grid), and
// clicking through to a much shorter page (a product detail page) from
// deep down the list leaves the browser's old scrollY in place, which
// then just clamps to the bottom of the new, shorter page — landing on
// the footer instead of the top. Forcing an explicit scroll reset on
// every route change fixes it for this and any future page pair.
export default function ScrollToTop() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    // an explicit "instant" behavior is required here — the global
    // `html { scroll-behavior: smooth }` (for in-page anchor links)
    // would otherwise animate this reset into a visible scroll-up flash
    // on every route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
