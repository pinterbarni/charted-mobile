import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const ClockIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 8 8" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4C1 5.65685 2.34315 7 4 7C5.65685 7 7 5.65685 7 4C7 2.50403 5.90504 1.26381 4.47285 1.03705C4.49044 1.08813 4.5 1.14295 4.5 1.2V3.5H6C6.27614 3.5 6.5 3.72386 6.5 4C6.5 4.27614 6.27614 4.5 6 4.5H4C3.72386 4.5 3.5 4.27614 3.5 4V1.2C3.5 1.14295 3.50956 1.08813 3.52715 1.03705C2.09496 1.26381 1 2.50403 1 4ZM4 0C1.79086 0 0 1.79086 0 4C0 6.20914 1.79086 8 4 8C6.20914 8 8 6.20914 8 4C8 1.79086 6.20914 0 4 0Z"
        fill={color}
      />
    </Svg>
  );
};
