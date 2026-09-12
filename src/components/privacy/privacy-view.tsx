"use client";

import { useLanguage } from "@/i18n/language-provider";
import { privacyIntro, privacySections } from "@/content/privacy";
import { site } from "@/lib/site";

const CONTACT_ID = "contact";

export function PrivacyView() {
  const { t, lang } = useLanguage();

  const entries = [
    ...privacySections.map((section, index) => ({ id: `section-${index + 1}`, title: section.title[lang] })),
    { id: CONTACT_ID, title: t.privacy.contactTitle },
  ];

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">Bistro &amp; Jars</p>
      <h1 className="mt-6 font-display text-headline font-normal">{t.nav.privacy}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{privacyIntro[lang]}</p>

      <div className="mt-16 grid gap-14 md:grid-cols-[minmax(0,16rem)_minmax(0,44rem)] md:gap-24">
        <nav aria-label={t.privacy.contents} className="md:sticky md:top-32 md:self-start">
          <p className="eyebrow">{t.privacy.contents}</p>
          <ol className="mt-5 space-y-3 text-sm">
            {entries.map((entry, index) => (
              <li key={entry.id} className="flex gap-3">
                <span className="w-6 shrink-0 text-muted tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${entry.id}`}
                  className="text-muted transition-colors duration-300 hover:text-accent"
                >
                  {entry.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {privacySections.map((section, index) => (
            <div key={index} id={`section-${index + 1}`} className="scroll-mt-32">
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

          <div id={CONTACT_ID} className="scroll-mt-32 border-t border-border pt-10">
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
      </div>
    </section>
  );
}
