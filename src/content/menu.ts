import type { Localized } from "@/i18n/dictionaries";

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

// Placeholder menu — the categories follow what the venue's own photos show, but every item
// and price still needs to be replaced with the client's real menu.
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
        name: { sr: "Čokoladna tegla", en: "Chocolate jar" },
        description: {
          sr: "Šlag, čokolada i hrskavi preliv — desert koji se deli, ali retko.",
          en: "Whipped cream, chocolate and a crunchy topping — meant to share, rarely shared.",
        },
        price: 690,
        signature: true,
      },
    ],
  },
  {
    id: "dorucak",
    title: { sr: "Doručak", en: "Breakfast" },
    items: [
      {
        name: { sr: "Jaja na tostu", en: "Eggs on toast" },
        description: {
          sr: "Dva jaja, puter i vlašac, uz krompiriće.",
          en: "Two eggs, butter and chives, with fries on the side.",
        },
        price: 690,
      },
      {
        name: { sr: "Kajgana sa slaninom", en: "Scrambled eggs with bacon" },
        price: 720,
      },
      {
        name: { sr: "Omlet sa sirom", en: "Cheese omelette" },
        price: 620,
      },
      {
        name: { sr: "Avokado tost", en: "Avocado toast" },
        description: {
          sr: "Avokado, limun, susam i čili.",
          en: "Avocado, lemon, sesame and chilli.",
        },
        price: 780,
      },
      { name: { sr: "Palačinke", en: "Pancakes" }, price: 590 },
    ],
  },
  {
    id: "burgeri",
    title: { sr: "Burgeri", en: "Burgers" },
    items: [
      {
        name: { sr: "Klasičan burger", en: "Classic burger" },
        description: {
          sr: "Junetina, paradajz, kiseli krastavac i domaći sos.",
          en: "Beef, tomato, pickles and house sauce.",
        },
        price: 890,
      },
      {
        name: { sr: "Cheeseburger", en: "Cheeseburger" },
        description: {
          sr: "Dupli čedar koji se topi preko ivice.",
          en: "Double cheddar, melted over the edge.",
        },
        price: 950,
      },
      { name: { sr: "Burger sa slaninom", en: "Bacon burger" }, price: 1050 },
      { name: { sr: "Pileći burger", en: "Chicken burger" }, price: 920 },
    ],
  },
  {
    id: "rostilj",
    title: { sr: "Sa roštilja", en: "From the grill" },
    items: [
      {
        name: { sr: "Mešano meso za dvoje", en: "Mixed grill for two" },
        description: {
          sr: "Pljeskavica, ražnjići, kobasica i prilozi na dasci.",
          en: "Pljeskavica, skewers, sausage and sides, served on a board.",
        },
        price: 2200,
      },
      { name: { sr: "Pljeskavica", en: "Pljeskavica" }, price: 890 },
      { name: { sr: "Ražnjići", en: "Grilled skewers" }, price: 1250 },
      { name: { sr: "Pileći file", en: "Chicken fillet" }, price: 1150 },
      { name: { sr: "Biftek", en: "Beef steak" }, price: 1950 },
    ],
  },
  {
    id: "paste",
    title: { sr: "Paste", en: "Pasta" },
    items: [
      {
        name: { sr: "Karbonara", en: "Carbonara" },
        description: {
          sr: "Slanina, jaje i parmezan — bez pavlake.",
          en: "Bacon, egg and parmesan — no cream.",
        },
        price: 990,
      },
      { name: { sr: "Pasta sa piletinom", en: "Chicken pasta" }, price: 1050 },
      { name: { sr: "Pasta sa povrćem", en: "Vegetable pasta" }, price: 890 },
    ],
  },
  {
    id: "prilozi",
    title: { sr: "Prilozi", en: "Sides" },
    items: [
      { name: { sr: "Pomfrit", en: "Fries" }, price: 290 },
      {
        name: { sr: "Kolutovi luka", en: "Onion rings" },
        description: {
          sr: "Hrskavi, naslagani u kulu.",
          en: "Crisp, stacked into a tower.",
        },
        price: 390,
      },
      { name: { sr: "Sezonska salata", en: "Seasonal salad" }, price: 350 },
      { name: { sr: "Domaći sos", en: "House sauce" }, price: 120 },
    ],
  },
  {
    id: "slatko",
    title: { sr: "Slatko", en: "Sweets" },
    items: [
      { name: { sr: "Čizkejk", en: "Cheesecake" }, price: 520 },
      { name: { sr: "Brauni sa sladoledom", en: "Brownie with ice cream" }, price: 550 },
      { name: { sr: "Palačinke sa čokoladom", en: "Chocolate pancakes" }, price: 480 },
      { name: { sr: "Sladoled", en: "Ice cream" }, price: 320 },
    ],
  },
  {
    id: "kafa",
    title: { sr: "Kafa", en: "Coffee" },
    items: [
      { name: { sr: "Domaća kafa", en: "Turkish coffee" }, price: 180 },
      { name: { sr: "Espresso", en: "Espresso" }, price: 190 },
      { name: { sr: "Macchiato", en: "Macchiato" }, price: 220 },
      { name: { sr: "Cappuccino", en: "Cappuccino" }, price: 300 },
      { name: { sr: "Flat white", en: "Flat white" }, price: 340 },
      {
        name: { sr: "Ledena kafa", en: "Iced coffee" },
        description: {
          sr: "Sa šlagom i čokoladnim prelivom.",
          en: "With whipped cream and chocolate sauce.",
        },
        price: 420,
      },
    ],
  },
  {
    id: "napici",
    title: { sr: "Napici", en: "Drinks" },
    items: [
      {
        name: { sr: "Domaća limunada", en: "House lemonade" },
        description: {
          sr: "Sveže ceđena, u nekoliko ukusa.",
          en: "Freshly squeezed, in a few flavours.",
        },
        price: 350,
      },
      { name: { sr: "Ceđena pomorandža", en: "Fresh orange juice" }, price: 380 },
      { name: { sr: "Sokovi", en: "Soft drinks" }, price: 280 },
      { name: { sr: "Čaj", en: "Tea" }, price: 250 },
      { name: { sr: "Voda", en: "Water" }, price: 150 },
    ],
  },
];
