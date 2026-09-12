"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { venuePhotos } from "@/content/gallery";

export function Atmosphere() {
  const { t, lang } = useLanguage();

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[110rem] px-6 py-28 md:px-10 md:py-40">
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

        <div data-reveal className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-3 md:gap-8">
          {venuePhotos.slice(0, 3).map((photo, index) => (
            <figure
              key={photo.image.src}
              className={`${index === 1 ? "md:mt-16" : ""} ${index === 2 ? "hidden md:block md:mt-32" : ""}`}
            >
              <div className="photo-frame relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={photo.image}
                  alt={photo.caption[lang]}
                  fill
                  sizes="(min-width: 768px) 30vw, 45vw"
                  className="object-cover brightness-90"
                />
              </div>
              <figcaption className="mt-3 text-sm text-muted">{photo.caption[lang]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
