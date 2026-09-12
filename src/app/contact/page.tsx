import type { Metadata } from "next";
import { ContactView } from "@/components/contact/contact-view";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Reserve a table or send an inquiry to Brewlucks.",
};

export default function ContactPage() {
  return <ContactView />;
}
