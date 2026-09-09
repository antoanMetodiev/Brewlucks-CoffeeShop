import type { Language } from "@/i18n/dictionaries";

export type Localized = Record<Language, string>;

export type MenuItem = {
  name: Localized;
  description?: Localized;
  price: number;
  signature?: boolean;
};

export type MenuCategory = {
  id: string;
  title: Localized;
  items: MenuItem[];
};

export const currency: Localized = { sr: "din", en: "RSD" };

// Placeholder menu content — replace with the client's real items and prices.
export const menu: MenuCategory[] = [
  {
    id: "potpis",
    title: { sr: "Potpis kuće", en: "Signature" },
    items: [
      {
        name: { sr: "Jar No. 1", en: "Jar No. 1" },
        description: {
          sr: "Dupli espresso, domaći krem od vanile i slani karamel, slagani u tegli.",
          en: "Double espresso, house vanilla cream and salted caramel, layered in a jar.",
        },
        price: 420,
        signature: true,
      },
      {
        name: { sr: "Espresso tonik", en: "Espresso tonic" },
        description: {
          sr: "Espresso, tonik i kora pomorandže.",
          en: "Espresso, tonic water and orange peel.",
        },
        price: 380,
      },
    ],
  },
  {
    id: "kafa",
    title: { sr: "Kafa", en: "Coffee" },
    items: [
      { name: { sr: "Espresso", en: "Espresso" }, price: 190 },
      { name: { sr: "Doppio", en: "Doppio" }, price: 240 },
      { name: { sr: "Macchiato", en: "Macchiato" }, price: 210 },
      { name: { sr: "Cortado", en: "Cortado" }, price: 260 },
      { name: { sr: "Cappuccino", en: "Cappuccino" }, price: 300 },
      { name: { sr: "Flat white", en: "Flat white" }, price: 330 },
      {
        name: { sr: "Filter kafa", en: "Filter coffee" },
        description: {
          sr: "Zrno iz male serije, menja se svake nedelje.",
          en: "Small-batch beans, rotating every week.",
        },
        price: 280,
      },
      {
        name: { sr: "Cold brew", en: "Cold brew" },
        description: {
          sr: "Hladno ekstrahovan osamnaest sati.",
          en: "Cold extracted for eighteen hours.",
        },
        price: 350,
      },
    ],
  },
  {
    id: "napici",
    title: { sr: "Ostali napici", en: "Other drinks" },
    items: [
      { name: { sr: "Matcha latte", en: "Matcha latte" }, price: 380 },
      { name: { sr: "Čaj", en: "Tea" }, price: 260 },
      { name: { sr: "Topla čokolada", en: "Hot chocolate" }, price: 340 },
      { name: { sr: "Domaća limunada", en: "House lemonade" }, price: 320 },
      { name: { sr: "Ceđeni sok", en: "Fresh juice" }, price: 360 },
    ],
  },
  {
    id: "dorucak",
    title: { sr: "Doručak", en: "Breakfast" },
    items: [
      {
        name: { sr: "Kajgana sa tostom", en: "Scrambled eggs on toast" },
        description: {
          sr: "Tri jaja, puter i vlašac na kiselom testu.",
          en: "Three eggs, butter and chives on sourdough.",
        },
        price: 690,
      },
      {
        name: { sr: "Avokado tost", en: "Avocado toast" },
        description: {
          sr: "Avokado, limun, susam i čili.",
          en: "Avocado, lemon, sesame and chilli.",
        },
        price: 780,
      },
      {
        name: { sr: "Šakšuka", en: "Shakshuka" },
        description: {
          sr: "Paradajz, paprika, jaja i feta.",
          en: "Tomato, pepper, eggs and feta.",
        },
        price: 850,
      },
      {
        name: { sr: "Tost sa lososom", en: "Salmon toast" },
        description: {
          sr: "Dimljeni losos, krem sir i kapari.",
          en: "Smoked salmon, cream cheese and capers.",
        },
        price: 950,
      },
      { name: { sr: "Palačinke", en: "Pancakes" }, price: 620 },
    ],
  },
  {
    id: "tegle",
    title: { sr: "Tegle", en: "Jars" },
    items: [
      {
        name: { sr: "Granola tegla", en: "Granola jar" },
        description: {
          sr: "Domaća granola, jogurt i sezonsko voće.",
          en: "House granola, yoghurt and seasonal fruit.",
        },
        price: 520,
      },
      { name: { sr: "Chia puding", en: "Chia pudding" }, price: 480 },
      { name: { sr: "Overnight oats", en: "Overnight oats" }, price: 500 },
      { name: { sr: "Voćna tegla", en: "Fruit jar" }, price: 460 },
    ],
  },
  {
    id: "slatko",
    title: { sr: "Slatko", en: "Sweets" },
    items: [
      { name: { sr: "Čizkejk", en: "Cheesecake" }, price: 480 },
      { name: { sr: "Brauni", en: "Brownie" }, price: 420 },
      { name: { sr: "Kroasan", en: "Croissant" }, price: 260 },
      { name: { sr: "Cimet rolna", en: "Cinnamon roll" }, price: 380 },
    ],
  },
];
