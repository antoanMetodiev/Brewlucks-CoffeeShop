import type { Metadata } from "next";
import { PrivacyView } from "@/components/privacy/privacy-view";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: "How Bistro & Jars collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
