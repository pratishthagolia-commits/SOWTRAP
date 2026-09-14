// full-screen photo banner, same pattern as PartnershipHero — PartnershipTouch
// (the next section) wraps up over its bottom edge via a scroll-tracked
// margin, covering it with the "Get in touch" content panel as the user
// scrolls, instead of the illustration sitting inline at a fixed height.
export default function PartnershipTouchHero() {
  return (
    <section className="partnership-touch-hero">
      <div className="partnership-touch-hero-overlay" />
    </section>
  );
}
