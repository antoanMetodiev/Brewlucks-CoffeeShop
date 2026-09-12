// Placeholder business details — replace with the client's real content when the asset folder arrives.
export const site = {
  name: "Brewlucks",
  address: {
    street: "Ulitsa i nomer",
    city: "Sofia, Bulgaria",
    // Placeholder pin — National Assembly Square, central Sofia. Not the venue's real location.
    // Replace with the real coordinates (and mapsUrl below) once the client confirms the address.
    coordinates: { lat: 42.6953, lng: 23.3327 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=42.6953,23.3327",
  },
  whatsappNumber: "359880000000",
  // Placeholder — replace with the venue's real registered legal name and contact email
  // once available; used on the privacy policy as the data controller's identity.
  legalName: "Brewlucks EOOD",
  privacyEmail: "privacy@brewlucks.bg",
  instagram: {
    handle: "@brewlucks",
    url: "https://instagram.com",
  },
};

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}`;

export function whatsappMessageUrl(text: string) {
  return `${whatsappUrl}?text=${encodeURIComponent(text)}`;
}

// Real venue footage (Google Maps contributor clip, 568×320 — a placeholder until the client
// sends proper hero footage; will look soft at full-bleed sizes).
export const heroVideo = "/videos/venue-reference.mp4";
