import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export const SavedIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={(size * 13) / 16} height={size} viewBox="0 0 13 16" fill="none">
      <G clipPath="url(#clip_saved)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0.205128C0 0.0918388 0.0920172 0 0.205526 0H12.1261C12.2396 0 12.3316 0.091839 12.3316 0.205128V0.646782V8V15.7635C12.3316 15.9604 12.0806 16.0442 11.9619 15.8869L6.38836 8.5001L6.32039 8.42267C6.23853 8.32935 6.09306 8.32935 6.01119 8.42267L5.94323 8.50008L0.369705 15.8869C0.251011 16.0442 0 15.9604 0 15.7635V8V0.646784V0.205128Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip_saved">
          <Rect width="12.3316" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
