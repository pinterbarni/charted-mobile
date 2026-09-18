import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { AppIconProps } from '@/types/icon.types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  label: string;
  icon?: React.ComponentType<AppIconProps>;
  onPress?: () => void;
  isDangerous?: boolean;
};

export default function SettingsRow({ label, icon: Icon, onPress, isDangerous = false }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        {Icon && <Icon color={isDangerous ? theme.listModal.dangerZone : theme.defaultLabel} size={16} />}
        <Text style={[styles.label, isDangerous && styles.dangerLabel]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: theme.delicateBorder,
      borderBottomWidth: 1,
      paddingLeft: 8,
    },
    left: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingTop: 15,
      paddingBottom: 14,
    },
    label: {
      ...typography.l1m,
      color: theme.defaultLabel,
    },
    dangerLabel: {
      color: theme.listModal.dangerZone,
    },
  });
