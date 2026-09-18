import { PoiIconProps } from '@/types/icon.types';
import { PoiIconBase } from './poiIconBase';

export function HistoricalPoiIcon({ background = '#FFD700', border = '#091F01' }: PoiIconProps) {
  return <PoiIconBase background={background} border={border} />;
}
