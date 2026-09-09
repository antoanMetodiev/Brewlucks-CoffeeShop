"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";

export function Atmosphere() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
      <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t.home.atmosphereEyebrow}</p>
          <h2 className="mt-5 max-w-[18ch] font-display text-headline font-normal">
            {t.home.atmosphereTitle}
          </h2>
        </div>
        <Link
          href="/gallery"
          className="text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:text-accent hover:decoration-accent"
        >
          {t.home.atmosphereCta} →
        </Link>
      </div>

      <div data-reveal className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:gap-8">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
          <Image
            src="/images/venue/terrace.webp"
            alt="Bistro & Jars street terrace"
            fill
            sizes="(min-width: 768px) 40vw, 45vw"
            className="object-cover"
          />
        </div>
        <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl md:mt-20">
          <Image
            src="/images/venue/second-image.jpg"
            alt="Bistro & Jars interior bar"
            fill
            sizes="(min-width: 768px) 40vw, 45vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
