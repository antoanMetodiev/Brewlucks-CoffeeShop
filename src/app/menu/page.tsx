import type { Metadata } from "next";
import { MenuView } from "@/components/menu/menu-view";

export const metadata: Metadata = {
  title: "Meni",
  description:
    "Kafa iz malih serija, doručak po porudžbini i tegle koje punimo svakog jutra. — The full Bistro & Jars menu.",
};

export default function MenuPage() {
  return <MenuView />;
}
