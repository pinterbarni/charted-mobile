import Pill from '@/components/pill';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function UnitOfMeasurementSelector() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();

  const { unitOfMeasurementSystem, setUnitOfMeasurementSystem } = useSettingsStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.unitOfMeasurement')}</Text>
      <View style={styles.pills}>
        <Pill
          label={t('settings.metric')}
          isActive={unitOfMeasurementSystem === 'metric'}
          onPress={() => setUnitOfMeasurementSystem('metric')}
        />
        <Pill
          label={t('settings.imperial')}
          isActive={unitOfMeasurementSystem === 'imperial'}
          onPress={() => setUnitOfMeasurementSystem('imperial')}
        />
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
    },
    title: {
      ...typography.l2u,
      paddingBottom: 24,

      color: theme.defaultTitle,
    },
    // bgColor: {
    //   backgroundColor: theme.
    // },
    pills: {
      flexDirection: 'row',
      gap: 24,
    },
  });
