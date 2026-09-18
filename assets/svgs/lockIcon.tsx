import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const LockIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8 1.6H3.2V4.79844V4.8V6.39844H14.4V6.4C15.2837 6.4 16 7.11634 16 8.00004V14.4C16 15.2836 15.2837 16 14.4 16H1.6C0.716345 16 0 15.2836 0 14.4V8.00004C0 7.11634 0.716345 6.4 1.6 6.4V4.8V1.6C1.6 0.716345 2.31634 0 3.2 0H12.8C13.6837 0 14.4 0.716345 14.4 1.6V4.79844H12.8V1.6ZM14.4 8.00004H1.6V14.4H14.4V8.00004ZM8 9.60004C7.55782 9.60004 7.2 9.9582 7.2 10.4C7.2 10.6961 7.36094 10.9547 7.6 11.093V12.8H8.4V11.093C8.63904 10.9547 8.8 10.6961 8.8 10.4C8.8 10.1707 8.70312 9.96404 8.5484 9.81796C8.40544 9.68284 8.21248 9.60004 8 9.60004Z"
        fill={color}
      />
    </Svg>
  );
};
