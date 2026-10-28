import { describe, expect, it } from "vitest";
import { assetUrl } from "./assetUrl";

describe("deployment image URLs", () => {
  it("resolves CMS and mock image paths under a repository subpath", () => {
    expect(assetUrl("/images/bali.jpg", "/meputrip-new/")).toBe(
      "/meputrip-new/images/bali.jpg",
    );
  });
  it("supports root hosting without a double slash", () => {
    expect(assetUrl("/images/bali.jpg", "/")).toBe("/images/bali.jpg");
  });
  it("preserves remote images and already resolved paths", () => {
    for (const path of [
      "https://example.com/image.jpg?q=1",
      "/meputrip-new/images/bali.jpg",
    ])
      expect(assetUrl(path, "/meputrip-new/")).toBe(path);
  });
});
