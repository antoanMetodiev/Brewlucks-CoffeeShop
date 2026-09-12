import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/menu/product-view";
import { getCatalog, getProduct } from "@/lib/catalog/catalog";
import type { ProductKind } from "@/lib/catalog/types";

type Params = Promise<{ kind: string; id: string }>;

function asKind(kind: string): ProductKind | null {
  return kind === "meal" || kind === "drink" ? kind : null;
}

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.flatMap((section) =>
    section.products.map((product) => ({ kind: product.kind, id: product.id })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { kind, id } = await params;
  const productKind = asKind(kind);
  const product = productKind ? await getProduct(productKind, id) : null;
  if (!product) return { title: "Меню" };
  return {
    title: product.name,
    description: product.ingredients.map((ingredient) => ingredient.name).join(", "),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { kind, id } = await params;
  const productKind = asKind(kind);
  if (!productKind) notFound();

  const product = await getProduct(productKind, id);
  if (!product) notFound();

  const catalog = await getCatalog();
  const section = catalog.find((candidate) => candidate.id === product.sectionId);
  const related = (section?.products ?? []).filter((candidate) => candidate.id !== product.id).slice(0, 4);

  return <ProductView product={product} sectionTitle={section?.title} related={related} />;
}
