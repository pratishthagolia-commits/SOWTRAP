import rawProducts from "@/data/products.json";
import rawIndications from "@/data/indications.json";

export type Product = {
  category: string;
  name: string;
  slug: string;
  description: string;
  bioactives: string[];
  naturalSources: string[];
  healthBenefits: string[];
  image: string | null;
  // only set for Bioactives products — its Product Type sub-filter
  productType?: "Functional Oils" | "Amino Acids" | "Functional Ingredients";
  // binomial from "Herbal Extracts- biological name.docx" — only the
  // Herbal Extracts category has one
  scientificName?: string;
};

// order per the "Website structure - SowTrap.docx" filter spec, rather
// than alphabetically
export const CATEGORY_ORDER = [
  "Herbal Extracts",
  "Vitamins",
  "Minerals",
  "Bioactives",
  "Biopeptides",
  "Micro-organisms",
] as const;

// Bioactives-only sub-filter (Product Type), derived from the "Product
// Type" sheet in SowTrap - Product list.xlsx — Functional oils and Amino
// acids are the explicit matches from that sheet; Functional Ingredients
// is the catch-all for everything else in Bioactives, same as it already
// was the largest bucket on that sheet
export const PRODUCT_TYPE_ORDER = ["Functional Oils", "Amino Acids", "Functional Ingredients"] as const;

// the 18 indication categories from the "Indication-wise Classification"
// sheet in SowTrap - Product list.xlsx — every product's healthBenefits
// were normalized onto this exact set during data cleanup, so this list
// is authoritative (not derived from whatever strings happen to appear)
export const HEALTH_BENEFIT_ORDER = [
  "Immunity Support",
  "Energy & Vitality",
  "Cognitive Health",
  "Bone & Joint Health",
  "Heart Health",
  "Skin Radiance",
  "Hair & Nail Support",
  "Eye Health",
  "Women’s Wellness",
  "Men’s Health",
  "Stress & Mood Balance",
  "Sports Recovery",
  "Sleep & Relaxation",
  "Detox & Liver Support",
  "Weight Management",
  "Bioenhancers",
  "Gut Health",
  "Menopause",
] as const;

// one icon per indication (from the client's "indicationlogos" folder),
// keyed by the exact HEALTH_BENEFIT_ORDER label so a lookup never
// silently falls through to a wrong icon
export const HEALTH_BENEFIT_ICONS: Record<(typeof HEALTH_BENEFIT_ORDER)[number], string> = {
  "Immunity Support": "/images/indications/immunity-support.png",
  "Energy & Vitality": "/images/indications/energy-vitality.png",
  "Cognitive Health": "/images/indications/cognitive-health.png",
  "Bone & Joint Health": "/images/indications/bone-joint-health.png",
  "Heart Health": "/images/indications/heart-health.png",
  "Skin Radiance": "/images/indications/skin-radiance.png",
  "Hair & Nail Support": "/images/indications/hair-nail-support.png",
  "Eye Health": "/images/indications/eye-health.png",
  "Women’s Wellness": "/images/indications/womens-wellness.png",
  "Men’s Health": "/images/indications/mens-health.png",
  "Stress & Mood Balance": "/images/indications/stress-mood-balance.png",
  "Sports Recovery": "/images/indications/sports-recovery.png",
  "Sleep & Relaxation": "/images/indications/sleep-relaxation.png",
  "Detox & Liver Support": "/images/indications/detox-liver-support.png",
  "Weight Management": "/images/indications/weight-management.png",
  Bioenhancers: "/images/indications/bioenhancers.png",
  "Gut Health": "/images/indications/gut-health.png",
  Menopause: "/images/indications/menopause.png",
};

export const PRODUCTS: Product[] = rawProducts as Product[];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  const present = new Set(PRODUCTS.map((p) => p.category));
  return CATEGORY_ORDER.filter((c) => present.has(c));
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getHealthBenefits(): string[] {
  const present = new Set(PRODUCTS.flatMap((p) => p.healthBenefits));
  return HEALTH_BENEFIT_ORDER.filter((b) => present.has(b));
}

export function getHealthBenefitIcon(benefit: string): string | undefined {
  return (HEALTH_BENEFIT_ICONS as Record<string, string>)[benefit];
}

// derived from the icon path rather than a second hand-written map, so
// the URL slug and the icon file can never drift out of sync
export function getHealthBenefitSlug(benefit: string): string | undefined {
  return getHealthBenefitIcon(benefit)?.split("/").pop()?.replace(/\.png$/, "");
}

export function getHealthBenefitBySlug(slug: string): string | undefined {
  return HEALTH_BENEFIT_ORDER.find((b) => getHealthBenefitSlug(b) === slug);
}

export function getProductsByHealthBenefit(benefit: string): Product[] {
  return PRODUCTS.filter((p) => p.healthBenefits.includes(benefit));
}

// per-indication marketing copy from "Updated - SowTrap product
// details.docx" (the "Indications" table), shown on each benefit's own
// dedicated page
export function getHealthBenefitDescription(benefit: string): string | undefined {
  return (rawIndications as Record<string, string>)[benefit];
}

export function getProductTypes(): string[] {
  const present = new Set(PRODUCTS.map((p) => p.productType).filter(Boolean));
  return PRODUCT_TYPE_ORDER.filter((t) => present.has(t));
}
