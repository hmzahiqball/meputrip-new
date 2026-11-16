import type { City, Destination } from "../types/travel";
import { catalogPhotos } from "./catalogPhotos";
import catalogs from "./javaCatalogs.json";
import areas from "./tourismAreas.json";

const areaIndex: Record<string, (typeof areas)[keyof typeof areas]> = areas;

const photoKeys: Record<string, string> = {
  "Kawah Putih Gunung Patuha": "kawah-putih",
  "Ranca Upas (penangkaran rusa & bumi perkemahan)": "ranca-upas",
  "Situ Patenggang": "situ-patenggang",
  "Gunung Tangkuban Perahu": "tangkuban-perahu",
  "Kebun Raya Bogor": "kebun-raya-bogor",
  "Situ Cileunca": "situ-cileunca",
  "Situ Cisanti (Titik Nol Kilometer Sungai Citarum)": "situ-cisanti",
  "Waduk Jatigede": "waduk-jatigede",
  "Curug Cimarinjung": "cimarinjung",
  "Pantai Palabuhanratu": "palabuhanratu",
  "Pantai Pangandaran": "pangandaran",
  "Green Canyon (Cukang Taneuh)": "green-canyon",
  "Pantai Batu Karas": "batu-karas",
  "Mercusuar Raja Willem Cikoneng (Titik Nol Anyer-Panarukan)": "cikoneng",
  "Taman Margasatwa Ragunan": "ragunan",
  "Taman Nasional Kepulauan Seribu (Pulau Pari, Pulau Tidung, Pulau Pramuka)":
    "kepulauan-seribu",
  "Setu Babakan": "setu-babakan",
  "Suaka Margasatwa Muara Angke": "muara-angke",
  "Danau Rawa Pening": "rawa-pening",
  "Pantai Parangtritis": "parangtritis",
  "Tebing Breksi": "tebing-breksi",
  "Goa Pindul (tubing sungai bawah tanah)": "goa-pindul",
  "Pantai Timang": "timang",
  "Air Terjun Sri Gethuk": "sri-gethuk",
  "Jembatan Suramadu": "suramadu",
  "Air Terjun Coban Rondo": "coban-rondo",
  "Air Terjun Tumpak Sewu": "tumpak-sewu",
  "Pantai Balekambang": "balekambang",
  "Kawah Aktif Bromo": "bromo",
  "Pura Luhur Poten": "pura-poten",
  "Air Terjun Madakaripura": "madakaripura",
};

const pendingLocations = new Set([
  "Pelabuhan Nelayan Tradisional",
  "lanskap muara pesisir pantura",
  "Pulau Kenjeran",
  "Delta Sungai Brantas",
]);

export const tourismCities: City[] = catalogs.nature.map((entry) => {
  const { id, label, latitude, longitude } = areaIndex[entry.name];
  return {
    id,
    regionId: "jawa",
    name: label,
    kind: "kawasan",
    latitude,
    longitude,
    description: entry.description,
  };
});

export const tourismDestinations: Destination[] = catalogs.nature.flatMap(
  (entry) => {
    const area = areaIndex[entry.name];
    return entry.locations.flatMap((name, index) => {
      // Indonesia.travel places Danau Singkarak in West Sumatra. Keep the source PDF intact.
      if (name === "Danau Singkarak Karawang") return [];

      const photo = catalogPhotos[photoKeys[name]];
      const pending = pendingLocations.has(name);
      return [
        {
          id: `${area.id}-${index + 1}`,
          regionId: "jawa",
          cityId: area.id,
          name,
          description: pending
            ? "Lokasi spesifik perlu dikonfirmasi bersama tim Meputrip."
            : "",
          category: "Wisata alam",
          image: photo?.image,
          imageAlt: photo ? `Foto ${name}` : "",
          photoCredit: photo,
          mapQuery: pending
            ? undefined
            : `${name.split(" (")[0]} ${area.label} Jawa`,
        },
      ];
    });
  },
);
