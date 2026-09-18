import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { ClipPath, Defs, Path, Rect } from 'react-native-svg';

export const ExclamationIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Defs>
        <ClipPath id="clip">
          <Rect width="3.2" height="16" fill="white" x="6.40039" />
        </ClipPath>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.46706 0C6.87795 0 6.40039 0.358172 6.40039 0.8L6.80039 10.8C6.80039 11.2418 6.85129 11.6 7.44039 11.6H8.56039C9.14948 11.6 9.20039 11.2418 9.20039 10.8L9.60039 0.8C9.60039 0.358172 9.12282 0 8.53372 0H7.46706ZM8.00039 12.4C6.80039 12.4 6.56039 12.7 6.56039 14.2C6.56039 15.7 6.96039 16 8.00039 16C9.04039 16 9.44039 15.7 9.44039 14.2C9.44039 12.7 9.20039 12.4 8.00039 12.4Z"
        fill={color}
        clipPath="url(#clip)"
      />
    </Svg>
  );
};
