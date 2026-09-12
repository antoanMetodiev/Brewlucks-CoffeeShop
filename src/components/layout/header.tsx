"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { getNavLinks, isActivePath } from "@/lib/navigation";
import { LanguageToggle } from "./language-toggle";
import { Wordmark } from "./wordmark";

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = getNavLinks(t);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-editorial ${
        solid ? "border-border bg-bg/80 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-20 max-w-[110rem] items-center justify-between gap-8 px-6 md:px-10">
        <Link href="/" aria-label={t.nav.home}>
          <Wordmark className="text-2xl" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm transition-colors duration-300 hover:text-fg ${
                  active ? "text-fg" : "text-muted"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-accent transition-all duration-500 ease-editorial group-hover:w-full ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <LanguageToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.18em] text-bg transition-all duration-400 ease-soft hover:brightness-110 md:inline-block"
          >
            {t.actions.reserve}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.actions.closeMenu : t.actions.openMenu}
            className="flex h-6 w-6 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-5 bg-fg transition-transform duration-400 ease-editorial ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-5 bg-fg transition-transform duration-400 ease-editorial ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-x-0 top-0 h-dvh bg-bg px-6 pt-32 transition-opacity duration-500 ease-editorial md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-8">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${120 + index * 70}ms` : "0ms" }}
              className={`font-display text-4xl transition-all duration-500 ease-editorial ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } ${isActivePath(pathname, link.href) ? "text-accent" : "text-fg"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
