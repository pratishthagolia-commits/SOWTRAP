import Link from "next/link";
import IndicationStrip from "./IndicationStrip";
import type { Product } from "@/lib/products";

// per Native Extracts' product page: image area, title + botanical-style
// subheading, description, a compounds list ("Phyto-Compounds"), and
// application/benefit categories — reworked here with the data SowTrap
// actually has (no pricing/cart, since this is a B2B ingredient
// portfolio, not a storefront) and finished with an enquiry CTA instead
// of an add-to-cart button, plus related ingredients from the same
// category instead of blog cards.
export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const compounds = product.bioactives.length ? product.bioactives : product.naturalSources;
  const compoundsLabel = product.bioactives.length
    ? "Key Bioactives"
    : product.naturalSources.length
    ? "Natural Sources"
    : null;

  return (
    <section className="product-detail">
      <p className="product-detail-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Products</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </p>

      {/* Nav watches #home to decide full-header vs hamburger-only — this
          used to be on the outer <section>, which spans the entire page
          (image, description, benefits, documents, related products), so
          it stayed "intersecting" and kept the full header on screen for
          nearly the whole scroll. Scoping it to just the top image/info
          row gives Nav a normal hero-sized target, matching every other
          page's behaviour. */}
      <div className="product-detail-top" id="home">
        <div className="product-detail-image-wrap reveal-left">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="product-detail-image" />
          ) : (
            <div className="product-detail-placeholder" aria-hidden="true">
              <span>Image coming soon</span>
            </div>
          )}
        </div>

        <div className="product-detail-info reveal-right">
          <p className="product-detail-category">{product.category}</p>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
          <Link href="/contact" className="btn btn-lime product-detail-cta">
            Enquire About This Ingredient
          </Link>

          {compoundsLabel && (
            <div className="product-detail-tag-list--info">
              <h2 className="product-detail-section-heading">{compoundsLabel}</h2>
              <ul className="product-detail-tag-list">
                {compounds.map((c) => (
                  <li key={c} className="product-detail-tag">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {product.healthBenefits.length > 0 && (
        <div className="product-detail-sections product-detail-sections--indications reveal-up">
          <h2 className="product-detail-section-heading">Health Benefits</h2>
          <IndicationStrip benefits={product.healthBenefits} />
        </div>
      )}

      <div className="product-detail-sections">
        <div className="product-detail-section reveal-up">
          <h2 className="product-detail-section-heading">Documents</h2>
          <ul className="product-detail-downloads">
            <li className="product-detail-download-row">
              <span className="product-detail-download-label">COA</span>
              <span className="product-detail-download-action is-disabled" aria-disabled="true">
                Download
              </span>
            </li>
            <li className="product-detail-download-row">
              <span className="product-detail-download-label">TDS</span>
              <span className="product-detail-download-action is-disabled" aria-disabled="true">
                Download
              </span>
            </li>
            <li className="product-detail-download-row">
              <span className="product-detail-download-label">MSDS</span>
              <span className="product-detail-download-action is-disabled" aria-disabled="true">
                Download
              </span>
            </li>
            <li className="product-detail-download-row">
              <span className="product-detail-download-label">Clinical Evidence</span>
              <span className="product-detail-download-action">On Request</span>
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <div className="product-detail-related">
          <h2 className="product-detail-related-heading reveal-up">More from {product.category}</h2>
          <div className="product-detail-related-grid">
            {related.map((p, i) => (
              <Link
                href={`/products/${p.slug}`}
                className="product-card reveal-up"
                key={p.slug}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="product-card-image-wrap">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="product-card-image" />
                  ) : (
                    <div className="product-card-placeholder" aria-hidden="true" />
                  )}
                </div>
                <h3 className="product-card-name">{p.name}</h3>
                <p className="product-card-category">{p.scientificName || "\u00A0"}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/products" className="product-detail-back reveal-up">&larr; Back to all ingredients</Link>
    </section>
  );
}
