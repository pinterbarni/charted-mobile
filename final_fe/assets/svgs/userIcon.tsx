import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const UserIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 20C25.5228 20 30 15.5228 30 10C30 4.47715 25.5228 0 20 0C14.4772 0 10 4.47715 10 10C10 15.5228 14.4772 20 20 20ZM20 20C8.9543 20 0 28.9543 0 40H40C40 28.9543 31.0457 20 20 20Z"
        fill={color}
      />
    </Svg>
  );
};
