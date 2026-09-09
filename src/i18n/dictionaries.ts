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
  home: {
    heroEyebrow: "Beograd",
    heroTitle: "Kafa koja se ne žuri.",
    heroLead:
      "Bistro i kafe bar u kojem se doručak servira do podneva, a razgovor traje duže.",
    scroll: "Skrolujte",
    statementTitle: "Sve počinje od zrna.",
    statementBody:
      "Biramo male pržionice, menjamo zrno svake nedelje i podešavamo mlin svakog jutra. Ono što stigne do šoljice je zbir tih sitnih odluka.",
    signatureEyebrow: "Potpis kuće",
    signatureTitle: "Kako nastaje Jar No. 1",
    signatureSteps: [
      {
        title: "Dupli espresso",
        body: "Sveže mleveno zrno i ekstrakcija od dvadeset sedam sekundi.",
      },
      {
        title: "Krem od vanile",
        body: "Mutimo ga ujutru, sa pravom vanilom i bez šećera u prahu.",
      },
      {
        title: "Slani karamel",
        body: "Kuvan do tamnog ćilibara, sa prstohvatom morske soli.",
      },
      {
        title: "Slaganje u teglu",
        body: "Sloj po sloj, da svaki gutljaj bude malo drugačiji.",
      },
    ],
    ctaTitle: "Vidimo se ujutru.",
    ctaBody: "Rezervišite sto ili nam pišite — javljamo se na WhatsApp-u.",
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
  home: {
    heroEyebrow: "Belgrade",
    heroTitle: "Coffee that takes its time.",
    heroLead:
      "A bistro and coffee bar where breakfast runs until noon and the conversation runs longer.",
    scroll: "Scroll",
    statementTitle: "It all starts with the bean.",
    statementBody:
      "We pick small roasteries, rotate the beans every week and dial in the grinder every morning. What reaches the cup is the sum of those small decisions.",
    signatureEyebrow: "Signature",
    signatureTitle: "How Jar No. 1 is made",
    signatureSteps: [
      {
        title: "Double espresso",
        body: "Freshly ground beans and a twenty-seven second extraction.",
      },
      {
        title: "Vanilla cream",
        body: "Whipped in the morning, with real vanilla and no icing sugar.",
      },
      {
        title: "Salted caramel",
        body: "Cooked down to dark amber, with a pinch of sea salt.",
      },
      {
        title: "Layered in the jar",
        body: "Layer by layer, so every sip tastes a little different.",
      },
    ],
    ctaTitle: "See you in the morning.",
    ctaBody: "Reserve a table or write to us — we reply on WhatsApp.",
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
