import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const PlusIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.6 9.20019C5.15222 9.20019 5.59989 8.75239 5.6 8.2002V5.6L8.2002 5.6C8.75239 5.59989 9.20019 5.15222 9.20019 4.6C9.20019 4.04778 8.75239 3.6001 8.2002 3.6L5.6 3.6V1C5.6 0.447715 5.15228 0 4.6 0C4.04772 0 3.6 0.447715 3.6 1V3.6L1 3.60001C0.447715 3.60001 0 4.04772 0 4.60001C5.96046e-08 5.15229 0.447715 5.60001 1 5.60001L3.6 5.6V8.2002C3.60011 8.75239 4.04778 9.20019 4.6 9.20019Z"
        fill={color}
      />
    </Svg>
  );
};
