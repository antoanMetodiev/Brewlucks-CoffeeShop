"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { formatDualPrice, imageVariant, productHref } from "@/lib/catalog/format";
import type { Product } from "@/lib/catalog/types";

export function SignatureScroll({ products }: { products: Product[] }) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-signature-step]", root.current);
        const images = gsap.utils.toArray<HTMLElement>("[data-signature-step] img", root.current);

        gsap.set(steps.slice(1), { y: 28 });
        gsap.set(images.slice(1), { scale: 1.08 });

        const range = `+=${steps.length * 55}%`;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: range,
            pin: true,
            scrub: 0.8,
          },
        });

        steps.forEach((step, index) => {
          if (index === 0) return;
          timeline
            .to({}, { duration: 0.6 })
            .to(steps[index - 1], {
              opacity: 0,
              y: -28,
              duration: 0.45,
              pointerEvents: "none",
            })
            .to(step, { opacity: 1, y: 0, duration: 0.45, pointerEvents: "auto" }, "<")
            .to(images[index], { scale: 1, duration: 0.9 }, "<");
        });

        gsap.to(progress.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: range, scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [lang, products.length], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      className="relative flex h-dvh flex-col justify-center overflow-hidden motion-reduce:h-auto motion-reduce:py-28"
    >
      <div className="mx-auto w-full max-w-[110rem] px-6 md:px-10">
        <p className="eyebrow">{t.home.signatureEyebrow}</p>
        <h2 className="mt-5 max-w-[20ch] font-display text-headline font-normal">
          {t.home.signatureTitle}
        </h2>

        <div className="relative mt-10 min-h-[52vh] md:mt-14 md:min-h-[46vh] motion-reduce:min-h-0">
          {products.map((product, index) => {
            const meta = [product.origin, product.glass].filter(Boolean).join(" · ");
            const chips = product.tags.slice(0, 4);
            const extraChips = product.tags.length - chips.length;

            return (
              <Link
                key={`${product.kind}-${product.id}`}
                href={productHref(product.kind, product.id)}
                data-signature-step
                className="group mb-20 flex flex-col gap-7 last:mb-0 md:flex-row md:items-center md:justify-between md:gap-14"
              >
                <div className="order-2 md:order-1 md:max-w-md">
                  <p className="text-[0.6875rem] tracking-[0.22em] text-accent">
                    {String(index + 1).padStart(2, "0")} —{" "}
                    {String(products.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-title font-normal transition-colors duration-300 group-hover:text-accent">
                    {product.name}
                  </h3>
                  {meta && (
                    <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.14em] text-muted/70">
                      {meta}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-muted tabular-nums">
                    {formatDualPrice(product.price, lang)}
                  </p>

                  {chips.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {chips.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-border px-3 py-1 text-[0.6875rem] uppercase tracking-[0.14em] text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                      {extraChips > 0 && (
                        <li className="rounded-full px-3 py-1 text-[0.6875rem] text-muted/70">
                          +{extraChips}
                        </li>
                      )}
                    </ul>
                  )}

                  {product.ingredients.length > 0 && (
                    <p className="mt-4 text-xs text-muted/70">
                      <span className="tabular-nums">{product.ingredients.length}</span>{" "}
                      {t.menu.ingredientsLabel} — {product.ingredients.slice(0, 3).join(", ")}
                      {product.ingredients.length > 3 ? "…" : ""}
                    </p>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-300 group-hover:decoration-accent">
                    {t.menu.details} →
                  </span>
                </div>

                <div className="photo-frame relative order-1 h-[30vh] w-full shrink-0 overflow-hidden rounded-2xl md:order-2 md:aspect-[4/5] md:h-[46vh] md:w-auto">
                  <Image
                    src={imageVariant(product.image, "medium")}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover brightness-90 transition-transform duration-700 ease-editorial group-hover:scale-[1.05]"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div
        ref={progress}
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent"
      />
    </section>
  );
}
