"use client";

import { useEffect, useRef, useState } from "react";

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "What are the benefits of encapsulating bioactive ingredients?",
    a: "Encapsulation can help protect sensitive actives from oxidation, moisture, light, heat, and other environmental factors. It can also be used to improve solubility, dispersibility, handling, taste masking, stability, and controlled delivery, depending on the active and formulation.",
  },
  {
    q: "What types of bioactives can SowTrap™ encapsulate?",
    a: "We work with a broad range of bioactives, including vitamins, minerals, amino acids, probiotics, botanical extracts, essential oils, lipids, adaptogens, and other sensitive active ingredients.",
  },
  {
    q: "What applications can SowTrap™ ingredients be used in?",
    a: "Our encapsulated ingredients are compatible for applications such as functional foods, beverages, gummies, dietary supplements, nutraceutical products, chewable tablets, softgels, and many other formulations, depending on the ingredient and regulatory requirements.",
  },
  {
    q: "Can SowTrap™ develop customized encapsulated ingredients?",
    a: "Yes. We offer custom R&D and new product development based on the client's active ingredient, target dosage, application, processing requirements, and desired performance characteristics.",
  },
  {
    q: "What if I don't find the product I am looking for on the website?",
    a: "Our listed products represent only a selection of our capabilities. If you do not find a specific product, you can share your requirement with us. Our R&D team can provide you the updated product list or work with you for customization.",
  },
  {
    q: "What information should I provide for a custom development project?",
    a: "Ideally, you can provide the active ingredient, desired dosage/loading, intended application, preferred dosage form, target market, required specifications, and any known performance challenges. If you do not have a finalized formulation, our R&D team can work from the product concept and development objective.",
  },
  {
    q: "What documentation can be provided for developed products?",
    a: "Depending on the stage and scope of the project, documentation may include technical specifications, formulation/development information, Certificate of Analysis (CoA), analytical test reports, process parameters, characterization data, stability-study data, and batch-related documentation. The exact documentation package can be agreed upon according to the project requirements.",
  },
  {
    q: "Will I receive a Certificate of Analysis (CoA) with my product?",
    a: "Where applicable, a batch-specific Certificate of Analysis (CoA) can be provided.",
  },
  {
    q: "Does SowTrap™ provide scale-up and contract research services?",
    a: "Yes. SowTrap™ supports projects from concept development and laboratory research through process optimization, scale-up, characterization, and technology development, providing flexible R&D and contract research solutions for industry partners.",
  },
  {
    q: "What is the minimum quantity required for custom development?",
    a: "Development and sample quantities can vary depending on the active, technology, and stage of development. Requirements can be discussed based on the project scope.",
  },
];

// exclusive accordion, same "curtain/blind" grid-template-rows 0fr->1fr
// reveal used elsewhere on the site (BioactivesIntro, PartnershipBrands)
// — animates to each answer's exact height instead of a guessed
// max-height, so short and long answers open/close at the same visible
// speed.
export default function ProductsFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  // same local-IntersectionObserver reveal as ScientificValidation/
  // SupplementsFail — each item's className changes on click (open/
  // close), so if the global ScrollReveal.tsx added "in-view" straight
  // to the DOM (outside React), every click's re-render would overwrite
  // className from React's own string and wipe it, making the whole row
  // flash back to invisible. Folding "in-view" into React state avoids
  // that.
  const [revealed, setRevealed] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
  }

  return (
    <section className="products-faq">
      <div className="products-faq-intro">
        <p className="products-faq-kicker reveal-left">FAQs</p>
        <h2 className="products-faq-heading reveal-left">Frequently Asked Questions</h2>
      </div>

      <div className="products-faq-list" ref={listRef}>
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              className={`products-faq-item reveal-up${revealed ? " in-view" : ""}${isOpen ? " is-open" : ""}`}
              key={faq.q}
              style={{ transitionDelay: `${Math.min(i, 5) * 0.06}s` }}
            >
              <button
                type="button"
                className="products-faq-item-head"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
              >
                <span className="products-faq-item-q">{faq.q}</span>
                <span className="products-faq-item-icon" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              <div className="products-faq-item-answer-wrap">
                <div className="products-faq-item-answer-inner">
                  <p className="products-faq-item-answer">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
