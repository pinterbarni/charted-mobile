import { PoiIconProps } from '@/types/icon.types';
import { PoiIconBase } from './poiIconBase';
export function PeakPoiIcon({ background = '#CD5C5C', border = '#091F01' }: PoiIconProps) {
  return <PoiIconBase background={background} border={border} />;
}
