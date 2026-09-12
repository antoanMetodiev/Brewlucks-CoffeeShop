"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import type { Dictionary } from "@/i18n/dictionaries";
import { venuePhotos } from "@/content/gallery";
import { productHref } from "@/lib/catalog/format";
import type { Product } from "@/lib/catalog/types";

type Group = "food" | "drinks" | "venue";
type Filter = "all" | Group;

type GalleryItem = {
  key: string;
  group: Group;
  src: string | StaticImageData;
  caption: string;
  href?: string;
};

const filters: { id: Filter; label: (t: Dictionary) => string }[] = [
  { id: "all", label: (t) => t.gallery.filterAll },
  { id: "food", label: (t) => t.gallery.filterFood },
  { id: "drinks", label: (t) => t.gallery.filterDrinks },
  { id: "venue", label: (t) => t.gallery.filterVenue },
];

// Interleave venue photos with product shots so the wall does not split into two blocks.
function weave<T>(a: T[], b: T[]) {
  const result: T[] = [];
  const longest = Math.max(a.length, b.length);
  for (let index = 0; index < longest; index++) {
    if (a[index]) result.push(a[index]);
    if (b[index]) result.push(b[index]);
  }
  return result;
}

export function GalleryView({ products }: { products: Product[] }) {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, lang } = useLanguage();

  const items = useMemo<GalleryItem[]>(() => {
    const venue: GalleryItem[] = venuePhotos.map((photo, index) => ({
      key: `venue-${index}`,
      group: "venue",
      src: photo.image,
      caption: photo.caption[lang],
    }));
    const shots: GalleryItem[] = products.map((product) => ({
      key: `${product.kind}-${product.id}`,
      group: product.kind === "meal" ? "food" : "drinks",
      src: product.image,
      caption: product.name,
      href: productHref(product.kind, product.id),
    }));
    const all = weave(venue, shots);
    return filter === "all" ? all : all.filter((item) => item.group === filter);
  }, [products, filter, lang]);

  const close = useCallback(() => setActiveIndex(null), []);

  const step = useCallback(
    (direction: number) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        return (current + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.batch("[data-gallery-item]", {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.08,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [lang, filter], revertOnUpdate: true },
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [activeIndex, close, step]);

  const active = activeIndex === null ? null : items[activeIndex];

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[110rem] px-6 pb-12 pt-32 md:px-10">
        <p className="eyebrow">Brewlucks</p>
        <h1 className="mt-6 font-display text-headline font-normal">{t.nav.gallery}</h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t.gallery.intro}</p>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label={t.menu.categories}>
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={filter === option.id}
              onClick={() => {
                setFilter(option.id);
                setActiveIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-400 ease-soft ${
                filter === option.id
                  ? "bg-elevated text-accent"
                  : "text-muted hover:bg-surface hover:text-fg"
              }`}
            >
              {option.label(t)}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[110rem] px-6 pb-28 md:px-10 md:pb-40">
        <div key={filter} className="columns-2 gap-4 sm:columns-3 md:gap-6 lg:columns-4 xl:columns-5">
          {items.map((item, index) => (
            <figure key={item.key} data-gallery-item className="mb-4 break-inside-avoid md:mb-6">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${t.gallery.open} — ${item.caption}`}
                className="photo-frame group block w-full overflow-hidden rounded-2xl bg-surface"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  {...(typeof item.src === "string" ? { width: 700, height: 700 } : { placeholder: "blur" as const })}
                  sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 48vw"
                  className="h-auto w-full brightness-90 transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                />
              </button>
              <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-sm leading-relaxed text-muted">
                <span>{item.caption}</span>
                {item.href && (
                  <Link
                    href={item.href}
                    className="shrink-0 text-[0.6875rem] uppercase tracking-[0.18em] text-accent"
                  >
                    {t.menu.viewItem} →
                  </Link>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {activeIndex !== null && active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-bg/95 px-6 py-20 backdrop-blur-xl"
        >
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            aria-label={t.gallery.close}
            className="absolute right-6 top-6 rounded-full border border-border px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent md:right-10 md:top-10"
          >
            {t.gallery.close}
          </button>

          <Image
            src={active.src}
            alt={active.caption}
            {...(typeof active.src === "string" ? { width: 700, height: 700 } : {})}
            sizes="(min-width: 768px) 42rem, 100vw"
            onClick={(event) => event.stopPropagation()}
            className="photo-frame h-auto max-h-[68vh] w-full max-w-2xl rounded-2xl object-contain brightness-90"
          />

          <div
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-8 text-sm"
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t.gallery.previous}
              className="text-muted transition-colors duration-300 hover:text-accent"
            >
              ←
            </button>
            <p className="max-w-md text-center text-muted">
              {active.caption}
              {active.href && (
                <>
                  {" "}
                  <Link href={active.href} className="text-accent underline underline-offset-4">
                    {t.menu.viewItem} →
                  </Link>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t.gallery.next}
              className="text-muted transition-colors duration-300 hover:text-accent"
            >
              →
            </button>
          </div>

          <p className="text-[0.6875rem] tracking-[0.18em] text-muted tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} —{" "}
            {String(items.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
