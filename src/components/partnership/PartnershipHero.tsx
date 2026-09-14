// full-screen photo banner, same pattern as ScienceHero/TechnologyHero —
// PartnershipIntro (the next section) wraps up over its bottom edge via a
// scroll-tracked margin, and the "PARTNERSHIP" title tab lives there too
// so it rides up together with the panel instead of staying pinned here.
export default function PartnershipHero() {
  return (
    <section className="partnership-hero" id="home">
      <div className="partnership-hero-overlay" />
    </section>
  );
}
