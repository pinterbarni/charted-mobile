import {
  CampsitePoiIcon,
  DefaultPoiIcon,
  GeocachePoiIcon,
  HistoricalPoiIcon,
  ParkingPoiIcon,
  PeakPoiIcon,
  PicnicPoiIcon,
  WaterPoiIcon,
} from '@/assets/svgs/pois';
import { PoiIconProps } from '@/types/icon.types';

export type CompassDirection =
  | 'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest';

export type PoiCategory =
  | 'default'
  | 'water'
  | 'historical'
  | 'campsite'
  | 'peak'
  | 'geocache'
  | 'picnic'
  | 'parking'
  | CompassDirection;

export type Poi = {
  id: string;
  lat: number;
  lon: number;
  category: PoiCategory;
  title?: string;
  note?: string;
};

export const COMPASS_DIRECTIONS: CompassDirection[] = [
  'north',
  'northeast',
  'east',
  'southeast',
  'south',
  'southwest',
  'west',
  'northwest',
];

export const COMPASS_ABBREVIATIONS: Record<CompassDirection, string> = {
  north: 'N',
  northeast: 'NE',
  east: 'E',
  southeast: 'SE',
  south: 'S',
  southwest: 'SW',
  west: 'W',
  northwest: 'NW',
};

export const NON_COMPASS_CATEGORIES: PoiCategory[] = [
  'default',
  'water',
  'historical',
  'campsite',
  'peak',
  'geocache',
  'picnic',
  'parking',
];

export const POI_CATEGORIES: PoiCategory[] = [...NON_COMPASS_CATEGORIES, ...COMPASS_DIRECTIONS];

export const POI_CATEGORY_ICONS: Record<PoiCategory, React.ComponentType<PoiIconProps>> = {
  default: DefaultPoiIcon,
  water: WaterPoiIcon,
  historical: HistoricalPoiIcon,
  campsite: CampsitePoiIcon,
  peak: PeakPoiIcon,
  geocache: GeocachePoiIcon,
  picnic: PicnicPoiIcon,
  parking: ParkingPoiIcon,
  north: DefaultPoiIcon,
  northeast: DefaultPoiIcon,
  east: DefaultPoiIcon,
  southeast: DefaultPoiIcon,
  south: DefaultPoiIcon,
  southwest: DefaultPoiIcon,
  west: DefaultPoiIcon,
  northwest: DefaultPoiIcon,
};
