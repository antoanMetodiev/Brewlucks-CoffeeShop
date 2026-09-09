"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { Hero } from "./hero";
import { SignatureStory } from "./signature-story";

export function HomeView() {
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

  return (
    <div ref={root}>
      <Hero />

      <section className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
        <div data-reveal className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,36rem)] md:gap-24">
          <h2 className="font-display text-headline font-light">{t.home.statementTitle}</h2>
          <p className="max-w-xl self-end text-sm leading-relaxed text-muted">
            {t.home.statementBody}
          </p>
        </div>
      </section>

      <SignatureStory />

      <section className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
        <div data-reveal>
          <h2 className="max-w-[16ch] font-display text-headline font-light">{t.home.ctaTitle}</h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">{t.home.ctaBody}</p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="border border-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-accent transition-colors duration-300 hover:bg-accent hover:text-bg"
            >
              {t.actions.reserve}
            </Link>
            <Link
              href="/menu"
              className="border border-border px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-300 hover:border-fg"
            >
              {t.nav.menu}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
