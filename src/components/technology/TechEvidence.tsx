// full-bleed photo with an 80%-opacity white wash over it, paragraph
// right-aligned on the left, heading left-aligned on the right — both
// vertically centered over the image.
export default function TechEvidence() {
  return (
    <section className="tech-evidence">
      <div className="tech-evidence-overlay" />
      <div className="tech-evidence-content">
        <p className="tech-evidence-body reveal-left">
          From analytical characterization to clinical evaluation, from technical documentation to
          scientific collaboration, every stage is designed to build evidence around how the
          encapsulated active performs—from formulation and processing through application and,
          where relevant, human use.
        </p>
        <h2 className="tech-evidence-heading reveal-right">Evidence That Moves With the Active</h2>
      </div>
    </section>
  );
}
