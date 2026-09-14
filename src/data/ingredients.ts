// Sourced from "SowTrap - Product list.xlsx" — used to seed the hero rain glyphs
// and, later, the Products page filters.
export const INGREDIENT_NAMES = [
  "AHCC", "Acetyl-L-carnitine", "Anserine", "Arginine", "Ascorbic Acid", "Ashwagandha",
  "Astaxanthin", "Beetroot", "Bio-enhancers", "Biotin", "Black pepper", "Black seed oil",
  "CLA", "Ca-AKG", "Carnisone", "Cholecalciferol", "Chromium picolinate", "Cinnamon oil",
  "Collagen", "Copper Chloride", "Copper gluconate", "Creatine Monohydrate", "Curcumin",
  "Curry leaf oil", "Cyanocobalamin", "Decapeptides", "ErgoCalciferol", "Fenugreek",
  "Ferrous bisglycinate", "Ferrous gluconate", "Ferrous pyrophosphate", "Folic acid",
  "Gingerols", "Glucosamine", "Glutamic Acid", "Glutathione", "Glycine", "Green Tea",
  "Inositol", "Inulin", "L-Citrulene", "L-Ergothioneine", "L-theanine Nat", "Lactoferricin",
  "Lactotripeptides", "Linalool oil", "Lunasin", "Lutein", "MCT oil", "Magnesium Bisglycinate",
  "Magnesium Gluconate", "Magnesium citrate", "Menaquinone", "Menatetrenone", "Mint oil",
  "Mixed Tocopherol", "Nat caffeine", "Neem oil", "Nicotinamide Riboside", "NMN", "Omega-3",
  "Pantothenic acid", "Paraxanthine", "Piperine extract", "Pomegranate peel", "Probiotics",
  "Pyridoxine", "Raw banana", "Resveratrol", "Retinol", "Retinyl acetate", "Retinyl palmitate",
  "Rhodiola rosavins", "Riboflavin", "Saffron", "Sea buckthorn", "Sodium selenate", "Taurine",
  "Theanine", "Thiamine", "Tulsi", "Urolithin A", "Zea xanthin", "Zinc Citrate", "Zinc gluconate",
  "Zinc lactate",
] as const;

export const INGREDIENT_GLYPHS = Array.from(
  new Set(INGREDIENT_NAMES.join("").toUpperCase().replace(/[^A-Z]/g, "").split(""))
);
