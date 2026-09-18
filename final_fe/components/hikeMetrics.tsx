import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatDistance, formatElevation, formatPace, formatTime } from '@/utils/unitsOfMeasurement.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  distanceKm?: number;
  timeSeconds?: number;
  paceKmh?: number;
  elevationM?: number;
};

export default function HikeMetrics({ distanceKm = 0, timeSeconds = 0, paceKmh = 0, elevationM = 0 }: Props) {
  const theme = useAppTheme();
  const { unitOfMeasurementSystem } = useSettingsStore();
  const styles = makeStyles(theme);
  const { i18n, t } = useTranslation();
  const locale = i18n.language;

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={styles.topMetric}>
          <Text style={styles.label}>{t('metrics.distance')}</Text>
          <Text style={styles.value}>{formatDistance(distanceKm, unitOfMeasurementSystem, locale)}</Text>
        </View>
        <View style={styles.bottomMetric}>
          <Text style={styles.label}>{t('metrics.time')}</Text>
          <Text style={styles.value}>{formatTime(timeSeconds)}</Text>
        </View>
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.topMetric}>
          <Text style={styles.label}>{t('metrics.pace')}</Text>
          <Text style={styles.value}>{formatPace(paceKmh, unitOfMeasurementSystem, locale)}</Text>
        </View>
        <View style={styles.bottomMetric}>
          <Text style={styles.label}>{t('metrics.elevation')}</Text>
          <Text style={styles.value}>{formatElevation(elevationM, unitOfMeasurementSystem, locale)}</Text>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingTop: 16,
      flexDirection: 'row',
      alignSelf: 'stretch',
      gap: 16,
    },
    leftColumn: {
      flexDirection: 'column',
      flex: 1,
    },
    rightColumn: {
      flex: 1,
      flexDirection: 'column',
    },
    topMetric: {
      paddingBottom: 11,
      borderBottomColor: theme.hikeMetrics.tracking.label,
      justifyContent: 'space-between',
      borderBottomWidth: 1,

      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomMetric: {
      paddingTop: 8,

      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    label: {
      ...typography.l3u,
      color: theme.hikeMetrics.tracking.label,
    },
    value: {
      ...typography.l1m,
      color: theme.hikeMetrics.tracking.value,
    },
  });
