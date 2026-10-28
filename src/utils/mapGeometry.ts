import type { City } from "../types/travel";

export interface Point {
  x: number;
  y: number;
}
export interface Bounds extends Point {
  width: number;
  height: number;
}
export interface Viewport {
  width: number;
  height: number;
}
export interface Camera {
  scale: number;
  x: number;
  y: number;
}
export interface CityMarker {
  city: City;
  anchor: Point;
  label: Point;
  width: number;
}
export const INDONESIA_BOUNDS: Bounds = {
  x: 0,
  y: 0,
  width: 1040,
  height: 420,
};
export const cityKindLabels = {
  kota: "Kota",
  kabupaten: "Kabupaten",
  kawasan: "Kawasan",
};

/** Same equirectangular projection as scripts/generate-map.mjs. */
export function projectLocation(longitude: number, latitude: number): Point {
  return { x: (longitude - 94) * 21, y: (7 - latitude) * 21 };
}
export function hasCoordinates(
  city: City,
): city is City & { latitude: number; longitude: number } {
  return Number.isFinite(city.latitude) && Number.isFinite(city.longitude);
}
/** Our generated coastline paths contain only M/L/Z pairs, never curves. */
export function pathBounds(path: string): Bounds {
  const numbers = (path.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  if (!numbers.length || numbers.length % 2 !== 0)
    throw Error("Geometri peta tidak valid.");
  let left = Infinity,
    top = Infinity,
    right = -Infinity,
    bottom = -Infinity;
  for (let i = 0; i < numbers.length; i += 2) {
    left = Math.min(left, numbers[i]);
    right = Math.max(right, numbers[i]);
    top = Math.min(top, numbers[i + 1]);
    bottom = Math.max(bottom, numbers[i + 1]);
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}
export function includeCityLocations(bounds: Bounds, cities: City[]): Bounds {
  let left = bounds.x,
    top = bounds.y,
    right = left + bounds.width,
    bottom = top + bounds.height;
  for (const city of cities.filter(hasCoordinates)) {
    const p = projectLocation(city.longitude, city.latitude);
    left = Math.min(left, p.x);
    top = Math.min(top, p.y);
    right = Math.max(right, p.x);
    bottom = Math.max(bottom, p.y);
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}
export function fitCamera(
  bounds: Bounds,
  viewport: Viewport,
  padding = 32,
): Camera {
  const scale = Math.min(
    Math.max(1, viewport.width - 2 * padding) / Math.max(1, bounds.width),
    Math.max(1, viewport.height - 2 * padding) / Math.max(1, bounds.height),
  );
  return {
    scale,
    x: (viewport.width - bounds.width * scale) / 2 - bounds.x * scale,
    y: (viewport.height - bounds.height * scale) / 2 - bounds.y * scale,
  };
}
export function cameraPoint(point: Point, camera: Camera): Point {
  return {
    x: point.x * camera.scale + camera.x,
    y: point.y * camera.scale + camera.y,
  };
}
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
/** Separate 44px callouts while retaining a leader line to each geographic anchor. */
export function layoutCityMarkers(
  cities: City[],
  camera: Camera,
  viewport: Viewport,
): CityMarker[] {
  const placed: CityMarker[] = [];
  const offsets = [
    [0, -48],
    [0, 48],
    [-80, -48],
    [80, 48],
    [80, -48],
    [-80, 48],
    [0, -104],
    [0, 104],
    [-130, 0],
    [130, 0],
  ];
  for (const city of cities
    .filter(hasCoordinates)
    .slice()
    .sort((a, b) => a.longitude - b.longitude || a.id.localeCompare(b.id))) {
    const anchor = cameraPoint(
      projectLocation(city.longitude, city.latitude),
      camera,
    );
    const width = Math.min(
      viewport.width - 24,
      Math.max(96, city.name.length * 7 + 28),
    );
    const candidates = offsets.map(([x, y]) => ({
      x: anchor.x + x,
      y: anchor.y + y,
    }));
    for (let y = 36; y <= viewport.height - 32; y += 56) {
      for (const x of [
        16 + width / 2,
        viewport.width / 2,
        viewport.width - 16 - width / 2,
      ])
        candidates.push({ x, y });
    }
    let best = { x: anchor.x, y: anchor.y },
      score = Infinity;
    for (const candidate of candidates) {
      const p = {
        x: clamp(candidate.x, 12 + width / 2, viewport.width - 12 - width / 2),
        y: clamp(candidate.y, 28, viewport.height - 28),
      };
      const collisions = placed.filter(
        (other) =>
          Math.abs(p.x - other.label.x) < (width + other.width) / 2 + 8 &&
          Math.abs(p.y - other.label.y) < 52,
      ).length;
      const cost =
        collisions * 1_000_000 + Math.hypot(p.x - anchor.x, p.y - anchor.y);
      if (cost < score) {
        score = cost;
        best = p;
      }
    }
    placed.push({ city, anchor, label: best, width });
  }
  return placed;
}
