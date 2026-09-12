"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/language-provider";
import { getNavLinks, isActivePath } from "@/lib/navigation";
import { useCart } from "@/lib/cart/cart-provider";
import { useFavorites } from "@/lib/supabase/favorites-provider";
import { useProfile } from "@/lib/supabase/profile-provider";
import { useSession } from "@/lib/supabase/use-session";
import { LanguageToggle } from "./language-toggle";
import { Wordmark } from "./wordmark";

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { user } = useSession();
  const { count } = useCart();
  const { ids: favoriteIds } = useFavorites();
  const { profile } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = getNavLinks(t);
  const accountHref = user ? "/account" : "/login";
  const accountLabel = user ? t.auth.myAccount : t.auth.signIn;
  const avatarUrl = profile?.avatar_url ?? undefined;

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
            href="/favorites"
            aria-label={t.auth.favorites}
            className="relative hidden h-8 w-8 items-center justify-center rounded-full border border-border text-fg transition-colors duration-300 hover:border-accent hover:text-accent md:flex"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill={favoriteIds.size > 0 ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.5s-7.5-4.6-10-9.2C.6 8.1 2 4.8 5.2 4.1c2-.4 4 .5 5.3 2.3l1.5 2 1.5-2c1.3-1.8 3.3-2.7 5.3-2.3 3.2.7 4.6 4 3.2 7.2-2.5 4.6-10 9.2-10 9.2Z"
              />
            </svg>
            {favoriteIds.size > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[0.5625rem] text-bg tabular-nums">
                {favoriteIds.size}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={t.cart.title}
            className="relative hidden h-8 w-8 items-center justify-center rounded-full border border-border text-fg transition-colors duration-300 hover:border-accent hover:text-accent md:flex"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h2l1.5 11.5A2 2 0 0 0 8.5 17.5h9a2 2 0 0 0 2-1.7L21 8H6"
              />
              <circle cx="9" cy="20.5" r="1.25" />
              <circle cx="17" cy="20.5" r="1.25" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[0.5625rem] text-bg tabular-nums">
                {count}
              </span>
            )}
          </Link>
          <Link
            href={accountHref}
            aria-label={accountLabel}
            className="hidden h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border text-[0.6875rem] uppercase text-fg transition-colors duration-300 hover:border-accent hover:text-accent md:flex"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : user ? (
              (user.email?.[0] ?? "?").toUpperCase()
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
              </svg>
            )}
          </Link>
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
          <Link
            href={accountHref}
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: menuOpen ? `${120 + links.length * 70}ms` : "0ms" }}
            className={`font-display text-4xl transition-all duration-500 ease-editorial ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } ${isActivePath(pathname, accountHref) ? "text-accent" : "text-fg"}`}
          >
            {accountLabel}
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: menuOpen ? `${120 + (links.length + 1) * 70}ms` : "0ms" }}
            className={`font-display text-4xl transition-all duration-500 ease-editorial ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } ${isActivePath(pathname, "/favorites") ? "text-accent" : "text-fg"}`}
          >
            {t.auth.favorites}
            {favoriteIds.size > 0 && (
              <span className="ml-3 text-lg text-muted tabular-nums">({favoriteIds.size})</span>
            )}
          </Link>
          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: menuOpen ? `${120 + (links.length + 2) * 70}ms` : "0ms" }}
            className={`font-display text-4xl transition-all duration-500 ease-editorial ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            } ${isActivePath(pathname, "/cart") ? "text-accent" : "text-fg"}`}
          >
            {t.cart.title}
            {count > 0 && <span className="ml-3 text-lg text-muted tabular-nums">({count})</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
