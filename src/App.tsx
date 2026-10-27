import { useState } from "react";
import { ArrowUpRight, RefreshCw, Compass, Clock } from "lucide-react";
import Header from "./components/Header";
import Modal from "./components/Modal";
import Inquiry from "./components/Inquiry";
import Explorer from "./sections/Explorer";
import CompanySections from "./sections/CompanySections";
import { useTravelData } from "./hooks/useTravelData";
import { config } from "./config/site";
import type { Destination, TripPackage } from "./types/travel";
export default function App() {
  const { data, error, retry } = useTravelData();
  const [destination, setDestination] = useState<Destination | null>(null),
    [trip, setTrip] = useState<TripPackage | null>(null),
    [inquiry, setInquiry] = useState<string | null>(null);
  function inquire(initial: string) {
    setTrip(null);
    setDestination(null);
    setInquiry(initial);
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati navigasi
      </a>
      <Header />
      <main id="main">
        {!data && !error && (
          <div className="loading-state" role="status">
            <Compass className="loading-icon" size={40} />
            <h1>Menyiapkan perjalananmu…</h1>
            <p>Memuat peta dan katalog destinasi.</p>
          </div>
        )}
        {error && (
          <div className="error-state" role="alert">
            <h1>Katalog belum bisa dimuat.</h1>
            <p>{error}</p>
            <p>
              Sumber data: {config.dataSource}. Data contoh tidak menggantikan
              kegagalan koneksi secara otomatis.
            </p>
            <button className="btn red" onClick={retry}>
              <RefreshCw size={16} /> Coba lagi
            </button>
          </div>
        )}
        {data && (
          <>
            <Explorer data={data} onDetail={setDestination} />
            <CompanySections data={data} onTrip={setTrip} onInquiry={inquire} />
          </>
        )}
      </main>
      {destination && data && (
        <Modal title={destination.name} onClose={() => setDestination(null)}>
          <img
            className="modal-photo"
            src={destination.image}
            alt={destination.imageAlt}
          />
          <p className="eyebrow olive">
            {data.cities.find((c) => c.id === destination.cityId)?.name} /{" "}
            {data.regions.find((r) => r.id === destination.regionId)?.name} /{" "}
            {destination.category}
          </p>
          <p>{destination.description}</p>
          <p className="muted">
            Inspirasi destinasi prototype. Foto ilustrasi. Itinerary, akses,
            tiket, dan fasilitas perlu dikonfirmasi sebelum perjalanan.
          </p>
          <h3>Paket terkait</h3>
          {data.packages
            .filter((p) => p.cityId === destination.cityId)
            .map((p) => (
              <button
                key={p.id}
                className="related-trip"
                onClick={() => {
                  setDestination(null);
                  setTrip(p);
                }}
              >
                {p.name}
                <ArrowUpRight size={16} />
              </button>
            ))}
          {!data.packages.some((p) => p.cityId === destination.cityId) && (
            <p className="muted">
              Paket kota ini belum tersedia. Gunakan konsultasi untuk menyusun
              custom trip.
            </p>
          )}
          <button className="btn red" onClick={() => inquire(destination.name)}>
            Konsultasikan destinasi <ArrowUpRight size={16} />
          </button>
        </Modal>
      )}
      {trip && (
        <Modal title={trip.name} onClose={() => setTrip(null)}>
          <img
            className="modal-photo"
            src={trip.image}
            alt={`Foto ilustrasi ${trip.name}`}
          />
          <p className="eyebrow olive">
            CONTOH PAKET / {trip.type === "open" ? "OPEN TRIP" : "PRIVATE TRIP"}
          </p>
          <p>{trip.description}</p>
          <p className="duration">
            <Clock size={15} />
            {trip.duration}
          </p>
          <p>{trip.price}</p>
          <p>{trip.departure}</p>
          <p className="muted">
            {trip.availability}. Foto ilustrasi. Belum ada pemesanan atau
            pembayaran pada prototype ini.
          </p>
          <button className="btn red" onClick={() => inquire(trip.name)}>
            Tanya detail paket <ArrowUpRight size={16} />
          </button>
        </Modal>
      )}
      {inquiry !== null && (
        <Inquiry
          initial={inquiry}
          number={config.whatsapp || data?.contact.whatsapp || ""}
          onClose={() => setInquiry(null)}
        />
      )}
    </>
  );
}
