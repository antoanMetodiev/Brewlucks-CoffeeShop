import type { Localized } from "@/i18n/dictionaries";

export type ProductKind = "meal" | "drink";

export type Product = {
  id: string;
  kind: ProductKind;
  name: string;
  image: string;
  sectionId: string;
  price: number;
  signature: boolean;
  origin?: string;
  glass?: string;
  tags: string[];
  ingredients: string[];
};

export type Ingredient = { name: string; measure: string };

export type ProductDetail = Omit<Product, "ingredients"> & {
  ingredients: Ingredient[];
  steps: string[];
};

export type Section = {
  id: string;
  kind: ProductKind;
  title: Localized;
  blurb: Localized;
  products: Product[];
};

export type Catalog = Section[];
