import Reveal from "../components/Reveal";
import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  MapPin,
  SlidersHorizontal,
  Compass,
  Download,
} from "lucide-react";
import type { TravelData, Destination } from "../types/travel";
import IndonesiaMap from "../components/IndonesiaMap";
import CatalogCard from "../components/CatalogCard";
import { assetUrl } from "../utils/assetUrl";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLElement>(null);
  const catalogHeadingRef = useRef<HTMLHeadingElement>(null);
  const destinationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const destination of data.destinations)
      counts[destination.cityId] = (counts[destination.cityId] ?? 0) + 1;
    return counts;
  }, [data.destinations]);
  const catalogCities = useMemo(
    () => data.cities.filter((city) => destinationCounts[city.id] > 0),
    [data.cities, destinationCounts],
  );
  const city = catalogCities.find((c) => c.id === cityId);
  const availableCities = catalogCities.filter((c) => c.regionId === regionId);
  const hasJavaLocations = catalogCities.some((c) => c.regionId === "jawa");
  const scope = data.destinations.filter(
    (d) =>
      (!regionId || d.regionId === regionId) &&
      (!cityId || d.cityId === cityId),
  );
  const categories = ["Semua", ...new Set(scope.map((d) => d.category))];
  const visible = scope.filter(
    (d) => category === "Semua" || d.category === category,
  );
  const displayed =
    region && !city
      ? []
      : region || showAll || category !== "Semua"
        ? visible
        : [
            ...visible.filter((d) => d.image),
            ...visible.filter((d) => !d.image),
          ].slice(0, 6);
  function selectRegion(id: string) {
    setRegionId(id);
    setCityId("");
    setCategory("Semua");
    setShowAll(false);
  }
  function selectCity(id: string) {
    setCityId(id);
    setCategory("Semua");
    if (!id) return;
    requestAnimationFrame(() => {
      catalogHeadingRef.current?.focus({ preventScroll: true });
      catalogRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  function returnToMap() {
    mapRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-heading">
          <div>
            <p className="eyebrow">
              <span className="tiny-line" /> 01 / PESAN PERJALANAN
            </p>
            <h1>
              Dekat dengan alam.
              <br />
              Jauh dari <em>yang biasa.</em>
            </h1>
          </div>
          <div className="hero-intro">
            <p>Pilih wilayah di peta untuk membuka katalog wisata.</p>
            <a href="#/pesan-perjalanan/peta-eksplorasi">
              Pilih pulau, temukan perjalananmu <ArrowRight size={17} />
            </a>
            <a href="#/kunjungan-industri">
              Kunjungan Industri <ArrowRight size={17} />
            </a>
          </div>
        </div>
        <div ref={mapRef} id="peta-eksplorasi">
          <IndonesiaMap
            regions={data.regions}
            cities={catalogCities}
            selected={regionId}
            selectedCity={cityId}
            destinationCounts={destinationCounts}
            onSelect={selectRegion}
            onSelectCity={selectCity}
            onBack={() => selectRegion("")}
          />
        </div>
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
              <h2>{region ? `Wisata di ${region.name}` : "Katalog Wisata"}</h2>
              <p>
                {region
                  ? availableCities.length
                    ? "Pilih titik kawasan untuk melihat destinasinya."
                    : "Katalog untuk wilayah ini belum tersedia."
                  : "Lihat lokasi yang sudah tersedia di katalog Meputrip."}
              </p>
            </div>
          </div>
          <div className="city-control">
            <label htmlFor="city">
              <MapPin size={14} />{" "}
              {region ? `Pilih lokasi di ${region.name}` : "Lokasi wisata"}
            </label>
            <div className="select-row">
              <select
                id="city"
                value={cityId}
                disabled={availableCities.length === 0}
                onChange={(e) => selectCity(e.target.value)}
              >
                <option value="">
                  {region
                    ? availableCities.length
                      ? "Pilih kawasan"
                      : "Belum ada kawasan"
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
                href="#/pesan-perjalanan/destinasi"
                aria-label="Lihat katalog destinasi"
              >
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
      <section ref={catalogRef} className="section destinations" id="destinasi">
        <Reveal className="section-heading">
          <div>
            <h2 ref={catalogHeadingRef} tabIndex={-1}>
              {city
                ? city.name
                : region
                  ? `Wisata di ${region.name}`
                  : "Katalog Wisata"}
            </h2>
          </div>
          <button className="text-link" onClick={returnToMap}>
            <ArrowLeft size={15} /> {city ? "Ganti kawasan" : "Kembali ke peta"}
          </button>
        </Reveal>
        {region && availableCities.length === 0 ? (
          <div className="empty-state">
            <MapPin size={28} />
            <h3>Katalog wisata di {region.name} belum tersedia.</h3>
            {hasJavaLocations && (
              <button
                className="btn outline-dark"
                onClick={() => selectRegion("jawa")}
              >
                Jelajahi Jawa <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        ) : region && !city ? (
          <div className="catalog-map-prompt">
            <MapPin size={28} />
            <h3>Pilih kawasan wisata di peta {region.name}.</h3>
            <button className="btn olive-btn" onClick={returnToMap}>
              Pilih lokasi pada peta <ArrowUpRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <Reveal className="catalog-toolbar">
              {categories.length > 2 && (
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
              )}
              <span className="result-count" aria-live="polite">
                {visible.length} destinasi{" "}
                {city
                  ? `di ${city.name}`
                  : region
                    ? `di ${region.name}`
                    : "untuk dijelajahi"}
              </span>
            </Reveal>
            {(!region || city?.description) && (
              <p className="catalog-note">
                {city?.description ||
                  "Pilih kawasan di peta untuk membuka katalog setempat."}
              </p>
            )}
            <div className="destination-grid">
              {displayed.map((d) => (
                <CatalogCard
                  key={d.id}
                  {...d}
                  location={data.cities.find((c) => c.id === d.cityId)?.name}
                  onDetail={() => onDetail(d)}
                />
              ))}
            </div>
            {!region &&
              !showAll &&
              category === "Semua" &&
              visible.length > displayed.length && (
                <button
                  className="btn outline-dark catalog-more"
                  onClick={() => setShowAll(true)}
                >
                  Lihat semua {visible.length} destinasi{" "}
                  <ArrowRight size={16} />
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
                    selectCity("");
                    returnToMap();
                  }}
                >
                  Lihat semua kota
                </button>
              </div>
            )}
          </>
        )}
        {(!region || region.id === "jawa") && (
          <a
            className="text-link catalog-download"
            href={assetUrl("/katalog/wisata-alam-pulau-jawa.pdf")}
            download
          >
            Unduh PDF Wisata Alam Pulau Jawa <Download size={15} />
          </a>
        )}
      </section>
    </>
  );
}
