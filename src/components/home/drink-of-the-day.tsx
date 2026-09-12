"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { currency, formatPrice, productHref } from "@/lib/catalog/format";
import type { ProductDetail } from "@/lib/catalog/types";

export function DrinkOfTheDay({ drink }: { drink: ProductDetail }) {
  const { t, lang } = useLanguage();

  return (
    <section className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20">
        <div data-reveal className="md:sticky md:top-32 md:self-start">
          <div className="photo-frame relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
            <Image
              src={drink.image}
              alt={drink.name}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover brightness-90"
            />
          </div>
        </div>

        <div>
          <div data-reveal>
            <p className="eyebrow">{t.home.drinkEyebrow}</p>
            <h2 className="mt-5 font-display text-headline font-normal">{drink.name}</h2>
            <p className="mt-4 font-display text-title text-accent tabular-nums">
              {formatPrice(drink.price)} {currency[lang]}
            </p>
          </div>

          <div data-reveal className="mt-12">
            <p className="eyebrow">{t.home.drinkIngredients}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {drink.ingredients.map((ingredient) => (
                <li
                  key={ingredient.name}
                  className="rounded-full border border-border px-4 py-2 text-sm text-fg"
                >
                  {ingredient.name}
                  {ingredient.measure && <span className="text-muted"> · {ingredient.measure}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="mt-12">
            <p className="eyebrow">{t.home.drinkTitle}</p>
            <ol className="mt-6 space-y-6">
              {drink.steps.map((step, index) => (
                <li key={index} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-border pt-5">
                  <span className="font-display text-lg text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div data-reveal className="mt-12">
            <Link
              href={productHref(drink.kind, drink.id)}
              className="inline-block rounded-full border border-border px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
            >
              {t.home.drinkCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
