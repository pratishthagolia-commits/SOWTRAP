"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useScrolledPastHero from "@/lib/useScrolledPastHero";

export default function Nav() {
  const pathname = usePathname();
  const scrolledPastHero = useScrolledPastHero();
  const [menuOpen, setMenuOpen] = useState(false);

  // every product detail page ("/products/<slug>") mounts a fresh Nav on
  // each navigation (each slug is its own route segment), so the full
  // transparent bar flashed back in at the top of every single product a
  // visitor clicked through, however briefly they'd scrolled on the last
  // one — hamburger-only always on this route, never the full bar.
  //
  // the legal pages (Cookie Policy, Terms & Conditions, Privacy Policy,
  // Whistleblowing) have no hero image at all — just plain white-page
  // text — so per "the full header only ever shows on an actual hero
  // slide" this forces hamburger-only there too, rather than the
  // transparent full bar (white nav-links) rendering unreadable over
  // this page's own white background.
  const LEGAL_PAGES = ["/cookie-policy", "/terms-and-conditions", "/privacy-policy", "/whistleblowing"];
  const alwaysHamburger = pathname.startsWith("/products/") || LEGAL_PAGES.includes(pathname);
  const hideFullNav = scrolledPastHero || alwaysHamburger;

  // back on the landing page — close the drawer so it isn't left open
  // if the user scrolls back up past the hero
  useEffect(() => {
    if (!scrolledPastHero) setMenuOpen(false);
  }, [scrolledPastHero]);

  const navLinks = (
    <>
      <li><Link href="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
      <li><Link href="/science" className={pathname === "/science" ? "active" : ""}>Science</Link></li>
      <li><Link href="/technology" className={pathname === "/technology" ? "active" : ""}>Technology</Link></li>
      <li><Link href="/products" className={pathname === "/products" ? "active" : ""}>Products</Link></li>
      <li><Link href="/partnership" className={pathname === "/partnership" ? "active" : ""}>Partnership</Link></li>
    </>
  );

  // past the landing page: full header is replaced by a hamburger that
  // opens a side drawer with the same nav content, instead of a header
  // that follows every slide. Both pieces stay mounted at all times now
  // (rather than one unmounting the other) so the swap can crossfade via
  // CSS opacity instead of popping instantly — synced to the same
  // duration as Watermark's own fade-in, so the real logo dissolving out
  // and the watermark dissolving in read as one continuous handoff.
  return (
    <>
      <nav className={`nav${hideFullNav ? " nav-is-hidden" : ""}`} aria-hidden={hideFullNav}>
        <div className="nav-inner">
          <Link href="/" className="logo-badge">SowTrap</Link>
          <ul className="nav-links">{navLinks}</ul>
          <Link href="/contact" className="nav-cta">Get in touch</Link>
        </div>
      </nav>

      <button
        type="button"
        className={`nav-hamburger${hideFullNav ? " is-visible" : ""}`}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-hidden={!hideFullNav}
        onClick={() => setMenuOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`nav-drawer-scrim${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div className={`nav-drawer${menuOpen ? " is-open" : ""}`}>
        <button
          type="button"
          className="nav-drawer-close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          &times;
        </button>
        <Link href="/" className="logo-badge">SowTrap</Link>
        <ul className="nav-drawer-links">{navLinks}</ul>
        <Link href="/contact" className="nav-cta">Get in touch</Link>
      </div>
    </>
  );
}
