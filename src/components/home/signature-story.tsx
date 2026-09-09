"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLanguage } from "@/i18n/language-provider";
import { storyVideo } from "@/lib/site";

export function SignatureStory() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stepsWrapper = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  useGSAP(
    () => {
      const element = video.current;
      if (element) {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => element.play().catch(() => {}),
          onEnterBack: () => element.play().catch(() => {}),
          onLeave: () => element.pause(),
          onLeaveBack: () => element.pause(),
        });
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", stepsWrapper.current);

        gsap.set(steps, { y: 28 });
        gsap.set(steps[0], { y: 0 });

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
            .to(steps[index - 1], { opacity: 0, y: -28, duration: 0.4 })
            .to(step, { opacity: 1, y: 0, duration: 0.4 }, "<");
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
      className="relative h-dvh overflow-hidden motion-reduce:h-auto motion-reduce:overflow-visible motion-reduce:py-28"
    >
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src={storyVideo}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-bg/80" />

      <div className="relative z-10 mx-auto flex h-full max-w-[110rem] flex-col justify-center px-6 motion-reduce:h-auto md:px-10">
        <p className="eyebrow">{t.home.signatureEyebrow}</p>
        <h2 className="mt-6 max-w-[20ch] font-display text-headline font-light">
          {t.home.signatureTitle}
        </h2>

        <div ref={stepsWrapper} className="relative mt-14 min-h-56 max-w-xl">
          {t.home.signatureSteps.map((step, index) => (
            <div key={index} data-step className="mb-10 last:mb-0">
              <p className="text-[0.6875rem] tracking-[0.22em] text-accent">
                {String(index + 1).padStart(2, "0")} —{" "}
                {String(t.home.signatureSteps.length).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-display text-title font-light">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={progress}
        className="absolute inset-x-0 bottom-0 z-10 h-px origin-left scale-x-0 bg-accent"
      />
    </section>
  );
}
