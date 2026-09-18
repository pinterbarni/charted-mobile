import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { AppIconProps } from '@/types/icon.types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// todo: move out these!
type FontWeight = 'regular' | 'medium' | 'semibold';

type Props = {
  label: string;
  icon?: React.ComponentType<AppIconProps>;
  onPress?: () => void;
  isActive?: boolean;
  minWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
  fontWeight?: FontWeight;
};

const getLabelStyle = (fontWeight: FontWeight) => {
  switch (fontWeight) {
    case 'semibold':
      return typography.l3m;
    case 'medium':
      return typography.l3m;
    default:
      return typography.l3r;
  }
};

export default function TagPill({
  label,
  icon: Icon,
  onPress,
  isActive = false,
  borderColor,
  minWidth,
  backgroundColor,

  fontWeight = 'regular',
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, isActive, minWidth, backgroundColor, borderColor);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {Icon && <Icon color={theme.defaultLabel} size={8} />}
      <Text style={[styles.label, getLabelStyle(fontWeight)]}>{label}</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (
  theme: AppTheme,
  isActive: boolean,
  minWidth?: number,
  backgroundColor?: string,
  borderColor?: string
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderRadius: 100,
      borderWidth: 1,
      borderColor: borderColor ?? (isActive ? theme.defaultBorder : theme.delicateBorder),
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 7,
      paddingVertical: 3,

      backgroundColor: backgroundColor ?? (isActive ? theme.defaultBorder : theme.defaultBackground),
      ...(minWidth ? { minWidth } : {}),
      justifyContent: 'center',
    },
    label: {
      ...typography.l3r,
      color: theme.defaultLabel,
    },
  });
