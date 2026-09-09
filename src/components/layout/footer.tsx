"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-provider";
import { getNavLinks } from "@/lib/navigation";
import { site, whatsappUrl } from "@/lib/site";
import { Wordmark } from "./wordmark";

export function Footer() {
  const { t } = useLanguage();
  const links = getNavLinks(t);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[110rem] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-1">
            <Wordmark className="text-3xl" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          </div>

          <div>
            <p className="eyebrow">{t.footer.visit}</p>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block text-sm leading-relaxed text-fg transition-colors duration-300 hover:text-accent"
            >
              {site.address.street}
              <br />
              {site.address.city}
            </a>
          </div>

          <div>
            <p className="eyebrow">{t.footer.hours}</p>
            <p className="mt-5 text-sm leading-relaxed text-fg">
              {t.footer.hoursWeekdays}
              <br />
              {t.footer.hoursWeekend}
            </p>
          </div>

          <div>
            <p className="eyebrow">{t.footer.connect}</p>
            <div className="mt-5 flex flex-col items-start gap-3 text-sm">
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

        <div className="mt-20 flex flex-col gap-6 border-t border-border pt-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-300 hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/privacy" className="transition-colors duration-300 hover:text-fg">
              {t.nav.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
