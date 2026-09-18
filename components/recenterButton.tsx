import { ArrowHeadIcon } from '@/assets/svgs/arrowheadIcon';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { todoDumb } from '@/utils/todo.utils';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onPress?: () => void;
  bottomOffset?: number;
};

export default function RecenterButton({ onPress = () => todoDumb(), bottomOffset = 190 }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { bottom: bottomOffset + insets.bottom }]}>
      <ArrowHeadIcon color={styles.svg.color} size={styles.svg.height} />
      <Text style={styles.label}>Re-Center</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      right: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 6,
      gap: 4,
      borderWidth: 1,
      borderColor: theme.recenterButton.border,
      backgroundColor: theme.recenterButton.background,
    },
    svg: {
      color: theme.recenterButton.svg,
      height: 10,
    },
    label: {
      ...typography.l1r,
      color: theme.recenterButton.label,
    },
    activeLabel: {
      color: theme.button.primary.background,
    },
  });
