"use client";

import { useState } from "react";

type MaterialClass = { num: string; title: string; materials: string; overview: string[] };

const MATERIALS: MaterialClass[] = [
  {
    num: "01",
    title: "Protein Matrices",
    materials: "Pea Protein • Rice Protein • Caseinates",
    overview: [
      "Natural emulsifying and film-forming properties",
      "Interfacial activity supporting oil-in-water emulsion stabilization",
      "Protein–bioactive interactions through hydrophobic, electrostatic, and hydrogen-bonding interactions",
      "Formation of cohesive protective matrices around bioactives",
      "Suitable for both hydrophilic and lipophilic compounds, depending on formulation",
      "Protease-responsive matrix degradation can support gastrointestinal release",
    ],
  },
  {
    num: "02",
    title: "Carbohydrate Matrices",
    materials: "Gum Arabic • Modified Starches • Functional Polysaccharides",
    overview: [
      "Excellent film-forming and matrix-forming properties",
      "Good aqueous dispersibility and hydration behaviour",
      "Effective protection of sensitive compounds during processing and storage",
      "Broad compatibility with food and nutraceutical ingredients",
      "Particularly suitable for spray-dried powder systems",
      "Matrix composition can be tuned to modify moisture barrier and release characteristics",
      "Scalable and adaptable to continuous manufacturing processes",
    ],
  },
  {
    num: "03",
    title: "Hybrid Matrices",
    materials: "Protein + Carbohydrate Systems",
    overview: [
      "Combines protein emulsification and interfacial stabilization with carbohydrate film formation",
      "Tunable protein-to-carbohydrate ratio",
      "Improved structural integrity and environmental stability",
      "Can provide multi-stage or modified release behaviour",
      "Suitable for challenging or multifunctional bioactives",
      "Enables optimization of matrix properties for specific applications",
      "Compatible with multiple processing and product formats",
      "Customizable release kinetics",
      "Improved processing and storage stability",
      "Suitable for powders, capsules, tablets, gummies, beverages, and functional foods",
      "Allows formulation properties to be tailored to the target application",
    ],
  },
  {
    num: "04",
    title: "Lipids",
    materials: "Phospholipids • Lecithin • Medium-chain triglycerides (MCTs) • Solid lipids • Waxes",
    overview: [
      "Hydrophobic matrices provide an effective environment for lipophilic and poorly water-soluble bioactives",
      "Phospholipids provide amphiphilic properties that facilitate interaction with both aqueous and lipid phases",
      "Lipid matrices can form solid, liquid, or vesicular structures depending on composition and processing",
      "Supports controlled or sustained release through lipid matrix composition",
      "Can provide a protective barrier against water, oxidation, and environmental degradation",
      "Suitable for developing lipid-based delivery systems with enhanced dispersion and bio accessibility",
      "Improves delivery of poorly water-soluble and lipophilic bioactives",
      "Enhances dispersibility of selected lipid-soluble ingredients",
      "Provides opportunities for taste masking and improved sensory compatibility",
      "Suitable for applications in functional foods, nutraceuticals, beverages, capsules, and other delivery formats",
    ],
  },
];

// same exclusive-accordion curtain/blind pattern as TechEncapsulation and
// BioactivesIntro's "key classes" list — banner heading, click-to-expand
// items — but text-only (no photo gallery column) since there's no
// matching image set for these 4 material classes yet.
export default function TechMaterials() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
  }

  return (
    <section className="tech-materials">
      <p className="tech-materials-intro">
        At SowTrap&trade; encapsulation begins with intelligent matrix design. Rather than relying
        on a one-size-fits-all approach, we engineer customized coating systems based on the
        physicochemical properties of each bioactive, its stability requirements, target release
        profile, and intended application.
      </p>

      <h3 className="tech-materials-banner">
        Materials that <span className="tech-materials-banner-accent">shape delivery</span>
      </h3>

      <div className="tech-materials-list">
        {MATERIALS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div className={`tech-materials-item${isOpen ? " is-open" : ""}`} key={item.title}>
              <button type="button" className="tech-materials-item-head" onClick={() => toggle(i)}>
                <span className="tech-materials-item-title">{item.title}</span>
              </button>
              <div className="tech-materials-item-desc-wrap">
                <div className="tech-materials-item-desc-inner">
                  <p className="tech-materials-item-materials">
                    <strong>Materials:</strong> {item.materials}
                  </p>
                  <p className="tech-materials-item-overview-label">Matrix Overview</p>
                  <ul className="tech-materials-item-overview">
                    {item.overview.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
