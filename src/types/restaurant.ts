export type PlaceCategory =
  | 'restaurant'
  | 'mosque'
  | 'accommodation'
  | 'grocery'
  | 'other';

export type HalalStatus =
  | 'halal_certified'
  | 'muslim_friendly'
  | 'partially_halal'
  | 'seafood_only'
  | 'vegetarian'
  | 'unknown';

export interface Restaurant {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  halalStatus: HalalStatus;
  category: PlaceCategory;
  openingHours: string | null;
  phone: string | null;
  description: string | null;
  source: 'local_kmz';
}
