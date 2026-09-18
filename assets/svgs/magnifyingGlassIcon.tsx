import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const MagnifyingGlassIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 17 17" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8209 6.4299C10.8209 8.88219 8.84056 10.8598 6.41045 10.8598C3.98033 10.8598 2 8.88219 2 6.4299C2 3.97762 3.98033 2 6.41045 2C8.84056 2 10.8209 3.97762 10.8209 6.4299ZM10.2108 11.6086C9.14737 12.395 7.83302 12.8598 6.41045 12.8598C2.87005 12.8598 0 9.98104 0 6.4299C0 2.87877 2.87005 0 6.41045 0C9.95084 0 12.8209 2.87877 12.8209 6.4299C12.8209 7.83135 12.3739 9.12808 11.6151 10.1845L15.8983 14.4677C16.2888 14.8582 16.2888 15.4914 15.8983 15.8819C15.5078 16.2724 14.8746 16.2724 14.4841 15.8819L10.2108 11.6086Z"
        fill={color}
      />
    </Svg>
  );
};
