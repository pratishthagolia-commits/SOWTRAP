"use client";

import { useState } from "react";
import Link from "next/link";
import { CATEGORY_ORDER, type Product } from "@/lib/products";

const ALL = "All";

// left-hand category filter (Bioactives, Herbal Extracts, Vitamins,
// Minerals, ...) + a product grid on the right — same sidebar+grid split
// as the main /products browser, scoped down to just this indication's
// own ingredients
export default function IndicationProductsGrid({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  const categories = CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c));
  const filtered = activeCategory === ALL ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="indication-products">
      <aside className="products-filters indication-products-filters">
        <div className="products-filter-group">
          <p className="products-filter-label">Category</p>
          <ul className="products-filter-list">
            <li>
              <button
                type="button"
                className={`products-filter-item${activeCategory === ALL ? " is-active" : ""}`}
                onClick={() => setActiveCategory(ALL)}
              >
                All Ingredients
              </button>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  className={`products-filter-item${activeCategory === c ? " is-active" : ""}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="product-detail-related-grid indication-products-grid">
        {filtered.map((p) => (
          <Link href={`/products/${p.slug}`} className="product-card" key={p.slug}>
            <div className="product-card-image-wrap">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="product-card-image" />
              ) : (
                <div className="product-card-placeholder" aria-hidden="true" />
              )}
            </div>
            <h3 className="product-card-name">{p.name}</h3>
            <p className="product-card-category">{p.scientificName || " "}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
