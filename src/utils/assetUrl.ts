/** Resolve portable public asset paths against the deployment base. */
export function assetUrl(
  path: string,
  base = import.meta.env.BASE_URL,
): string {
  return /^\/(images|katalog|legalitas)\//.test(path)
    ? `${base.replace(/\/$/, "")}${path}`
    : path;
}
