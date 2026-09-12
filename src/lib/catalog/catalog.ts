import { cache } from "react";
import type { Localized } from "@/i18n/dictionaries";
import catalogSnapshot from "./generated/catalog.json";
import type { Catalog, Ingredient, Product, ProductDetail, ProductKind, Section } from "./types";

type SectionRow = {
  id: string;
  kind: ProductKind;
  position: number;
  title_bg: string;
  title_en: string;
  blurb_bg: string;
  blurb_en: string;
};

type ProductRow = {
  id: string;
  kind: ProductKind;
  external_id: string;
  section_id: string;
  name: string;
  image: string;
  price: string;
  signature: boolean;
  origin: string | null;
  glass: string | null;
  tags: string[];
  ingredients: Ingredient[];
  steps: string[];
};

const sectionRows = catalogSnapshot.sections as SectionRow[];
const productRows = catalogSnapshot.products as ProductRow[];

function localized(bg: string, en: string): Localized {
  return { bg, en };
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.external_id,
    kind: row.kind,
    name: row.name,
    image: row.image,
    sectionId: row.section_id,
    price: Number(row.price),
    signature: row.signature,
    ...(row.origin ? { origin: row.origin } : {}),
    ...(row.glass ? { glass: row.glass } : {}),
    tags: row.tags,
    ingredients: row.ingredients.map((ingredient) => ingredient.name),
  };
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  const productsBySection = new Map<string, Product[]>();
  for (const row of productRows) {
    const product = toProduct(row);
    const list = productsBySection.get(row.section_id);
    if (list) list.push(product);
    else productsBySection.set(row.section_id, [product]);
  }

  const sections: Section[] = sectionRows.map((row) => ({
    id: row.id,
    kind: row.kind,
    title: localized(row.title_bg, row.title_en),
    blurb: localized(row.blurb_bg, row.blurb_en),
    products: productsBySection.get(row.id) ?? [],
  }));

  return sections;
});

export async function getFeatured(count = 8): Promise<Product[]> {
  const catalog = await getCatalog();
  return catalog.slice(0, count).map((section) => section.products[0]);
}

export async function getProduct(kind: ProductKind, id: string): Promise<ProductDetail | null> {
  const row = productRows.find((candidate) => candidate.kind === kind && candidate.external_id === id);
  if (!row) return null;

  return {
    ...toProduct(row),
    ingredients: row.ingredients,
    steps: row.steps,
  };
}

// A wide, evenly-spread selection across the whole catalog (not just one-per-section) — used to
// densely fill the home page's WebGL hero background with real menu photos.
export async function getHeroShowcase(count = 48): Promise<Product[]> {
  const catalog = await getCatalog();
  const all = catalog.flatMap((section) => section.products);
  if (all.length <= count) return all;
  const step = all.length / count;
  return Array.from({ length: count }, (_, index) => all[Math.floor(index * step)]);
}

// The signature drinks across all drink sections (coffee, shakes, lemonades) — used by the
// home page's pinned horizontal-scroll showcase.
export async function getSignatureDrinks(): Promise<Product[]> {
  const catalog = await getCatalog();
  return catalog
    .filter((section) => section.kind === "drink")
    .flatMap((section) => section.products.filter((product) => product.signature));
}
