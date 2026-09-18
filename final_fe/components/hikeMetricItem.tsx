import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { StyleSheet, Text, View } from 'react-native';

export type HikeMetricVariant = 'tracked' | 'planned';

type Props = {
  label: string;
  value: string;
  variant?: HikeMetricVariant;
  invisible?: boolean;
};

export default function HikeMetricItem({ label, value, variant = 'tracked', invisible }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, variant);

  return (
    <View style={[styles.container, invisible && { opacity: 0 }]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const makeStyles = (themeRaw: AppTheme, variant: HikeMetricVariant) => {
  const theme = variant === 'tracked' ? themeRaw.hikeMetrics.tracked : themeRaw.hikeMetrics.planned;

  return StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: theme.background,
      flex: 1,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: themeRaw.defaultBorder,
      borderRadius: 8,
    },
    label: {
      ...typography.l3u,
      color: theme.label,
    },
    value: {
      ...typography.l1m,
      color: theme.value,
    },
    topRow: {
      paddingVertical: 7,
      borderBottomWidth: 1,
      alignItems: 'flex-start',
      borderColor: theme.margin,
    },
    bottomRow: {
      alignItems: 'flex-start',
      paddingTop: 16,
      paddingBottom: 8,
    },
  });
};
