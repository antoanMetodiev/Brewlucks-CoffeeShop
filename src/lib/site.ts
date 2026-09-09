// Placeholder business details — replace with the client's real content when the asset folder arrives.
export const site = {
  name: "Bistro & Jars",
  address: {
    street: "Ulica i broj",
    city: "Beograd, Srbija",
    // Placeholder pin — Republic Square, central Belgrade. Not the venue's real location.
    // Replace with the real coordinates (and mapsUrl below) once the client confirms the address.
    coordinates: { lat: 44.8125, lng: 20.4612 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=44.8125,20.4612",
  },
  whatsappNumber: "381600000000",
  instagram: {
    handle: "@bistroandjars",
    url: "https://instagram.com",
  },
};

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}`;

// Real venue footage (Google Maps contributor clip, 568×320 — a placeholder until the client
// sends proper hero footage; will look soft at full-bleed sizes).
export const heroVideo = "/videos/venue-reference.mp4";
