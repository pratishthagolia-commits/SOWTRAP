// full-screen photo banner, same pattern as ContactHeroPhoto/PartnershipHero
// — ProductsHero (the next section) wraps up over its bottom edge via a
// scroll-tracked margin, with the "PRODUCT" folder-notch tab riding up
// together with it.
export default function ProductsHeroPhoto() {
  return (
    <section className="products-hero-photo" id="home">
      <div className="products-hero-photo-overlay" />
    </section>
  );
}
