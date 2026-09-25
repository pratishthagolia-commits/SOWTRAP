"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// persistent bottom-right entry point into Contact, mounted once in the
// root layout (same as CookieConsent) so it's present on every page.
// Clicking it opens a small panel with the two ways to reach the
// Contact page's actual forms — "Contact Us" (ContactProjectForm,
// id="contact-form") and "Speak to Us Directly" (ContactDirectForm,
// id="direct-form") — rather than just dropping the visitor at the top
// of the page to go hunting for the right form themselves.
export default function ChatButton() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const btnRef = useRef<HTMLButtonElement>(null);

  // the button sits over wildly different backgrounds depending on
  // scroll position (navy sections, white sections, photos) — a single
  // fixed colour would go invisible against a matching background, so
  // this samples whatever's actually behind the button on every frame
  // and flips it to whichever theme contrasts. Sampling a point just
  // outside the button's own left edge (not the button's own centre)
  // is deliberate: elementFromPoint at the button's own position would
  // just hit the button itself.
  useEffect(() => {
    let frameId = 0;
    function sample() {
      const btn = btnRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = Math.max(1, rect.left - 14);
        const y = rect.top + rect.height / 2;
        let el = document.elementFromPoint(x, y) as HTMLElement | null;
        let resolved: "light" | "dark" | null = null;
        while (el && el !== document.documentElement) {
          // photos and the canvas-based matrix-rain background (Hero)
          // don't carry a CSS background-color at all — only checking
          // backgroundColor walked straight past .hero's navy gradient
          // and kept climbing all the way to <body>'s white background,
          // misreading the hero as "light" and rendering an invisible
          // navy-on-navy button there. Every dark section on this site
          // is either a solid navy background-color, a navy gradient, or
          // a photo — all three are treated as dark here.
          const tag = el.tagName;
          if (tag === "IMG" || tag === "CANVAS" || tag === "VIDEO") {
            resolved = "dark";
            break;
          }
          const cs = getComputedStyle(el);
          if (cs.backgroundImage && cs.backgroundImage !== "none") {
            resolved = "dark";
            break;
          }
          const c = cs.backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
            const rgb = c.match(/[\d.]+/g);
            if (rgb) {
              const [r, g, b] = rgb.map(Number);
              const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
              resolved = luminance < 140 ? "dark" : "light";
            }
            break;
          }
          el = el.parentElement;
        }
        if (resolved) setTheme(resolved);
      }
      frameId = requestAnimationFrame(sample);
    }
    frameId = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <>
      <div className="chat-button-wrap">
        <button
          type="button"
          ref={btnRef}
          className={`chat-button-circle chat-button-circle--${theme}`}
          aria-label="Get in touch"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
        <span className="chat-button-label">How can we assist you?</span>
      </div>

      <div className={`chat-panel-scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <div className={`chat-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Get in touch">
        <button type="button" className="chat-panel-close" aria-label="Close" onClick={() => setOpen(false)}>
          &times;
        </button>
        <p className="chat-panel-title">How can we help?</p>
        <div className="chat-panel-options">
          <Link href="/contact#contact-form" className="chat-panel-option" onClick={() => setOpen(false)}>
            <span className="chat-panel-option-title">Contact Us</span>
            <span className="chat-panel-option-desc">Tell us about your project</span>
          </Link>
          <Link href="/contact#direct-form" className="chat-panel-option" onClick={() => setOpen(false)}>
            <span className="chat-panel-option-title">Speak to Us Directly</span>
            <span className="chat-panel-option-desc">Prefer to speak directly? Get in touch with our team</span>
          </Link>
        </div>
      </div>
    </>
  );
}
