"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import { getAllProducts, getCategories, getHealthBenefits, getProductTypes, type Product } from "@/lib/products";

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "az", label: "Alphabetically, A–Z" },
  { value: "za", label: "Alphabetically, Z–A" },
  { value: "category", label: "By Category" },
  { value: "most-benefits", label: "Most Health Benefits" },
];

const ALL = "All";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image-wrap">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="product-card-image" />
        ) : (
          <div className="product-card-placeholder" aria-hidden="true" />
        )}
      </div>
      <h3 className="product-card-name">{product.name}</h3>
      <p className="product-card-category">{product.scientificName || "\u00A0"}</p>
    </Link>
  );
}

// left-hand filters (category + health benefit) + search + sort, and a
// responsive product grid on the right — same structural pieces as the
// Native Extracts collection page (multi-facet filter panel, sort
// control, image-led product cards) reworked in SowTrap's own
// navy/white/lime palette, with "Applications" replaced by the 18
// indication categories from the product list spreadsheet since that's
// the facet SowTrap's own data actually supports. With "All" categories,
// no benefit filter, and no active search, the grid is broken into
// per-category sections instead of one flat unlabeled wall of cards.
const BIOACTIVES = "Bioactives";

export default function ProductsBrowser() {
  const searchParams = useSearchParams();
  const categories = useMemo(() => getCategories(), []);
  const benefits = useMemo(() => getHealthBenefits(), []);
  const productTypes = useMemo(() => getProductTypes(), []);

  // deep-links from a product detail page's breadcrumb (?category=X) land
  // straight on that category instead of the unfiltered "All" view — read
  // once via the lazy initializer rather than syncing in an effect
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const fromUrl = searchParams.get("category");
    return fromUrl && categories.includes(fromUrl) ? fromUrl : ALL;
  });
  const [activeProductType, setActiveProductType] = useState<string | null>(null);
  const [activeBenefits, setActiveBenefits] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "az" | "za" | "category" | "most-benefits">("default");
  // phone-only: which of the two filter groups is expanded as a dropdown
  // tab (see .products-filter-tabs in globals.css) — irrelevant above
  // 640px, where both groups just render normally via CSS
  const [mobileFilterOpen, setMobileFilterOpen] = useState<"category" | "indications" | null>(null);

  const allProducts = useMemo(() => getAllProducts(), []);

  const query = search.trim().toLowerCase();

  // Product Type is a Bioactives-only sub-filter, nested under it in the
  // sidebar — selecting any other category (or "All") clears it, since it
  // has no meaning outside Bioactives
  function selectCategory(c: string) {
    setActiveCategory(c);
    if (c !== BIOACTIVES) setActiveProductType(null);
  }

  function toggleProductType(t: string) {
    setActiveProductType((prev) => (prev === t ? null : t));
  }

  function toggleBenefit(b: string) {
    setActiveBenefits((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  }

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = activeCategory === ALL || p.category === activeCategory;
      const matchesProductType =
        activeCategory !== BIOACTIVES || !activeProductType || p.productType === activeProductType;
      const matchesBenefits =
        activeBenefits.length === 0 || activeBenefits.some((b) => p.healthBenefits.includes(b));
      const matchesSearch = !query || p.name.toLowerCase().includes(query);
      return matchesCategory && matchesProductType && matchesBenefits && matchesSearch;
    });
  }, [allProducts, activeCategory, activeProductType, activeBenefits, query]);

  const sorted = useMemo(() => {
    // "default" leaves filtered's order untouched — the order products
    // were listed in Updated - SowTrap product details.docx, which is
    // also the array order in products.json — rather than resorting them
    if (sort === "default") return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      switch (sort) {
        case "za":
          return b.name.localeCompare(a.name);
        case "az":
          return a.name.localeCompare(b.name);
        case "category":
          return (
            categories.indexOf(a.category) - categories.indexOf(b.category) ||
            a.name.localeCompare(b.name)
          );
        case "most-benefits":
          return b.healthBenefits.length - a.healthBenefits.length || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return copy;
  }, [filtered, sort, categories]);

  const grouped = activeCategory === ALL && activeBenefits.length === 0 && !query;
  const hasActiveFilters =
    activeCategory !== ALL || !!activeProductType || activeBenefits.length > 0 || !!query;

  function clearFilters() {
    setActiveCategory(ALL);
    setActiveProductType(null);
    setActiveBenefits([]);
    setSearch("");
  }

  return (
    <section className="products-browser">
      <aside className="products-filters">
        <div className="products-filter-tabs">
          <button
            type="button"
            className={`products-filter-tab${mobileFilterOpen === "category" ? " is-open" : ""}`}
            onClick={() => setMobileFilterOpen((prev) => (prev === "category" ? null : "category"))}
            aria-expanded={mobileFilterOpen === "category"}
          >
            Ingredient Category
            <span className="products-filter-tab-chevron" aria-hidden="true">&#9662;</span>
          </button>
          <button
            type="button"
            className={`products-filter-tab${mobileFilterOpen === "indications" ? " is-open" : ""}`}
            onClick={() => setMobileFilterOpen((prev) => (prev === "indications" ? null : "indications"))}
            aria-expanded={mobileFilterOpen === "indications"}
          >
            Indications
            <span className="products-filter-tab-chevron" aria-hidden="true">&#9662;</span>
          </button>
        </div>

        <div className={`products-filter-group${mobileFilterOpen === "category" ? " is-mobile-open" : ""}`}>
          <p className="products-filter-label">Ingredient Category</p>
          <ul className="products-filter-list">
            <li>
              <button
                type="button"
                className={`products-filter-item${activeCategory === ALL ? " is-active" : ""}`}
                onClick={() => selectCategory(ALL)}
              >
                All Ingredients
              </button>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  className={`products-filter-item${activeCategory === c ? " is-active" : ""}`}
                  onClick={() => selectCategory(c)}
                >
                  {c}
                </button>
                {c === BIOACTIVES && activeCategory === BIOACTIVES && productTypes.length > 0 && (
                  <ul className="products-filter-sublist">
                    {productTypes.map((t) => (
                      <li key={t}>
                        <button
                          type="button"
                          className={`products-filter-subitem${activeProductType === t ? " is-active" : ""}`}
                          onClick={() => toggleProductType(t)}
                        >
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className={`products-filter-group${mobileFilterOpen === "indications" ? " is-mobile-open" : ""}`}>
          <p className="products-filter-label">Indications</p>
          <ul className="products-filter-list products-filter-list--checkbox">
            {benefits.map((b) => {
              const checked = activeBenefits.includes(b);
              return (
                <li key={b}>
                  <label className={`products-filter-checkbox${checked ? " is-active" : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleBenefit(b)} />
                    <span>{b}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        {hasActiveFilters && (
          <button type="button" className="products-filter-clear" onClick={clearFilters}>
            Clear all filters
          </button>
        )}
      </aside>

      <div className="products-results">
        <div className="products-toolbar">
          <input
            type="text"
            className="products-search"
            placeholder="Search ingredients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search ingredients"
          />
          <Dropdown
            className="products-sort"
            listClassName="products-sort-list"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(v) => setSort(v as "default" | "az" | "za" | "category" | "most-benefits")}
            listWidth={220}
            ariaLabel="Sort ingredients"
          />
        </div>

        {(activeBenefits.length > 0 || activeProductType) && (
          <div className="products-active-pills">
            {activeProductType && (
              <button
                type="button"
                className="products-active-pill"
                onClick={() => setActiveProductType(null)}
              >
                {activeProductType} <span aria-hidden="true">&times;</span>
              </button>
            )}
            {activeBenefits.map((b) => (
              <button type="button" key={b} className="products-active-pill" onClick={() => toggleBenefit(b)}>
                {b} <span aria-hidden="true">&times;</span>
              </button>
            ))}
          </div>
        )}

        {/* keyed on the full filter/sort signature so switching category
            (or any other filter) remounts this block instead of patching
            the existing grid in place — that remount is what replays the
            fade/rise-in animation below, instead of the new cards just
            snapping into place */}
        <div
          className="products-grid-wrap"
          key={`${activeCategory}|${activeProductType ?? ""}|${activeBenefits.join(",")}|${query}|${sort}`}
        >
          {sorted.length === 0 && (
            <p className="products-empty">No ingredients match your filters.</p>
          )}

          {grouped ? (
            categories.map((c) => {
              const items = sorted.filter((p) => p.category === c);
              if (items.length === 0) return null;
              return (
                <div className="products-section" key={c}>
                  <h2 className="products-section-heading">{c}</h2>
                  <div className="products-grid">
                    {items.map((p) => (
                      <ProductCard product={p} key={p.slug} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="products-grid">
              {sorted.map((p) => (
                <ProductCard product={p} key={p.slug} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
