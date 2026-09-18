import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Pill({ label, isActive = false, onPress, disabled = false }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, isActive);

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme, isActive: boolean) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: isActive ? theme.pill.activeBorder : theme.pill.inactiveBorder,
      backgroundColor: isActive ? theme.pill.activeBackground : theme.pill.inactiveBackground,
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 20,
    },
    label: {
      ...typography.l1m,
      color: isActive ? theme.pill.activeLabel : theme.pill.inactiveLabel,
    },
    disabled: {
      opacity: 0.3,
    },
  });
