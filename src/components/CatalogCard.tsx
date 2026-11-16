import { assetUrl } from "../utils/assetUrl";
import Reveal from "./Reveal";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PhotoAttribution, PhotoReferenceLink } from "./CatalogPhoto";
import type { PhotoCredit } from "../types/travel";
export default function CatalogCard({
  name,
  location,
  description,
  category,
  image,
  imageAlt,
  photoCredit,
  photoReference,
  onDetail,
}: {
  name: string;
  location?: string;
  description?: string;
  category: string;
  image?: string;
  imageAlt: string;
  photoCredit?: PhotoCredit;
  photoReference?: string;
  onDetail: () => void;
}) {
  return (
    <Reveal as="article" className="destination-card">
      <button
        className="destination-image"
        onClick={onDetail}
        aria-label={`Lihat detail ${name}`}
      >
        {image ? (
          <img src={assetUrl(image)} alt={imageAlt} loading="lazy" />
        ) : (
          <span className="catalog-no-photo" aria-hidden="true">
            <MapPin size={42} strokeWidth={1.2} />
            {photoReference
              ? "Foto tersedia di situs sumber"
              : "Foto belum tersedia"}
          </span>
        )}
        <span className="image-tag">{category}</span>
        <span className="image-arrow">
          <ArrowUpRight size={21} />
        </span>
      </button>
      {location && (
        <div className="destination-meta">
          <MapPin size={13} /> {location}
        </div>
      )}
      <button className="text-detail" onClick={onDetail}>
        <h3>{name}</h3>
      </button>
      {description && <p>{description}</p>}
      {photoCredit && (
        <small className="catalog-card-credit">
          <PhotoAttribution credit={photoCredit} />
        </small>
      )}
      {!image && photoReference && (
        <div>
          <PhotoReferenceLink href={photoReference} name={name} />
        </div>
      )}
    </Reveal>
  );
}
