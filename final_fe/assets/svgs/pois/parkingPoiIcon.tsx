import { PoiIconProps } from '@/types/icon.types';
import { PoiIconBase } from './poiIconBase';
export function ParkingPoiIcon({ background = '#7A7A7A', border = '#091F01' }: PoiIconProps) {
  return <PoiIconBase background={background} border={border} />;
}
