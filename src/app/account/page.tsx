import type { Metadata } from "next";
import { AccountView } from "@/components/auth/account-view";
import { getCatalog } from "@/lib/catalog/catalog";

export const metadata: Metadata = {
  title: "Моят акаунт",
  description: "Your Brewlucks account and favorites.",
};

export default async function AccountPage() {
  const catalog = await getCatalog();
  const products = catalog.flatMap((section) => section.products);
  return <AccountView products={products} />;
}
