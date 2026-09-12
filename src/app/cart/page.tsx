import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Количка",
  description: "Your Brewlucks cart.",
};

export default function CartPage() {
  return <CartView />;
}
