import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const PinIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={(size * 10) / 12} height={size} viewBox="0 0 10 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.46484 1.43811C3.41699 -0.47937 6.58301 -0.47937 8.53516 1.43811C10.4883 3.3551 10.4883 6.4635 8.53516 8.38049L5 11.8517L1.46484 8.38049C-0.48828 6.4635 -0.48828 3.3551 1.46484 1.43811ZM5 7.00012C6.10449 7.00012 7 6.10461 7 5.00012C7 3.89563 6.10449 3.00012 5 3.00012C3.89551 3.00012 3 3.89563 3 5.00012C3 5.64221 3.30273 6.21399 3.77344 6.5802C4.1123 6.84338 4.53809 7.00012 5 7.00012Z"
        fill={color}
      />
    </Svg>
  );
};
