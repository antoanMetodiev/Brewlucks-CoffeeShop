"use client";

import { useLanguage } from "@/i18n/language-provider";

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-24 pt-32 md:px-10">
      <h1 className="font-display text-headline font-normal">{t.nav.privacy}</h1>
    </section>
  );
}
