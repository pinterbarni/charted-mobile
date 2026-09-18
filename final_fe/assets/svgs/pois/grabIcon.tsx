import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const GrabIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={(size * 16) / 20} viewBox="0 0 21 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 1.5C0 0.671573 0.671573 0 1.5 0H19.5C20.3284 0 21 0.671573 21 1.5C21 2.32843 20.3284 3 19.5 3H1.5C0.671573 3 0 2.32843 0 1.5ZM0 15.9C0 15.0716 0.671573 14.4 1.5 14.4H19.5C20.3284 14.4 21 15.0716 21 15.9C21 16.7284 20.3284 17.4 19.5 17.4H1.5C0.671573 17.4 0 16.7284 0 15.9ZM1.5 7.2C0.671573 7.2 0 7.87157 0 8.7C0 9.52843 0.671573 10.2 1.5 10.2H19.5C20.3284 10.2 21 9.52843 21 8.7C21 7.87157 20.3284 7.2 19.5 7.2H1.5Z"
        fill={color}
      />
    </Svg>
  );
};
