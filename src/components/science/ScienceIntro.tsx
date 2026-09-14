import Link from "next/link";

// plain static opening statement for the science page — kicker, the "an
// active ingredient..." heading, two navy statement blocks staggered at
// different left offsets, and a closing tagline with emphasized words.
export default function ScienceIntro() {
  return (
    <section className="science-intro">
      <h1 className="science-intro-heading reveal-right">
        An Active Ingredient Is Only as Effective as Its Journey.
      </h1>

      <div className="science-intro-block science-intro-block-1 reveal-left">
        <p>
          Advances in food science, biotechnology, materials science, and process engineering enable
          the rational design and optimization of bioactive delivery systems. Microencapsulation helps
          protect sensitive bioactives and enhance their stability, functionality, and application
          performance.
        </p>
      </div>

      <h2 className="science-intro-sub reveal-left">This is where SowTrap makes a difference.</h2>

      <div className="science-intro-block science-intro-block-2 reveal-right">
        <p>
          We integrate active-ingredient science, material selection, formulation engineering, and
          process technology to develop microencapsulated bioactives engineered around the complete
          journey of the active—from ingredient to application.
        </p>
      </div>

      <p className="science-intro-tagline reveal-up">
        Understand the active, Engineer the delivery, Unlock its potential.
      </p>

      <div className="science-intro-cta">
        <Link href="/technology" className="btn btn-lime">Explore SowTrap&trade; Technology</Link>
        <Link href="/#portfolio-carousel" className="btn btn-outline-dark">Explore SowTrap&trade; Product Portfolio</Link>
      </div>
    </section>
  );
}
