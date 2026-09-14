const EXPERTISE_ITEMS = [
  "Advanced encapsulation and controlled-release technologies",
  "Functional ingredient and delivery system development",
  "Research-driven formulation and matrix engineering",
  "Bioavailability enhancement and stability optimization",
  "Product formulation for nutraceutical, pharmaceutical, and functional food applications",
  "Contract research, process optimization, pilot-scale development, technology transfer, and commercial manufacturing",
];

const CLOSING_LINE =
  "At SowTrap™, every solution is developed through a science-first approach, combining rigorous research, application-focused formulation, and scalable manufacturing to help partners accelerate innovation and bring differentiated, high-quality products to market.";

// plain static section — no scroll-jack of its own. The "OUR CORE
// EXPERTISE" tab lives inside AboutUsV2's sliding shape (attached to its
// bottom edge); this is just the dark navy content that sits underneath
// it in normal page flow, scrolling like any other section. The whole
// panel slides in from the right (.reveal-right, handled globally by
// ScrollReveal.tsx's IntersectionObserver), and the bullet points reveal
// one by one via staggered transition-delays on top of that same
// mechanism, rather than a separate scroll-jack.
export default function CoreExpertiseSection() {
  return (
    <section className="expertise-panel reveal-right">
      <ul className="expertise-list">
        {EXPERTISE_ITEMS.map((item, i) => (
          <li key={item.slice(0, 24)} className="reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
            {item}
          </li>
        ))}
      </ul>
      <p className="expertise-closing reveal" style={{ transitionDelay: `${EXPERTISE_ITEMS.length * 0.15}s` }}>
        {CLOSING_LINE}
      </p>
    </section>
  );
}
