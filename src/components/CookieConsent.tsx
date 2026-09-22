"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sowtrap-cookie-consent";
// dispatched by the footer's "Cookie Settings" link to reopen this modal
// after the visitor has already made (and this component has already
// hidden itself for) a choice — see FooterCTA.tsx
export const OPEN_COOKIE_SETTINGS_EVENT = "sowtrap:open-cookie-settings";

type Categories = {
  preference: boolean;
  analytics: boolean;
  functionality: boolean;
  marketing: boolean;
};

const DEFAULT_CATEGORIES: Categories = {
  preference: false,
  analytics: false,
  functionality: false,
  marketing: false,
};

const ALL_ACCEPTED: Categories = {
  preference: true,
  analytics: true,
  functionality: true,
  marketing: true,
};

const CATEGORY_COPY: { key: keyof Categories; label: string; description: string }[] = [
  {
    key: "preference",
    label: "Preference Cookies",
    description:
      "These cookies allow the Website to remember choices such as language, location or other settings and provide a more convenient browsing experience.",
  },
  {
    key: "analytics",
    label: "Analytics Cookies",
    description:
      "These cookies help us understand how visitors use our Website. They may provide aggregated information about page visits, navigation, engagement, and Website performance. We use this information to improve our Website, content, and user experience.",
  },
  {
    key: "functionality",
    label: "Functionality Cookies",
    description:
      "These cookies may be used by third-party services integrated into the Website to provide additional functionality, such as embedded content, forms, communication tools, appointment services, maps, or similar features.",
  },
  {
    key: "marketing",
    label: "Marketing Cookies",
    description:
      "Where applicable, these cookies may be used to understand interaction with marketing activities, measure campaigns, support relevant communications, or provide advertising and remarketing functionality.",
  },
];

// full consent modal (categories + Accept All / Reject Non-Essential /
// Save Preferences), not just a plain accept/decline banner — matches
// the pattern used by most B2B ingredient-industry sites (e.g. BENEO).
// Essential cookies are always on and can't be unchecked. The category
// choices are persisted but nothing in this codebase yet actually gates
// a script behind them — there's no analytics/marketing tag installed
// to conditionally load. When one is added, read this stored value
// before initializing it.
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

    // re-open on demand from the footer's "Cookie Settings" link, even
    // after a choice has already been made and this modal hidden itself
    function handleReopen() {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Categories>;
          setCategories({
            preference: !!parsed.preference,
            analytics: !!parsed.analytics,
            functionality: !!parsed.functionality,
            marketing: !!parsed.marketing,
          });
        }
      } catch {
        // ignore — just reopen with whatever's currently in state
      }
      setVisible(true);
    }
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleReopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleReopen);
  }, []);

  function persist(chosen: Categories) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ essential: true, ...chosen, decidedAt: Date.now() })
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
      <div className="cookie-modal" role="dialog" aria-modal="true" aria-label="Cookie settings">
        <h2 className="cookie-modal-title">Your Privacy, Your Choice</h2>

        <div className="cookie-modal-body">
          <p>
            SowTrap&trade; uses cookies and similar technologies to keep our Website secure and
            functional, remember your preferences, understand Website usage, and improve our content
            and services.
          </p>
          <p>
            You can choose which non-essential cookie categories you allow. You can change your
            preferences at any time through Cookie Settings.
          </p>
        </div>

        <div className="cookie-modal-categories">
          <label className="cookie-category is-locked">
            <input type="checkbox" checked disabled readOnly />
            <span>
              Essential Cookies
              <em>
                Always Active — required for the Website to function properly (navigation, security,
                forms, session management, consent preferences, and core functionality).
              </em>
            </span>
          </label>
          {CATEGORY_COPY.map(({ key, label, description }) => (
            <label className="cookie-category" key={key}>
              <input type="checkbox" checked={categories[key]} onChange={() => toggle(key)} />
              <span>
                {label}
                <em>{description}</em>
              </span>
            </label>
          ))}
        </div>

        <p className="cookie-modal-footnote">
          For more information about our use of cookies and similar technologies, please read our{" "}
          <Link href="/cookie-policy">Cookie Policy</Link>.
        </p>

        <div className="cookie-modal-actions">
          <button type="button" className="btn btn-outline-dark" onClick={() => persist(DEFAULT_CATEGORIES)}>
            Reject Non-Essential
          </button>
          <button type="button" className="btn btn-outline-dark" onClick={() => persist(categories)}>
            Save Preferences
          </button>
          <button type="button" className="btn btn-lime" onClick={() => persist(ALL_ACCEPTED)}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
