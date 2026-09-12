import type { Language, Localized } from "@/i18n/dictionaries";

export const currency: Localized = { bg: "лв.", en: "BGN" };

// Bulgaria's fixed currency-board peg, carried over as the official BGN↔EUR conversion rate
// through the euro-adoption transition period (prices are shown in both currencies by law).
export const BGN_PER_EUR = 1.95583;

export function formatPrice(price: number) {
  return price.toFixed(2);
}

export function toEur(bgnPrice: number) {
  return bgnPrice / BGN_PER_EUR;
}

export function formatDualPrice(bgnPrice: number, lang: Language) {
  return `€${formatPrice(toEur(bgnPrice))} · ${formatPrice(bgnPrice)} ${currency[lang]}`;
}

export function productHref(kind: string, id: string) {
  return `/menu/${kind}/${id}`;
}

export function imageVariant(image: string, size: "small" | "medium") {
  return `${image}/${size}`;
}
