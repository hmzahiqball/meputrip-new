import Reveal from "../components/Reveal";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  MapPin,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import type { TravelData, Destination } from "../types/travel";
import IndonesiaMap from "../components/IndonesiaMap";
import DestinationCard from "../components/DestinationCard";
export default function Explorer({
  data,
  onDetail,
}: {
  data: TravelData;
  onDetail: (d: Destination) => void;
}) {
  const [regionId, setRegionId] = useState(""),
    [cityId, setCityId] = useState(""),
    [category, setCategory] = useState("Semua"),
    [showAll, setShowAll] = useState(false);
  const region = data.regions.find((r) => r.id === regionId);
  const city = data.cities.find((c) => c.id === cityId);
  const availableCities = data.cities.filter((c) => c.regionId === regionId);
  const scope = data.destinations.filter(
    (d) =>
      (!regionId || d.regionId === regionId) &&
      (!cityId || d.cityId === cityId),
  );
  const categories = ["Semua", ...new Set(scope.map((d) => d.category))];
  const featured = ["Tegallalang", "Pulau Padar", "Candi Prambanan"];
  const visible = scope.filter(
    (d) => category === "Semua" || d.category === category,
  );
  const initialPicks = featured.flatMap((name) =>
    visible.filter((d) => d.name === name),
  );
  const displayed =
    region || showAll || category !== "Semua"
      ? visible
      : initialPicks.length > 0
        ? initialPicks
        : visible.slice(0, 3);
  function selectRegion(id: string) {
    setRegionId(id);
    setCityId("");
    setCategory("Semua");
  }
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-heading">
          <div>
            <p className="eyebrow">
              <span className="tiny-line" /> YOUR NEXT STORY STARTS HERE
            </p>
            <h1>
              Dekat dengan alam.
              <br />
              Jauh dari <em>yang biasa.</em>
            </h1>
          </div>
          <div className="hero-intro">
            <p>Dari barat hingga timur, ada Indonesia yang belum kamu temui.</p>
            <a href="#pilih-wilayah">
              Pilih pulau, temukan perjalananmu <ArrowRight size={17} />
            </a>
          </div>
        </div>
        <IndonesiaMap
          regions={data.regions}
          selected={regionId}
          onSelect={selectRegion}
        />
        <Reveal className="region-selection" id="pilih-wilayah">
          <span className="eyebrow step-label">01 / PILIH PULAU</span>
          <div
            className="region-buttons"
            role="group"
            aria-label="Pilihan wilayah"
          >
            {data.regions.map((r) => (
              <button
                key={r.id}
                className={regionId === r.id ? "active" : ""}
                aria-pressed={regionId === r.id}
                onClick={() => selectRegion(r.id)}
              >
                {r.name}
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal className="journey-panel">
          <div className="journey-description" aria-live="polite">
            <span className="panel-number">{region ? "02" : "↗"}</span>
            <div>
              <h2>
                {region
                  ? region.tagline
                  : "Delapan wilayah. Tak terhitung cerita."}
              </h2>
              <p>
                {region
                  ? region.description
                  : "Mulai dari pulau yang memanggilmu, atau langsung lihat inspirasi destinasi pilihan kami."}
              </p>
            </div>
          </div>
          <div className="city-control">
            <label htmlFor="city">
              <MapPin size={14} />{" "}
              {region ? `Pilih kota di ${region.name}` : "Tujuan berikutnya?"}
            </label>
            <div className="select-row">
              <select
                id="city"
                value={cityId}
                disabled={!region}
                onChange={(e) => {
                  setCityId(e.target.value);
                  setCategory("Semua");
                }}
              >
                <option value="">
                  {region
                    ? "Semua kota di wilayah ini"
                    : "Pilih pulau terlebih dahulu"}
                </option>
                {availableCities.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <a
                className="go-button"
                href="#destinasi"
                aria-label="Lihat katalog destinasi"
              >
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="section destinations" id="destinasi">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow olive">THE PLACES THAT STAY WITH YOU</p>
            <h2>
              {city
                ? `Sampai jumpa di ${city.name}.`
                : region
                  ? `Cerita dari ${region.name}.`
                  : "Tempat baru. Rasa yang berbeda."}
            </h2>
          </div>
          <a className="text-link" href="#pilih-wilayah">
            <ArrowLeft size={15} />{" "}
            {region ? "Ganti pulau" : "Jelajahi lewat peta"}
          </a>
        </Reveal>
        <Reveal className="catalog-toolbar">
          <div className="filters" aria-label="Filter kategori">
            <SlidersHorizontal size={16} />
            {categories.map((c) => (
              <button
                className={c === category ? "active" : ""}
                key={c}
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="result-count" aria-live="polite">
            {visible.length} destinasi{" "}
            {city
              ? `di ${city.name}`
              : region
                ? `di ${region.name}`
                : "untuk dijelajahi"}
          </span>
        </Reveal>
        {!region && (
          <p className="catalog-note">
            Pilihan inspirasi dari seluruh Indonesia. Pilih pulau dan kota di
            peta untuk hasil yang lebih spesifik.
          </p>
        )}
        <div className="destination-grid">
          {displayed.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              city={data.cities.find((c) => c.id === d.cityId)}
              onDetail={() => onDetail(d)}
            />
          ))}
        </div>
        {!region && !showAll && category === "Semua" && (
          <button
            className="btn outline-dark catalog-more"
            onClick={() => setShowAll(true)}
          >
            Lihat semua {visible.length} destinasi <ArrowRight size={16} />
          </button>
        )}
        {visible.length === 0 && (
          <div className="empty-state">
            <Compass size={36} />
            <h3>Perjalanan baru sedang disiapkan.</h3>
            <p>
              Belum ada destinasi untuk pilihan ini. Coba kota atau pulau
              lainnya.
            </p>
            <button
              className="btn outline-dark"
              onClick={() => {
                setCityId("");
                setCategory("Semua");
              }}
            >
              Lihat semua kota
            </button>
          </div>
        )}
        <p className="section-footnote">
          Katalog prototype · Deskripsi adalah inspirasi perjalanan · Foto
          ilustrasi, bukan dokumentasi layanan.
        </p>
      </section>
    </>
  );
}
