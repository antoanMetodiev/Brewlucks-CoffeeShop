"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import type { Product } from "@/lib/catalog/types";
import { ProductCard } from "@/components/menu/product-card";

export function FeaturedStrip({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[110rem] px-6 py-24 md:px-10 md:py-32">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.home.featuredEyebrow}</p>
            <h2 className="mt-5 max-w-[18ch] font-display text-headline font-normal">
              {t.home.featuredTitle}
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:text-accent hover:decoration-accent"
          >
            {t.home.featuredCta} →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[110rem] pb-24 md:pb-32">
        <div
          data-reveal
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:gap-8 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[68vw] shrink-0 snap-start sm:w-[40vw] md:w-[26vw] lg:w-[19vw]">
              <ProductCard product={product} sizes="(min-width: 1024px) 19vw, (min-width: 768px) 26vw, 68vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
