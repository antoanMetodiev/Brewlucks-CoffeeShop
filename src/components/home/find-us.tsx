"use client";

import { useLanguage } from "@/i18n/language-provider";
import { site } from "@/lib/site";

export function FindUs() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 md:px-10 md:pb-40">
      <div data-reveal>
        <p className="eyebrow">{t.home.findUsEyebrow}</p>
        <h2 className="mt-5 max-w-[18ch] font-display text-headline font-normal">
          {t.home.findUsTitle}
        </h2>
      </div>

      <div data-reveal className="mt-14 md:mt-20">
        <div className="relative h-72 overflow-hidden rounded-2xl border border-border md:h-[28rem]">
          <iframe
            title={`${site.name} — ${t.home.findUsTitle}`}
            src={`https://www.google.com/maps?q=${site.address.coordinates.lat},${site.address.coordinates.lng}&z=17&output=embed`}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {site.address.street}, {site.address.city}
        </p>
        <a
          href={site.address.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
        >
          {t.home.findUsCta} →
        </a>
      </div>
    </section>
  );
}
