"use client";

import { useLanguage } from "@/i18n/language-provider";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[110rem] flex-col justify-center px-6 py-24 md:px-10">
      <p className="eyebrow">Beograd</p>
      <h1 className="mt-8 font-display text-display font-light">
        Bistro <span className="text-accent">&</span> Jars
      </h1>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
    </section>
  );
}
