"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Option = { value: string; label: string; shortLabel?: string };

// custom dropdown, replacing the native <select> — a browser's native
// option-list popup can't be restyled (its background, blur, hover
// colour, and scrollbar are all OS-drawn), which is why the country-code
// list was rendering as a glassy, blue-highlighted native menu instead of
// the site's own navy/white/lime palette. This renders its own styled
// listbox instead, with a real (always-visible, custom-coloured)
// scrollbar rather than the native "keep tapping to reveal more" chevron.
//
// the open list is rendered through a portal into document.body,
// positioned by the trigger's actual screen coordinates, rather than as
// a normal absolutely-positioned child. Two sibling form sections
// (.contact-form-section--alt and the one after it) each set their own
// position:relative + z-index, which makes each its OWN stacking
// context — z-index values inside one context can never outrank a
// later SIBLING context's own background, no matter how high, so the
// list was getting visually sliced off by the next section's opaque
// background the moment it overflowed past its own section's box. A
// portal escapes that entirely by attaching straight to <body>.
export default function Dropdown({
  id,
  name,
  options,
  required,
  placeholder = "Select one",
  defaultValue,
  listWidth,
  value,
  onChange,
  ariaLabel,
  className,
  listClassName,
}: {
  id?: string;
  // omit `name` for a controlled, non-form use (e.g. a page filter/sort
  // control) — the hidden form-submission input is only rendered when
  // it's given
  name?: string;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  // overrides the list's width instead of matching the trigger's own
  // width — the phone country-code trigger is intentionally compact, but
  // its list needs more room to show full country names legibly
  listWidth?: number;
  // controlled mode: parent owns the selected value instead of this
  // component tracking it internally
  value?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  // the list portals straight into <body>, outside this component's own
  // DOM subtree, so a selector scoped through `className` on the trigger
  // can never reach it — this reaches the list directly instead
  listClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string | null>(defaultValue ?? null);
  const selected = value !== undefined ? value : uncontrolledSelected;
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  function updatePosition() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = listWidth ?? rect.width;
    // clamp so a list wider than its trigger (listWidth) never runs past
    // the right edge of the viewport when the trigger itself sits near
    // that edge — align it flush right against the viewport instead
    const left = Math.min(rect.left, window.innerWidth - width - 16);
    setPos({ top: rect.bottom + 6, left, width });
  }

  useEffect(() => {
    if (!open) return;
    updatePosition();
    // the portal is positioned in viewport coordinates, so it has to be
    // kept in sync with the page any time it could move underneath it
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = rootRef.current?.contains(target);
      const insideList = listRef.current?.contains(target);
      if (!insideTrigger && !insideList) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption = options.find((o) => o.value === selected);

  return (
    <div className={`dropdown${open ? " is-open" : ""}${className ? ` ${className}` : ""}`} ref={rootRef}>
      {name && <input type="hidden" name={name} value={selected ?? ""} required={required} />}
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selectedOption ? "dropdown-value" : "dropdown-placeholder"}>
          {selectedOption ? selectedOption.shortLabel ?? selectedOption.label : placeholder}
        </span>
        <span className="dropdown-chevron" aria-hidden="true">
          &#9662;
        </span>
      </button>
      {open && pos &&
        createPortal(
          <ul
            className={`dropdown-list${listClassName ? ` ${listClassName}` : ""}`}
            role="listbox"
            ref={listRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
          >
            {options.map((o) => (
              <li key={o.value} role="option" aria-selected={o.value === selected}>
                <button
                  type="button"
                  className={`dropdown-option${o.value === selected ? " is-selected" : ""}`}
                  onClick={() => {
                    if (onChange) onChange(o.value);
                    else setUncontrolledSelected(o.value);
                    setOpen(false);
                  }}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}
