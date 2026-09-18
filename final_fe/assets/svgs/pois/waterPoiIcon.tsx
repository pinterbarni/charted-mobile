import { PoiIconProps } from '@/types/icon.types';
import { G, Mask, Path } from 'react-native-svg';
import { PoiIconBase } from './poiIconBase';

export function WaterPoiIcon({
  background = '#1C4C83',
  border = '#091F01',
  center = '#EBEFEA',
}: PoiIconProps) {
  return (
    <PoiIconBase background={background} border={border}>
      <Mask id="mask_water" maskUnits="userSpaceOnUse" x="6" y="5" width="10" height="12">
        <Path d="M16 5H6V17H16V5Z" fill="white" />
      </Mask>
      <G mask="url(#mask_water)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.46447 15.5622C9.41709 17.4793 12.5829 17.4793 14.5356 15.5622C16.4882 13.6451 16.4882 10.5368 14.5356 8.61969L11 5.14844L7.46447 8.61969C5.51184 10.5368 5.51184 13.6451 7.46447 15.5622Z"
          fill={center}
        />
      </G>
    </PoiIconBase>
  );
}
