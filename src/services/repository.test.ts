import { describe, expect, it } from "vitest";
import { parseCsv } from "./csv";
import { mockRepository, sheetsRepository, validateData } from "./repository";
import { mockData } from "../data/mock";
import paths from "../data/mapPaths.json";
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
  it("loads complete mock data without a key", async () => {
    const data = await mockRepository.load();
    expect(data.regions).toHaveLength(8);
    expect(data.destinations.length).toBeGreaterThan(20);
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
