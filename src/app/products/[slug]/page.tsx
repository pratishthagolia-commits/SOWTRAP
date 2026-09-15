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

      {/* keyed on slug so navigating from one product to another (client-side,
          no full page reload) forces React to unmount and remount this whole
          subtree — otherwise it just patches the existing DOM nodes' src/text
          in place, and their .reveal classes (already flipped to .in-view
          from the previous product) would never re-trigger the fade-in */}
      <ProductDetail product={product} related={related} key={product.slug} />

      <FooterCTA />
    </>
  );
}
