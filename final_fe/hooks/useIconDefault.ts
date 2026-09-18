import { useAppTheme } from '@/contexts/themeContext';
import { AppIconProps, ICON_DEFAULTS } from '@/types/icon.types';

export const useIconDefaults = (props: AppIconProps) => {
  const theme = useAppTheme();
  return {
    color: props.color ?? theme.icon.unimplemented,
    size: props.size ?? ICON_DEFAULTS.size,
  };
};
