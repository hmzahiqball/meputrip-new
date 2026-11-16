import { assetUrl } from "../utils/assetUrl";
import type { PhotoCredit } from "../types/travel";

export function PhotoAttribution({ credit }: { credit: PhotoCredit }) {
  return (
    <>
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
