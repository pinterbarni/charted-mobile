import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const StartIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={(size * 11) / 12} height={size} viewBox="0 0 11 12" fill="none">
      <Path
        d="M9.97253 5.77128C10.1337 5.8675 10.1337 6.10808 9.97253 6.2043L0.362637 11.9417C0.201466 12.0379 0 11.9177 0 11.7252V0.250374C0 0.0579234 0.201466 -0.0623586 0.362637 0.0338666L9.97253 5.77128Z"
        fill={color}
      />
    </Svg>
  );
};
