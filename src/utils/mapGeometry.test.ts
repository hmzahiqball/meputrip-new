import { describe, expect, it } from "vitest";
import paths from "../data/mapPaths.json";
import { cities, regions } from "../data/mock";
import {
  cameraPoint,
  fitCamera,
  hasCoordinates,
  includeCityLocations,
  layoutCityMarkers,
  pathBounds,
  projectLocation,
} from "./mapGeometry";

describe("map camera and geographic anchors", () => {
  it("uses the coastline projection for city points", () =>
    expect(projectLocation(110, -7)).toEqual({ x: 336, y: 294 }));
  it("extracts bounds from simplified coastline paths", () =>
    expect(pathBounds("M10,20L50,80L5,40Z")).toEqual({
      x: 5,
      y: 20,
      width: 45,
      height: 60,
    }));
  it("rejects missing geometry", () =>
    expect(() => pathBounds("")).toThrow("Geometri"));
  it("fits a tall island without clipping or stretching", () => {
    const b = { x: 50, y: 20, width: 100, height: 300 },
      v = { width: 360, height: 420 };
    const c = fitCamera(b, v, 40);
    const start = cameraPoint(b, c),
      end = cameraPoint({ x: b.x + b.width, y: b.y + b.height }, c);
    expect(start.x).toBeGreaterThanOrEqual(39);
    expect(start.y).toBeGreaterThanOrEqual(39);
    expect(end.x).toBeLessThanOrEqual(321);
    expect(end.y).toBeLessThanOrEqual(381);
  });
  it("keeps 0-degree coordinates valid", () =>
    expect(
      hasCoordinates({
        id: "zero",
        regionId: "sumatra",
        name: "Zero",
        latitude: 0,
        longitude: 100,
      }),
    ).toBe(true));
  it("leaves cities without coordinates available for the companion list", () =>
    expect(
      layoutCityMarkers(
        [{ id: "new", regionId: "jawa", name: "Baru" }],
        { x: 0, y: 0, scale: 1 },
        { width: 320, height: 360 },
      ),
    ).toEqual([]));
  for (const width of [320, 700, 1040]) {
    it(`places every catalogue city inside the ${width}px viewport without callout collisions`, () => {
      const viewport = { width, height: 400 };
      for (const region of regions) {
        const group = cities.filter((c) => c.regionId === region.id),
          bounds = includeCityLocations(
            pathBounds(paths[region.id as keyof typeof paths]),
            group,
          );
        const camera = fitCamera(bounds, viewport, 60),
          markers = layoutCityMarkers(group, camera, viewport);
        expect(markers).toHaveLength(group.length);
        for (const marker of markers) {
          expect(marker.label.x - marker.width / 2).toBeGreaterThanOrEqual(11);
          expect(marker.label.x + marker.width / 2).toBeLessThanOrEqual(
            width - 11,
          );
          expect(marker.label.y - 22).toBeGreaterThanOrEqual(0);
          expect(marker.label.y + 22).toBeLessThanOrEqual(400);
          expect(marker.anchor.x).toBeGreaterThanOrEqual(0);
          expect(marker.anchor.x).toBeLessThanOrEqual(width);
        }
        for (let i = 0; i < markers.length; i++)
          for (let j = i + 1; j < markers.length; j++) {
            const a = markers[i],
              b = markers[j];
            expect(
              Math.abs(a.label.x - b.label.x) >= (a.width + b.width) / 2 + 7 ||
                Math.abs(a.label.y - b.label.y) >= 51,
            ).toBe(true);
          }
      }
    });
  }
});
