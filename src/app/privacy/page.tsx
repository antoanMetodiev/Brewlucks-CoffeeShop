import type { Metadata } from "next";
import { PrivacyView } from "@/components/privacy/privacy-view";

export const metadata: Metadata = {
  title: "Политика за поверителност",
  description: "How Brewlucks collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
