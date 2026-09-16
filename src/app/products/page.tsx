import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import ProductsHeroPhoto from "@/components/products/ProductsHeroPhoto";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsBrowser from "@/components/products/ProductsBrowser";
import ProductsFAQ from "@/components/products/ProductsFAQ";
import FooterCTA from "@/components/FooterCTA";

export const metadata: Metadata = {
  title: "Products | SowTrap™",
  description: "SowTrap™'s encapsulated ingredient portfolio — herbal extracts, vitamins, minerals, bioactives, biopeptides, and microbial ingredients.",
};

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <ScrollReveal />

      <ProductsHeroPhoto />

      <ProductsHero />

      <Suspense fallback={null}>
        <ProductsBrowser />
      </Suspense>

      <ProductsFAQ />

      <FooterCTA />
    </>
  );
}
