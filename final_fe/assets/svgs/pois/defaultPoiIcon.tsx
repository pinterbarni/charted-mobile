import { PoiIconProps } from '@/types/icon.types';
import { G, Mask, Path } from 'react-native-svg';
import { PoiIconBase } from './poiIconBase';

export function DefaultPoiIcon({
  background = '#B5BCB3',
  border = '#091F01',
  center = '#EBEFEA',
}: PoiIconProps) {
  return (
    <PoiIconBase background={background} border={border}>
      <Mask id="mask_default" maskUnits="userSpaceOnUse" x="6" y="5" width="10" height="12">
        <Path d="M16 5H6V17H16V5Z" fill="white" />
      </Mask>
      <G mask="url(#mask_default)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.46484 6.43811C9.41699 4.52063 12.583 4.52063 14.5352 6.43811C16.4883 8.3551 16.4883 11.4635 14.5352 13.3805L11 16.8517L7.46484 13.3805C5.51172 11.4635 5.51172 8.3551 7.46484 6.43811ZM11 12.0001C12.1045 12.0001 13 11.1046 13 10.0001C13 8.89563 12.1045 8.00012 11 8.00012C9.89551 8.00012 9 8.89563 9 10.0001C9 10.6422 9.30273 11.214 9.77344 11.5802C10.1123 11.8434 10.5381 12.0001 11 12.0001Z"
          fill={center}
        />
      </G>
    </PoiIconBase>
  );
}
