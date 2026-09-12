"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import type { Localized } from "@/i18n/dictionaries";
import { currency, formatPrice } from "@/lib/catalog/format";
import type { Product, ProductDetail } from "@/lib/catalog/types";
import { whatsappMessageUrl } from "@/lib/site";
import { AddToCartButton } from "./add-to-cart-button";
import { FavoriteButton } from "./favorite-button";
import { ProductCard } from "./product-card";

type Props = {
  product: ProductDetail;
  sectionTitle?: Localized;
  related: Product[];
};

export function ProductView({ product, sectionTitle, related }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-hero]",
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "power3.out", delay: 0.1 },
        );
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((group) => {
          gsap.fromTo(
            group.children,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: group, start: "top 85%" },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang, product.id], revertOnUpdate: true },
  );

  const orderUrl = whatsappMessageUrl(
    `${t.product.orderMessage} ${product.name} (${formatPrice(product.price)} ${currency[lang]})`,
  );

  const facts = [
    sectionTitle && { label: t.menu.categories, value: sectionTitle[lang] },
    product.origin && { label: t.product.origin, value: product.origin },
    product.glass && { label: t.product.glass, value: product.glass },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[110rem] px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36">
        <Link
          href="/menu"
          data-hero
          className="inline-block text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
        >
          ← {t.product.back}
        </Link>

        <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-20">
          <div
            data-hero
            className="photo-frame relative aspect-square overflow-hidden rounded-3xl bg-surface md:sticky md:top-32"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover brightness-90"
            />
          </div>

          <div>
            <div data-hero className="flex flex-wrap items-center gap-3">
              {product.signature && (
                <span className="rounded-full border border-accent/40 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] text-accent">
                  {t.menu.signature}
                </span>
              )}
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.2em] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 data-hero className="mt-6 font-display text-headline font-normal">
              {product.name}
            </h1>

            <p data-hero className="mt-6 font-display text-title text-accent tabular-nums">
              {formatPrice(product.price)} {currency[lang]}
            </p>

            {facts.length > 0 && (
              <dl data-hero className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="eyebrow">{fact.label}</dt>
                    <dd className="mt-2 text-sm text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div data-hero className="mt-10 flex flex-wrap gap-4">
              <a
                href={orderUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110"
              >
                {t.product.order}
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-border px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
              >
                {t.actions.reserve}
              </Link>
              <AddToCartButton product={product} />
              <FavoriteButton productId={`${product.kind}-${product.id}`} className="border border-border" />
            </div>

            <div data-reveal className="mt-16 border-t border-border pt-10">
              <p className="eyebrow">{t.product.ingredients}</p>
              <ul className="mt-6 divide-y divide-border">
                {product.ingredients.map((ingredient) => (
                  <li
                    key={`${ingredient.name}-${ingredient.measure}`}
                    className="flex items-baseline justify-between gap-6 py-3 text-sm"
                  >
                    <span className="text-fg">{ingredient.name}</span>
                    <span className="shrink-0 text-muted">{ingredient.measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.steps.length > 0 && (
              <div data-reveal className="mt-14 border-t border-border pt-10">
                <p className="eyebrow">{t.product.steps}</p>
                <ol className="mt-6 space-y-5">
                  {product.steps.map((step, index) => (
                    <li key={index} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
                      <span className="font-display text-lg text-accent tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-muted">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && sectionTitle && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[110rem] px-6 py-20 md:px-10 md:py-28">
            <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="font-display text-title font-normal">
                {t.product.more} {sectionTitle[lang].toLowerCase()}
              </h2>
              <Link
                href={`/menu#${product.sectionId}`}
                className="text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-accent hover:decoration-accent"
              >
                {t.home.featuredCta} →
              </Link>
            </div>
            <div data-reveal className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={`${item.kind}-${item.id}`} product={item} sizes="(min-width: 1024px) 22vw, 45vw" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
