"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { HeroBackground } from "./hero-background";

export function Hero({ images }: { images: string[] }) {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-hero]",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, stagger: 0.12, delay: 0.2, ease: "power3.out" },
        );

        gsap.to(content.current, {
          y: -80,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              scrollProgress.current = self.progress;
            },
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="relative h-dvh overflow-hidden">
      <HeroBackground images={images} scrollRef={scrollProgress} />
      <div className="absolute inset-0 bg-bg/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg" />

      <div
        ref={content}
        className="relative z-10 mx-auto flex h-full max-w-[110rem] flex-col justify-end px-6 pb-28 md:px-10 md:pb-32"
      >
        <div>
          <p className="eyebrow" data-hero>
            {t.home.heroEyebrow}
          </p>
          <h1 className="mt-6 max-w-[14ch] font-display text-display font-normal" data-hero>
            {t.home.heroTitle}
          </h1>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted" data-hero>
            {t.home.heroLead}
          </p>
          <div className="mt-10 flex flex-wrap gap-4" data-hero>
            <Link
              href="/menu"
              className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110"
            >
              {t.home.heroMenuCta}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-fg/30 px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] backdrop-blur transition-colors duration-400 ease-soft hover:border-accent hover:text-accent"
            >
              {t.actions.reserve}
            </Link>
          </div>
        </div>
      </div>

      {/* Fixed (not part of the fading hero content) so it stays visible for the whole
          homepage scroll — this component only ever renders on "/", so it's implicitly
          homepage-only. */}
      <div
        data-hero
        className="fixed right-6 top-28 z-40 hidden rounded-2xl border border-fg/10 bg-bg/60 p-6 backdrop-blur-xl md:right-10 md:block"
      >
        <p className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t.home.heroOpenNow}
        </p>
        <p className="mt-4 text-sm text-fg">{t.footer.hoursAll}</p>
        <p className="font-display text-2xl tabular-nums">{t.footer.hoursTime}</p>
      </div>

      <div className="absolute bottom-10 right-6 z-10 flex items-center gap-4 md:right-10">
        <span className="text-[0.6875rem] uppercase tracking-[0.22em] text-muted">
          {t.home.scroll}
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-border">
          <span className="absolute inset-x-0 top-0 h-4 bg-accent motion-safe:animate-scroll-cue" />
        </span>
      </div>
    </section>
  );
}
