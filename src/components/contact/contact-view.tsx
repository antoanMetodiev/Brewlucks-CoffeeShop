"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { site, whatsappUrl } from "@/lib/site";

export function ContactView() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">{t.contact.heroEyebrow}</p>
      <h1 className="mt-6 font-display text-headline font-normal">{t.contact.heroTitle}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t.contact.heroLead}</p>

      <div className="mt-16 grid gap-14 md:grid-cols-[minmax(0,28rem)_minmax(0,20rem)] md:gap-24">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="eyebrow">
              {t.contact.formName}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder={t.contact.formNamePlaceholder}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="eyebrow">
              {t.contact.formPhone}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder={t.contact.formPhonePlaceholder}
              className="mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent"
            />
          </div>

          <div>
            <label htmlFor="message" className="eyebrow">
              {t.contact.formMessage}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder={t.contact.formMessagePlaceholder}
              className="mt-3 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.contact.formSubmit}
          </button>

          <div aria-live="polite">
            {submitted && (
              <div className="rounded-xl border border-accent/30 bg-elevated px-5 py-4">
                <p className="text-sm text-fg">{t.contact.comingSoonTitle}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t.contact.comingSoonBody}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm text-accent underline decoration-border underline-offset-4 transition-colors duration-400 ease-soft hover:decoration-accent"
                >
                  {t.actions.whatsapp} →
                </a>
              </div>
            )}
          </div>
        </form>

        <div className="space-y-10">
          <div>
            <p className="eyebrow">{t.footer.visit}</p>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm leading-relaxed text-fg transition-colors duration-300 hover:text-accent"
            >
              {site.address.street}
              <br />
              {site.address.city}
            </a>
          </div>

          <div>
            <p className="eyebrow">{t.footer.hours}</p>
            <p className="mt-3 text-sm leading-relaxed text-fg">
              {t.footer.hoursAll}
              <br />
              <span className="tabular-nums">{t.footer.hoursTime}</span>
            </p>
          </div>

          <div>
            <p className="eyebrow">{t.footer.connect}</p>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="text-fg transition-colors duration-300 hover:text-accent"
              >
                WhatsApp
              </a>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="text-fg transition-colors duration-300 hover:text-accent"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
