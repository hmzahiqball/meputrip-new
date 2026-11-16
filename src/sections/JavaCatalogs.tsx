import { ArrowUpRight, ChevronDown, Download } from "lucide-react";
import catalogs from "../data/javaCatalogs.json";
import { assetUrl } from "../utils/assetUrl";

const groups = [
  {
    title: "Wisata Alam Pulau Jawa",
    label: "kawasan",
    entries: catalogs.nature,
    pdf: "/katalog/wisata-alam-pulau-jawa.pdf",
  },
  {
    title: "Kunjungan Industri Pulau Jawa",
    label: "jurusan",
    entries: catalogs.industry,
    pdf: "/katalog/kunjungan-industri-pulau-jawa.pdf",
  },
] as const;

export default function JavaCatalogs({
  onInquiry,
}: {
  onInquiry: (initial: string) => void;
}) {
  return (
    <section className="section java-catalog" id="katalog-jawa">
      <div className="section-heading">
        <h2>Katalog perjalanan Pulau Jawa</h2>
        <p className="heading-note">
          Konfirmasikan jadwal, biaya, dan akses destinasi bersama tim Meputrip.
          Kunjungan industri mengikuti persetujuan instansi tujuan.
        </p>
      </div>
      <div className="java-catalog-grid">
        {groups.map(({ title, label, entries, pdf }) => (
          <article className="java-catalog-group" key={pdf}>
            <div className="java-catalog-heading">
              <p className="eyebrow olive">
                {entries.length} {label}
              </p>
              <h3>{title}</h3>
              <a
                className="text-link"
                href={assetUrl(pdf)}
                download
                aria-label={`Unduh PDF ${title}`}
              >
                Unduh PDF <Download size={15} />
              </a>
            </div>
            {entries.map(({ name, description, locations }) => (
              <details className="java-catalog-entry" key={name}>
                <summary>
                  {name}
                  <ChevronDown size={17} aria-hidden="true" />
                </summary>
                <div className="java-catalog-detail">
                  <p>
                    {label === "jurusan" && <strong>Fokus studi. </strong>}
                    {description}
                  </p>
                  <ul>
                    {locations.map((location) => (
                      <li key={location}>{location}</li>
                    ))}
                  </ul>
                  <button
                    className="text-link"
                    onClick={() => onInquiry(`${title} – ${name}`)}
                  >
                    Konsultasikan {label === "jurusan" ? "kunjungan" : "wisata"}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </details>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
