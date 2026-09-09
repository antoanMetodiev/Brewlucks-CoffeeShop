"use client";

import { useLanguage } from "@/i18n/language-provider";

export default function GalleryPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-[110rem] px-6 py-24 md:px-10">
      <h1 className="font-display text-headline font-light">{t.nav.gallery}</h1>
    </section>
  );
}
