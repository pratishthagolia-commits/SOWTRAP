"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sowtrap-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so this has to be an
    // effect (checked once after mount) rather than computed at render
    // time — same SSR-safety shape as ScrollToTop/useIsMobile elsewhere
    // in this app, not the "derive state from props" case the lint rule
    // is meant to catch
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) — just show it
      // every visit rather than blocking the page on this
      setVisible(true);
    }
  }, []);

  function choose(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // nothing to persist to — the banner will just reappear next visit
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Cookie consent">
      <p className="cookie-consent-text">
        We use cookies to improve your experience on our site and to show you relevant content. By
        clicking &ldquo;Accept&rdquo;, you agree to our use of cookies.
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="btn btn-outline-light cookie-consent-decline" onClick={() => choose("declined")}>
          Decline
        </button>
        <button type="button" className="btn btn-lime cookie-consent-accept" onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
