import type { Localized } from "@/i18n/dictionaries";

export type SignatureStep = {
  image: string;
  title: Localized;
  body: Localized;
};

export const signatureSteps: SignatureStep[] = [
  {
    image: "/images/double-espresso.jpg",
    title: { sr: "Dupli espresso", en: "Double espresso" },
    body: {
      sr: "Sveže mleveno zrno i ekstrakcija od dvadeset sedam sekundi.",
      en: "Freshly ground beans and a twenty-seven second extraction.",
    },
  },
  {
    image: "/images/vanilla-cream.jpg",
    title: { sr: "Krem od vanile", en: "Vanilla cream" },
    body: {
      sr: "Mutimo ga ujutru, sa pravom vanilom i bez šećera u prahu.",
      en: "Whipped in the morning, with real vanilla and no icing sugar.",
    },
  },
  {
    image: "/images/salted-carammel.jpg",
    title: { sr: "Slani karamel", en: "Salted caramel" },
    body: {
      sr: "Kuvan do tamnog ćilibara, sa prstohvatom morske soli.",
      en: "Cooked down to dark amber, with a pinch of sea salt.",
    },
  },
  {
    image: "/images/layered-in-the-jar.jpg",
    title: { sr: "Slaganje u teglu", en: "Layered in the jar" },
    body: {
      sr: "Sloj po sloj, da svaki gutljaj bude malo drugačiji.",
      en: "Layer by layer, so every sip tastes a little different.",
    },
  },
];
