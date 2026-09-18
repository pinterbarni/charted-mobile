import { PoiIconProps } from '@/types/icon.types';
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { PoiIconBase } from './poiIconBase';

export function AddPoiIcon({ background = '#EBEFEA', border = '#5C6959', center = '#5C6959' }: PoiIconProps) {
  return (
    <PoiIconBase background={background} border={border}>
      <G clipPath="url(#clip_add)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0016 5.59961C12.0016 5.04732 11.5538 4.59961 11.0016 4.59961C10.4493 4.59961 10.0016 5.04732 10.0016 5.59961V9.99961H5.60156C5.04927 9.99961 4.60156 10.4473 4.60156 10.9996C4.60156 11.5519 5.04927 11.9996 5.60156 11.9996H10.0016V16.3996C10.0016 16.9519 10.4493 17.3996 11.0016 17.3996C11.5538 17.3996 12.0016 16.9519 12.0016 16.3996V11.9996H16.4016C16.9539 11.9996 17.4016 11.5519 17.4016 10.9996C17.4016 10.4473 16.9539 9.99961 16.4016 9.99961H12.0016V5.59961Z"
          fill={center}
        />
      </G>
      <Defs>
        <ClipPath id="clip_add">
          <Rect width="12.8" height="12.8" fill="white" transform="translate(4.60156 4.59961)" />
        </ClipPath>
      </Defs>
    </PoiIconBase>
  );
}
