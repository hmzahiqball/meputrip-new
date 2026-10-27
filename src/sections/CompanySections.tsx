import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Clock,
  CalendarDays,
  Route,
  Leaf,
  Users,
  MessageCircle,
  ShieldCheck,
  Star,
  Compass,
  Mail,
  Phone,
  MapPin,
  Instagram,
} from "lucide-react";
import type { TravelData, TripPackage } from "../types/travel";
import { photos } from "../data/mock";
interface Props {
  data: TravelData;
  onTrip: (trip: TripPackage) => void;
  onInquiry: (initial: string) => void;
}
export default function CompanySections({ data, onTrip, onInquiry }: Props) {
  const [filter, setFilter] = useState("all");
  const packages = data.packages.filter(
    (p) => filter === "all" || p.regionId === filter,
  );
  const advantages = [
    {
      icon: Route,
      title: "Rute mengikuti ritmemu",
      text: "Draft layanan: itinerary fleksibel sesuai waktu dan preferensi perjalanan.",
    },
    {
      icon: Users,
      title: "Teman di perjalanan",
      text: "Draft layanan: pendamping dan koordinasi perjalanan sesuai paket.",
    },
    {
      icon: MessageCircle,
      title: "Mulai dari percakapan",
      text: "Draft layanan: konsultasikan tujuan, kebutuhan, dan anggaran lebih awal.",
    },
    {
      icon: ShieldCheck,
      title: "Informasi yang terbuka",
      text: "Draft layanan: detail biaya dan fasilitas dikonfirmasi sebelum pemesanan.",
    },
  ];
  return (
    <>
      <section className="section trips" id="paket">
        <div className="section-heading">
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
        </div>
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
            <article className="trip-card" key={p.id}>
              <button
                className="trip-photo"
                onClick={() => onTrip(p)}
                aria-label={`Lihat paket ${p.name}`}
              >
                <img
                  loading="lazy"
                  src={p.image}
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
            </article>
          ))}
        </div>
        {packages.length === 0 && (
          <p className="empty-state">Paket untuk wilayah ini belum tersedia.</p>
        )}
      </section>
      <section className="open-trip section" id="open-trip">
        <div className="section-heading">
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
        </div>
        <div className="open-trip-list">
          {data.packages
            .filter((p) => p.type === "open")
            .map((p) => (
              <article key={p.id}>
                <img src={p.image} alt={`Ilustrasi ${p.name}`} loading="lazy" />
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
              </article>
            ))}
        </div>
      </section>
      <section className="custom-trip" id="custom-trip">
        <img
          className="custom-photo"
          src={photos.bajo}
          alt="Ilustrasi bentang kepulauan Indonesia"
          loading="lazy"
        />
        <div className="custom-overlay" />
        <div className="custom-content">
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
        </div>
      </section>
      <section className="section about" id="tentang">
        <div className="about-image">
          <img
            src={photos.bali}
            alt="Foto ilustrasi suasana alam Bali"
            loading="lazy"
          />
          <span className="photo-caption">A LITTLE CLOSER TO INDONESIA.</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow olive">KENAL LEBIH DEKAT / DRAFT PROFIL</p>
          <h2>
            Perjalanan baik
            <br />
            dimulai dengan
            <br />
            <em>rasa ingin tahu.</em>
          </h2>
          <p>{data.company.story}</p>
          <div className="vision-mission">
            <div>
              <h3>Visi kami</h3>
              <p>{data.company.vision}</p>
            </div>
            <div>
              <h3>Misi kami</h3>
              <p>{data.company.mission}</p>
            </div>
          </div>
          <a className="text-link" href="#kontak">
            Mari berkenalan <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
      <section className="section values">
        <div className="section-heading">
          <div>
            <p className="eyebrow olive">THE WAY WE TRAVEL / DRAFT LAYANAN</p>
            <h2>
              Detail kecil.
              <br />
              Pengalaman berarti.
            </h2>
          </div>
          <Leaf size={44} strokeWidth={1} />
        </div>
        <div className="values-grid">
          {advantages.map((v) => (
            <article key={v.title}>
              <v.icon size={26} strokeWidth={1.3} />
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section testimonials">
        <p className="eyebrow olive">CERITA PERJALANAN / CONTOH PROTOTYPE</p>
        {data.testimonials.map((t) => (
          <figure key={t.id}>
            <div className="stars" aria-label={`${t.rating} dari 5 bintang`}>
              {Array.from({ length: t.rating }, (_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>
              <strong>{t.name}</strong>
              <span>{t.trip}</span>
              <small>
                {t.isDemo
                  ? "Ulasan dummy untuk demonstrasi tampilan, bukan ulasan pelanggan sungguhan."
                  : "Ulasan dari sumber konten perusahaan."}
              </small>
            </figcaption>
          </figure>
        ))}
      </section>
      <section className="section legal" id="legalitas">
        <div>
          <p className="eyebrow olive">COMPANY INFORMATION</p>
          <h2>Kenali perusahaanmu.</h2>
          <p>
            Dokumen legal dan identitas perusahaan akan ditampilkan setelah
            diberikan dan diverifikasi oleh pemilik.
          </p>
        </div>
        <div>
          {data.legal.map((doc) => (
            <article key={doc.id}>
              <ShieldCheck size={22} />
              <div>
                <h3>{doc.title}</h3>
                <p>{doc.status}</p>
                {/^https:\/\//.test(doc.url) && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Lihat dokumen <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <footer id="kontak">
        <div className="footer-top">
          <div>
            <p className="eyebrow">LET'S MAKE IT A JOURNEY</p>
            <h2>
              Ke mana cerita
              <br />
              <em>akan membawamu?</em>
            </h2>
          </div>
          <button
            className="footer-arrow"
            aria-label="Mulai konsultasi perjalanan"
            onClick={() => onInquiry("Perjalanan Indonesia")}
          >
            <ArrowUpRight size={48} strokeWidth={1} />
          </button>
        </div>
        <div className="footer-grid">
          <div>
            <a href="#home" className="brand">
              <Compass size={27} />
              <span>
                mepu<span className="brand-light">trip.</span>
              </span>
            </a>
            <p>
              Lebih dekat dengan Indonesia.
              <br />
              Satu perjalanan pada satu waktu.
            </p>
            <span className="prototype-label">
              PROTOTYPE · IDENTITAS VISUAL SEMENTARA
            </span>
          </div>
          <div>
            <h3>Jelajahi</h3>
            <a href="#destinasi">
              Destinasi <ArrowUpRight size={12} />
            </a>
            <a href="#open-trip">Open trip</a>
            <a href="#custom-trip">Custom trip</a>
            <a href="#tentang">Tentang kami</a>
            <a href="#legalitas">Legalitas</a>
          </div>
          <div>
            <h3>Mari terhubung</h3>
            <button
              className="footer-contact"
              onClick={() => onInquiry("Konsultasi perjalanan")}
            >
              <MessageCircle size={14} />{" "}
              {data.contact.whatsapp
                ? "Konsultasi WhatsApp"
                : "WhatsApp belum diatur"}
            </button>
            {data.contact.email ? (
              <a href={`mailto:${data.contact.email}`}>
                <Mail size={14} />
                {data.contact.email}
              </a>
            ) : (
              <span>
                <Mail size={14} /> Email belum ditambahkan
              </span>
            )}
            {data.contact.phone ? (
              <a href={`tel:${data.contact.phone}`}>
                <Phone size={14} />
                {data.contact.phone}
              </a>
            ) : (
              <span>
                <Phone size={14} /> Telepon belum ditambahkan
              </span>
            )}
            {/^https:\/\/(www\.)?instagram.com\//.test(
              data.contact.instagram,
            ) ? (
              <a href={data.contact.instagram} target="_blank" rel="noreferrer">
                <Instagram size={14} /> Instagram
              </a>
            ) : (
              <span>
                <Instagram size={14} /> Instagram belum ditambahkan
              </span>
            )}
          </div>
          <div>
            <h3>Temui kami</h3>
            <p className="contact-address">
              <MapPin size={16} />
              {data.contact.address}
            </p>
            <p>{data.contact.hours}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {data.company.name}. Prototype
            frontend.
          </span>
          <a href="#home">
            Kembali ke atas <ArrowRight size={13} />
          </a>
          <span>MADE FOR THE EXPLORER IN YOU</span>
        </div>
      </footer>
    </>
  );
}
