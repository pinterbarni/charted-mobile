import { PoiIconProps } from '@/types/icon.types';
import { PoiIconBase } from './poiIconBase';
export function GeocachePoiIcon({ background = '#02874D', border = '#091F01' }: PoiIconProps) {
  return <PoiIconBase background={background} border={border} />;
}
