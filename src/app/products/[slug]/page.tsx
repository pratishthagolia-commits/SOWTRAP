import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import ProductDetail from "@/components/products/ProductDetail";
import FooterCTA from "@/components/FooterCTA";
import { getAllProducts, getProductBySlug, getProductsByCategory } from "@/lib/products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | SowTrap™" };
  return {
    title: `${product.name} | SowTrap™`,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <Nav />
      <ScrollReveal />

      <ProductDetail product={product} related={related} />

      <FooterCTA />
    </>
  );
}
