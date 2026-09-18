import Pill from '@/components/pill';
import Toggle from '@/components/toggle';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { ColorTheme, useSettingsStore } from '@/stores/settingsStore';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function DarkModeSelector() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const { t } = useTranslation();
  const systemScheme = useColorScheme();

  const resolvedSystemTheme: ColorTheme = systemScheme === 'dark' ? 'dark' : 'light';
  const { colorTheme, setColorTheme, automaticTheme, setAutomaticTheme } = useSettingsStore();

  const activeTheme = automaticTheme ? resolvedSystemTheme : colorTheme;

  const handleAutomaticToggle = (value: boolean) => {
    if (!value) {
      setColorTheme(resolvedSystemTheme);
    }
    setAutomaticTheme(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('settings.darkMode')}</Text>
      <View style={styles.pills}>
        <Pill
          onPress={() => !automaticTheme && setColorTheme('light')}
          label={t('settings.light')}
          isActive={activeTheme === 'light'}
          disabled={automaticTheme}
        />
        <Pill
          onPress={() => !automaticTheme && setColorTheme('dark')}
          label={t('settings.dark')}
          isActive={activeTheme === 'dark'}
          disabled={automaticTheme}
        />
      </View>
      <View style={styles.automaticRow}>
        <View style={styles.automaticLeft}>
          <Text style={styles.automaticLabel}>{t('settings.automatic')}</Text>
        </View>
        <Toggle value={automaticTheme} onValueChange={handleAutomaticToggle} />
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
      color: theme.defaultTitle,
      paddingBottom: 24,
    },
    pills: {
      flexDirection: 'row',
      gap: 24,
    },
    automaticRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: theme.delicateBorder,
      borderBottomWidth: 1,
      paddingLeft: 8,
      marginTop: 16,
    },
    colBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    automaticLeft: {
      flex: 1,
    },
    automaticLabel: {
      ...typography.l1m,
      color: theme.defaultLabel,
      paddingTop: 15,
      paddingBottom: 14,
    },
  });
