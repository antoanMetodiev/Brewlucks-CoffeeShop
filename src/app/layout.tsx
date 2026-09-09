import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/language-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
    default: "Bistro & Jars",
    template: "%s — Bistro & Jars",
  },
  description: "Kafa, hrana i sporo jutro u srcu grada. — Coffee, food and slow mornings in the heart of the city.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        <LanguageProvider>
          <Header />
          <main className="min-h-dvh">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
