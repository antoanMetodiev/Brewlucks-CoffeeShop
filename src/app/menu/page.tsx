import type { Metadata } from "next";
import { MenuView } from "@/components/menu/menu-view";
import { getCatalog } from "@/lib/catalog/catalog";

export const metadata: Metadata = {
  title: "Меню",
  description:
    "Закуска, основни, паста, десерти, кафе и напитки. — The full Bistro & Jars menu, with photos.",
};

export default async function MenuPage() {
  const catalog = await getCatalog();
  return <MenuView catalog={catalog} />;
}
