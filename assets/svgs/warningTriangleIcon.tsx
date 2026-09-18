import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIcon } from '@/types/icon.types';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export const WarningTriangleIcon = (props: AppIcon) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 11 10" fill="none">
      <G clipPath="url(#clip0)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.90861 0.331124C5.65145 -0.110375 5.01363 -0.110375 4.75647 0.331125L0.0915999 8.33993C-0.167272 8.78433 0.153334 9.34213 0.667673 9.34213H9.9974C10.5117 9.34213 10.8323 8.78433 10.5735 8.33993L5.90861 0.331124ZM5.37989 2.00878C5.74807 2.00878 6.04655 2.30725 6.04655 2.67545V6.00878C6.04655 6.37697 5.74807 6.67547 5.37989 6.67547C5.01169 6.67547 4.71322 6.37697 4.71322 6.00878V2.67545C4.71322 2.30725 5.01169 2.00878 5.37989 2.00878ZM4.66634 7.99413C4.66634 7.6292 4.96805 7.33333 5.33301 7.33333C5.69796 7.33333 5.99967 7.6292 5.99967 7.99413C5.99967 8.35907 5.69796 8.65493 5.33301 8.65493C4.96805 8.65493 4.66634 8.35907 4.66634 7.99413Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Rect width="10.6667" height="10" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
