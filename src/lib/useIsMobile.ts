"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(max-width: 640px)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// the server (and the client's very first pre-hydration paint) always
// reports desktop — matches the SSR-safety concern already handled in
// ScrollToTop.tsx. React re-checks getSnapshot right after hydration on
// its own, so this flips to the real value without any effect needed.
function getServerSnapshot() {
  return false;
}

export default function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
