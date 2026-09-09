import type { Localized } from "@/i18n/dictionaries";
import type { StaticImageData } from "next/image";

import platter from "../../public/images/gallery-section/1.jpg";
import fried from "../../public/images/gallery-section/2.jpg";
import espresso from "../../public/images/gallery-section/3.jpg";
import dessert from "../../public/images/gallery-section/4.jpg";
import lemonades from "../../public/images/gallery-section/5.jpg";
import burger from "../../public/images/gallery-section/6.jpg";
import onionRings from "../../public/images/gallery-section/7.jpg";
import icedCoffee from "../../public/images/gallery-section/8.jpg";

export type GalleryItem = {
  image: StaticImageData;
  caption: Localized;
};

export const galleryItems: GalleryItem[] = [
  {
    image: platter,
    caption: {
      sr: "Sto koji se deli.",
      en: "A table made for sharing.",
    },
  },
  {
    image: fried,
    caption: {
      sr: "Jaja na tostu, uz krompiriće.",
      en: "Eggs on toast, fries alongside.",
    },
  },
  {
    image: espresso,
    caption: {
      sr: "Kratka kafa, duga pauza.",
      en: "Short coffee, long pause.",
    },
  },
  {
    image: dessert,
    caption: {
      sr: "Desert koji se ne stidi.",
      en: "A dessert with no restraint.",
    },
  },
  {
    image: lemonades,
    caption: {
      sr: "Leto u dve čaše.",
      en: "Summer in two glasses.",
    },
  },
  {
    image: burger,
    caption: {
      sr: "Burger, bez kompromisa.",
      en: "The burger, no compromise.",
    },
  },
  {
    image: onionRings,
    caption: {
      sr: "Kula od prstenova.",
      en: "A tower of onion rings.",
    },
  },
  {
    image: icedCoffee,
    caption: {
      sr: "Ledena kafa uz pogled na baštu.",
      en: "Iced coffee with a view of the garden.",
    },
  },
];
