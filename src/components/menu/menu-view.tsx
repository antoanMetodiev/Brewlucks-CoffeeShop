"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import type { Catalog, Product, ProductKind } from "@/lib/catalog/types";
import { ProductCard } from "./product-card";
import { ProductCarousel } from "./product-carousel";

type KindFilter = "all" | ProductKind;
type Sort = "category" | "price-asc" | "price-desc" | "name";

const HEADER_HEIGHT = 80;

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function MenuView({ catalog }: { catalog: Catalog }) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [sort, setSort] = useState<Sort>("category");
  const [activeId, setActiveId] = useState(catalog[0].id);
  const [showTop, setShowTop] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const chips = useRef<HTMLDivElement>(null);

  const totals = useMemo(() => {
    const all = catalog.flatMap((section) => section.products);
    return {
      dishes: all.filter((product) => product.kind === "meal").length,
      drinks: all.filter((product) => product.kind === "drink").length,
    };
  }, [catalog]);

  const signature = useMemo(
    () => catalog.flatMap((section) => section.products.filter((product) => product.signature)),
    [catalog],
  );

  const sectionTitles = useMemo(
    () => new Map(catalog.map((section) => [section.id, section.title])),
    [catalog],
  );

  const sections = useMemo(() => {
    const needle = normalize(query.trim());
    return catalog
      .filter((section) => kind === "all" || section.kind === kind)
      .map((section) => ({
        ...section,
        products: needle
          ? section.products.filter((product) => normalize(product.name).includes(needle))
          : section.products,
      }))
      .filter((section) => section.products.length > 0);
  }, [catalog, kind, query]);

  const flat = useMemo<Product[] | null>(() => {
    if (sort === "category") return null;
    const products = sections.flatMap((section) => section.products);
    if (sort === "price-asc") return [...products].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...products].sort((a, b) => b.price - a.price);
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [sections, sort]);

  const isDefaultView = !query.trim() && kind === "all" && sort === "category";
  const resultCount = sections.reduce((sum, section) => sum + section.products.length, 0);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (flat) return;
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element) => element !== null);
    if (elements.length === 0) return;

    const onScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      // A section counts as current once its heading has risen into the upper third of the
      // viewport — waiting for its top edge to clear the sticky bar highlights it far too late.
      const threshold = window.innerHeight * 0.35;
      const started = elements.filter((element) => element.getBoundingClientRect().top <= threshold);
      const current = reachedBottom ? elements.at(-1) : started.at(-1);
      setActiveId((current ?? elements[0]).id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections, flat]);

  useEffect(() => {
    const nav = chips.current;
    const chip = nav?.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (!nav || !chip) return;
    nav.scrollTo({
      left: chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  useGSAP(
    () => {
      if (!isDefaultView) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.batch("[data-gallery-item]", {
          start: "top 92%",
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang, isDefaultView], revertOnUpdate: true },
  );

  const jumpTo = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const offset = HEADER_HEIGHT + (toolbar.current?.offsetHeight ?? 0) + 16;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const kindOptions: { id: KindFilter; label: string }[] = [
    { id: "all", label: t.menu.all },
    { id: "meal", label: t.gallery.filterFood },
    { id: "drink", label: t.gallery.filterDrinks },
  ];

  const sortOptions: { id: Sort; label: string }[] = [
    { id: "category", label: t.menu.sortCategory },
    { id: "price-asc", label: t.menu.sortPriceAsc },
    { id: "price-desc", label: t.menu.sortPriceDesc },
    { id: "name", label: t.menu.sortName },
  ];

  const cardGrid = "grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 xl:grid-cols-4";

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[110rem] px-6 pb-12 pt-32 md:px-10 md:pb-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-end">
          <div>
            <p className="eyebrow">Brewlucks</p>
            <h1 className="mt-6 font-display text-display font-normal">{t.nav.menu}</h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t.menu.intro}</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 border-l border-border pl-6 md:pl-10">
            <div>
              <dt className="eyebrow">{t.menu.dishes}</dt>
              <dd className="mt-2 font-display text-title tabular-nums">{totals.dishes}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t.menu.drinks}</dt>
              <dd className="mt-2 font-display text-title tabular-nums">{totals.drinks}</dd>
            </div>
          </dl>
        </div>
      </section>

      {isDefaultView && (
        <ProductCarousel
          products={signature}
          header={
            <>
              <p className="eyebrow">{t.menu.picks}</p>
              <h2 className="mt-4 font-display text-headline font-normal">{t.menu.signature}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t.menu.picksBody}</p>
            </>
          }
        />
      )}

      <div ref={toolbar} className="sticky top-20 z-30 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[110rem] px-6 md:px-10">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-4">
            <label className="relative flex-1">
              <span className="sr-only">{t.menu.search}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="m14 14 4 4" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.menu.searchPlaceholder}
                className="w-full rounded-full border border-border bg-surface py-2.5 pl-11 pr-20 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-[0.625rem] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-accent"
                >
                  {t.menu.clear}
                </button>
              )}
            </label>

            <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
              <div role="group" aria-label={t.menu.categories} className="flex rounded-full border border-border bg-surface p-1">
                {kindOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={kind === option.id}
                    onClick={() => setKind(option.id)}
                    className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                      kind === option.id ? "bg-elevated text-accent" : "text-muted hover:text-fg"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <label className="relative">
                <span className="sr-only">{t.menu.sort}</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="appearance-none rounded-full border border-border bg-surface py-2.5 pl-4 pr-9 text-sm text-fg focus-visible:border-accent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </label>
            </div>
          </div>

          {!flat && sections.length > 0 && (
            <div
              ref={chips}
              aria-label={t.menu.categories}
              className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  data-chip={section.id}
                  onClick={() => jumpTo(section.id)}
                  aria-current={activeId === section.id}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-400 ease-soft ${
                    activeId === section.id
                      ? "bg-elevated text-accent"
                      : "text-muted hover:bg-surface hover:text-fg"
                  }`}
                >
                  {section.title[lang]}
                  <span className="ml-2 text-xs text-muted/70 tabular-nums">{section.products.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[110rem] px-6 md:px-10">
        <div className={`grid gap-12 ${flat ? "" : "lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20"}`}>
          {!flat && (
            <aside className="hidden lg:block">
              <nav aria-label={t.menu.categories} className="sticky top-44 py-14">
                <p className="eyebrow">{t.menu.categories}</p>
                <ul className="mt-5 space-y-1">
                  {sections.map((section) => {
                    const active = activeId === section.id;
                    return (
                      <li key={section.id}>
                        <button
                          type="button"
                          onClick={() => jumpTo(section.id)}
                          aria-current={active}
                          className={`group flex w-full items-baseline justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-300 ${
                            active ? "bg-surface text-accent" : "text-muted hover:text-fg"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`h-px transition-all duration-400 ease-editorial ${
                                active ? "w-4 bg-accent" : "w-0 bg-border group-hover:w-4"
                              }`}
                            />
                            {section.title[lang]}
                          </span>
                          <span className="text-xs tabular-nums text-muted/70">{section.products.length}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-8 border-t border-border pt-6 text-xs leading-relaxed text-muted">
                  {t.menu.prices}
                </p>
              </nav>
            </aside>
          )}

          <div className="min-w-0">
            {resultCount === 0 && (
              <div className="py-28 text-center">
                <p className="font-display text-title">{t.menu.empty}</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setKind("all");
                  }}
                  className="mt-6 rounded-full border border-border px-6 py-3 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
                >
                  {t.menu.clear}
                </button>
              </div>
            )}

            {flat && flat.length > 0 && (
              <section className="py-14 md:py-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <h2 className="font-display text-title font-normal">{t.menu.allItems}</h2>
                  <p className="text-sm text-muted tabular-nums">
                    {flat.length} {t.menu.items}
                  </p>
                </div>
                <div className={`mt-10 ${cardGrid} xl:grid-cols-5`}>
                  {flat.map((product) => (
                    <ProductCard
                      key={`${product.kind}-${product.id}`}
                      product={product}
                      sectionTitle={sectionTitles.get(product.sectionId)}
                    />
                  ))}
                </div>
              </section>
            )}

            {!flat &&
              sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="border-t border-border py-14 first:border-t-0 md:py-20"
                >
                  <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <p className="eyebrow">
                        {section.kind === "meal" ? t.gallery.filterFood : t.gallery.filterDrinks}
                        <span className="ml-3 text-muted/60 tabular-nums">{section.products.length}</span>
                      </p>
                      <h2 className="mt-4 font-display text-headline font-normal">{section.title[lang]}</h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-muted">{section.blurb[lang]}</p>
                  </div>

                  <div className={`mt-10 ${cardGrid}`}>
                    {section.products.map((product) => (
                      <div key={product.id} {...(isDefaultView ? { "data-gallery-item": true } : {})}>
                        <ProductCard product={product} sizes="(min-width: 1280px) 18vw, (min-width: 640px) 30vw, 45vw" />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        </div>

        <div className="border-t border-border py-12 text-xs leading-relaxed text-muted">
          <p>{t.menu.prices}</p>
          <p className="mt-2">{t.menu.allergens}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t.menu.backToTop}
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur transition-all duration-400 ease-soft hover:border-accent hover:text-accent md:right-10 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 15V5m0 0-5 5m5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
