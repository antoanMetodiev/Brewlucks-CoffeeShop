"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/i18n/language-provider";
import type { Product } from "@/lib/catalog/types";
import { ProductCard } from "./product-card";

type Props = {
  products: Product[];
  header: ReactNode;
  autoplayMs?: number;
};

const arrow = (direction: "left" | "right") => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    {direction === "left" ? (
      <path d="M12 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="m8 4 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

export function ProductCarousel({ products, header, autoplayMs = 4500 }: Props) {
  const { t } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = products.length;

  const slideWidth = useCallback(() => {
    const first = track.current?.firstElementChild as HTMLElement | null;
    if (!first || !track.current) return 0;
    const gap = parseFloat(getComputedStyle(track.current).columnGap || "0");
    return first.offsetWidth + gap;
  }, []);

  const goTo = useCallback(
    (target: number, behavior: ScrollBehavior = "smooth") => {
      const node = track.current;
      const width = slideWidth();
      if (!node || !width) return;
      const clamped = ((target % total) + total) % total;
      node.scrollTo({ left: clamped * width, behavior });
    },
    [slideWidth, total],
  );

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const onScroll = () => {
      const width = slideWidth();
      const max = node.scrollWidth - node.clientWidth;
      if (width) setIndex(Math.round(node.scrollLeft / width));
      setProgress(max > 0 ? node.scrollLeft / max : 1);
    };
    onScroll();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slideWidth]);

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const node = track.current;
      if (!node) return;
      const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 4;
      goTo(atEnd ? 0 : index + 1);
    }, autoplayMs);
    return () => window.clearInterval(timer);
  }, [paused, index, total, autoplayMs, goTo]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <section
      className="border-y border-border bg-surface"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
    >
      <div className="mx-auto max-w-[110rem] px-6 pt-16 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">{header}</div>
          <div className="flex items-center gap-3">
            <span className="text-[0.6875rem] tracking-[0.18em] text-muted tabular-nums">
              {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={t.gallery.previous}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
            >
              {arrow("left")}
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={t.gallery.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-fg transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
            >
              {arrow("right")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[110rem] pb-14 pt-10 md:pb-16">
        <div
          ref={track}
          role="region"
          aria-roledescription="carousel"
          aria-label={t.menu.picks}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(index + 1);
            if (event.key === "ArrowLeft") goTo(index - 1);
          }}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-4 outline-none md:gap-6 md:scroll-px-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, slide) => (
            <div
              key={`${product.kind}-${product.id}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${t.menu.slide} ${slide + 1} / ${total}`}
              className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-[28vw] lg:w-[21vw] xl:w-[17vw]"
            >
              <ProductCard product={product} sizes="(min-width: 1280px) 17vw, (min-width: 768px) 28vw, 70vw" />
            </div>
          ))}
        </div>

        <div className="mx-6 mt-6 flex items-center gap-4 md:mx-10">
          <div className="relative h-px flex-1 bg-border">
            <div
              className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-300 ease-soft"
              style={{ width: `${Math.max(progress * 100, 4)}%` }}
            />
          </div>
          <div className="hidden gap-1.5 sm:flex">
            {products.map((product, slide) => (
              <button
                key={`${product.kind}-${product.id}`}
                type="button"
                onClick={() => goTo(slide)}
                aria-label={`${t.menu.slide} ${slide + 1}`}
                aria-current={slide === index}
                className={`h-1.5 rounded-full transition-all duration-400 ease-editorial ${
                  slide === index ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
