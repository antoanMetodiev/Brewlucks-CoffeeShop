"use client";

import { useLanguage } from "@/i18n/language-provider";
import { privacyIntro, privacySections } from "@/content/privacy";
import { site } from "@/lib/site";

export function PrivacyView() {
  const { t, lang } = useLanguage();

  return (
    <section className="mx-auto max-w-[46rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">Bistro &amp; Jars</p>
      <h1 className="mt-6 font-display text-headline font-normal">{t.nav.privacy}</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">{privacyIntro[lang]}</p>

      <div className="mt-16 space-y-12">
        {privacySections.map((section, index) => (
          <div key={index}>
            <h2 className="font-display text-title font-normal">{section.title[lang]}</h2>
            <div className="mt-4 space-y-4">
              {section.body.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-sm leading-relaxed text-muted">
                  {paragraph[lang]}
                </p>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-border pt-10">
          <h2 className="font-display text-title font-normal">{t.privacy.contactTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{t.privacy.contactBody}</p>
          <a
            href={`mailto:${site.privacyEmail}`}
            className="mt-2 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
          >
            {site.privacyEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
