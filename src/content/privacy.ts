import type { Localized } from "@/i18n/dictionaries";

export type PrivacySection = {
  title: Localized;
  body: Localized[];
};

// Generic, defensible content for a small hospitality business site — modelled on GDPR /
// Serbia's Zakon o zaštiti podataka o ličnosti. Placeholders (company name, address, email)
// live in src/lib/site.ts. Have the client's lawyer review before this goes live.
export const privacyIntro: Localized = {
  sr: "Poslednja izmena: septembar 2026. Ova politika objašnjava koje podatke prikupljamo preko ovog sajta i kako ih koristimo.",
  en: "Last updated: September 2026. This policy explains what data we collect through this website and how we use it.",
};

export const privacySections: PrivacySection[] = [
  {
    title: { sr: "Ko smo mi", en: "Who we are" },
    body: [
      {
        sr: "Ovaj sajt vodi Bistro & Jars (\"mi\", \"nas\"). Za sva pitanja u vezi sa vašim podacima možete nas kontaktirati na način naveden na kraju ove stranice.",
        en: "This website is operated by Bistro & Jars (\"we\", \"us\"). For any questions about your data, you can reach us using the contact details at the end of this page.",
      },
    ],
  },
  {
    title: { sr: "Koje podatke prikupljamo", en: "What data we collect" },
    body: [
      {
        sr: "Kada nam pišete preko kontakt forme, prikupljamo podatke koje sami unesete — ime, broj telefona ili WhatsApp kontakt i sadržaj poruke. Ovi podaci se šalju direktno na naš WhatsApp broj i ne prolaze kroz naš server niti se čuvaju u bazi podataka na sajtu.",
        en: "When you write to us through the contact form, we collect what you enter yourself — your name, phone or WhatsApp contact and the message content. This information is sent directly to our WhatsApp number and does not pass through or get stored in a database on this website.",
      },
      {
        sr: "Sajt pamti vaš izabrani jezik (srpski ili engleski) lokalno u vašem pregledaču, radi udobnijeg korišćenja. Ovaj podatak ne napušta vaš uređaj i mi mu nemamo pristup.",
        en: "The site remembers your chosen language (Serbian or English) locally in your browser, for convenience. This information never leaves your device and we have no access to it.",
      },
      {
        sr: "Ne koristimo alate za praćenje ponašanja niti marketinške kolačiće.",
        en: "We do not use behavioural tracking tools or marketing cookies.",
      },
    ],
  },
  {
    title: { sr: "Kako koristimo vaše podatke", en: "How we use your data" },
    body: [
      {
        sr: "Podatke iz kontakt forme koristimo isključivo da odgovorimo na vaš upit ili rezervaciju, putem WhatsApp-a. Ne koristimo ih u marketinške svrhe bez vašeg izričitog pristanka.",
        en: "We use contact form data solely to respond to your inquiry or reservation, via WhatsApp. We do not use it for marketing purposes without your explicit consent.",
      },
    ],
  },
  {
    title: { sr: "Deljenje sa trećim stranama", en: "Sharing with third parties" },
    body: [
      {
        sr: "Poruke poslate preko kontakt forme prosleđuju se WhatsApp-u (Meta Platforms, Inc.), koji ih obrađuje u skladu sa sopstvenom politikom privatnosti. Mapa lokacije na sajtu koristi OpenStreetMap — ovaj servis ne prima nikakve vaše lične podatke.",
        en: "Messages sent through the contact form are forwarded to WhatsApp (Meta Platforms, Inc.), which processes them under its own privacy policy. The location map on this site uses OpenStreetMap — this service does not receive any of your personal data.",
      },
      {
        sr: "Sajt je hostovan na Vercel infrastrukturi, koja može evidentirati osnovne tehničke podatke o poseti (IP adresa, vreme pristupa) radi sigurnosti i rada servisa.",
        en: "The site is hosted on Vercel infrastructure, which may log basic technical visit data (IP address, access time) for security and service operation.",
      },
    ],
  },
  {
    title: { sr: "Koliko dugo čuvamo podatke", en: "How long we keep data" },
    body: [
      {
        sr: "Poruke i kontakte čuvamo onoliko koliko je potrebno da odgovorimo na vaš upit, u skladu sa pravilima same WhatsApp aplikacije. Ako želite da izbrišemo prepisku, javite nam se.",
        en: "We keep messages and contacts for as long as needed to respond to your inquiry, subject to WhatsApp's own retention rules. If you'd like us to delete a conversation, let us know.",
      },
    ],
  },
  {
    title: { sr: "Vaša prava", en: "Your rights" },
    body: [
      {
        sr: "Imate pravo da zatražite uvid, ispravku ili brisanje svojih podataka, kao i da uložite prigovor Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti Republike Srbije.",
        en: "You have the right to request access to, correction of, or deletion of your data, and to lodge a complaint with the Commissioner for Information of Public Importance and Personal Data Protection of the Republic of Serbia.",
      },
    ],
  },
  {
    title: { sr: "Izmene ove politike", en: "Changes to this policy" },
    body: [
      {
        sr: "Ova politika se može povremeno ažurirati. Datum poslednje izmene naveden je na vrhu stranice.",
        en: "This policy may be updated from time to time. The date of the last change is shown at the top of the page.",
      },
    ],
  },
];
