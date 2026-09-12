import type { Localized } from "@/i18n/dictionaries";

export const currency: Localized = { bg: "лв.", en: "BGN" };

export function formatPrice(price: number) {
  return price.toFixed(2);
}

export function productHref(kind: string, id: string) {
  return `/menu/${kind}/${id}`;
}

export function imageVariant(image: string, size: "small" | "medium") {
  return `${image}/${size}`;
}
