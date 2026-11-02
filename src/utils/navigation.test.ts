import { describe, expect, it } from "vitest";
import { pages, parseRoute } from "./navigation";

describe("page navigation", () => {
  it("opens every page from its direct URL", () => {
    for (const page of pages) {
      expect(parseRoute(`#/${page.id}`)).toEqual({ page: page.id, anchor: "" });
    }
  });
  it("keeps section links on their own page", () => {
    expect(parseRoute("#/profil-mepu/legalitas")).toEqual({
      page: "profil-mepu",
      anchor: "legalitas",
    });
    expect(parseRoute("#/review-dokumentasi/main")).toEqual({
      page: "review-dokumentasi",
      anchor: "main",
    });
  });
  it("supports the homepage and previously shared section links", () => {
    expect(parseRoute("")).toEqual({ page: "pesan-perjalanan", anchor: "" });
    expect(parseRoute("#open-trip")).toEqual({
      page: "pesan-perjalanan",
      anchor: "open-trip",
    });
    expect(parseRoute("#legalitas")).toEqual({
      page: "profil-mepu",
      anchor: "legalitas",
    });
  });
});
