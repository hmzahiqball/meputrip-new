export interface Region {
  id: string;
  name: string;
  tagline: string;
  description: string;
}
export interface City {
  id: string;
  regionId: string;
  name: string;
}
export interface Destination {
  id: string;
  cityId: string;
  regionId: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
}
export interface TripPackage {
  id: string;
  regionId: string;
  cityId: string;
  name: string;
  duration: string;
  price: string;
  type: "open" | "private";
  departure: string;
  availability: string;
  image: string;
  description: string;
}
export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  trip: string;
  rating: number;
  isDemo: boolean;
}
export interface Company {
  name: string;
  story: string;
  vision: string;
  mission: string;
}
export interface LegalDocument {
  id: string;
  title: string;
  status: string;
  url: string;
}
export interface Contact {
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  hours: string;
}
export interface TravelData {
  regions: Region[];
  cities: City[];
  destinations: Destination[];
  packages: TripPackage[];
  testimonials: Testimonial[];
  company: Company;
  legal: LegalDocument[];
  contact: Contact;
}
export interface TravelRepository {
  load(signal?: AbortSignal): Promise<TravelData>;
}
