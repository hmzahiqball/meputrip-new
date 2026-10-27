export const config = {
  dataSource: import.meta.env.VITE_DATA_SOURCE || "mock",
  publishedId: import.meta.env.VITE_SHEETS_PUBLISHED_ID || "",
  gids: {
    regions: import.meta.env.VITE_SHEETS_REGIONS_GID,
    cities: import.meta.env.VITE_SHEETS_CITIES_GID,
    destinations: import.meta.env.VITE_SHEETS_DESTINATIONS_GID,
    packages: import.meta.env.VITE_SHEETS_PACKAGES_GID,
    testimonials: import.meta.env.VITE_SHEETS_TESTIMONIALS_GID,
    company: import.meta.env.VITE_SHEETS_COMPANY_GID,
    legal: import.meta.env.VITE_SHEETS_LEGAL_GID,
    contact: import.meta.env.VITE_SHEETS_CONTACT_GID,
  } as Record<string, string | undefined>,
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || "",
};
