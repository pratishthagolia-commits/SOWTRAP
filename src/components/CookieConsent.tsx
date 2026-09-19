"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sowtrap-cookie-consent";

type Categories = {
  statistics: boolean;
  targeting: boolean;
  preferences: boolean;
  unclassified: boolean;
};

const DEFAULT_CATEGORIES: Categories = {
  statistics: false,
  targeting: false,
  preferences: false,
  unclassified: false,
};

const CATEGORY_LABELS: { key: keyof Categories; label: string }[] = [
  { key: "statistics", label: "Statistics" },
  { key: "targeting", label: "Targeting" },
  { key: "preferences", label: "Preferences" },
  { key: "unclassified", label: "Unclassified" },
];

// full consent modal (categories + Accept All / Save Selection), not just
// a plain accept/decline banner — matches the pattern used by most B2B
// ingredient-industry sites (e.g. BENEO). Necessary cookies are always
// on and can't be unchecked, same as everywhere this pattern is used.
// The category choices are persisted but nothing in this codebase yet
// actually gates a script behind them — there's no analytics/marketing
// tag installed to conditionally load. When one is added, read this
// stored value before initializing it.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState<Categories>(DEFAULT_CATEGORIES);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) — just show it
      // every visit rather than blocking the page on this
      setVisible(true);
    }
  }, []);

  function persist(chosen: Categories) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ necessary: true, ...chosen, decidedAt: Date.now() })
      );
    } catch {
      // nothing to persist to — the modal will just reappear next visit
    }
    setVisible(false);
  }

  function toggle(key: keyof Categories) {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (!visible) return null;

  return (
    <div className="cookie-overlay" role="presentation">
      <div className="cookie-modal" role="dialog" aria-modal="true" aria-label="Cookie consent">
        <h2 className="cookie-modal-title">This website uses cookies</h2>

        <div className="cookie-modal-body">
          <p>
            SowTrap&trade; uses cookies and similar technical measures to understand how visitors use
            this site and to improve its content and performance. You can choose which categories to
            allow below, or accept all.
          </p>
          <p>
            Further information about how your data is processed, and your choices, can be found in
            our <a href="#">Cookie Policy</a> and <a href="#">Privacy Policy</a>.
          </p>
          <p>
            SowTrap&trade; is a B2B ingredient technology provider and does not sell products directly
            to consumers. This website is intended for business partners, industry professionals, and
            prospective collaborators.
          </p>
        </div>

        <div className="cookie-modal-categories">
          <label className="cookie-category is-locked">
            <input type="checkbox" checked disabled readOnly />
            <span>Necessary</span>
          </label>
          {CATEGORY_LABELS.map(({ key, label }) => (
            <label className="cookie-category" key={key}>
              <input type="checkbox" checked={categories[key]} onChange={() => toggle(key)} />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="cookie-modal-actions">
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => persist(categories)}
          >
            Save Selection
          </button>
          <button
            type="button"
            className="btn btn-lime"
            onClick={() =>
              persist({ statistics: true, targeting: true, preferences: true, unclassified: true })
            }
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
