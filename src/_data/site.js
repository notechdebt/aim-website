// Business details used across every page and the structured data.
// Keep name, address and phone identical to the Google Business Profile.
export default {
  name: "AIM Business Inc",
  url: "https://aimbusinessinc.com",
  phone: "(917) 584-4604",
  phoneHref: "tel:+19175844604",
  phoneSchema: "+1-917-584-4604",
  email: "aimbusinessinc@aol.com",
  address: {
    street: "23-18 Steinway Street",
    streetSchema: "23-18 Steinway St",
    city: "Astoria",
    region: "NY",
    zip: "11105",
    full: "23-18 Steinway Street, Astoria, NY 11105",
  },
  geo: { lat: 40.770712, lng: -73.908778 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=23-18+Steinway+St+Astoria+NY+11105",
  areas: ["Astoria", "Long Island City", "Sunnyside", "Woodside", "Jackson Heights"],
  ogImage: "/images/og-image.jpg",
  portrait: "/images/anila-gjika-accountant-astoria.webp",
  // TODO: opening hours, e.g. [{ days: ["Monday", "Tuesday"], opens: "09:00", closes: "18:00" }]
  hours: [],
  // TODO: Google Business Profile, Yelp, Facebook URLs
  sameAs: [],
  year: new Date().getFullYear(),
  analyticsToken: "733f49c34862458293d08e835ed3fc3a",
};
