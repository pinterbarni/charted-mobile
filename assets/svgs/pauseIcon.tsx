import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const PauseIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={(size * 11) / 12} height={size} viewBox="0 0 11 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.507692 0C0.227322 0 0 0.268653 0 0.6V11.4C0 11.7314 0.227322 12 0.507692 12H3.3C3.58037 12 3.80769 11.7314 3.80769 11.4V0.6C3.80769 0.268653 3.58037 0 3.3 0H0.507692ZM6.85385 0C6.57347 0 6.34615 0.268653 6.34615 0.6V11.4C6.34615 11.7314 6.57347 12 6.85385 12H9.64615C9.92653 12 10.1538 11.7314 10.1538 11.4V0.6C10.1538 0.268653 9.92653 0 9.64615 0H6.85385Z"
        fill={color}
      />
    </Svg>
  );
};
