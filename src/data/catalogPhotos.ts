import type { PhotoCredit } from "../types/travel";
import photos from "./catalogPhotos.json";

export const catalogPhotos: Partial<
  Record<string, PhotoCredit & { image: string }>
> = photos;
