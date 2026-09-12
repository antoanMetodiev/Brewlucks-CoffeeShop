"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { site, whatsappMessageUrl, whatsappUrl } from "@/lib/site";

const fieldClass =
  "mt-3 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted/60 focus-visible:border-accent";

export function ContactView() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const composed = [
    t.contact.messageGreeting,
    `${t.contact.formName}: ${name.trim()}`,
    `${t.contact.formPhone}: ${phone.trim()}`,
    "",
    message.trim(),
  ].join("\n");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(whatsappMessageUrl(composed), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mx-auto max-w-[110rem] px-6 pb-28 pt-32 md:px-10 md:pb-40">
      <p className="eyebrow">{t.contact.heroEyebrow}</p>
      <h1 className="mt-6 font-display text-headline font-normal">{t.contact.heroTitle}</h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t.contact.heroLead}</p>

      <div className="mt-16 grid gap-14 md:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] md:gap-24">
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
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t.contact.formNamePlaceholder}
              className={fieldClass}
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
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t.contact.formPhonePlaceholder}
              className={fieldClass}
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
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t.contact.formMessagePlaceholder}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-accent px-8 py-4 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110"
          >
            {t.contact.formSubmit}
          </button>

          <p className="max-w-md text-xs leading-relaxed text-muted">{t.contact.formHint}</p>
        </form>

        <div className="space-y-10">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-border md:h-80">
            <iframe
              title={`${site.name} — ${t.home.findUsTitle}`}
              src={`https://www.google.com/maps?q=${site.address.coordinates.lat},${site.address.coordinates.lng}&z=17&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
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
      </div>
    </section>
  );
}
