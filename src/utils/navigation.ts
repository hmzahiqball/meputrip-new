export const pages = [
  { id: "pesan-perjalanan", label: "Pesan Perjalanan" },
  { id: "kunjungan-industri", label: "Kunjungan Industri" },
  { id: "profil-mepu", label: "Profil Mepu" },
  { id: "review-dokumentasi", label: "Review & Dokumentasi" },
] as const;

export type PageId = (typeof pages)[number]["id"];

// Hash routes keep direct links working on static hosts such as GitHub Pages.
export function parseRoute(hash: string): { page: PageId; anchor: string } {
  const [page, anchor = ""] = hash.replace(/^#\/?/, "").split("/");
  if (page === "pesan-perjalanan" && anchor === "katalog-jawa") {
    return { page, anchor: "peta-eksplorasi" };
  }
  if (pages.some((item) => item.id === page)) {
    return { page: page as PageId, anchor };
  }
  // Retain links shared before the site was split into pages.
  if (["tentang", "legalitas", "kontak"].includes(page)) {
    return { page: "profil-mepu", anchor: page };
  }
  return { page: "pesan-perjalanan", anchor: page || "" };
}
