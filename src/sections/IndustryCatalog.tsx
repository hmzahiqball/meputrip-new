import { useState } from "react";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import CatalogCard from "../components/CatalogCard";
import CatalogPhoto from "../components/CatalogPhoto";
import Modal from "../components/Modal";
import catalogs from "../data/javaCatalogs.json";
import industry from "../data/industryLocations.json";
import { catalogPhotos } from "../data/catalogPhotos";
import { assetUrl } from "../utils/assetUrl";
import { mapLink } from "../utils/mapLink";

interface VisitSite {
  name: string;
  location: string;
  source?: string;
  mapQuery?: string;
  note?: string;
}

const siteIndex: Record<string, VisitSite> = industry.sites;
const programs: Record<string, string[]> = industry.programs;

export default function IndustryCatalog({
  onInquiry,
}: {
  onInquiry: (initial: string) => void;
}) {
  const [programName, setProgramName] = useState("");
  const [siteId, setSiteId] = useState("");
  const program = catalogs.industry.find(({ name }) => name === programName);
  const site = siteIndex[siteId];
  const photo = catalogPhotos[siteId];

  return (
    <>
      <section className="section industry-catalog" id="katalog-industri">
        <div className="section-heading">
          <div>
            <p className="eyebrow olive">PULAU JAWA</p>
            <h1>Kunjungan Industri</h1>
          </div>
          <a
            className="text-link"
            href={assetUrl("/katalog/kunjungan-industri-pulau-jawa.pdf")}
            download
          >
            Unduh PDF katalog <Download size={15} />
          </a>
        </div>
        <p>
          Temukan perusahaan dan instansi sesuai fokus studi. Jadwal dan akses
          kunjungan mengikuti persetujuan instansi tujuan.
        </p>
        <label className="industry-selector">
          Pilih jurusan
          <select
            value={programName}
            onChange={(event) => setProgramName(event.target.value)}
          >
            <option value="">
              Pilih salah satu dari {catalogs.industry.length} jurusan
            </option>
            {catalogs.industry.map(({ name }) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        {program && (
          <div aria-live="polite">
            <div className="industry-focus">
              <h2>{program.name}</h2>
              <p>
                <strong>Fokus studi.</strong> {program.description}
              </p>
            </div>
            <div className="destination-grid">
              {programs[program.name].map((id) => (
                <CatalogCard
                  key={id}
                  name={siteIndex[id].name}
                  location={siteIndex[id].location}
                  category="Kunjungan industri"
                  image={catalogPhotos[id]?.image}
                  imageAlt={siteIndex[id].name}
                  photoCredit={catalogPhotos[id]}
                  onDetail={() => setSiteId(id)}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      {site && program && (
        <Modal title={site.name} onClose={() => setSiteId("")}>
          {photo && (
            <CatalogPhoto image={photo.image} alt={site.name} credit={photo} />
          )}
          <p className="eyebrow olive">{program.name}</p>
          <p className="industry-address">
            <MapPin size={16} /> {site.location}
          </p>
          {site.note && <p>{site.note}</p>}
          <div className="industry-links">
            {site.mapQuery && (
              <a
                className="text-link"
                href={mapLink(site.mapQuery)}
                target="_blank"
                rel="noreferrer"
              >
                Buka lokasi di Google Maps <ArrowUpRight size={15} />
              </a>
            )}
            {site.source && (
              <a
                className="text-link"
                href={site.source}
                target="_blank"
                rel="noreferrer"
              >
                Sumber lokasi <ArrowUpRight size={15} />
              </a>
            )}
          </div>
          <button
            className="btn red"
            onClick={() => {
              setSiteId("");
              onInquiry(`Kunjungan Industri ${program.name} – ${site.name}`);
            }}
          >
            Konsultasikan kunjungan <ArrowUpRight size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
