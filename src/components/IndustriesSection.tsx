type Industry = { name: string; image: string; logo?: string };
type Slide = { left: Industry; right: Industry };

const SLIDES: Slide[] = [
  {
    left: {
      name: "Nutraceutical & Dietary Supplements",
      image: "/industry-nutraceutical-v2.jpeg",
      logo: "/logo-nutraceutical.png",
    },
    right: {
      name: "Functional Foods & Beverages",
      image: "/industry-functional-foods-v2.jpeg",
      logo: "/logo-functional-foods.png",
    },
  },
  {
    left: {
      name: "Sports Nutrition",
      image: "/industry-sports-v2.jpeg",
      logo: "/logo-sports.png",
    },
    right: {
      // was wrongly pointed at the flask+gears logo before — that one is
      // actually Contract Manufacturers & Formulators's logo, not Pharma's
      name: "Pharmaceutical & Healthcare",
      image: "/industry-pharma-v2.jpeg",
      logo: "/logo-pharma.png",
    },
  },
  {
    left: {
      name: "Beauty & Nutricosmetics",
      image: "/industry-beauty-v2.jpeg",
      logo: "/logo-beauty.png",
    },
    // the \n forces this onto exactly 2 lines without touching the
    // notch's own max-width
    right: {
      name: "Ingredient Manufacturers\n& Suppliers",
      image: "/industry-ingredient-mfrs-v2.jpeg",
      logo: "/logo-ingredient-mfrs.png",
    },
  },
  {
    left: {
      name: "Botanical Growers & Extract Producers",
      image: "/industry-botanical-v2.jpeg",
      logo: "/logo-botanical.png",
    },
    right: {
      name: "Contract Manufacturers & Formulators",
      image: "/industry-contract-mfrs-v2.jpeg",
      logo: "/logo-contract-mfrs.png",
    },
  },
];

// renders an embedded \n as a manual line break — used to force a
// specific industry name onto exactly 2 lines without touching the
// notch's own max-width (which would resize every card, not just one)
function NameText({ name }: { name: string }) {
  const lines = name.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

// each slide pins to the top of the viewport (plain position:sticky, no
// scroll-jack JS, no negative margins on any ancestor) — later slides sit
// later in the DOM, so they simply paint over the earlier ones as the user
// scrolls past, giving a full picture-over-picture overlap for free with
// no custom animation code to get wrong.
export default function IndustriesSection() {
  return (
    <section className="ind-section" id="industries">
      <p className="ind-heading">
        INDUSTRIES <strong>WE SERVE</strong>
      </p>

      <div className="ind-stack">
        {SLIDES.map((slide, i) => (
          <div className="ind-slide" key={slide.left.name} style={{ zIndex: i + 1 }}>
            <div className="ind-slide-half">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.left.image} alt={slide.left.name} />
              <div className="ind-slide-card">
                <div className="ind-slide-notch">
                  <p>
                    <NameText name={slide.left.name} />
                  </p>
                </div>
                <div className="ind-slide-panel">
                  {slide.left.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="ind-slide-logo" src={slide.left.logo} alt="" />
                  )}
                </div>
              </div>
            </div>

            <div className="ind-slide-divider" />

            <div className="ind-slide-half">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.right.image} alt={slide.right.name.replace("\n", " ")} />
              <div className="ind-slide-card ind-slide-card--right">
                <div className="ind-slide-notch">
                  <p>
                    <NameText name={slide.right.name} />
                  </p>
                </div>
                <div className="ind-slide-panel">
                  {slide.right.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="ind-slide-logo" src={slide.right.logo} alt="" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
