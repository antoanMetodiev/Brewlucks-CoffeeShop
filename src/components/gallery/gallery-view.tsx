"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { galleryItems } from "@/content/gallery";

export function GalleryView() {
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, lang } = useLanguage();

  const close = useCallback(() => setActiveIndex(null), []);

  const step = useCallback((direction: number) => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + direction + galleryItems.length) % galleryItems.length;
    });
  }, []);

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
    { scope: root, dependencies: [lang], revertOnUpdate: true },
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

  const active = activeIndex === null ? null : galleryItems[activeIndex];

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[80rem] px-6 pb-16 pt-32 md:px-10">
        <p className="eyebrow">Bistro &amp; Jars</p>
        <h1 className="mt-6 font-display text-headline font-normal">{t.nav.gallery}</h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t.gallery.intro}</p>
      </section>

      <section className="mx-auto max-w-[80rem] px-6 pb-28 md:px-10 md:pb-40">
        <div className="columns-2 gap-4 sm:columns-3 md:gap-6 lg:columns-4 xl:columns-5">
          {galleryItems.map((item, index) => (
            <figure key={index} data-gallery-item className="mb-4 break-inside-avoid md:mb-6">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${t.gallery.open} — ${item.caption[lang]}`}
                className="photo-frame group block w-full overflow-hidden rounded-2xl"
              >
                <Image
                  src={item.image}
                  alt={item.caption[lang]}
                  placeholder="blur"
                  unoptimized
                  className="w-full brightness-90 transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                />
              </button>
              <figcaption className="mt-3 text-sm leading-relaxed text-muted">
                {item.caption[lang]}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {activeIndex !== null && active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption[lang]}
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
            src={active.image}
            alt={active.caption[lang]}
            placeholder="blur"
            unoptimized
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
            <p className="max-w-md text-center text-muted">{active.caption[lang]}</p>
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
            {String(galleryItems.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}
