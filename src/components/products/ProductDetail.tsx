import Link from "next/link";
import { getHealthBenefitIcon, getHealthBenefitSlug, type Product } from "@/lib/products";

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
    <section className="product-detail" id="home">
      <p className="product-detail-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Products</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </p>

      <div className="product-detail-top">
        <div className="product-detail-image-wrap">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="product-detail-image" />
          ) : (
            <div className="product-detail-placeholder" aria-hidden="true">
              <span>Image coming soon</span>
            </div>
          )}
        </div>

        <div className="product-detail-info">
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
        <div className="product-detail-sections">
          <div className="product-detail-section">
            <h2 className="product-detail-section-heading">Health Benefits</h2>
            <ul className="product-detail-benefit-list">
              {product.healthBenefits.map((b) => {
                const icon = getHealthBenefitIcon(b);
                const slug = getHealthBenefitSlug(b);
                return (
                  <li key={b} className="product-detail-benefit-item">
                    <Link href={slug ? `/indications/${slug}` : "/products"} className="product-detail-benefit-row">
                      {icon && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={icon} alt="" className="product-detail-benefit-icon" aria-hidden="true" />
                      )}
                      <span>{b}</span>
                      <span className="product-detail-benefit-arrow" aria-hidden="true">&rarr;</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="product-detail-related">
          <h2 className="product-detail-related-heading">More from {product.category}</h2>
          <div className="product-detail-related-grid">
            {related.map((p) => (
              <Link href={`/products/${p.slug}`} className="product-card" key={p.slug}>
                <div className="product-card-image-wrap">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="product-card-image" />
                  ) : (
                    <div className="product-card-placeholder" aria-hidden="true" />
                  )}
                </div>
                <p className="product-card-category">{p.scientificName || "\u00A0"}</p>
                <h3 className="product-card-name">{p.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/products" className="product-detail-back">&larr; Back to all ingredients</Link>
    </section>
  );
}
