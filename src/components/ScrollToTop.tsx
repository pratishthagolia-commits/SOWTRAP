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
    // a URL hash (e.g. the chat button's popup linking to
    // /contact#contact-form or #direct-form) means the visitor wants a
    // specific section, not the top of the page — this used to force a
    // top-0 reset unconditionally, racing the browser's own native
    // hash-scroll (this is a layout effect, so it runs first) and
    // leaving the page wherever that race happened to land, which is
    // exactly why the two chat-panel links were landing at inconsistent
    // wrong spots instead of the target section.
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      let attempts = 0;
      let frameId = 0;
      // the target element may not exist in the DOM yet the instant
      // this fires on a fresh route change (client component mounting),
      // so retry across a few frames instead of giving up on one lookup
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          // matches .contact-form-section's own scroll-margin-top —
          // clearance for the fixed nav bar sitting on top of the page
          const navOffset = 100;
          const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "instant" });
          return;
        }
        attempts += 1;
        if (attempts < 60) frameId = requestAnimationFrame(tryScroll);
      };
      tryScroll();
      return () => cancelAnimationFrame(frameId);
    }

    // an explicit "instant" behavior is required here — the global
    // `html { scroll-behavior: smooth }` (for in-page anchor links)
    // would otherwise animate this reset into a visible scroll-up flash
    // on every route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
