export type Language = "sr" | "en";

const sr = {
  nav: {
    home: "Početna",
    gallery: "Galerija",
    menu: "Meni",
    contact: "Kontakt",
    privacy: "Politika privatnosti",
  },
  actions: {
    reserve: "Rezerviši",
    whatsapp: "Piši nam na WhatsApp",
    openMenu: "Otvori meni",
    closeMenu: "Zatvori meni",
  },
  menu: {
    intro:
      "Kafu pržimo u malim serijama, doručak spremamo po porudžbini, a tegle punimo svakog jutra.",
    categories: "Kategorije",
    signature: "Potpis",
    prices: "Sve cene su u dinarima, sa uračunatim PDV-om.",
    allergens: "Za alergene i sastojke pitajte naše osoblje.",
  },
  footer: {
    tagline: "Kafa, hrana i sporo jutro u srcu grada.",
    visit: "Poseti nas",
    hours: "Radno vreme",
    hoursWeekdays: "Ponedeljak — Petak · 08—22h",
    hoursWeekend: "Subota — Nedelja · 09—23h",
    connect: "Poveži se",
    rights: "Sva prava zadržana.",
  },
  language: {
    label: "Jezik",
    sr: "Srpski",
    en: "Engleski",
  },
};

export type Dictionary = typeof sr;

const en: Dictionary = {
  nav: {
    home: "Home",
    gallery: "Gallery",
    menu: "Menu",
    contact: "Contact",
    privacy: "Privacy policy",
  },
  actions: {
    reserve: "Reserve",
    whatsapp: "Message us on WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  menu: {
    intro:
      "We roast our coffee in small batches, cook breakfast to order, and fill the jars every morning.",
    categories: "Categories",
    signature: "Signature",
    prices: "All prices are in Serbian dinars, VAT included.",
    allergens: "Ask our staff about allergens and ingredients.",
  },
  footer: {
    tagline: "Coffee, food and slow mornings in the heart of the city.",
    visit: "Visit us",
    hours: "Opening hours",
    hoursWeekdays: "Monday — Friday · 08—22h",
    hoursWeekend: "Saturday — Sunday · 09—23h",
    connect: "Connect",
    rights: "All rights reserved.",
  },
  language: {
    label: "Language",
    sr: "Serbian",
    en: "English",
  },
};

export const dictionaries: Record<Language, Dictionary> = { sr, en };
