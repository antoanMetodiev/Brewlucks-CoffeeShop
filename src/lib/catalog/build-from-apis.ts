// One-time catalog generation from the public TheMealDB / TheCocktailDB APIs.
// Used only by scripts/seed-supabase.ts to populate the Supabase `sections`/`products` tables —
// the running app (src/lib/catalog/catalog.ts) reads from Supabase, not from these APIs.
import { sectionConfigs, type SectionConfig } from "./sections";
import { listMeals, lookupMeal, type MealRecord } from "./themealdb";
import { listDrinks, listNonAlcoholic, lookupDrink, type DrinkRecord } from "./thecocktaildb";
import type { Ingredient, ProductKind } from "./types";

const SIGNATURE_PER_SECTION = 2;

export type SeedProduct = {
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
  ingredients: Ingredient[];
  steps: string[];
};

export type SeedSection = {
  id: string;
  kind: ProductKind;
  position: number;
  title: SectionConfig["title"];
  blurb: SectionConfig["blurb"];
  products: SeedProduct[];
};

function hash(input: string) {
  let value = 0;
  for (const char of input) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

function priceFor(config: SectionConfig, id: string) {
  const [min, max] = config.price;
  const seed = hash(`${config.id}:${id}`);
  const whole = min + (seed % (max - min));
  const ending = [0, 0.5, 0.9][seed % 3];
  return whole + ending;
}

// Evenly spaced picks so a section is not just the alphabetical head of the API list.
function spread<T>(items: T[], count: number) {
  if (items.length <= count) return items;
  const step = items.length / count;
  return Array.from({ length: count }, (_, index) => items[Math.floor(index * step)]);
}

function interleave<T>(lists: T[][]) {
  const result: T[] = [];
  const longest = Math.max(...lists.map((list) => list.length));
  for (let index = 0; index < longest; index++) {
    for (const list of lists) if (list[index]) result.push(list[index]);
  }
  return result;
}

async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

type Summary = { id: string; name: string; image: string; origin?: string };
type Record_ = MealRecord | DrinkRecord;

function readIngredients(record: Record_): Ingredient[] {
  const ingredients: Ingredient[] = [];
  for (let index = 1; index <= 20; index++) {
    const name = record[`strIngredient${index}`]?.trim();
    if (!name) continue;
    ingredients.push({ name, measure: record[`strMeasure${index}`]?.trim() ?? "" });
  }
  return ingredients;
}

function readSteps(instructions: string | null) {
  const lines = (instructions ?? "")
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(step\s*\d+[:.)]?)\s*/i, "").trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  return (lines[0] ?? "")
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function readTags(tags: string | null) {
  return (tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function lookup(kind: ProductKind, id: string): Promise<Record_ | null> {
  return kind === "meal" ? lookupMeal(id) : lookupDrink(id);
}

function recordOrigin(record: Record_) {
  return "strArea" in record ? (record.strArea ?? undefined) : undefined;
}

function recordGlass(record: Record_) {
  return "strGlass" in record ? (record.strGlass ?? undefined) : undefined;
}

const LOOKUP_CONCURRENCY = 4;

async function toProducts(config: SectionConfig, summaries: Summary[]): Promise<SeedProduct[]> {
  const picked = spread(summaries, config.limit);
  return mapLimit(picked, LOOKUP_CONCURRENCY, async (summary) => {
    const record = await lookup(config.kind, summary.id);
    const index = picked.indexOf(summary);
    const origin = summary.origin ?? (record ? recordOrigin(record) : undefined);
    const glass = record ? recordGlass(record) : undefined;
    return {
      id: summary.id,
      kind: config.kind,
      name: summary.name,
      image: summary.image,
      sectionId: config.id,
      price: priceFor(config, summary.id),
      signature: index < SIGNATURE_PER_SECTION,
      ...(origin ? { origin } : {}),
      ...(glass ? { glass } : {}),
      tags: record ? readTags(record.strTags) : [],
      ingredients: record ? readIngredients(record) : [],
      steps: record ? readSteps(record.strInstructions) : [],
    };
  });
}

async function mealSummaries(categories: string[]): Promise<Summary[]> {
  const lists = await Promise.all(categories.map((category) => listMeals(category)));
  return interleave(lists).map((meal) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    origin: meal.strCountry ?? meal.strArea ?? undefined,
  }));
}

export async function buildCatalogFromApis(): Promise<SeedSection[]> {
  const nonAlcoholic = await listNonAlcoholic();
  const allowedDrinks = new Map(nonAlcoholic.map((drink) => [drink.idDrink, drink]));
  const usedDrinks = new Set<string>();

  const sections: SeedSection[] = [];
  for (const [position, config] of sectionConfigs.entries()) {
    let summaries: Summary[];

    if (config.kind === "meal") {
      summaries = await mealSummaries(config.sources as string[]);
    } else if (config.sources === "rest") {
      summaries = nonAlcoholic
        .filter((drink) => !usedDrinks.has(drink.idDrink))
        .map((drink) => ({ id: drink.idDrink, name: drink.strDrink, image: drink.strDrinkThumb }));
    } else {
      const lists = await Promise.all(config.sources.map((category) => listDrinks(category)));
      summaries = interleave(lists)
        .filter((drink) => allowedDrinks.has(drink.idDrink) && !usedDrinks.has(drink.idDrink))
        .map((drink) => ({ id: drink.idDrink, name: drink.strDrink, image: drink.strDrinkThumb }));
    }

    const products = await toProducts(config, summaries);
    if (config.kind === "drink") products.forEach((product) => usedDrinks.add(product.id));

    sections.push({
      id: config.id,
      kind: config.kind,
      position,
      title: config.title,
      blurb: config.blurb,
      products,
    });
  }

  return sections;
}
