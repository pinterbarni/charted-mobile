import { EndLocationIcon, StartLocationIcon } from '@/assets/svgs/routes';
import Button from '@/components/button';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  onStartPress: () => void;
  onEndPress: () => void;
};

export default function RoutePlanner({ onStartPress, onEndPress }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('route.title')}</Text>
      </View>

      <View style={styles.buttons}>
        <Button
          variant="secondary"
          title={t('route.startPlaceholder')}
          icon={StartLocationIcon}
          iconPosition="left"
          textAlign="left"
          hasBorder={false}
          onPress={onStartPress}
        />
        <Button
          variant="secondary"
          title={t('route.endPlaceholder')}
          icon={EndLocationIcon}
          iconPosition="left"
          textAlign="left"
          hasBorder={false}
          onPress={onEndPress}
        />
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      borderWidth: 1,
      borderColor: theme.defaultBorder,
      borderRadius: 8,
      overflow: 'hidden',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.poiList.header.background,
    },
    title: {
      ...typography.h4,
      color: theme.poiList.header.title,
    },
    buttons: {
      gap: 1,
      backgroundColor: theme.delicateBorder,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    gap: {
      gap: 16,
    },
  });
