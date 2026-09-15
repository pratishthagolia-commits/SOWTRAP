import Link from "next/link";
import IndicationProductsGrid from "./IndicationProductsGrid";
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
    <section className="product-detail">
      <p className="product-detail-breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Products</Link>
        <span aria-hidden="true">/</span>
        <span>{benefit}</span>
      </p>

      {/* see ProductDetail.tsx — #home needs to sit on a hero-sized block,
          not the whole page, or Nav's "have we scrolled past the hero"
          check stays true almost the entire way down and the full header
          never switches to the hamburger-only view. */}
      <div className="indication-top" id="home">
        <div className="indication-info reveal-left">
          <p className="product-detail-category">Health Benefit</p>
          <h1 className="product-detail-name">{benefit}</h1>
          {description && <p className="indication-description">{description}</p>}
        </div>

        {icon && (
          <div className="indication-image-wrap reveal-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon} alt="" className="indication-image" aria-hidden="true" />
          </div>
        )}
      </div>

      {products.length > 0 ? (
        <div className="product-detail-related">
          <h2 className="product-detail-related-heading">Ingredients for {benefit}</h2>
          <IndicationProductsGrid products={products} />
        </div>
      ) : (
        <p className="products-empty">No ingredients are tagged with this benefit yet.</p>
      )}

      <Link href="/products" className="product-detail-back">&larr; Back to all ingredients</Link>
    </section>
  );
}
