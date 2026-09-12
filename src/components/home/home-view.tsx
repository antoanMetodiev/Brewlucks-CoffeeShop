"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { imageVariant } from "@/lib/catalog/format";
import type { Product } from "@/lib/catalog/types";
import { Atmosphere } from "./atmosphere";
import { FeaturedStrip } from "./featured-strip";
import { FindUs } from "./find-us";
import { Hero } from "./hero";
import { SignatureScroll } from "./signature-scroll";

type Props = {
  featured: Product[];
  heroShowcase: Product[];
  signatureDrinks: Product[];
};

export function HomeView({ featured, heroShowcase, signatureDrinks }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((group) => {
          gsap.fromTo(
            group.children,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: { trigger: group, start: "top 80%" },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  const heroImages = heroShowcase.map((product) => imageVariant(product.image, "small"));

  return (
    <div ref={root}>
      <Hero images={heroImages} />

      <section className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
        <div data-reveal className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,36rem)] md:gap-24">
          <h2 className="font-display text-headline font-normal">{t.home.statementTitle}</h2>
          <p className="max-w-xl self-end text-sm leading-relaxed text-muted">
            {t.home.statementBody}
          </p>
        </div>
      </section>

      <FeaturedStrip products={featured} />

      {signatureDrinks.length > 0 && <SignatureScroll products={signatureDrinks} />}

      <Atmosphere />

      <section className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
        <div data-reveal>
          <h2 className="max-w-[16ch] font-display text-headline font-normal">{t.home.ctaTitle}</h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">{t.home.ctaBody}</p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110"
            >
              {t.actions.reserve}
            </Link>
            <Link
              href="/menu"
              className="rounded-full border border-border px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
            >
              {t.nav.menu}
            </Link>
          </div>
        </div>
      </section>

      <FindUs />
    </div>
  );
}
