// simple two-column statement, heading right-aligned on the left, body
// copy on the right — placed right after the "stage / what we evaluate"
// pinned experience.
export default function TechPlatform() {
  return (
    <section className="tech-platform">
      <h2 className="tech-platform-heading reveal-left">
        Our Technology
        <br />
        Platform
      </h2>
      <p className="tech-platform-body reveal-right">
        At SowTrap&trade;, we leverage advanced encapsulation and particle engineering technologies
        to develop high-performance functional ingredients with enhanced stability, bioavailability,
        and application versatility. Our technology platforms are selected and optimized based on the
        physicochemical properties of each bioactive and its intended application.
      </p>
    </section>
  );
}
