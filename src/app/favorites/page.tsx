import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites/favorites-view";
import { getCatalog } from "@/lib/catalog/catalog";

export const metadata: Metadata = {
  title: "Любими",
  description: "Your favorite dishes and drinks at Brewlucks.",
};

export default async function FavoritesPage() {
  const catalog = await getCatalog();
  const products = catalog.flatMap((section) => section.products);
  return <FavoritesView products={products} />;
}
