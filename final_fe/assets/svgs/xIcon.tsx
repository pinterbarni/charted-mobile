import { useIconDefaults } from '@/hooks/useIconDefault';
import { AppIconProps } from '@/types/icon.types';
import Svg, { Path } from 'react-native-svg';

export const XIcon = (props: AppIconProps) => {
  const { color, size } = useIconDefaults(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4.10879 4.10868C4.49932 3.71816 5.13248 3.71816 5.52301 4.10868L8.05164 6.63732L10.6975 3.99146C11.088 3.60094 11.7212 3.60094 12.1117 3.99146C12.5022 4.38199 12.5022 5.01515 12.1117 5.40568L9.46585 8.05153L11.9943 10.58C12.3848 10.9705 12.3848 11.6037 11.9943 11.9942C11.6038 12.3847 10.9706 12.3847 10.5801 11.9942L8.05164 9.46574L5.40559 12.1118C5.01507 12.5023 4.3819 12.5023 3.99138 12.1118C3.60085 11.7213 3.60085 11.0881 3.99138 10.6976L6.63743 8.05153L4.10879 5.52289C3.71827 5.13237 3.71827 4.49921 4.10879 4.10868Z"
        fill={color}
      />
    </Svg>
  );
};
