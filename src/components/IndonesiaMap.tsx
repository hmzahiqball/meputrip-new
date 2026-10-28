import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowLeft,
  Compass,
  MapPin,
  MousePointer2,
  RotateCcw,
} from "lucide-react";
import paths from "../data/mapPaths.json";
import type { City, Region } from "../types/travel";
import { useInViewOnce } from "../hooks/useInViewOnce";
import { useMapViewport } from "../hooks/useMapViewport";
import {
  cityKindLabels,
  fitCamera,
  hasCoordinates,
  includeCityLocations,
  INDONESIA_BOUNDS,
  layoutCityMarkers,
  pathBounds,
} from "../utils/mapGeometry";

interface Props {
  regions: Region[];
  cities: City[];
  selected: string;
  selectedCity: string;
  destinationCounts: Record<string, number>;
  onSelect: (id: string) => void;
  onSelectCity: (id: string) => void;
  onBack: () => void;
}
const revealOrder = [
  "sumatra",
  "jawa",
  "kalimantan",
  "bali",
  "nusa-tenggara",
  "sulawesi",
  "maluku",
  "papua",
];
const labelPoints: Record<string, [number, number]> = {
  sumatra: [158, 195],
  jawa: [322, 344],
  kalimantan: [427, 133],
  sulawesi: [590, 201],
  bali: [458, 355],
  "nusa-tenggara": [572, 383],
  maluku: [741, 191],
  papua: [887, 252],
};
const regionBounds = Object.fromEntries(
  Object.entries(paths).map(([id, path]) => [id, pathBounds(path)]),
);

export default function IndonesiaMap({
  regions,
  cities,
  selected,
  selectedCity,
  destinationCounts,
  onSelect,
  onSelectCity,
  onBack,
}: Props) {
  const [hovered, setHovered] = useState("");
  const [replay, setReplay] = useState(0);
  const [explored, setExplored] = useState(false);
  const { ref, visible } = useInViewOnce<HTMLDivElement>();
  const { ref: canvasRef, size } = useMapViewport();
  const svgRef = useRef<SVGSVGElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const previous = useRef(selected);
  const focused = regions.find((region) => region.id === selected);
  const regionCities = useMemo(
    () => cities.filter((city) => city.regionId === selected),
    [cities, selected],
  );
  const camera = useMemo(
    () =>
      fitCamera(
        focused
          ? includeCityLocations(regionBounds[focused.id], regionCities)
          : INDONESIA_BOUNDS,
        size,
        focused ? (size.width < 600 ? 58 : 82) : 12,
      ),
    [focused, regionCities, size],
  );
  const markers = useMemo(
    () => layoutCityMarkers(regionCities, camera, size),
    [regionCities, camera, size],
  );
  useEffect(() => {
    if (selected) setExplored(true);
    if (selected !== previous.current) {
      ref.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      if (selected) {
        backRef.current?.focus({ preventScroll: true });
      } else {
        const oldRegion = previous.current;
        Array.from(
          svgRef.current?.querySelectorAll<SVGPathElement>(".island") ?? [],
        )
          .find((path) => path.dataset.region === oldRegion)
          ?.focus({ preventScroll: true });
      }
    }
    previous.current = selected;
  }, [selected, ref]);
  return (
    <div
      ref={ref}
      className={`map-stage ${focused ? "is-focused" : ""} ${explored ? "has-explored" : ""}`}
      data-map-reveal={visible ? "visible" : "pending"}
    >
      <div className="map-topline">
        <span>
          <span className="live-dot" />
          {focused
            ? `INDONESIA / ${focused.name.toUpperCase()}`
            : "INDONESIA, SELALU ADA CERITA"}
        </span>
        <span className="map-coordinate">
          {focused ? "02 / PILIH KOTA ATAU KABUPATEN" : "01 / PILIH PULAU"}
        </span>
      </div>
      {focused && (
        <div className="map-drilldown-toolbar">
          <button ref={backRef} className="map-back" onClick={onBack}>
            <ArrowLeft size={16} /> Peta Indonesia
          </button>
          <div aria-live="polite">
            <h2>Jelajahi {focused.name}.</h2>
            <p>Pilih titik kota atau kabupaten untuk melihat pariwisatanya.</p>
          </div>
          <span className="map-city-total">
            {regionCities.length} lokasi tersedia
          </span>
        </div>
      )}
      <div className="map-canvas" ref={canvasRef}>
        <svg
          ref={svgRef}
          className="indonesia-map drilldown-map"
          viewBox={`0 0 ${size.width} ${size.height}`}
          role="group"
          aria-label={
            focused
              ? `Peta ${focused.name} diperbesar. Pilih kota atau kabupaten.`
              : "Peta interaktif Indonesia. Pilih pulau untuk memperbesar."
          }
        >
          <defs>
            <pattern
              id="sea-grid"
              width="52"
              height="52"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M52 0H0V52"
                fill="none"
                stroke="#ffffff"
                strokeOpacity=".035"
              />
            </pattern>
          </defs>
          <rect
            className="map-grid"
            width={size.width}
            height={size.height}
            fill="url(#sea-grid)"
          />
          <g
            className="map-camera"
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            }}
          >
            <text x="70" y="328" className="ocean-label">
              SAMUDRA HINDIA
            </text>
            <text x="785" y="74" className="ocean-label">
              SAMUDRA PASIFIK
            </text>
            <g key={replay} className="archipelago">
              <line
                className="map-scan"
                x1="0"
                y1="35"
                x2="0"
                y2="385"
                aria-hidden="true"
              />
              {regions.map((region) => {
                const [x, y] = labelPoints[region.id];
                return (
                  <g
                    key={region.id}
                    className={`island-group ${selected === region.id ? "selected" : ""} ${hovered === region.id ? "hovered" : ""}`}
                    style={
                      {
                        "--island-delay": `${Math.max(0, revealOrder.indexOf(region.id)) * 120}ms`,
                      } as CSSProperties
                    }
                  >
                    <path
                      d={paths[region.id as keyof typeof paths]}
                      data-region={region.id}
                      className="island"
                      role={focused ? undefined : "button"}
                      tabIndex={focused ? -1 : 0}
                      aria-hidden={focused ? true : undefined}
                      aria-label={focused ? undefined : `Pilih ${region.name}`}
                      onClick={() => {
                        if (!focused) onSelect(region.id);
                      }}
                      onKeyDown={(e) => {
                        if (!focused && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onSelect(region.id);
                        }
                      }}
                      onMouseEnter={() => setHovered(region.id)}
                      onMouseLeave={() => setHovered("")}
                      onFocus={() => setHovered(region.id)}
                      onBlur={() => setHovered("")}
                    >
                      <title>{region.name} — perbesar peta wilayah</title>
                    </path>
                    <g
                      aria-hidden="true"
                      className="map-label"
                      onClick={() => {
                        if (!focused) onSelect(region.id);
                      }}
                    >
                      <circle cx={x} cy={y - 17} r="3" />
                      <text x={x} y={y + 2} textAnchor="middle">
                        {region.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
          {focused && (
            <g
              key={focused.id}
              className="city-markers"
              aria-label={`Titik lokasi di ${focused.name}`}
            >
              {markers.map(({ city, anchor, label, width }, index) => (
                <g
                  key={city.id}
                  className={`city-marker ${selectedCity === city.id ? "active" : ""}`}
                  style={
                    {
                      "--marker-delay": `${520 + index * 65}ms`,
                    } as CSSProperties
                  }
                >
                  <line
                    className="city-leader"
                    x1={anchor.x}
                    y1={anchor.y}
                    x2={label.x}
                    y2={label.y}
                  />
                  <circle
                    className="city-anchor"
                    cx={anchor.x}
                    cy={anchor.y}
                    r="4"
                  />
                  <g
                    className="city-callout"
                    role="button"
                    tabIndex={0}
                    aria-label={`Lihat wisata di ${city.name}`}
                    aria-pressed={selectedCity === city.id}
                    aria-controls="destinasi"
                    onClick={() => onSelectCity(city.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectCity(city.id);
                      }
                    }}
                  >
                    <title>
                      {city.name} — {destinationCounts[city.id] ?? 0} destinasi
                    </title>
                    <rect
                      x={label.x - width / 2}
                      y={label.y - 22}
                      width={width}
                      height="44"
                      rx="7"
                    />
                    <text
                      className="city-name"
                      x={label.x}
                      y={label.y - 3}
                      textAnchor="middle"
                    >
                      {city.name}
                    </text>
                    <text
                      className="city-count"
                      x={label.x}
                      y={label.y + 12}
                      textAnchor="middle"
                    >
                      {city.kind ? cityKindLabels[city.kind] : "Lokasi"} ·{" "}
                      {destinationCounts[city.id] ?? 0} destinasi
                    </text>
                  </g>
                </g>
              ))}
            </g>
          )}
          <g
            transform={`translate(${size.width - 24} ${size.height - 45})`}
            aria-hidden="true"
            className="map-compass"
          >
            <path d="M0 -20L5 0L0 18L-5 0Z" fill="#697548" />
            <path d="M0 -20V18" stroke="#fff" strokeOpacity=".6" />
            <text x="0" y="-28" textAnchor="middle" fill="#aaa" fontSize="10">
              N
            </text>
          </g>
        </svg>
      </div>
      {focused && (
        <div className="map-city-directory">
          <p className="eyebrow">
            KOTA, KABUPATEN & KAWASAN DI {focused.name.toUpperCase()}
          </p>
          <div
            className="map-city-list"
            role="group"
            aria-label={`Daftar lokasi di ${focused.name}`}
          >
            {regionCities.map((city) => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city.id)}
                aria-pressed={selectedCity === city.id}
                aria-controls="destinasi"
                className={selectedCity === city.id ? "active" : ""}
              >
                <MapPin size={14} />
                <span>
                  {city.name}
                  <small>
                    {city.kind ? cityKindLabels[city.kind] : "Lokasi"}
                    {!hasCoordinates(city) ? " · titik peta belum diatur" : ""}
                  </small>
                </span>
                <span className="city-list-count">
                  {destinationCounts[city.id] ?? 0}
                </span>
              </button>
            ))}
          </div>
          {regionCities.length === 0 && (
            <p className="map-location-note">
              Belum ada kota atau kabupaten dalam katalog wilayah ini. Pilih
              pulau lainnya.
            </p>
          )}
          {regionCities.length > 0 && markers.length === 0 && (
            <p className="map-location-note">
              Koordinat belum tersedia. Pilih lokasi melalui daftar di atas.
            </p>
          )}
        </div>
      )}
      <div className="map-bottomline">
        <span>
          <MousePointer2 size={14} />
          {focused
            ? "Klik titik lokasi untuk membuka katalog"
            : "Klik pulau untuk memperbesar peta"}
        </span>
        <span>
          <Compass size={15} />
          {focused
            ? "Titik katalog, bukan batas administratif"
            : "Satu negeri. Banyak kemungkinan."}
        </span>
        {!focused && (
          <button
            className="map-replay"
            onClick={() => {
              setExplored(false);
              setReplay((value) => value + 1);
            }}
            aria-label="Putar ulang animasi peta"
          >
            <RotateCcw size={13} /> Putar ulang animasi
          </button>
        )}
      </div>
      <p className="map-attribution">
        Geometri:{" "}
        <a
          href="https://www.naturalearthdata.com/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>{" "}
        · Titik lokasi:{" "}
        <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">
          GeoNames (CC BY 4.0)
        </a>
      </p>
    </div>
  );
}
