import Link from "next/link";

// final closing statement of the partnership page — the source-to-market
// pathway as a single arrow chain, plus the two conversion CTAs.
export default function PartnershipFarmClosing() {
  return (
    <section className="partnership-farm">
      <h2 className="partnership-farm-heading reveal-up">From Farm to Functional Ingredient</h2>
      <p className="partnership-farm-path reveal-up">
        Source &rarr; Characterize &rarr; Engineer &rarr; Encapsulate &rarr; Validate &rarr; Scale
        &rarr; Commercialize
      </p>
      <p className="partnership-farm-body reveal-up">
        Partner with SowTrap&trade; to transform quality bioactive resources into scientifically
        engineered, consistent, and application-ready functional ingredients.
      </p>

      <div className="partnership-farm-cta">
        <Link href="/contact" className="btn btn-lime">Book a Consultation / Partnership Enquiry</Link>
        <Link href="/products" className="btn btn-lime">Explore products</Link>
      </div>
    </section>
  );
}
