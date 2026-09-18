import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const CheckmarkIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);

  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.89301 0.463327C9.29989 -0.0598098 10.0538 -0.154052 10.577 0.252832C11.1001 0.659716 11.1943 1.41364 10.7874 1.93678L7.42746 6.25676L4.08278 10.5571C4.0252 10.6345 3.95777 10.7056 3.88121 10.7682C3.63184 10.973 3.31361 11.0649 3.00199 11.0343C2.83384 11.0178 2.66761 10.9657 2.51516 10.8764C2.39372 10.8057 2.28384 10.7132 2.19204 10.601C2.12926 10.5245 2.07708 10.4416 2.0358 10.3544L1.08695 8.45668L0.12695 6.53668C-0.169437 5.94392 0.0708331 5.2231 0.663607 4.92672C1.25638 4.63033 1.97719 4.87061 2.27358 5.46338L3.23357 7.38337L3.34204 7.60029L5.53302 4.7833L8.89301 0.463327Z"
        fill={color}
      />
    </Svg>
  );
};
