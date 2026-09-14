import Link from "next/link";
import { getHealthBenefitDescription, getHealthBenefitIcon, type Product } from "@/lib/products";

// a dedicated landing page per health benefit, reached by clicking a
// benefit row on any product detail page — the "About" copy from
// "Updated - SowTrap product details.docx", followed by every SowTrap
// ingredient tagged with that indication, laid out the same way as a
// product detail page's own "More from {category}" panel
export default function IndicationDetail({ benefit, products }: { benefit: string; products: Product[] }) {
  const icon = getHealthBenefitIcon(benefit);
  const description = getHealthBenefitDescription(benefit);

  return (
    <section className="product-detail" id="home">
      <p className="product-detail-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Products</Link>
        <span aria-hidden="true">/</span>
        <span>{benefit}</span>
      </p>

      <div className="indication-hero">
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt="" className="indication-hero-icon" aria-hidden="true" />
        )}
        <div>
          <p className="product-detail-category">Health Benefit</p>
          <h1 className="product-detail-name">{benefit}</h1>
        </div>
      </div>

      {description && <p className="indication-description">{description}</p>}

      {products.length > 0 ? (
        <div className="product-detail-related">
          <h2 className="product-detail-related-heading">
            {products.length} Ingredient{products.length === 1 ? "" : "s"} for {benefit}
          </h2>
          <div className="product-detail-related-grid">
            {products.map((p) => (
              <Link href={`/products/${p.slug}`} className="product-card" key={p.slug}>
                <div className="product-card-image-wrap">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="product-card-image" />
                  ) : (
                    <div className="product-card-placeholder" aria-hidden="true" />
                  )}
                </div>
                <p className="product-card-category">{p.category}</p>
                <h3 className="product-card-name">{p.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="products-empty">No ingredients are tagged with this benefit yet.</p>
      )}

      <Link href="/products" className="product-detail-back">&larr; Back to all ingredients</Link>
    </section>
  );
}
