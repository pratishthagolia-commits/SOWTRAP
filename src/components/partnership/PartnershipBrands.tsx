"use client";

import { useEffect, useRef, useState } from "react";
import useIsMobile from "@/lib/useIsMobile";

type BrandStep = {
  num: string;
  title: string;
  tagline: string;
  body: string;
  supportLabel: string;
  support: string[];
  outcome: string;
  image: string;
};

const STEPS: BrandStep[] = [
  {
    num: "01",
    title: "Contract R&D",
    tagline: "Science-led development for challenging bioactives and delivery requirements.",
    body: "We provide collaborative R&D support to investigate, develop, and optimize encapsulated bioactive systems.",
    supportLabel: "What we support:",
    support: [
      "Bioactive characterization and pre-formulation assessment",
      "Encapsulation feasibility studies",
      "Material and technology screening",
      "Formulation development and optimization",
      "Encapsulation efficiency and loading optimization",
      "Stability and compatibility studies",
      "Release and dissolution profiling",
      "Application-specific performance evaluation",
    ],
    outcome: "A scientifically optimized formulation with defined development parameters and performance targets.",
    image: "/images/partnership-brands-contract-rd.jpeg",
  },
  {
    num: "02",
    title: "Custom Formulation",
    tagline: "Formulations engineered around your active and application.",
    body: "Every product has unique formulation challenges. At SowTrap™, we work closely with brands to develop customized encapsulated ingredient solutions tailored to specific product requirements.",
    supportLabel: "We optimize for:",
    support: [
      "Active stability",
      "Solubility and dispersibility",
      "Encapsulation efficiency",
      "Release behaviour",
      "Sensory performance",
      "Processing compatibility",
      "Storage stability",
      "Final product format",
    ],
    outcome: "A customized encapsulated ingredient designed for its intended application.",
    image: "/images/partnership-brands-custom-formulation.jpeg",
  },
  {
    num: "03",
    title: "Pilot Batches",
    tagline: "From laboratory formulation to reproducible pilot-scale production.",
    body: "Pilot-scale batches bridge the gap between laboratory development and commercial manufacturing.",
    supportLabel: "Our pilot development focuses on:",
    support: [
      "Process parameter translation",
      "Batch reproducibility",
      "Feed and formulation optimisation",
      "Process yield",
      "Particle and powder characteristics",
      "Encapsulation efficiency",
      "Active retention",
      "Product recovery",
      "Preliminary stability assessment",
    ],
    outcome: "A pilot-scale process and material suitable for further scale-up and application development.",
    image: "/images/partnership-brands-pilot-batches.jpeg",
  },
  {
    num: "04",
    title: "Technology Transfer",
    tagline: "Translating R&D knowledge into a reproducible manufacturing process.",
    body: "Technology transfer establishes the scientific and operational framework required to reproduce the developed product and process at the next manufacturing stage.",
    supportLabel: "Transfer package may include:",
    support: [
      "Product and formulation specifications",
      "Critical material attributes",
      "Critical process parameters",
      "Manufacturing process flow",
      "Process operating ranges",
      "Analytical methods",
      "In-process controls",
      "Quality specifications",
      "Batch documentation",
      "Scale-up considerations",
    ],
    outcome: "A structured technology package that supports consistent process implementation.",
    image: "/images/partnership-brands-technology-transfer.jpeg",
  },
  {
    num: "05",
    title: "Scale-up and Commercial Manufacturing",
    tagline: "From validated formulation to consistent commercial production.",
    body: "We translate optimised laboratory and pilot-scale formulations into robust, reproducible, and scalable manufacturing processes, while maintaining critical product and performance attributes.",
    supportLabel: "Our support includes:",
    support: [
      "Scale-up of formulation and process parameters",
      "Equipment and process optimisation",
      "Process yield and recovery optimisation",
      "Encapsulation efficiency and active retention",
      "Batch-to-batch consistency",
      "In-process quality monitoring",
      "Commercial-scale batch production",
      "Batch documentation and traceability",
      "Stability and quality monitoring",
    ],
    outcome:
      "A commercially scalable and reproducible encapsulated ingredient manufactured to defined quality and performance specifications.",
    image: "/images/partnership-brands-scale-up.jpeg",
  },
];

// "For BRANDS" — same content as before, but the 5-item list is now laid
// out exactly like TechEncapsulation's "Key encapsulation technologies":
// exclusive click-to-expand accordion on the left, floating tilt-toward-
// cursor photo gallery on the right (active photo sharp + tagged,
// neighbours blurred/peeking), instead of a hover-curtain on navy.
export default function PartnershipBrands() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const currentTiltRef = useRef({ x: 0, y: 0 });

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
    setActiveImage(i);
  }

  useEffect(() => {
    // no cursor to follow on a phone, and the photo stack this drives
    // isn't rendered there — skip the permanent rAF loop entirely
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
    <section className="partnership-brands" id="for-brands">
      <div className="partnership-brands-top reveal-up">
        <div className="partnership-brands-heading-col">
          <h2 className="partnership-brands-heading">For BRANDS</h2>
          <p className="partnership-brands-subheading">
            From Formulation Challenge to Commercial Ingredient
          </p>
        </div>
        <div className="partnership-brands-intro-col">
          <p className="partnership-brands-intro-body">
            SowTrap&trade;, partners with nutraceutical, food, beverage, pharmaceutical, and
            functional-ingredient brands to develop science-led, application-specific delivery
            solutions.
          </p>
          <p className="partnership-brands-intro-body">
            From feasibility and custom formulation to pilot batches, scale-up, and commercial
            manufacturing, we combine scientific expertise with formulation and process
            engineering to turn challenging ingredients into validated, application-ready
            solutions.
          </p>
        </div>
      </div>

      <div className="partnership-brands-body">
        <div className="partnership-brands-list">
          {STEPS.map((step, i) => {
            const isOpen = open === i;
            return (
              <div className={`partnership-brands-item${isOpen ? " is-open" : ""}`} key={step.title}>
                <button type="button" className="partnership-brands-item-head" onClick={() => toggle(i)}>
                  <span className="partnership-brands-item-title">{step.title}</span>
                </button>
                <div className="partnership-brands-item-desc-wrap">
                  <div className="partnership-brands-item-desc-inner">
                    <p className="partnership-brands-item-tagline">{step.tagline}</p>
                    <p className="partnership-brands-item-body">{step.body}</p>
                    <p className="partnership-brands-item-support-label">{step.supportLabel}</p>
                    <ul className="partnership-brands-item-support">
                      {step.support.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <p className="partnership-brands-item-outcome">
                      <strong>Outcome:</strong> {step.outcome}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isMobile && (
        <div className="partnership-brands-gallery" ref={galleryRef}>
          {STEPS.map((step, i) => {
            const prevIndex = (activeImage - 1 + STEPS.length) % STEPS.length;
            const nextIndex = (activeImage + 1) % STEPS.length;
            let state: "active" | "prev" | "next" | "hidden" = "hidden";
            if (i === activeImage) state = "active";
            else if (i === prevIndex) state = "prev";
            else if (i === nextIndex) state = "next";

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={step.title}
                src={step.image}
                alt={step.title}
                className={`partnership-brands-gallery-photo partnership-brands-gallery-photo--${state}`}
                style={
                  state === "active"
                    ? { transform: `perspective(900px) rotateX(${tilt.y * -14}deg) rotateY(${tilt.x * 14}deg) scale(1.03)` }
                    : undefined
                }
              />
            );
          })}
          <span className="partnership-brands-gallery-tag">{STEPS[activeImage].title}</span>
        </div>
        )}
      </div>

      <div className="partnership-brands-strategist reveal-up">
        <h3 className="partnership-brands-strategist-heading">
          Meet your Ingredient Strategist &amp; Formula Creator.
        </h3>
        <p className="partnership-brands-strategist-subheading">
          Innovation starts with the right scientific partner.
        </p>
        <p className="partnership-brands-strategist-body">
          Our New Product Development (NPD) specialists combine expertise in ingredient science,
          encapsulation technology, formulation development, and manufacturing to help brands
          create products that stand out in today&rsquo;s competitive marketplace. Whether
          you&rsquo;re launching a new nutraceutical, improving an existing formulation, or
          solving complex stability and bioavailability challenges, our team works alongside you
          from concept to commercialisation&mdash;providing scientific guidance, formulation
          strategy, process optimisation, and technical support at every stage.
        </p>
      </div>
    </section>
  );
}
