import type { City, TravelData, TravelRepository } from "../types/travel";
import { mockData } from "../data/mock";
import { config } from "../config/site";
import { parseCsv } from "./csv";
type Row = Record<string, string>;
const fields: Record<string, string[]> = {
  regions: ["id", "name", "tagline", "description"],
  cities: ["id", "regionId", "name"],
  destinations: [
    "id",
    "cityId",
    "regionId",
    "name",
    "description",
    "category",
    "image",
    "imageAlt",
  ],
  packages: [
    "id",
    "regionId",
    "cityId",
    "name",
    "duration",
    "price",
    "type",
    "departure",
    "availability",
    "image",
    "description",
  ],
  testimonials: ["id", "name", "quote", "trip", "rating", "isDemo"],
  company: ["name", "story", "vision", "mission"],
  legal: ["id", "title", "status", "url"],
  contact: ["whatsapp", "email", "phone", "address", "instagram", "hours"],
};
export function validateData(data: TravelData): TravelData {
  for (const key of [
    "regions",
    "cities",
    "destinations",
    "packages",
    "testimonials",
    "legal",
  ] as const) {
    const ids = data[key].map((v) => v.id);
    if (new Set(ids).size !== ids.length)
      throw Error(`ID duplikat pada ${key}.`);
  }
  if (data.regions.some((r) => !mockData.regions.some((m) => m.id === r.id)))
    throw Error("ID wilayah tidak dikenali oleh peta.");
  const cityMap = new Map(data.cities.map((c) => [c.id, c]));
  if (data.cities.some((c) => !data.regions.some((r) => r.id === c.regionId)))
    throw Error("Relasi kota ke wilayah tidak valid.");
  for (const city of data.cities) {
    const hasLatitude = city.latitude !== undefined;
    const hasLongitude = city.longitude !== undefined;
    if (
      hasLatitude !== hasLongitude ||
      (hasLatitude &&
        (!Number.isFinite(city.latitude) ||
          !Number.isFinite(city.longitude) ||
          Math.abs(city.latitude!) > 90 ||
          Math.abs(city.longitude!) > 180))
    )
      throw Error(
        `Koordinat ${city.name} tidak valid. Isi latitude dan longitude berpasangan.`,
      );
    if (city.kind && !["kota", "kabupaten", "kawasan"].includes(city.kind))
      throw Error(`Jenis lokasi ${city.name} tidak valid.`);
  }
  for (const item of [...data.destinations, ...data.packages]) {
    if (cityMap.get(item.cityId)?.regionId !== item.regionId)
      throw Error("Relasi destinasi/paket ke kota dan wilayah tidak valid.");
    if (!/^(https:\/\/|\/images\/)/.test(item.image))
      throw Error("URL foto harus HTTPS atau /images/.");
  }
  return data;
}
export function cityFromRow(row: Row): City {
  const city: City = { id: row.id, name: row.name, regionId: row.regionId };
  if (row.latitude?.trim()) city.latitude = Number(row.latitude);
  if (row.longitude?.trim()) city.longitude = Number(row.longitude);
  if (row.kind?.trim()) {
    if (!["kota", "kabupaten", "kawasan"].includes(row.kind))
      throw Error(`Jenis lokasi ${row.name} tidak valid.`);
    city.kind = row.kind as City["kind"];
  }
  return city;
}
async function getRows(key: string, signal?: AbortSignal): Promise<Row[]> {
  const gid = config.gids[key];
  if (!config.publishedId || !gid || !/^\d+$/.test(gid))
    throw Error(`Konfigurasi Sheets untuk ${key} belum lengkap.`);
  const url = `https://docs.google.com/spreadsheets/d/e/${encodeURIComponent(config.publishedId)}/pub?gid=${gid}&single=true&output=csv`;
  const response = await fetch(url, {
    signal: AbortSignal.any([
      ...(signal ? [signal] : []),
      AbortSignal.timeout(15000),
    ]),
  });
  if (!response.ok)
    throw Error(
      `Gagal mengambil ${key} (HTTP ${response.status}). Periksa izin publikasi.`,
    );
  const text = await response.text();
  if (/^\s*</.test(text))
    throw Error(
      `${key} mengembalikan HTML, bukan CSV. Periksa publikasi spreadsheet.`,
    );
  const rows = parseCsv(text, fields[key]);
  for (const row of rows) {
    if ("id" in row && !row.id) throw Error(`ID kosong pada ${key}.`);
  }
  return rows;
}
// Explicit row mapping keeps the UI contract independent of the source format.
export const sheetsRepository: TravelRepository = {
  async load(signal) {
    const keys = Object.keys(fields);
    const tables: Record<string, Row[]> = Object.fromEntries(
      await Promise.all(
        keys.map(async (key) => [key, await getRows(key, signal)]),
      ),
    );
    if (tables.company.length !== 1 || tables.contact.length !== 1)
      throw Error("Tab company dan contact harus memiliki tepat satu baris.");
    const data: TravelData = {
      regions: tables.regions.map((r) => ({
        id: r.id,
        name: r.name,
        tagline: r.tagline,
        description: r.description,
      })),
      cities: tables.cities.map(cityFromRow),
      destinations: tables.destinations.map((r) => ({
        id: r.id,
        cityId: r.cityId,
        regionId: r.regionId,
        name: r.name,
        description: r.description,
        category: r.category,
        image: r.image,
        imageAlt: r.imageAlt,
      })),
      packages: tables.packages.map((r) => {
        if (r.type !== "open" && r.type !== "private")
          throw Error("Tipe paket harus open atau private.");
        return {
          id: r.id,
          regionId: r.regionId,
          cityId: r.cityId,
          name: r.name,
          duration: r.duration,
          price: r.price,
          type: r.type,
          departure: r.departure,
          availability: r.availability,
          image: r.image,
          description: r.description,
        };
      }),
      testimonials: tables.testimonials.map((r) => {
        const rating = Number(r.rating);
        if (
          !Number.isInteger(rating) ||
          rating < 1 ||
          rating > 5 ||
          !["true", "false"].includes(r.isDemo)
        )
          throw Error("Rating atau isDemo tidak valid.");
        return {
          id: r.id,
          name: r.name,
          quote: r.quote,
          trip: r.trip,
          rating,
          isDemo: r.isDemo === "true",
        };
      }),
      company: {
        name: tables.company[0].name,
        story: tables.company[0].story,
        vision: tables.company[0].vision,
        mission: tables.company[0].mission,
      },
      legal: tables.legal.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        url: r.url,
      })),
      contact: {
        whatsapp: tables.contact[0].whatsapp,
        email: tables.contact[0].email,
        phone: tables.contact[0].phone,
        address: tables.contact[0].address,
        instagram: tables.contact[0].instagram,
        hours: tables.contact[0].hours,
      },
    };
    return validateData(data);
  },
};
export const mockRepository: TravelRepository = {
  async load() {
    return validateData(mockData);
  },
};
export const repository: TravelRepository =
  config.dataSource === "sheets"
    ? sheetsRepository
    : config.dataSource === "mock"
      ? mockRepository
      : {
          async load() {
            throw Error("VITE_DATA_SOURCE harus mock atau sheets.");
          },
        };
