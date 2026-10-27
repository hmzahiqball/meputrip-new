import { useState } from "react";
import { Compass, MousePointer2 } from "lucide-react";
import paths from "../data/mapPaths.json";
import type { Region } from "../types/travel";
interface Props {
  regions: Region[];
  selected: string;
  onSelect: (id: string) => void;
}
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
export default function IndonesiaMap({ regions, selected, onSelect }: Props) {
  const [hovered, setHovered] = useState("");
  return (
    <div className="map-stage">
      <div className="map-topline">
        <span>
          <span className="live-dot" /> INDONESIA, SELALU ADA CERITA
        </span>
        <span className="map-coordinate">0° 47′ S &nbsp; 113° 55′ E</span>
      </div>
      <svg
        className="indonesia-map"
        viewBox="0 0 1040 420"
        role="group"
        aria-label="Peta interaktif Indonesia. Pilih wilayah untuk menjelajahi kota."
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
        <rect width="1040" height="420" fill="url(#sea-grid)" />
        <text x="70" y="328" className="ocean-label">
          SAMUDRA HINDIA
        </text>
        <text x="785" y="74" className="ocean-label">
          SAMUDRA PASIFIK
        </text>
        {regions.map((region, index) => {
          const [x, y] = labelPoints[region.id];
          return (
            <g
              key={region.id}
              className={`island-group ${selected === region.id ? "selected" : ""} ${hovered === region.id ? "hovered" : ""}`}
              style={{ animationDelay: `${index * 95}ms` }}
            >
              <path
                d={paths[region.id as keyof typeof paths]}
                className="island"
                role="button"
                tabIndex={0}
                aria-label={`Pilih ${region.name}`}
                aria-pressed={selected === region.id}
                onClick={() => onSelect(region.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(region.id);
                  }
                }}
                onMouseEnter={() => setHovered(region.id)}
                onMouseLeave={() => setHovered("")}
                onFocus={() => setHovered(region.id)}
                onBlur={() => setHovered("")}
              >
                <title>{region.name} — pilih untuk melihat kota</title>
              </path>
              <g
                aria-hidden="true"
                className="map-label"
                onClick={() => onSelect(region.id)}
                onMouseEnter={() => setHovered(region.id)}
                onMouseLeave={() => setHovered("")}
              >
                <circle cx={x} cy={y - 17} r={selected === region.id ? 5 : 3} />
                <text x={x} y={y + 2} textAnchor="middle">
                  {region.name}
                </text>
              </g>
            </g>
          );
        })}
        <g transform="translate(978 320)" aria-hidden="true">
          <path d="M0 -26L7 0L0 24L-7 0Z" fill="#697548" />
          <path d="M0 -26V24" stroke="#fff" strokeOpacity=".6" />
          <text x="0" y="-38" textAnchor="middle" fill="#aaa" fontSize="11">
            N
          </text>
        </g>
      </svg>
      <div className="map-bottomline">
        <span>
          <MousePointer2 size={14} /> Klik pulau untuk mulai menjelajah
        </span>
        <span>
          <Compass size={15} /> Satu negeri. Banyak kemungkinan.
        </span>
      </div>
    </div>
  );
}
