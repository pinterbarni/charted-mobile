import { CHARTED_COLOR_PALETTE } from '@/constants/theme.constants';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Circle } from 'react-native-svg';

export const CurrentLocationIcon = ({ size = 16 }: AppIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="8" fill={CHARTED_COLOR_PALETTE.fullGreen[200]} />
    <Circle cx="8" cy="8" r="5" fill={CHARTED_COLOR_PALETTE.fullGreen[300]} />
  </Svg>
);
