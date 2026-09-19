import Link from "next/link";

// standalone closing CTA — was previously the 6th item inside
// PartnershipGrowers' chamber, but it's a general invitation to partner
// with SowTrap™, not specific to Growers & Suppliers like the other
// five points there, so it's its own section now, between "For Growers
// & Suppliers" and "From Farm to Functional Ingredient".
export default function PartnershipBuildCTA() {
  return (
    <section className="partnership-build">
      <div className="partnership-build-inner">
        <h2 className="partnership-build-heading reveal-up">Build with SowTrap&trade;</h2>
        <p className="partnership-build-body reveal-up">
          Have a Bioactive, Formulation Challenge, Or a New Product Idea? Whether you are a
          grower seeking to add value to a bioactive-rich crop, an ingredient manufacturer
          developing a differentiated ingredient, or a brand looking for a high-performance
          delivery system, SowTrap&trade; provides a collaborative pathway from scientific concept
          to application-ready product. Our scientists and formulation experts work with you to
          understand the challenge, define the development objectives, identify the appropriate
          material and technology, and establish a pathway toward validation and scale-up.
        </p>
        <Link href="/contact" className="btn btn-lime partnership-build-cta reveal-up">
          Partner With Us
        </Link>
      </div>
    </section>
  );
}
