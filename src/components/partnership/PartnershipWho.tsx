type Point = { title: string; desc: string };

const LEFT_POINTS: Point[] = [
  {
    title: "Growers & Botanical Suppliers",
    desc: "Preserve and unlock the value of bioactive-rich raw materials.",
  },
  {
    title: "Ingredient Manufacturers",
    desc: "Develop differentiated, higher-value functional ingredients.",
  },
  {
    title: "Brands & Product Developers",
    desc: "Solve formulation and delivery challenges.",
  },
];

const RIGHT_POINTS: Point[] = [
  {
    title: "Food & Beverage Companies",
    desc: "Develop stable, functional, application-ready ingredients.",
  },
  {
    title: "Pharmaceutical & Nutraceutical Companies",
    desc: "Engineer advanced delivery systems for bioactive compounds.",
  },
  {
    title: "Research & Academic Partners",
    desc: "Generate scientific evidence and develop new technologies.",
  },
];

// "Who We Partner With" — three points on either side of a centered
// photo, covering every stage of the ingredient value chain.
export default function PartnershipWho() {
  return (
    <section className="partnership-who">
      <h2 className="partnership-who-heading reveal-up">Who We Partner With</h2>
      <p className="partnership-who-subheading reveal-up">Built for Every Stage of the Ingredient Value Chain</p>

      <div className="partnership-who-body">
        <div className="partnership-who-points partnership-who-points--left reveal-left">
          {LEFT_POINTS.map((p) => (
            <div className="partnership-who-point" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="partnership-who-image-wrap">
          {/* lazy so that when the phone breakpoint hides its wrapper, the
              browser never fetches it either — this is a server component,
              so it can't branch on useIsMobile without shipping JS for it */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/partnership-who.jpeg"
            alt="Raw botanical ingredients alongside a lab-processed bioactive extract"
            className="partnership-who-image"
            loading="lazy"
          />
        </div>

        <div className="partnership-who-points partnership-who-points--right reveal-right">
          {RIGHT_POINTS.map((p) => (
            <div className="partnership-who-point" key={p.title}>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
