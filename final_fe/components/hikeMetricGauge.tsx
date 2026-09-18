import HikeMetricItem, { HikeMetricVariant } from '@/components/hikeMetricItem';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatDistance, formatElevation, formatPace, formatTime } from '@/utils/unitsOfMeasurement.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

type Props = {
  distanceKm?: number;
  timeSeconds?: number;
  paceKmh?: number;
  elevationM?: number;
  variant?: HikeMetricVariant;
};

export default function HikeMetricGauge({
  distanceKm = 0,
  variant = 'planned',
  timeSeconds = 0,
  paceKmh = 0,
  elevationM = 0,
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { i18n, t } = useTranslation();
  const locale = i18n.language;

  const { unitOfMeasurementSystem } = useSettingsStore();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <HikeMetricItem
          label={t('metrics.distance')}
          value={formatDistance(distanceKm, unitOfMeasurementSystem, locale)}
          variant={variant}
        />
        <HikeMetricItem
          label={t('metrics.elevation')}
          value={formatElevation(elevationM, unitOfMeasurementSystem, locale)}
          variant={variant}
        />
      </View>
      <View style={styles.row}>
        <HikeMetricItem label={t('metrics.time')} value={formatTime(timeSeconds)} variant={variant} />
        <HikeMetricItem
          label={t('metrics.pace')}
          value={formatPace(paceKmh, unitOfMeasurementSystem, locale)}
          variant={variant}
          invisible={variant === 'planned'}
        />
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      //alignSelf: 'stretch',
      gap: 16,
      alignItems: 'stretch',
    },
    row: {
      flexDirection: 'row',
      gap: 16,
    },
    hidden: {
      flex: 1,
      opacity: 0,
    },
    flex: {
      flex: 1,
    },
  });
