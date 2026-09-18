import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const AddUserIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2002 0C19.7525 0 20.2002 0.447715 20.2002 1V4.2L23.4 4.2C23.9523 4.2 24.4 4.64771 24.4 5.2C24.4 5.75228 23.9523 6.2 23.4 6.2L20.2002 6.2V9.4C20.2002 9.95228 19.7525 10.4 19.2002 10.4C18.6479 10.4 18.2002 9.95228 18.2002 9.4V6.2L15 6.2C14.4477 6.2 14 5.75229 14 5.2C14 4.64772 14.4477 4.2 15 4.2L18.2002 4.2V1C18.2002 0.447715 18.6479 0 19.2002 0ZM13.5 10.9C13.5 13.3853 11.4853 15.4 9 15.4C6.51472 15.4 4.5 13.3853 4.5 10.9C4.5 8.41472 6.51472 6.4 9 6.4C11.4853 6.4 13.5 8.41472 13.5 10.9ZM9 15.4C13.9706 15.4 18 19.4294 18 24.4H0C0 19.4294 4.02944 15.4 9 15.4Z"
        fill={color}
      />
    </Svg>
  );
};
