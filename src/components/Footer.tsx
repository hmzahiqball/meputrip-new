import Reveal from "./Reveal";
import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Instagram,
} from "lucide-react";
import type { TravelData } from "../types/travel";
export default function Footer({
  data,
  onInquiry,
}: {
  data: TravelData;
  onInquiry: (initial: string) => void;
}) {
  return (
    <footer id="kontak">
      <Reveal className="footer-top">
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
      </Reveal>
      <Reveal className="footer-grid">
        <div>
          <a href="#/pesan-perjalanan" className="brand">
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
          <a href="#/pesan-perjalanan/destinasi">
            Destinasi <ArrowUpRight size={12} />
          </a>
          <a href="#/pesan-perjalanan/open-trip">Open trip</a>
          <a href="#/pesan-perjalanan/custom-trip">Custom trip</a>
          <a href="#/profil-mepu">Profil Mepu</a>
          <a href="#/review-dokumentasi">Review &amp; dokumentasi</a>
          <a href="#/profil-mepu/legalitas">Legalitas</a>
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
          {/^https:\/\/(www\.)?instagram.com\//.test(data.contact.instagram) ? (
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
      </Reveal>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {data.company.name}. Prototype frontend.
        </span>
        <a href="#/pesan-perjalanan">
          Pesan perjalanan <ArrowRight size={13} />
        </a>
        <span>MADE FOR THE EXPLORER IN YOU</span>
      </div>
    </footer>
  );
}
