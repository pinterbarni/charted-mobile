import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const EditProfileIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 17 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8ZM8 8C3.58172 8 0 11.5817 0 16H8.51926C8.6081 15.9947 8.69226 15.96 8.75868 15.9019L12.9784 10.873L13.5284 10.2176C12.092 8.84382 10.1445 8 8 8ZM15.3992 8.90642C15.5412 8.7372 15.8278 8.7439 16.0394 8.9214L16.8054 9.56418C17.0169 9.74166 17.0733 10.0228 16.9313 10.192L15.9029 11.4177L12.6889 15.2479L11.1026 15.9424C10.9312 16.014 10.7076 15.8263 10.7484 15.6451L11.1568 13.9623L14.3708 10.1321L15.3992 8.90642Z"
        fill={color}
      />
    </Svg>
  );
};
