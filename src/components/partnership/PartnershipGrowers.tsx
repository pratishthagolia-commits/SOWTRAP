"use client";

import { useState } from "react";
import ChamberAccordion from "@/components/ChamberAccordion";
import useIsMobile from "@/lib/useIsMobile";

type GrowerItem = { title: string; body: string };

// ordered to match the 2-column grid's row-major fill exactly as laid
// out in the reference design (row 1: item 1/2, row 2: item 3/4, ...)
const ITEMS: GrowerItem[] = [
  {
    title: "Co-creating better Ingredients at the source",
    body: "At SowTrap™, we believe exceptional ingredients begin at the source. We work closely with growers, botanical suppliers, ingredient manufacturers, and value-chain partners to understand and optimize the raw materials that form the foundation of bioactive delivery. Through technical collaboration, we help partners establish more consistent raw-material specifications and develop processing strategies that preserve bioactive integrity from harvest to formulation.",
  },
  {
    title: "Tailored encapsulation development",
    body: "Every bioactive has a distinct physicochemical profile and delivery challenge. Our scientists develop customized encapsulation matrices based on ingredient characteristics, target applications, release requirements, and processing conditions to create application-ready functional ingredients with superior performance. This enables raw materials to move beyond commodity ingredients toward differentiated, scientifically engineered functional ingredients.",
  },
  {
    title: "Field Research & Technical Training",
    body: "Our technical teams collaborate with cultivation partners to promote best agricultural and post-harvest practices that preserve bioactive quality and maximize ingredient potential. The objective is to establish a stronger connection between agricultural practice, ingredient quality, and downstream functional performance.",
  },
  {
    title: "Contract R&D & custom solutions",
    body: "Science Built Around Your Ingredient. SowTrap™ partners with ingredient manufacturers, nutraceutical brands, food companies, pharmaceutical organizations, and research institutions to develop customized encapsulation solutions from concept to commercialization. We can engage at the early feasibility stage or support an existing formulation through optimization, validation, scale-up, and manufacturing.",
  },
  {
    title: "Advanced Processing & Value Addition",
    body: "High-quality raw materials can lose significant functional value during processing and storage. SowTrap™ supports suppliers through advanced processing technologies, quality optimization, and value-addition strategies that improve ingredient recovery, stability, and commercial value while minimizing post-harvest losses.",
  },
];
// "Build with SowTrap™" used to be a 6th item here, but it isn't a
// Growers & Suppliers-specific point like the other five — it's a
// general call to action. Moved out into its own standalone section,
// PartnershipBuildCTA, placed right after this one.

// "For GROWERS & SUPPLIERS" — same click-to-select chamber pattern as
// .sci-factors-chamber (detail panel + list, single active item), but only
// the detail panel is a navy card (the list sits on plain white), and the
// active item follows the mouse on hover UNTIL it's clicked — a click pins
// it, and further hovering over other points does nothing until the user
// clicks a different point (or the same one again, to unpin).
export default function PartnershipGrowers() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const item = ITEMS[active];

  function handleEnter(i: number) {
    if (pinned) return;
    setActive(i);
  }

  function handleClick(i: number) {
    if (pinned && active === i) {
      setPinned(false);
    } else {
      setActive(i);
      setPinned(true);
    }
  }

  return (
    <section className="partnership-growers" id="for-growers">
      <h2 className="partnership-growers-heading reveal-left">For GROWERS &amp; SUPPLIERS</h2>

      {isMobile ? (
        <div className="chamber-mobile-wrap">
          <ChamberAccordion points={ITEMS.map((it) => ({ title: it.title, detail: it.body }))} />
        </div>
      ) : (
        <div className="partnership-growers-chamber">
          <div className="partnership-growers-detail">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
          <div className="partnership-growers-list">
            {ITEMS.map((it, i) => (
              <button
                type="button"
                key={it.title}
                className={`partnership-growers-list-item${active === i ? " is-active" : ""}${
                  pinned && active === i ? " is-pinned" : ""
                }`}
                onMouseEnter={() => handleEnter(i)}
                onClick={() => handleClick(i)}
              >
                {it.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
