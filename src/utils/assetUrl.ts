/** Keep CMS paths portable; prefix local images only at the rendering boundary. */
export function assetUrl(
  path: string,
  base = import.meta.env.BASE_URL,
): string {
  return path.startsWith("/images/")
    ? `${base.replace(/\/$/, "")}${path}`
    : path;
}
