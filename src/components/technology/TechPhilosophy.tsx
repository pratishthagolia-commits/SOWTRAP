type Challenge = { title: string; solution: string; benefit: string };

const CHALLENGES: Challenge[] = [
  {
    title: "Sensory Challenges",
    solution: "Taste-masked and sensory-optimised formats",
    benefit: "Reduced bitterness, metallic notes and undesirable odour.",
  },
  {
    title: "Low Bioavailability",
    solution: "Bioaccessibility focused delivery systems",
    benefit: "Improved availability of the active during digestion.",
  },
  {
    title: "Targeted Release",
    solution: "Controlled and application-specific release systems",
    // source text was truncated ("Delivery at the desired ") — best-guess completion, flagged to the user
    benefit: "Delivery at the desired site of action.",
  },
  {
    title: "High Active Load",
    solution: "Optimised high-load formulations",
    benefit: "Higher active delivery with efficient use of carrier materials.",
  },
  {
    title: "Poor Solubility",
    solution: "Enhanced dispersibility and delivery systems",
    benefit: "Improved solubility and more uniform distribution in the final product.",
  },
  {
    title: "Active Instability",
    solution: "Protective encapsulation systems",
    benefit: "Improved stability against heat, oxygen, light and moisture.",
  },
  {
    title: "Formulation Challenges",
    solution: "Application ingredient formats",
    benefit: "Improved compatibility, handling and formulation flexibility.",
  },
  {
    title: "Process Sensitivity",
    solution: "Process-compatible protective systems",
    benefit: "Better active retention during manufacturing.",
  },
];

// horizontal scrolling row of navy-header/white-body cards, same visual
// pattern as the reference screenshot — each card pairs an ingredient
// challenge (navy header) with the delivery system SowTrap creates to
// solve it (white body).
export default function TechPhilosophy() {
  return (
    <section className="tech-philosophy">
      <p className="tech-philosophy-kicker reveal-left">Technology selection philosophy</p>
      <div className="tech-philosophy-body">
        <h2 className="tech-philosophy-heading reveal-left">Science-led. Application-driven. Performance-focused.</h2>
        <p className="tech-philosophy-intro reveal-right">
          We develop advanced delivery solutions that help nutritional and functional ingredients
          perform better where it matters &mdash; during processing, throughout shelf life, and in
          the final product. From challenging actives to high-value nutrients, our technologies are
          designed around the specific properties of each ingredient and the performance required
          from the final application.
        </p>
      </div>

      <div className="tech-philo-cards">
        {CHALLENGES.map((c) => (
          <div className="tech-philo-card" key={c.title}>
            <div className="tech-philo-card-header">
              <span className="tech-philo-card-eyebrow">Ingredient Challenge:</span>
              <h4>{c.title}</h4>
            </div>
            <div className="tech-philo-card-body">
              <span className="tech-philo-card-eyebrow tech-philo-card-eyebrow--dark">What We Create:</span>
              <p className="tech-philo-card-solution">{c.solution}</p>
              <p className="tech-philo-card-benefit">{c.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
