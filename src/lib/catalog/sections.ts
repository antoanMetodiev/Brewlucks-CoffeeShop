import type { Localized } from "@/i18n/dictionaries";
import type { ProductKind } from "./types";

export type SectionConfig = {
  id: string;
  kind: ProductKind;
  title: Localized;
  blurb: Localized;
  // TheMealDB categories, or TheCocktailDB categories (always intersected with Non_Alcoholic).
  // "rest" = every non-alcoholic drink not already used by an earlier drink section.
  sources: string[] | "rest";
  limit: number;
  price: [min: number, max: number];
};

export const sectionConfigs: SectionConfig[] = [
  {
    id: "breakfast",
    kind: "meal",
    title: { bg: "Закуска", en: "Breakfast" },
    blurb: { bg: "От сутрин до обяд, без бързане.", en: "Served from opening until noon, unhurried." },
    sources: ["Breakfast"],
    limit: 20,
    price: [8, 15],
  },
  {
    id: "starters",
    kind: "meal",
    title: { bg: "Стартери и гарнитури", en: "Starters & sides" },
    blurb: { bg: "За споделяне или за начало.", en: "To share, or to start with." },
    sources: ["Starter", "Side"],
    limit: 24,
    price: [6, 14],
  },
  {
    id: "mains",
    kind: "meal",
    title: { bg: "Основни", en: "Mains" },
    blurb: { bg: "Телешко, пилешко, агнешко и свинско от скарата и фурната.", en: "Beef, chicken, lamb and pork, from the grill and the oven." },
    sources: ["Beef", "Chicken", "Lamb", "Pork"],
    limit: 32,
    price: [16, 34],
  },
  {
    id: "seafood",
    kind: "meal",
    title: { bg: "Риба и морски дарове", en: "Fish & seafood" },
    blurb: { bg: "Прясно, леко и на скара.", en: "Fresh, light and off the grill." },
    sources: ["Seafood"],
    limit: 20,
    price: [18, 38],
  },
  {
    id: "pasta",
    kind: "meal",
    title: { bg: "Паста", en: "Pasta" },
    blurb: { bg: "Прясна паста, приготвена на момента.", en: "Fresh pasta, made to order." },
    sources: ["Pasta"],
    limit: 12,
    price: [14, 22],
  },
  {
    id: "vegetarian",
    kind: "meal",
    title: { bg: "Вегетарианско и веган", en: "Vegetarian & vegan" },
    blurb: { bg: "Зеленчуци в главната роля.", en: "Vegetables in the leading role." },
    sources: ["Vegetarian", "Vegan"],
    limit: 24,
    price: [12, 20],
  },
  {
    id: "desserts",
    kind: "meal",
    title: { bg: "Десерти", en: "Desserts" },
    blurb: { bg: "Сладкият край на всяко посещение.", en: "The sweet end to every visit." },
    sources: ["Dessert"],
    limit: 28,
    price: [7, 13],
  },
  {
    id: "coffee",
    kind: "drink",
    title: { bg: "Кафе и чай", en: "Coffee & tea" },
    blurb: { bg: "Прясно изпечено кафе и чай от листа.", en: "Freshly roasted coffee and loose-leaf tea." },
    sources: ["Coffee / Tea"],
    limit: 12,
    price: [3, 8],
  },
  {
    id: "shakes",
    kind: "drink",
    title: { bg: "Шейкове и какао", en: "Shakes & cocoa" },
    blurb: { bg: "Гъсти, студени и топли.", en: "Thick, cold and warm." },
    sources: ["Shake", "Cocoa"],
    limit: 15,
    price: [6, 11],
  },
  {
    id: "lemonades",
    kind: "drink",
    title: { bg: "Лимонади и моктейли", en: "Lemonades & mocktails" },
    blurb: { bg: "Без алкохол, с много плодове.", en: "Alcohol-free, fruit-forward." },
    sources: "rest",
    limit: 40,
    price: [5, 10],
  },
];
