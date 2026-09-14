"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal, .reveal-left, .reveal-right, .reveal-up";

export default function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    // any element already on the page when this mounts (the normal case)
    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => io.observe(el));

    // a plain one-time querySelectorAll misses anything added to the DOM
    // afterwards — a component re-rendering (e.g. dev-server hot reload
    // swapping a component that adds a new .reveal element) would leave
    // that element permanently stuck at opacity:0, since nothing would
    // ever call io.observe() on it. Watching for future additions closes
    // that gap for good, not just for this specific edit.
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL_SELECTOR)) io.observe(node);
          node.querySelectorAll?.(REVEAL_SELECTOR).forEach((el) => io.observe(el));
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
