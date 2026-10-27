import { ArrowUpRight, MapPin } from "lucide-react";
import type { Destination, City } from "../types/travel";
export default function DestinationCard({
  destination,
  city,
  onDetail,
}: {
  destination: Destination;
  city: City | undefined;
  onDetail: () => void;
}) {
  return (
    <article className="destination-card">
      <button
        className="destination-image"
        onClick={onDetail}
        aria-label={`Lihat detail ${destination.name}`}
      >
        <img
          src={destination.image}
          alt={destination.imageAlt}
          loading="lazy"
        />
        <span className="image-tag">{destination.category}</span>
        <span className="image-arrow">
          <ArrowUpRight size={21} />
        </span>
      </button>
      <div className="destination-meta">
        <span>
          <MapPin size={13} />
          {city?.name}
        </span>
        <span>FOTO ILUSTRASI</span>
      </div>
      <button className="text-detail" onClick={onDetail}>
        <h3>{destination.name}</h3>
      </button>
      <p>{destination.description}</p>
    </article>
  );
}
