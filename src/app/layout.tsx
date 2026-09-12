import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/language-provider";
import { CartProvider } from "@/lib/cart/cart-provider";
import { FavoritesProvider } from "@/lib/supabase/favorites-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCatalog } from "@/lib/catalog/catalog";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-family",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brewlucks",
    template: "%s - Brewlucks",
  },
  description: "Кафе, храна и бавни сутрини в сърцето на София. — Coffee, food and slow mornings in the heart of the city.",
  icons: {
    icon: "/images/brewlucks-logo.jpg",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalog();
  const footerSections = catalog.map((section) => ({ id: section.id, title: section.title }));

  return (
    <html lang="bg" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        <LanguageProvider>
          <FavoritesProvider>
            <CartProvider>
              <Header />
              <main className="min-h-dvh">{children}</main>
              <Footer sections={footerSections} />
            </CartProvider>
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
