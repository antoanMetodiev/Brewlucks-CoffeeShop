import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/gallery-view";
import { getCatalog } from "@/lib/catalog/catalog";

export const metadata: Metadata = {
  title: "Галерия",
  description: "Чиниите, чашите и ъглите, които най-често помните. — A look inside Bistro & Jars.",
};

const PER_SECTION = 2;

export default async function GalleryPage() {
  const catalog = await getCatalog();
  const products = catalog.flatMap((section) => section.products.slice(0, PER_SECTION));
  return <GalleryView products={products} />;
}
