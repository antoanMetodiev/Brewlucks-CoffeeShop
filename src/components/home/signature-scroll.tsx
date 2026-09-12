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
            .to(steps[index - 1], { opacity: 0, y: -28, duration: 0.45 })
            .to(step, { opacity: 1, y: 0, duration: 0.45 }, "<")
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
          {products.map((product, index) => (
            <article
              key={`${product.kind}-${product.id}`}
              data-signature-step
              className="mb-20 flex flex-col gap-7 last:mb-0 md:flex-row md:items-center md:justify-between md:gap-14"
            >
              <div className="order-2 md:order-1 md:max-w-md">
                <p className="text-[0.6875rem] tracking-[0.22em] text-accent">
                  {String(index + 1).padStart(2, "0")} —{" "}
                  {String(products.length).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-title font-normal">{product.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted tabular-nums">
                  {formatDualPrice(product.price, lang)}
                </p>
                <Link
                  href={productHref(product.kind, product.id)}
                  className="mt-4 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-300 hover:decoration-accent"
                >
                  {t.menu.details} →
                </Link>
              </div>

              <div className="photo-frame relative order-1 h-[30vh] w-full shrink-0 overflow-hidden rounded-2xl md:order-2 md:aspect-[4/5] md:h-[46vh] md:w-auto">
                <Image
                  src={imageVariant(product.image, "medium")}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover brightness-90"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div
        ref={progress}
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent"
      />
    </section>
  );
}
