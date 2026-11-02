import Reveal from "../components/Reveal";
import PageIntro from "../components/PageIntro";
import { Star } from "lucide-react";
import { assetUrl } from "../utils/assetUrl";
import type { TravelData } from "../types/travel";
export default function ReviewsPage({ data }: { data: TravelData }) {
  return (
    <>
      <PageIntro
        number="03"
        label="REVIEW & DOKUMENTASI"
        title="Perjalanan berlalu."
        accent="Cerita tinggal."
        description="Ruang untuk cerita, kesan, dan potret perjalanan menjelajahi Indonesia bersama Mepu."
      />
      <section className="section testimonials">
        <p className="eyebrow olive">CERITA PERJALANAN / CONTOH PROTOTYPE</p>
        {data.testimonials.map((t) => (
          <Reveal as="figure" key={t.id}>
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
          </Reveal>
        ))}
      </section>

      <section className="section documentation" id="dokumentasi">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow olive">POTRET NUSANTARA</p>
            <h2>
              Tempat indah.
              <br />
              <em>Kenangan yang dekat.</em>
            </h2>
          </div>
          <p className="heading-note">
            Galeri inspirasi destinasi.
            <br />
            Foto ilustrasi, bukan dokumentasi pelanggan.
          </p>
        </Reveal>
        <div className="documentation-grid">
          {data.destinations.slice(0, 6).map((destination) => (
            <Reveal as="figure" key={destination.id}>
              <img
                src={assetUrl(destination.image)}
                alt={destination.imageAlt}
                loading="lazy"
              />
              <figcaption>
                <span className="eyebrow olive">
                  {
                    data.regions.find(
                      (region) => region.id === destination.regionId,
                    )?.name
                  }
                </span>
                <h3>{destination.name}</h3>
                <small>Foto ilustrasi destinasi</small>
              </figcaption>
            </Reveal>
          ))}
        </div>
        {data.destinations.length === 0 && (
          <p className="empty-state">Galeri perjalanan belum tersedia.</p>
        )}
      </section>
    </>
  );
}
