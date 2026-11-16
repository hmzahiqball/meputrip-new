import Reveal from "../components/Reveal";
import PageIntro from "../components/PageIntro";
import { Star } from "lucide-react";
import { assetUrl } from "../utils/assetUrl";
import type { Destination, TravelData } from "../types/travel";
import { PhotoAttribution } from "../components/CatalogPhoto";
export default function ReviewsPage({ data }: { data: TravelData }) {
  const photos = data.destinations.filter(
    (destination): destination is Destination & { image: string } =>
      Boolean(destination.image),
  );
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
            Foto bersumber dari katalog destinasi.
          </p>
        </Reveal>
        <div className="documentation-grid">
          {photos.slice(0, 6).map((destination) => (
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
                {destination.photoCredit && (
                  <small>
                    <PhotoAttribution credit={destination.photoCredit} />
                  </small>
                )}
              </figcaption>
            </Reveal>
          ))}
        </div>
        {photos.length === 0 && (
          <p className="empty-state">Galeri perjalanan belum tersedia.</p>
        )}
      </section>
    </>
  );
}
