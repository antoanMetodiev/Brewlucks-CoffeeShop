"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { signatureSteps } from "@/content/signature";

export function SignatureStory() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root.current);
        const images = gsap.utils.toArray<HTMLElement>("[data-step] img", root.current);

        gsap.set(steps.slice(1), { y: 28 });
        gsap.set(images.slice(1), { scale: 1.08 });

        const range = `+=${steps.length * 85}%`;

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
    { scope: root, dependencies: [lang], revertOnUpdate: true },
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
          {signatureSteps.map((step, index) => (
            <article
              key={index}
              data-step
              className="mb-20 flex flex-col gap-7 last:mb-0 md:flex-row md:items-center md:justify-between md:gap-14"
            >
              <div className="order-2 md:order-1 md:max-w-md">
                <p className="text-[0.6875rem] tracking-[0.22em] text-accent">
                  {String(index + 1).padStart(2, "0")} —{" "}
                  {String(signatureSteps.length).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-title font-normal">{step.title[lang]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.body[lang]}</p>
              </div>

              <div className="relative order-1 h-[30vh] w-full shrink-0 overflow-hidden rounded-2xl md:order-2 md:aspect-[4/5] md:h-[46vh] md:w-auto">
                <Image
                  src={step.image}
                  alt={step.title[lang]}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover"
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
