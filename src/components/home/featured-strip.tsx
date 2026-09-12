"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import type { Product } from "@/lib/catalog/types";
import { ProductCarousel } from "@/components/menu/product-carousel";

export function FeaturedStrip({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <ProductCarousel
      products={products}
      header={
        <div data-reveal>
          <p className="eyebrow">{t.home.featuredEyebrow}</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-headline font-normal">
            {t.home.featuredTitle}
          </h2>
          <Link
            href="/menu"
            className="mt-5 inline-block text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:text-accent hover:decoration-accent"
          >
            {t.home.featuredCta} →
          </Link>
        </div>
      }
    />
  );
}
