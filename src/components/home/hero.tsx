"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { storyVideo } from "@/lib/site";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-hero]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            delay: 0.2,
            ease: "power3.out",
          },
        );

        const scrub = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };

        gsap.to(video.current, { scale: 1.18, ease: "none", scrollTrigger: scrub });
        gsap.to(content.current, { y: -80, opacity: 0, ease: "none", scrollTrigger: scrub });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="relative h-dvh overflow-hidden">
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src={storyVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/40 to-bg" />

      <div
        ref={content}
        className="relative z-10 mx-auto flex h-full max-w-[110rem] flex-col justify-end px-6 pb-24 md:px-10 md:pb-28"
      >
        <p className="eyebrow" data-hero>
          {t.home.heroEyebrow}
        </p>
        <h1 className="mt-6 max-w-[16ch] font-display text-display font-light" data-hero>
          {t.home.heroTitle}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted" data-hero>
          {t.home.heroLead}
        </p>
      </div>

      <p className="absolute bottom-10 right-6 z-10 text-[0.6875rem] uppercase tracking-[0.22em] text-muted md:right-10">
        {t.home.scroll}
      </p>
    </section>
  );
}
