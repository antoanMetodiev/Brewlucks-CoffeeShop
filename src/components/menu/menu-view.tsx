"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { currency, menu } from "@/content/menu";

// Fixed header (5rem) plus the sticky category bar.
const STICKY_OFFSET = 132;

export function MenuView() {
  const { lang, t } = useLanguage();
  const [activeId, setActiveId] = useState(menu[0].id);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = menu
      .map((category) => document.getElementById(category.id))
      .filter((element) => element !== null);

    const onScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      const started = sections.filter(
        (section) => section.getBoundingClientRect().top <= STICKY_OFFSET + 8,
      );
      const current = reachedBottom ? sections.at(-1) : started.at(-1);
      setActiveId((current ?? sections[0]).id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    const chip = nav?.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    if (!nav || !chip) return;
    nav.scrollTo({
      left: chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const jumpTo = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      <section className="mx-auto max-w-[110rem] px-6 pb-14 pt-8 md:px-10 md:pb-20">
        <p className="eyebrow">Bistro &amp; Jars</p>
        <h1 className="mt-6 font-display text-headline font-light">{t.nav.menu}</h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t.menu.intro}</p>
      </section>

      <div className="sticky top-20 z-30 border-y border-border bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[110rem] px-6 md:px-10">
          <div
            ref={navRef}
            aria-label={t.menu.categories}
            className="flex gap-7 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {menu.map((category) => (
              <button
                key={category.id}
                type="button"
                data-chip={category.id}
                onClick={() => jumpTo(category.id)}
                aria-current={activeId === category.id}
                className={`shrink-0 text-sm transition-colors duration-300 ${
                  activeId === category.id ? "text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {category.title[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[110rem] px-6 md:px-10">
        {menu.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="border-t border-border py-14 first:border-t-0 md:py-20"
          >
            <div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_minmax(0,44rem)] md:gap-20">
              <h2 className="font-display text-title font-light md:sticky md:top-36 md:self-start">
                {category.title[lang]}
              </h2>

              <ul>
                {category.items.map((item) => (
                  <li
                    key={item.name.en}
                    className="border-b border-border py-5 last:border-b-0 last:pb-0"
                  >
                    {item.signature && (
                      <p className="mb-2 text-[0.6875rem] uppercase tracking-[0.22em] text-accent">
                        {t.menu.signature}
                      </p>
                    )}
                    <div className="flex items-baseline justify-between gap-6">
                      <h3 className="font-display text-xl font-normal lining-nums">
                        {item.name[lang]}
                      </h3>
                      <span className="shrink-0 text-sm tabular-nums text-muted">
                        {item.price} {currency[lang]}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                        {item.description[lang]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        <div className="border-t border-border py-12 text-xs leading-relaxed text-muted">
          <p>{t.menu.prices}</p>
          <p className="mt-2">{t.menu.allergens}</p>
        </div>
      </div>
    </>
  );
}
