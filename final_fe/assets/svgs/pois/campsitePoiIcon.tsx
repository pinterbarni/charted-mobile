import { PoiIconProps } from '@/types/icon.types';
import { PoiIconBase } from './poiIconBase';

export function CampsitePoiIcon({ background = '#286912', border = '#091F01' }: PoiIconProps) {
  return <PoiIconBase background={background} border={border} />;
}
