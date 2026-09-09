import type { Dictionary } from "@/i18n/dictionaries";

export function getNavLinks(t: Dictionary) {
  return [
    { href: "/", label: t.nav.home },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/menu", label: t.nav.menu },
    { href: "/contact", label: t.nav.contact },
  ];
}

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
