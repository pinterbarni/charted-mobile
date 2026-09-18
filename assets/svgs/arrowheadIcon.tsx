import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const ArrowHeadIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 9 10" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.59826 9.91833L4.3216 0.103516L0.0449219 9.91833L4.3216 7.51092L8.59826 9.91833Z"
        fill={color}
      />
    </Svg>
  );
};
