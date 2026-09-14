import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import IndicationDetail from "@/components/products/IndicationDetail";
import FooterCTA from "@/components/FooterCTA";
import {
  HEALTH_BENEFIT_ORDER,
  getHealthBenefitBySlug,
  getHealthBenefitSlug,
  getProductsByHealthBenefit,
} from "@/lib/products";

export function generateStaticParams() {
  return HEALTH_BENEFIT_ORDER.map((b) => getHealthBenefitSlug(b))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const benefit = getHealthBenefitBySlug(slug);
  if (!benefit) return { title: "Health Benefit | SowTrap™" };
  return {
    title: `${benefit} | SowTrap™`,
    description: `Encapsulated SowTrap™ ingredients formulated to support ${benefit.toLowerCase()}.`,
  };
}

export default async function IndicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const benefit = getHealthBenefitBySlug(slug);
  if (!benefit) notFound();

  const products = getProductsByHealthBenefit(benefit);

  return (
    <>
      <Nav />
      <ScrollReveal />

      <IndicationDetail benefit={benefit} products={products} />

      <FooterCTA />
    </>
  );
}
