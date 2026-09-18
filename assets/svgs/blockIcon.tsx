import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const BlockIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4 8C14.4 11.5346 11.5346 14.4 8 14.4C6.52146 14.4 5.16002 13.8986 4.07642 13.0566L13.0566 4.07642C13.8986 5.16002 14.4 6.52146 14.4 8ZM2.94484 11.9254L11.9255 2.94484C10.8416 2.10196 9.4794 1.6 8 1.6C4.46538 1.6 1.6 4.46538 1.6 8C1.6 9.4794 2.10196 10.8416 2.94484 11.9254ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
        fill={color}
      />
    </Svg>
  );
};
