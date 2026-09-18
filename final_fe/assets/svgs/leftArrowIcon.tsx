import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const LeftArrowIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={(size * 11) / 7} viewBox="0 0 7 11" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.05914 2.08583C6.5191 1.60867 6.5191 0.835035 6.05914 0.357873C5.5992 -0.119291 4.8535 -0.119291 4.39356 0.357873L0.340084 4.56315C-0.119854 5.04031 -0.119867 5.81398 0.340071 6.2911C0.341672 6.29278 0.343278 6.29446 0.344886 6.29608L4.39357 10.4964C4.85351 10.9736 5.59921 10.9736 6.05914 10.4964C6.5191 10.0193 6.5191 9.24562 6.05914 8.76844L2.83846 5.4271L6.05914 2.08583Z"
        fill={color}
      />
    </Svg>
  );
};
