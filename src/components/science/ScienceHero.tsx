// full-bleed lab photo banner at the top of the science page — BioactivesIntro
// (the next section) wraps up over its bottom edge via a static negative
// margin, same overlap technique as Hero -> About Us.
export default function ScienceHero() {
  return (
    <section className="science-hero" id="home">
      <div className="science-hero-overlay" />
    </section>
  );
}
