import { describe, expect, it } from "vitest";
import { parseCsv } from "./csv";
import {
  mockRepository,
  sheetsRepository,
  validateData,
  cityFromRow,
} from "./repository";
import { mockData } from "../data/mock";
import paths from "../data/mapPaths.json";
import catalogs from "../data/javaCatalogs.json";
import industry from "../data/industryLocations.json";
describe("Google Sheets CSV contract", () => {
  it("handles BOM, commas, quoted newlines and escaped quotes", () => {
    expect(
      parseCsv(
        '\uFEFFid,name,note\r\na,"Bali, Indonesia","baris 1\nbaris ""2"""',
      ),
    ).toEqual([
      { id: "a", name: "Bali, Indonesia", note: 'baris 1\nbaris "2"' },
    ]);
  });
  it("rejects malformed row widths", () =>
    expect(() => parseCsv("id,name\na")).toThrow("Jumlah kolom"));
  it("rejects unclosed quotes", () =>
    expect(() => parseCsv('id\n"abc')).toThrow("tanda kutip"));
  it("rejects duplicated headers", () =>
    expect(() => parseCsv("id,id\na,b")).toThrow("duplikat"));
  it("accepts an empty table with a header", () =>
    expect(parseCsv("id,name\n")).toEqual([]));
  it("rejects missing publication configuration", async () => {
    await expect(sheetsRepository.load()).rejects.toThrow("Konfigurasi Sheets");
  });
});
describe("Region → City → Destination data integrity", () => {
  it("loads the Java travel catalog without displaying sample locations", async () => {
    const data = await mockRepository.load();
    expect(data.regions).toHaveLength(8);
    const sampleIds = new Set(mockData.destinations.map(({ id }) => id));
    const expectedCount =
      catalogs.nature.reduce(
        (count, area) => count + area.locations.length,
        0,
      ) - 1;
    expect(data.destinations).toHaveLength(expectedCount);
    expect(
      data.destinations.every(
        ({ id, regionId }) => regionId === "jawa" && !sampleIds.has(id),
      ),
    ).toBe(true);
    expect(new Set(data.destinations.map(({ cityId }) => cityId)).size).toBe(
      catalogs.nature.length,
    );
    expect(
      data.destinations.some(({ name }) => name === "Danau Singkarak Karawang"),
    ).toBe(false);
  });
  it("provides a directory with addresses for every industry program", () => {
    expect(Object.keys(industry.programs)).toEqual(
      catalogs.industry.map(({ name }) => name),
    );
    const siteIndex: Record<string, { location: string; source: string }> =
      industry.sites;
    const ids = Object.values(industry.programs).flat();
    expect(new Set(ids)).toEqual(new Set(Object.keys(siteIndex)));
    for (const id of ids) {
      expect(siteIndex[id].location).toBeTruthy();
      expect(siteIndex[id].source).toMatch(/^https:\/\//);
    }
  });
  it("every map region has geometry, cities and destinations", () => {
    for (const region of mockData.regions) {
      expect(paths[region.id as keyof typeof paths].startsWith("M")).toBe(true);
      expect(mockData.cities.some((c) => c.regionId === region.id)).toBe(true);
      expect(mockData.destinations.some((d) => d.regionId === region.id)).toBe(
        true,
      );
    }
  });
  it("rejects duplicate identifiers", () => {
    const data = structuredClone(mockData);
    data.cities.push(data.cities[0]);
    expect(() => validateData(data)).toThrow("ID duplikat");
  });
  it("rejects mismatched city/region relations", () => {
    const data = structuredClone(mockData);
    data.destinations[0].regionId = "jawa";
    expect(() => validateData(data)).toThrow("Relasi destinasi");
  });
  it("rejects unknown map IDs", () => {
    const data = structuredClone(mockData);
    data.regions[0].id = "unknown";
    expect(() => validateData(data)).toThrow("ID wilayah");
  });
  it("rejects unsafe image URLs", () => {
    const data = structuredClone(mockData);
    data.destinations[0].image = "javascript:alert(1)";
    expect(() => validateData(data)).toThrow("URL foto");
  });
  it("labels all prototype reviews and leaves business contact empty", () => {
    expect(mockData.testimonials.every((t) => t.isDemo)).toBe(true);
    expect(mockData.contact.whatsapp).toBe("");
    expect(mockData.legal.every((l) => !l.url)).toBe(true);
  });
});
import { afterEach, vi } from "vitest";
import { config } from "../config/site";
const originalId = config.publishedId;
const originalGids = { ...config.gids };
afterEach(() => {
  config.publishedId = originalId;
  config.gids = originalGids;
  vi.unstubAllGlobals();
});
describe("Sheets fetch adapter", () => {
  function configured() {
    config.publishedId = "TEST_PUBLICATION";
    config.gids = Object.fromEntries(
      Object.keys(mockData).map((k, i) => [k, String(i)]),
    );
  }
  it("maps eight published CSV tables into the exact UI contract", async () => {
    configured();
    const keys = Object.keys(mockData) as (keyof typeof mockData)[];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        const key = keys[Number(new URL(input).searchParams.get("gid"))];
        const value = mockData[key];
        const rows = Array.isArray(value) ? value : [value];
        const headers = Object.keys(rows[0]);
        const escape = (v: unknown) =>
          '"' + String(v ?? "").replaceAll('"', '""') + '"';
        const records = rows as unknown as Record<string, unknown>[];
        return new Response(
          [
            headers.join(","),
            ...records.map((r) => headers.map((h) => escape(r[h])).join(",")),
          ].join("\r\n"),
        );
      }),
    );
    expect(await sheetsRepository.load()).toEqual(mockData);
  });
  it("rejects a Google login HTML response", async () => {
    configured();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<!DOCTYPE html><title>Sign in</title>")),
    );
    await expect(sheetsRepository.load()).rejects.toThrow("HTML");
  });
  it("reports denied publication access", async () => {
    configured();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Forbidden", { status: 403 })),
    );
    await expect(sheetsRepository.load()).rejects.toThrow("HTTP 403");
  });
  it("rejects a missing CSV column", async () => {
    configured();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("id\nexample")),
    );
    await expect(sheetsRepository.load()).rejects.toThrow("Kolom");
  });
});

describe("Empty CSV schema validation", () => {
  it("rejects missing required headers even when there are no rows", () =>
    expect(() => parseCsv("id\n", ["id", "name"])).toThrow("Kolom name"));
});

describe("Optional city coordinates", () => {
  it("keeps legacy three-column cities usable", () =>
    expect(cityFromRow({ id: "new", name: "Baru", regionId: "jawa" })).toEqual({
      id: "new",
      name: "Baru",
      regionId: "jawa",
    }));
  it("parses coordinates and administrative kind from Sheets", () =>
    expect(
      cityFromRow({
        id: "x",
        name: "X",
        regionId: "jawa",
        latitude: "-7.8",
        longitude: "110.3",
        kind: "kabupaten",
      }),
    ).toEqual({
      id: "x",
      name: "X",
      regionId: "jawa",
      latitude: -7.8,
      longitude: 110.3,
      kind: "kabupaten",
    }));
  it("rejects a lone coordinate", () => {
    const data = structuredClone(mockData);
    delete data.cities[0].longitude;
    expect(() => validateData(data)).toThrow("Koordinat");
  });
  it("rejects non-finite coordinates", () => {
    const data = structuredClone(mockData);
    data.cities[0].latitude = NaN;
    expect(() => validateData(data)).toThrow("Koordinat");
  });
  it("rejects coordinates outside geographic ranges", () => {
    const data = structuredClone(mockData);
    data.cities[0].latitude = 91;
    expect(() => validateData(data)).toThrow("Koordinat");
  });
  it("rejects an unknown location kind", () =>
    expect(() =>
      cityFromRow({ id: "x", name: "X", regionId: "jawa", kind: "unknown" }),
    ).toThrow("Jenis lokasi"));
});
