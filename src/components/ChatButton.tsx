"use client";

import Link from "next/link";

// persistent bottom-right entry point into the Contact page, present on
// every page (mounted once in the root layout, same as CookieConsent) —
// both bottom corners were free (top-left/top-right are already the
// watermark logo and hamburger), so this doesn't collide with anything
// else pinned to the screen.
export default function ChatButton() {
  return (
    <Link href="/contact" className="chat-button" aria-label="Get in touch">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="chat-button-label">How can we assist you?</span>
    </Link>
  );
}
