import type { Metadata } from "next";
import { GalleryView } from "@/components/gallery/gallery-view";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Tanjiri, čaše i uglovi koje najčešće pamtite. — A look inside Bistro & Jars.",
};

export default function GalleryPage() {
  return <GalleryView />;
}
