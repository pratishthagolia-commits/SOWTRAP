"use client";

import { useState } from "react";

export type ChamberPoint = { title: string; detail: string };

// phone-only stand-in for the "chamber" pattern (a grid of points next to
// one shared hover/click-driven preview card) used across 8 sections —
// hover has no equivalent on touch, so each point becomes its own
// independently-toggleable curtain-drop row instead, per the client's
// Native Extracts reference for its "Application Categories" accordion.
export default function ChamberAccordion({ points }: { points: ChamberPoint[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <ul className="chamber-accordion">
      {points.map((point, i) => {
        const isOpen = open.has(i);
        return (
          <li key={point.title} className={`chamber-accordion-item${isOpen ? " is-open" : ""}`}>
            <button
              type="button"
              className="chamber-accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
            >
              <span>{point.title}</span>
              <span className="chamber-accordion-icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div className="chamber-accordion-curtain">
              <div className="chamber-accordion-curtain-inner">
                <p>{point.detail}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
