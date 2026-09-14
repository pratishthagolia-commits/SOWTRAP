"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GradientBlobs from "./GradientBlobs";
import useIsMobile from "@/lib/useIsMobile";

// overlap is a fraction of the viewport height — wraps the footer up over
// whatever section precedes it (different on every page this is used on:
// IndustriesSection on the home page, ScienceIntro on /science,
// TechEvidence on /technology) as the user scrolls, same scroll-tracked-
// margin technique used throughout the site. Kept deliberately small —
// on the home page the preceding section (IndustriesSection) is made of
// position:sticky pinned cards, not blank trailing padding, so a larger
// overlap here visibly covers part of the last card's content instead of
// just wrapping into empty space.
const MAX_OVERLAP_RATIO = 0.08;

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4zm5.29-7.03a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

export default function FooterCTA() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const naturalTopRef = useRef<number | null>(null);
  const [overlapPx, setOverlapPx] = useState(0);

  // capture this section's natural (unshifted) top once on the first
  // frame — before any margin is ever applied — to avoid a feedback loop
  // with its own animated position, then grow the negative margin purely
  // off window.scrollY as it approaches the viewport top.
  useEffect(() => {
    let frameId = 0;
    function tick() {
      const el = sectionRef.current;
      if (el) {
        if (naturalTopRef.current === null) {
          naturalTopRef.current = el.getBoundingClientRect().top + window.scrollY;
        }
        const naturalViewportTop = naturalTopRef.current - window.scrollY;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - naturalViewportTop) / (window.innerHeight * 0.4)));
        setOverlapPx(window.innerHeight * MAX_OVERLAP_RATIO * progress);
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    function fitWordmark() {
      const el = wordRef.current;
      if (!el) return;
      // true edge-to-edge — measured against the viewport, not the footer's
      // own (padded) box, since the wordmark breaks out of that padding
      const containerWidth = window.innerWidth;
      const probeSize = 100;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const family = getComputedStyle(el).fontFamily;
      ctx.font = `800 ${probeSize}px ${family}`;
      const textWidth = ctx.measureText(el.textContent || "SowTrap").width;
      el.style.fontSize = `${probeSize * (containerWidth / textWidth)}px`;
    }

    document.fonts.ready.then(fitWordmark);
    window.addEventListener("resize", fitWordmark);
    return () => window.removeEventListener("resize", fitWordmark);
  }, []);

  return (
    <footer className="cta-footer" id="contact" ref={sectionRef} style={{ marginTop: `${-overlapPx}px` }}>
      {!isMobile && <GradientBlobs targetRef={sectionRef} />}

      <div className="footer-content container">
        <div className="footer-grid">
          <div className="footer-col footer-col-brand">
            <div className="logo-badge footer-logo">SowTrap</div>
            <p className="footer-tagline">
              A specialised encapsulation technology division of ScienceOnWheels Bio Pvt. Ltd.
            </p>
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <div className="footer-newsletter-row">
                <input type="text" placeholder="Name" aria-label="Name" />
                <input type="email" placeholder="Email" aria-label="Email" required />
              </div>
              <button type="submit" className="btn btn-lime footer-subscribe">
                Subscribe for the newsletter
              </button>
            </form>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><Link href="/products">Products</Link></li>
              <li><a href="#partnership">Partnership</a></li>
              <li><a href="#contact">Contact us</a></li>
              <li><a href="#join">Join us</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-links footer-contact-list">
              <li><a href="tel:+918374406722">+91 8374406722</a></li>
              <li><a href="mailto:sowtrap@scienceonwheels.in">sowtrap@scienceonwheels.in</a></li>
              <li>
                <strong>Innovation center:</strong> No. 507 &amp; 302, Kamat Grand, Santa Inez,
                Panaji, Goa 403001, INDIA
              </li>
              <li>
                <strong>Manufacturing Unit 1:</strong> Plot 216, Main road Phase &ndash; VI,
                Udyog Vihar, Sector&ndash;37, Gurgaon Haryana, India &ndash; 122001
              </li>
              <li>
                <strong>Business Address:</strong> 10th floor, 83Avenue, Sector 83, Gurugram,
                Haryana, Pincode &ndash; 122004
              </li>
            </ul>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <span>&copy; 2026 SowTrap&trade;. All rights reserved.</span>
          <div className="footer-legal-links">
            <a href="#">Cookie Policy</a>
            <a href="#">Cookie Settings</a>
            <a href="#">Terms and Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>

      <h2 className="cta-wordmark" ref={wordRef}>SowTrap</h2>
    </footer>
  );
}
