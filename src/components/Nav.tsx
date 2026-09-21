"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // every product detail page ("/products/<slug>") mounts a fresh Nav on
  // each navigation (each slug is its own route segment), so the full
  // transparent bar flashed back in at the top of every single product a
  // visitor clicked through, however briefly they'd scrolled on the last
  // one — hamburger-only always on this route, never the full bar.
  const alwaysHamburger = pathname.startsWith("/products/");
  const hideFullNav = scrolledPastHero || alwaysHamburger;

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;

    // rootMargin (not just threshold: 0) — every hero is a full 100vh, and
    // the section right after it wraps UP over it by as much as 55% of the
    // viewport height as the user scrolls (see e.g. ContactHero's own
    // MAX_OVERLAP_RATIO), so that section's own heading is already on
    // screen well before #home has fully left the viewport. threshold: 0
    // alone waits for 100% exit (a full 100vh of scrolling), leaving the
    // still-transparent full nav bar overlapping that heading for a long
    // stretch in between. Shrinking the observer's effective viewport by
    // 55% from the bottom makes it report "exited" around the same point
    // the overlap animation actually covers the hero, instead of lagging
    // a full viewport height behind what's visually on screen.
    const io = new IntersectionObserver(
      ([entry]) => setScrolledPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -55% 0px" }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

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
