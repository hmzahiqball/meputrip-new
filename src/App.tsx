import { assetUrl } from "./utils/assetUrl";
import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw, Compass, Clock } from "lucide-react";
import Header from "./components/Header";
import Modal from "./components/Modal";
import Inquiry from "./components/Inquiry";
import Explorer from "./sections/Explorer";
import TripSections from "./sections/TripSections";
import ProfilePage from "./sections/ProfilePage";
import ReviewsPage from "./sections/ReviewsPage";
import Footer from "./components/Footer";
import { usePageRoute } from "./hooks/usePageRoute";
import { pages } from "./utils/navigation";
import { useTravelData } from "./hooks/useTravelData";
import { config } from "./config/site";
import type { Destination, TripPackage } from "./types/travel";
export default function App() {
  const { data, error, retry } = useTravelData();
  const { page, anchor } = usePageRoute();
  const [destination, setDestination] = useState<Destination | null>(null),
    [trip, setTrip] = useState<TripPackage | null>(null),
    [inquiry, setInquiry] = useState<string | null>(null);
  useEffect(() => {
    document.title = `${pages.find((item) => item.id === page)?.label} | Meputrip`;
    setTrip(null);
    setDestination(null);
    setInquiry(null);
    if (!data) return;
    const frame = requestAnimationFrame(() => {
      const target = anchor ? document.getElementById(anchor) : null;
      if (target)
        target.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [page, anchor, data]);
  function inquire(initial: string) {
    setTrip(null);
    setDestination(null);
    setInquiry(initial);
  }
  return (
    <>
      <a className="skip-link" href={`#/${page}/main`}>
        Lewati navigasi
      </a>
      <Header page={page} />
      <main id="main" tabIndex={-1}>
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
            {page === "pesan-perjalanan" && (
              <>
                <Explorer data={data} onDetail={setDestination} />
                <TripSections
                  data={data}
                  onTrip={setTrip}
                  onInquiry={inquire}
                />
              </>
            )}
            {page === "profil-mepu" && <ProfilePage data={data} />}
            {page === "review-dokumentasi" && <ReviewsPage data={data} />}
          </>
        )}
      </main>
      {data && <Footer key={page} data={data} onInquiry={inquire} />}
      {destination && data && (
        <Modal title={destination.name} onClose={() => setDestination(null)}>
          <img
            className="modal-photo"
            src={assetUrl(destination.image)}
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
            src={assetUrl(trip.image)}
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
