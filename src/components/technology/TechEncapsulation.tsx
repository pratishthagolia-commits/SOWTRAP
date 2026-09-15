"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/lib/useIsMobile";

type EncapTech = { num: string; title: string; desc: string; features: string[]; image: string };

const ENCAP_TECHS: EncapTech[] = [
  {
    num: "01",
    title: "Spray Drying (Micro/Nano Encapsulation)",
    desc: "A scalable and cost-effective encapsulation technology that converts sensitive bioactives into stable, free-flowing powders suitable for diverse food, nutraceutical, and pharmaceutical applications.",
    features: [
      "High encapsulation efficiency (typically 70–95%)",
      "Excellent scalability for commercial manufacturing",
      "Cost-effective continuous processing",
      "Improved stability against heat, moisture, and oxidation",
      "Suitable for vitamins, minerals, botanical extracts, probiotics, amino acids, flavors, and functional oils",
      "Compatible with powders, tablets, capsules, gummies, beverages, and functional foods",
    ],
    image: "/images/tech-encap-spray-drying.jpeg",
  },
  {
    num: "02",
    title: "Freeze Drying (Lyophilization)",
    desc: "A low-temperature dehydration process designed to preserve highly sensitive bioactive compounds while maintaining their structural and functional integrity.",
    features: [
      "Maximum retention of heat-sensitive and volatile compounds",
      "Preserves biological activity and nutritional quality",
      "Excellent product stability and shelf life",
      "Minimal thermal degradation",
      "Ideal for micro-organisms, enzymes, peptides, botanical extracts, and premium nutraceutical ingredients",
    ],
    image: "/images/tech-encap-freeze-drying.jpeg",
  },
  {
    num: "03",
    title: "Supercritical Fluid Assisted Encapsulation",
    desc: "An advanced green processing technology that utilizes supercritical carbon dioxide for the extraction and encapsulation of sensitive bioactive compounds without the use of harmful organic solvents.",
    features: [
      "Environment friendly, solvent-free processing",
      "Low-temperature operation suitable for thermolabile compounds",
      "High encapsulation efficiencies",
      "Precise control over particle size and morphology",
      "Zero solvent residue in the final product",
      "Improved stability of flavors, essential oils, botanical extracts, lipophilic nutrients, and pharmaceutical actives",
      "Faster processing with high product purity",
      "Applications across nutraceutical, food, pharmaceutical, and cosmetic industries",
    ],
    image: "/images/tech-encap-supercritical.jpeg",
  },
  {
    num: "04",
    title: "Liposomal Encapsulation",
    desc: "Phospholipid-based delivery systems designed to encapsulate bioactive compounds within lipid vesicles, improving protection and systemic delivery.",
    features: [
      "Improved cellular uptake and bioavailability",
      "Enhanced protection from gastrointestinal degradation",
      "Suitable for hydrophilic and lipophilic bioactives",
      "Supports controlled and targeted nutrient delivery",
      "Ideal for vitamins, antioxidants, botanical actives, peptides, and specialty nutraceuticals",
    ],
    image: "/images/tech-encap-liposomal.jpeg",
  },
];

// exact same pattern as BioactivesIntro's "key classes of bioactives" —
// banner heading, exclusive click-to-expand accordion (curtain/blind
// grid-rows reveal) on the left, and a floating photo stack on the right
// (active photo sharp + tagged, neighbours blurred/peeking, tilts toward
// the cursor) — reused here for the 4 encapsulation technologies.
export default function TechEncapsulation() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });
  // reveal state kept locally rather than via the global ScrollReveal
  // class-on-DOM-node approach — .tech-encap-item's className already
  // changes with React state (is-open toggling on click), and React
  // overwrites the whole className on every such change, discarding any
  // class ScrollReveal added from outside. Same fix as SupplementsFail.
  const [listRevealed, setListRevealed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
    setActiveImage(i);
  }

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setListRevealed(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // no cursor on a phone, and the photo stack this drives isn't
    // rendered there — skip the permanent rAF loop entirely
    if (isMobile) return;
    function handlePointerMove(e: globalThis.MouseEvent) {
      const el = galleryRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (e.clientX - centerX) / (window.innerWidth / 2);
      const relY = (e.clientY - centerY) / (window.innerHeight / 2);
      targetTiltRef.current = {
        x: Math.max(-1, Math.min(1, relX)),
        y: Math.max(-1, Math.min(1, relY)),
      };
    }
    window.addEventListener("mousemove", handlePointerMove);

    let frameId = 0;
    function tick() {
      const current = currentTiltRef.current;
      const target = targetTiltRef.current;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      setTilt({ x: current.x, y: current.y });
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      cancelAnimationFrame(frameId);
    };
  }, [isMobile]);

  return (
    <section className="tech-encap">
      <h3 className="tech-encap-banner">
        Key Encapsulation <span className="tech-encap-banner-accent">Technologies</span>
      </h3>

      <div className="tech-encap-body">
        <div className="tech-encap-list" ref={listRef}>
          {ENCAP_TECHS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                className={`tech-encap-item reveal-up${listRevealed ? " in-view" : ""}${isOpen ? " is-open" : ""}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
                key={item.title}
              >
                <button type="button" className="tech-encap-item-head" onClick={() => toggle(i)}>
                  <span className="tech-encap-item-title">{item.title}</span>
                </button>
                <div className="tech-encap-item-desc-wrap">
                  <div className="tech-encap-item-desc-inner">
                    <p className="tech-encap-item-desc">{item.desc}</p>
                    <p className="tech-encap-item-features-label">Key Features</p>
                    <ul className="tech-encap-item-features">
                      {item.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isMobile && (
        <div className="tech-encap-gallery" ref={galleryRef}>
          {ENCAP_TECHS.map((item, i) => {
            const prevIndex = (activeImage - 1 + ENCAP_TECHS.length) % ENCAP_TECHS.length;
            const nextIndex = (activeImage + 1) % ENCAP_TECHS.length;
            let state: "active" | "prev" | "next" | "hidden" = "hidden";
            if (i === activeImage) state = "active";
            else if (i === prevIndex) state = "prev";
            else if (i === nextIndex) state = "next";

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.title}
                src={item.image}
                alt={item.title}
                className={`tech-encap-gallery-photo tech-encap-gallery-photo--${state}`}
                style={
                  state === "active"
                    ? { transform: `perspective(900px) rotateX(${tilt.y * -14}deg) rotateY(${tilt.x * 14}deg) scale(1.03)` }
                    : undefined
                }
              />
            );
          })}
          <span className="tech-encap-gallery-tag">{ENCAP_TECHS[activeImage].title}</span>
        </div>
        )}
      </div>
    </section>
  );
}
