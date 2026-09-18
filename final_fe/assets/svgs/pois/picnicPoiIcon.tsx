import { PoiIconProps } from '@/types/icon.types';
import { PoiIconBase } from './poiIconBase';
export function PicnicPoiIcon({ background = '#843FDB', border = '#091F01' }: PoiIconProps) {
  return <PoiIconBase background={background} border={border} />;
}
