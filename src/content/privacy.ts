import type { Localized } from "@/i18n/dictionaries";

export type PrivacySection = {
  title: Localized;
  body: Localized[];
};

// Generic, defensible content for a small hospitality business site — modelled on GDPR / the
// Bulgarian Закон за защита на личните данни (ЗЗЛД). Placeholders (company name, address, email)
// live in src/lib/site.ts. Have the client's lawyer review before this goes live.
export const privacyIntro: Localized = {
  bg: "Последна редакция: септември 2026 г. Тази политика обяснява какви данни събираме чрез този уебсайт и как ги използваме.",
  en: "Last updated: September 2026. This policy explains what data we collect through this website and how we use it.",
};

export const privacySections: PrivacySection[] = [
  {
    title: { bg: "Кои сме ние", en: "Who we are" },
    body: [
      {
        bg: "Този сайт се поддържа от Brewlucks (\"ние\", \"нас\"). За всякакви въпроси относно вашите данни можете да се свържете с нас по начина, посочен в края на тази страница.",
        en: "This website is operated by Brewlucks (\"we\", \"us\"). For any questions about your data, you can reach us using the contact details at the end of this page.",
      },
    ],
  },
  {
    title: { bg: "Какви данни събираме", en: "What data we collect" },
    body: [
      {
        bg: "Когато ни пишете през контактната форма, събираме данните, които сами въвеждате — име, телефон или WhatsApp контакт и съдържанието на съобщението. Тези данни се изпращат директно на нашия WhatsApp номер и не преминават през наш сървър, нито се съхраняват в база данни на сайта.",
        en: "When you write to us through the contact form, we collect what you enter yourself — your name, phone or WhatsApp contact and the message content. This information is sent directly to our WhatsApp number and does not pass through or get stored in a database on this website.",
      },
      {
        bg: "Сайтът запомня избрания от вас език (български или английски) локално във вашия браузър, за по-удобно ползване. Тази информация не напуска устройството ви и ние нямаме достъп до нея.",
        en: "The site remembers your chosen language (Bulgarian or English) locally in your browser, for convenience. This information never leaves your device and we have no access to it.",
      },
      {
        bg: "Не използваме инструменти за проследяване на поведението, нито маркетингови бисквитки.",
        en: "We do not use behavioural tracking tools or marketing cookies.",
      },
    ],
  },
  {
    title: { bg: "Как използваме вашите данни", en: "How we use your data" },
    body: [
      {
        bg: "Данните от контактната форма използваме единствено за да отговорим на вашето запитване или резервация, чрез WhatsApp. Не ги използваме за маркетингови цели без вашето изрично съгласие.",
        en: "We use contact form data solely to respond to your inquiry or reservation, via WhatsApp. We do not use it for marketing purposes without your explicit consent.",
      },
    ],
  },
  {
    title: { bg: "Споделяне с трети страни", en: "Sharing with third parties" },
    body: [
      {
        bg: "Съобщенията, изпратени през контактната форма, се отварят във WhatsApp (Meta Platforms, Inc.) на вашето устройство и се изпращат от вас; WhatsApp ги обработва съгласно собствената си политика за поверителност. Картата с локацията на сайта използва Google Maps — тя се зарежда директно от Google при отваряне на страницата.",
        en: "Messages composed through the contact form open in WhatsApp (Meta Platforms, Inc.) on your device and are sent by you; WhatsApp processes them under its own privacy policy. The location map on this site uses Google Maps, loaded directly from Google when the page opens.",
      },
      {
        bg: "Снимките на ястията и напитките в менюто и галерията се зареждат от сървърите на TheMealDB и TheCocktailDB. Тези услуги могат да видят IP адреса ви при зареждане на изображение, но не получават други ваши данни.",
        en: "Photos of dishes and drinks in the menu and gallery are loaded from the servers of TheMealDB and TheCocktailDB. These services may see your IP address when an image loads, but receive no other data about you.",
      },
      {
        bg: "Сайтът се хоства на инфраструктурата на Cloudflare, която може да записва основни технически данни за посещението (IP адрес, време на достъп) с цел сигурност и работа на услугата.",
        en: "The site is hosted on Cloudflare infrastructure, which may log basic technical visit data (IP address, access time) for security and service operation.",
      },
    ],
  },
  {
    title: { bg: "Колко дълго съхраняваме данните", en: "How long we keep data" },
    body: [
      {
        bg: "Съобщенията и контактите се съхраняват толкова дълго, колкото е необходимо, за да отговорим на вашето запитване, съгласно правилата на самото приложение WhatsApp. Ако желаете да изтрием кореспонденцията, свържете се с нас.",
        en: "We keep messages and contacts for as long as needed to respond to your inquiry, subject to WhatsApp's own retention rules. If you'd like us to delete a conversation, let us know.",
      },
    ],
  },
  {
    title: { bg: "Вашите права", en: "Your rights" },
    body: [
      {
        bg: "Имате право да поискате достъп, коригиране или изтриване на вашите данни, както и да подадете жалба до Комисията за защита на личните данни (КЗЛД) на Република България.",
        en: "You have the right to request access to, correction of, or deletion of your data, and to lodge a complaint with the Commission for Personal Data Protection (CPDP) of the Republic of Bulgaria.",
      },
    ],
  },
  {
    title: { bg: "Промени в тази политика", en: "Changes to this policy" },
    body: [
      {
        bg: "Тази политика може периодично да се актуализира. Датата на последната редакция е посочена в началото на страницата.",
        en: "This policy may be updated from time to time. The date of the last change is shown at the top of the page.",
      },
    ],
  },
];
