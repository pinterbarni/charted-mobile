import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const FinishIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        d="M11.4 0H0.6C0.268629 0 0 0.268629 0 0.6V11.4C0 11.7314 0.268629 12 0.6 12H11.4C11.7314 12 12 11.7314 12 11.4V0.6C12 0.268629 11.7314 0 11.4 0Z"
        fill={color}
      />
    </Svg>
  );
};
