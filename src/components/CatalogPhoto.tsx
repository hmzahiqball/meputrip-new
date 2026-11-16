import { assetUrl } from "../utils/assetUrl";
import type { PhotoCredit } from "../types/travel";

export function PhotoAttribution({ credit }: { credit: PhotoCredit }) {
  return (
    <>
      {credit.caption && (
        <span className="catalog-photo-caption">{credit.caption}</span>
      )}
      <a href={credit.source} target="_blank" rel="noreferrer">
        {credit.title}
      </a>
      {` • ${credit.author} • `}
      <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
        {credit.license}
      </a>
      {" • Ukuran dan format disesuaikan"}
    </>
  );
}

export function PhotoReferenceLink({
  href,
  name,
}: {
  href: string;
  name: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-link"
      aria-label={`Lihat foto ${name} di situs sumber`}
    >
      Lihat foto di situs sumber
    </a>
  );
}

export default function CatalogPhoto({
  image,
  alt,
  credit,
}: {
  image: string;
  alt: string;
  credit?: PhotoCredit;
}) {
  return (
    <figure className="catalog-photo">
      <img className="modal-photo" src={assetUrl(image)} alt={alt} />
      {credit && (
        <figcaption>
          <PhotoAttribution credit={credit} />
        </figcaption>
      )}
    </figure>
  );
}
