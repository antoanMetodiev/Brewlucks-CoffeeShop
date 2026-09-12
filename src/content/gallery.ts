import type { Localized } from "@/i18n/dictionaries";
import type { StaticImageData } from "next/image";

import terrace from "../../public/images/venue/terrace.webp";
import interior from "../../public/images/venue/interior.webp";
import bar from "../../public/images/venue/second-image.jpg";
import platter from "../../public/images/gallery-section/1.jpg";
import fried from "../../public/images/gallery-section/2.jpg";
import espresso from "../../public/images/gallery-section/3.jpg";
import dessert from "../../public/images/gallery-section/4.jpg";
import lemonades from "../../public/images/gallery-section/5.jpg";
import burger from "../../public/images/gallery-section/6.jpg";
import onionRings from "../../public/images/gallery-section/7.jpg";
import icedCoffee from "../../public/images/gallery-section/8.jpg";

export type VenuePhoto = {
  image: StaticImageData;
  caption: Localized;
};

// The venue's own photos — the home page uses the first three, the gallery shows all of them.
export const venuePhotos: VenuePhoto[] = [
  { image: terrace, caption: { bg: "Терасата на улицата.", en: "The street terrace." } },
  { image: interior, caption: { bg: "Салонът вътре.", en: "The room inside." } },
  { image: bar, caption: { bg: "Барът.", en: "The bar." } },
  { image: platter, caption: { bg: "Маса, направена за споделяне.", en: "A table made for sharing." } },
  { image: fried, caption: { bg: "Яйца на тост, с пържени картофи.", en: "Eggs on toast, fries alongside." } },
  { image: espresso, caption: { bg: "Кратко кафе, дълга пауза.", en: "Short coffee, long pause." } },
  { image: dessert, caption: { bg: "Десерт без свян.", en: "A dessert with no restraint." } },
  { image: lemonades, caption: { bg: "Лято в две чаши.", en: "Summer in two glasses." } },
  { image: burger, caption: { bg: "Бургерът, без компромис.", en: "The burger, no compromise." } },
  { image: onionRings, caption: { bg: "Кула от лукови кръгчета.", en: "A tower of onion rings." } },
  { image: icedCoffee, caption: { bg: "Студено кафе с изглед към градината.", en: "Iced coffee with a view of the garden." } },
];
