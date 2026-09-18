import { PoiIconBase } from '@/assets/svgs/pois/poiIconBase';
import { PoiIconProps } from '@/types/icon.types';
import { Rect } from 'react-native-svg';

export function CurrentLocationRouteIcon({ background = '#EBEFEA', border = '#091F01' }: PoiIconProps) {
  return (
    <PoiIconBase background={background} border={border}>
      <Rect x="6" y="6" width="10" height="10" rx="5" fill="#8FAF84" />
      <Rect x="8" y="8" width="6" height="6" rx="3" fill="#286912" />
    </PoiIconBase>
  );
}
