"use client";

import { useEffect, useState } from "react";

// Nav and Watermark both need to know "has the user scrolled past the
// hero slide" and must never disagree about it, or the real logo/full
// header and the watermark/hamburger stand-in visibly fight each other
// (both on screen, or neither). They used to each run their own pair of
// IntersectionObservers watching the same #home/#slide-two elements —
// correct in principle, but #slide-two on every page except the home
// page (Science/Technology/Products/Partnership/Contact) is the exact
// element a *different* component is dragging around every frame via a
// scroll-driven inline marginTop (the hero-overlap animation). Watching
// a target with IntersectionObserver while something else is
// simultaneously mutating that target's own geometry every frame is a
// known source of missed/late/out-of-order callbacks — the browser
// computes intersection lazily, not synchronously with each style
// mutation, so two separate observers on the same moving target can
// end up disagreeing about which side of the threshold it's currently
// on. The home page's own slide-two (AboutUsV2) never had this problem
// because its id="slide-two" wrapper is a tall, static scroll-jack
// container — position:sticky moves a *child* inside it, the wrapper
// itself never gets a mutated inline style — which is exactly why this
// bug was only ever visible on the other five pages.
//
// Fix: drop IntersectionObserver entirely and poll both elements'
// getBoundingClientRect() once per animation frame, the same
// rAF-driven technique every overlap component on this site already
// uses for its own scroll math. That keeps this hook on the same clock
// as the thing it's reacting to, so it can never read stale geometry.
export default function useScrolledPastHero() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const slideTwo = document.getElementById("slide-two");

    let frameId = 0;
    const hiddenRef = { current: false };

    function apply(next: boolean) {
      if (hiddenRef.current !== next) {
        hiddenRef.current = next;
        setScrolledPastHero(next);
      }
    }

    function tick() {
      const heroRect = hero!.getBoundingClientRect();
      const visibleHeight =
        Math.min(heroRect.bottom, window.innerHeight) - Math.max(heroRect.top, 0);
      const heroRatio = hero!.offsetHeight > 0 ? visibleHeight / hero!.offsetHeight : 0;

      // hero substantially back in view always wins — this is the only
      // way scrolledPastHero ever goes back to false, matching "only
      // scrolling back up to the hero itself" restores the full header
      if (heroRatio >= 0.4) {
        apply(false);
      } else if (slideTwo) {
        // the moment slide-two's own top edge starts entering the
        // viewport is the same moment the overlap animation begins
        // covering the hero — same trigger point as before, just read
        // directly instead of through an observer callback
        if (slideTwo.getBoundingClientRect().top < window.innerHeight) {
          apply(true);
        }
      } else if (heroRect.bottom < window.innerHeight * 0.5) {
        // no slide-two marker on this page (product/indication detail
        // pages) — fall back to the hero itself having scrolled at
        // least half a viewport past the top
        apply(true);
      }

      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return scrolledPastHero;
}
