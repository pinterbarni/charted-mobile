import { PoiIconBase } from '@/assets/svgs/pois/poiIconBase';
import { PoiIconProps } from '@/types/icon.types';
import { Path } from 'react-native-svg';

export function StartLocationIcon({
  background = '#EBEFEA',
  border = '#091F01',
  center = '#091F01',
}: PoiIconProps) {
  return (
    <PoiIconBase background={background} border={border}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 6C8.23858 6 6 8.23858 6 11C6 13.7614 8.23858 16 11 16C13.7614 16 16 13.7614 16 11C16 8.23858 13.7614 6 11 6ZM11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8Z"
        fill={center}
      />
    </PoiIconBase>
  );
}
