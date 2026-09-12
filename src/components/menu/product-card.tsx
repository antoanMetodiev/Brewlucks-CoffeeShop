"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { currency, formatPrice, imageVariant, productHref } from "@/lib/catalog/format";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Product;
  sizes?: string;
  className?: string;
};

export function ProductCard({ product, sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw", className = "" }: Props) {
  const { t, lang } = useLanguage();

  return (
    <Link
      href={productHref(product.kind, product.id)}
      className={`group block ${className}`}
      aria-label={`${t.menu.viewItem}: ${product.name}`}
    >
      <div className="photo-frame relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        <Image
          src={imageVariant(product.image, "medium")}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover brightness-90 transition-transform duration-700 ease-editorial group-hover:scale-[1.05]"
        />
        {product.signature && (
          <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] text-accent backdrop-blur">
            {t.menu.signature}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg leading-snug transition-colors duration-300 group-hover:text-accent">
          {product.name}
        </h3>
        <span className="shrink-0 text-sm tabular-nums text-muted">
          {formatPrice(product.price)} {currency[lang]}
        </span>
      </div>
      {product.origin && (
        <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-muted/80">{product.origin}</p>
      )}
    </Link>
  );
}
