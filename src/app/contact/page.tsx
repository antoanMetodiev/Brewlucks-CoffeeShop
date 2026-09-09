import type { Metadata } from "next";
import { ContactView } from "@/components/contact/contact-view";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Reserve a table or send an inquiry to Bistro & Jars.",
};

export default function ContactPage() {
  return <ContactView />;
}
