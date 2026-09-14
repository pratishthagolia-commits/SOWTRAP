// full-screen lab photo banner, same pattern as ScienceHero — TechIntro
// (the next section) wraps up over its bottom edge via a scroll-tracked
// margin. The "TECHNOLOGY" title tab itself lives in TechIntro (the
// panel doing the wrapping), so it rides up together with the panel
// instead of staying pinned to the hero and getting cut off mid-wrap.
export default function TechnologyHero() {
  return (
    <section className="tech-hero" id="home">
      <div className="tech-hero-overlay" />
    </section>
  );
}
