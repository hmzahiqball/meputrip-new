import { assetUrl } from "../utils/assetUrl";
import Reveal from "../components/Reveal";
import { useState } from "react";
import { ArrowUpRight, Clock, CalendarDays } from "lucide-react";
import type { TravelData, TripPackage } from "../types/travel";
import { photos } from "../data/mock";
export default function TripSections({
  data,
  onTrip,
  onInquiry,
}: {
  data: TravelData;
  onTrip: (trip: TripPackage) => void;
  onInquiry: (initial: string) => void;
}) {
  const [filter, setFilter] = useState("all");
  const packages = data.packages.filter(
    (p) => filter === "all" || p.regionId === filter,
  );
  return (
    <>
      <section className="section trips" id="paket">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow olive">CURATED JOURNEYS</p>
            <h2>
              Bukan sekadar pergi.
              <br />
              <em>Ini tentang mengalami.</em>
            </h2>
          </div>
          <p className="heading-note">
            Pilih perjalanan yang terasa seperti kamu.
            <br />
            Semua paket berikut adalah contoh prototype.
          </p>
        </Reveal>
        <div className="trip-filters" aria-label="Filter paket per wilayah">
          <button
            aria-pressed={filter === "all"}
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Semua wilayah
          </button>
          {data.regions.map((r) => (
            <button
              key={r.id}
              className={filter === r.id ? "active" : ""}
              aria-pressed={filter === r.id}
              onClick={() => setFilter(r.id)}
            >
              {r.name}
            </button>
          ))}
        </div>
        <div className="trip-grid">
          {packages.map((p, i) => (
            <Reveal as="article" className="trip-card" key={p.id}>
              <button
                className="trip-photo"
                onClick={() => onTrip(p)}
                aria-label={`Lihat paket ${p.name}`}
              >
                <img
                  loading="lazy"
                  src={assetUrl(p.image)}
                  alt={`Foto ilustrasi untuk paket ${p.name}`}
                />
                <span className="image-tag">
                  {p.type === "open" ? "Open trip" : "Private trip"}
                </span>
                <span className="trip-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
              <div className="trip-card-body">
                <p className="eyebrow olive">
                  {data.regions.find((r) => r.id === p.regionId)?.name} / CONTOH
                  PAKET
                </p>
                <h3>{p.name}</h3>
                <span className="duration">
                  <Clock size={14} />
                  {p.duration}
                </span>
                <div className="trip-card-bottom">
                  <span>{p.price}</span>
                  <button
                    aria-label={`Detail ${p.name}`}
                    onClick={() => onTrip(p)}
                  >
                    <ArrowUpRight size={22} />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        {packages.length === 0 && (
          <p className="empty-state">Paket untuk wilayah ini belum tersedia.</p>
        )}
      </section>
      <section className="open-trip section" id="open-trip">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow olive">GOOD PLACES, NEW FACES</p>
            <h2>
              Berangkat bersama.
              <br />
              Pulang membawa cerita.
            </h2>
          </div>
          <p className="heading-note">
            Buka ruang untuk teman baru.
            <br />
            Jadwal dan ketersediaan berikut belum dikonfirmasi.
          </p>
        </Reveal>
        <div className="open-trip-list">
          {data.packages
            .filter((p) => p.type === "open")
            .map((p) => (
              <Reveal as="article" key={p.id}>
                <img
                  src={assetUrl(p.image)}
                  alt={`Ilustrasi ${p.name}`}
                  loading="lazy"
                />
                <div className="open-name">
                  <span className="eyebrow olive">OPEN TRIP / CONTOH</span>
                  <h3>{p.name}</h3>
                  <span>
                    <CalendarDays size={14} />
                    {p.departure}
                  </span>
                </div>
                <div className="open-info">
                  <span>{p.duration}</span>
                  <small>{p.availability}</small>
                  <strong>{p.price}</strong>
                </div>
                <button
                  className="round-button"
                  aria-label={`Tanya open trip ${p.name}`}
                  onClick={() => onInquiry(p.name)}
                >
                  <ArrowUpRight size={23} />
                </button>
              </Reveal>
            ))}
        </div>
      </section>
      <section className="custom-trip" id="custom-trip">
        <img
          className="custom-photo"
          src={assetUrl(photos.bajo)}
          alt="Ilustrasi bentang kepulauan Indonesia"
          loading="lazy"
        />
        <div className="custom-overlay" />
        <Reveal className="custom-content">
          <p className="eyebrow">MADE FOR YOUR KIND OF ADVENTURE</p>
          <h2>
            Rencana boleh beda.
            <br />
            <em>Petualangan tetap istimewa.</em>
          </h2>
          <p>
            Honeymoon, liburan keluarga, atau perjalanan bersama tim.
            <br />
            Mari susun perjalanan yang benar-benar milikmu.
          </p>
          <button
            className="btn red"
            onClick={() => onInquiry("Custom trip Indonesia")}
          >
            Rancang custom trip <ArrowUpRight size={18} />
          </button>
          <small>
            Demo konsultasi · Tanpa pembayaran atau pemesanan otomatis
          </small>
        </Reveal>
      </section>
    </>
  );
}
