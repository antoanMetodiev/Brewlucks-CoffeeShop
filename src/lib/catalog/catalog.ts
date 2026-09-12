import { cache } from "react";
import { sectionConfigs, type SectionConfig } from "./sections";
import { listMeals, lookupMeal, type MealRecord } from "./themealdb";
import { listDrinks, listNonAlcoholic, lookupDrink, type DrinkRecord } from "./thecocktaildb";
import type { Catalog, Ingredient, Product, ProductDetail, ProductKind, Section } from "./types";

const SIGNATURE_PER_SECTION = 2;
const DRINK_OF_THE_DAY_ID = "12770";

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

type Summary = { id: string; name: string; image: string; origin?: string };

function toProducts(config: SectionConfig, summaries: Summary[]): Product[] {
  return spread(summaries, config.limit).map((summary, index) => ({
    id: summary.id,
    kind: config.kind,
    name: summary.name,
    image: summary.image,
    sectionId: config.id,
    price: priceFor(config, summary.id),
    signature: index < SIGNATURE_PER_SECTION,
    ...(summary.origin ? { origin: summary.origin } : {}),
  }));
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

export const getCatalog = cache(async (): Promise<Catalog> => {
  const nonAlcoholic = await listNonAlcoholic();
  const allowedDrinks = new Map(nonAlcoholic.map((drink) => [drink.idDrink, drink]));
  const usedDrinks = new Set<string>();

  const sections: Section[] = [];
  for (const config of sectionConfigs) {
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

    const products = toProducts(config, summaries);
    if (config.kind === "drink") products.forEach((product) => usedDrinks.add(product.id));

    sections.push({
      id: config.id,
      kind: config.kind,
      title: config.title,
      blurb: config.blurb,
      products,
    });
  }

  return sections;
});

export async function getFeatured(count = 8): Promise<Product[]> {
  const catalog = await getCatalog();
  return catalog.slice(0, count).map((section) => section.products[0]);
}

function readIngredients(record: MealRecord | DrinkRecord): Ingredient[] {
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

export async function getProduct(kind: ProductKind, id: string): Promise<ProductDetail | null> {
  const catalog = await getCatalog();
  const product = catalog
    .flatMap((section) => section.products)
    .find((candidate) => candidate.kind === kind && candidate.id === id);
  if (!product) return null;

  if (kind === "meal") {
    const record = await lookupMeal(id);
    if (!record) return null;
    return {
      ...product,
      origin: product.origin ?? record.strArea ?? undefined,
      tags: readTags(record.strTags),
      ingredients: readIngredients(record),
      steps: readSteps(record.strInstructions),
    };
  }

  const record = await lookupDrink(id);
  if (!record) return null;
  return {
    ...product,
    tags: readTags(record.strTags),
    glass: record.strGlass ?? undefined,
    ingredients: readIngredients(record),
    steps: readSteps(record.strInstructions),
  };
}

export async function getDrinkOfTheDay(): Promise<ProductDetail | null> {
  const catalog = await getCatalog();
  const coffee = catalog.find((section) => section.id === "coffee");
  const pick =
    coffee?.products.find((product) => product.id === DRINK_OF_THE_DAY_ID) ?? coffee?.products[0];
  return pick ? getProduct("drink", pick.id) : null;
}
