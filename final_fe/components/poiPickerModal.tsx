import TagPill from '@/components/tagPill';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import {
  COMPASS_ABBREVIATIONS,
  COMPASS_DIRECTIONS,
  NON_COMPASS_CATEGORIES,
  POI_CATEGORY_ICONS,
  PoiCategory,
} from '@/types/poi.types';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import ListModal, { ModalItemGroup } from './listModal';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (category: PoiCategory) => void;
};

export default function PoiPickerModal({ visible, onDismiss, onSelect }: Props) {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  if (!visible) return null;

  const groups: ModalItemGroup[] = [
    NON_COMPASS_CATEGORIES.map((category) => ({
      title: t(`poi.${category}`),
      icon: POI_CATEGORY_ICONS[category],
      onPress: () => {
        onSelect(category);
        onDismiss();
      },
    })),
  ];

  const compassFooter = (
    <View style={styles.compassContainer}>
      <Text style={styles.compassTitle}>{t('poi.directions')}</Text>
      <View style={styles.compassPills}>
        {COMPASS_DIRECTIONS.map((direction) => (
          <TagPill
            minWidth={32}
            key={direction}
            label={COMPASS_ABBREVIATIONS[direction]}
            onPress={() => {
              onSelect(direction);
              onDismiss();
            }}
          />
        ))}
      </View>
    </View>
  );

  return <ListModal onDismiss={onDismiss} groups={groups} scrollable footer={compassFooter} />;
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    compassContainer: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.listModal.item.border,
      overflow: 'hidden',
      backgroundColor: theme.listModal.item.background,
      padding: 16,
      gap: 12,
    },
    compassTitle: {
      ...typography.l1m,
      color: theme.listModal.item.text,
    },
    compassPills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
  });
