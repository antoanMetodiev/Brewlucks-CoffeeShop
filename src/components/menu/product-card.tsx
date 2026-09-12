"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import type { Localized } from "@/i18n/dictionaries";
import { currency, formatPrice, imageVariant, productHref } from "@/lib/catalog/format";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Product;
  sectionTitle?: Localized;
  sizes?: string;
  className?: string;
};

const MAX_CHIPS = 4;

export function ProductCard({
  product,
  sectionTitle,
  sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw",
  className = "",
}: Props) {
  const { t, lang } = useLanguage();
  const chips = product.ingredients.slice(0, MAX_CHIPS);
  const extra = product.ingredients.length - chips.length;
  const meta = [product.origin, product.glass].filter(Boolean).join(" · ");

  return (
    <Link
      href={productHref(product.kind, product.id)}
      className={`group block transition-transform duration-500 ease-editorial hover:-translate-y-1.5 focus-visible:-translate-y-1.5 ${className}`}
      aria-label={`${t.menu.viewItem}: ${product.name}`}
    >
      <div className="photo-frame relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface transition-shadow duration-500 ease-editorial group-hover:shadow-[0_0_0_1px_rgba(203,131,85,0.55),0_32px_64px_-24px_rgba(203,131,85,0.35)]">
        <Image
          src={imageVariant(product.image, "medium")}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover brightness-90 transition-transform duration-700 ease-editorial group-hover:scale-[1.08]"
        />

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {product.signature ? (
            <span className="rounded-full bg-bg/80 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] text-accent backdrop-blur">
              {t.menu.signature}
            </span>
          ) : (
            <span />
          )}
          {sectionTitle && (
            <span className="rounded-full bg-bg/70 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] text-muted backdrop-blur">
              {sectionTitle[lang]}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-bg via-bg/85 to-transparent p-4 pt-14 opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {chips.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {chips.map((ingredient, index) => (
                <li
                  key={ingredient}
                  style={{ transitionDelay: `${60 + index * 40}ms` }}
                  className="translate-y-2 rounded-full border border-fg/15 bg-bg/60 px-2.5 py-1 text-[0.6875rem] text-fg opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  {ingredient}
                </li>
              ))}
              {extra > 0 && (
                <li
                  style={{ transitionDelay: `${60 + chips.length * 40}ms` }}
                  className="translate-y-2 rounded-full px-2 py-1 text-[0.6875rem] text-muted opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                >
                  +{extra}
                </li>
              )}
            </ul>
          )}
          <p className="mt-3 flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] text-accent">
            {t.menu.details}
            <span className="inline-block transition-transform duration-500 ease-editorial group-hover:translate-x-1">→</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg leading-snug transition-colors duration-300 group-hover:text-accent">
          {product.name}
        </h3>
        <span className="shrink-0 text-sm tabular-nums text-muted transition-colors duration-300 group-hover:text-fg">
          {formatPrice(product.price)} {currency[lang]}
        </span>
      </div>
      <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-muted/80">
        {meta && <span>{meta}</span>}
        {meta && product.ingredients.length > 0 && <span className="mx-2 text-border">·</span>}
        {product.ingredients.length > 0 && (
          <span className="tabular-nums">
            {product.ingredients.length} {t.menu.ingredientsLabel}
          </span>
        )}
      </p>
    </Link>
  );
}
