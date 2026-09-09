export type Language = "sr" | "en";

export type Localized = Record<Language, string>;

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
  home: {
    heroEyebrow: "Beograd",
    heroTitle: "Dobra hrana, bez žurbe.",
    heroLead:
      "Bistro i kafe bar — od doručka do večere, uz dobru kafu i mesto da se zadržite.",
    scroll: "Skrolujte",
    statementTitle: "Sve počinje za stolom.",
    statementBody:
      "Doručak koji se ne žuri, ručak koji se deli i večera koja traje. Kafa je tu od jutra do kasno.",
    signatureEyebrow: "Potpis kuće",
    signatureTitle: "Kako nastaje Jar No. 1",
    atmosphereEyebrow: "Prostor",
    atmosphereTitle: "Bašta ispred, bar iznutra.",
    atmosphereCta: "Pogledajte galeriju",
    findUsEyebrow: "Lokacija",
    findUsTitle: "Nađite nas u Beogradu.",
    findUsCta: "Otvorite mapu",
    ctaTitle: "Vidimo se uskoro.",
    ctaBody: "Rezervišite sto ili nam pišite — javljamo se na WhatsApp-u.",
  },
  gallery: {
    intro: "Tanjiri, čaše i uglovi koje najčešće pamtite.",
    open: "Otvori sliku",
    close: "Zatvori",
    previous: "Prethodna",
    next: "Sledeća",
  },
  menu: {
    intro: "Doručak, roštilj, burgeri i nešto slatko — od jutra do kasno.",
    categories: "Kategorije",
    signature: "Potpis",
    prices: "Sve cene su u dinarima, sa uračunatim PDV-om.",
    allergens: "Za alergene i sastojke pitajte naše osoblje.",
  },
  footer: {
    tagline: "Hrana, kafa i mesto da se zadržite — od jutra do kasno.",
    visit: "Poseti nas",
    hours: "Radno vreme",
    hoursAll: "Ponedeljak — Nedelja",
    hoursTime: "07:30 — 23:30",
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
  home: {
    heroEyebrow: "Belgrade",
    heroTitle: "Good food, unhurried.",
    heroLead:
      "A bistro and coffee bar — from breakfast to dinner, good coffee, and a reason to stay.",
    scroll: "Scroll",
    statementTitle: "It starts at the table.",
    statementBody:
      "Breakfast that isn't rushed, lunch worth sharing, dinner that lingers. Coffee, from morning until late.",
    signatureEyebrow: "Signature",
    signatureTitle: "How Jar No. 1 is made",
    atmosphereEyebrow: "The Space",
    atmosphereTitle: "Terrace out front, bar within.",
    atmosphereCta: "View the gallery",
    findUsEyebrow: "Location",
    findUsTitle: "Find us in Belgrade.",
    findUsCta: "Open in Maps",
    ctaTitle: "See you soon.",
    ctaBody: "Reserve a table or write to us — we reply on WhatsApp.",
  },
  gallery: {
    intro: "The plates, the glasses and the corners people remember.",
    open: "Open image",
    close: "Close",
    previous: "Previous",
    next: "Next",
  },
  menu: {
    intro: "Breakfast, the grill, burgers and something sweet — from morning until late.",
    categories: "Categories",
    signature: "Signature",
    prices: "All prices are in Serbian dinars, VAT included.",
    allergens: "Ask our staff about allergens and ingredients.",
  },
  footer: {
    tagline: "Food, coffee and a place to linger — from morning until late.",
    visit: "Visit us",
    hours: "Opening hours",
    hoursAll: "Monday — Sunday",
    hoursTime: "07:30 — 23:30",
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
