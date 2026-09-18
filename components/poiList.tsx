import { GrabIcon } from '@/assets/svgs/grabIcon';
import { AddPoiIcon } from '@/assets/svgs/pois';
import { TrashBinIcon } from '@/assets/svgs/trashBinIcon';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useLocationStore } from '@/stores/localStore';
import { Poi, POI_CATEGORY_ICONS } from '@/types/poi.types';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

type Props = {
  pois: Poi[];
  onAddPoi?: () => void;
};

function PoiListItem({ poi }: { poi: Poi }) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  //todo! styles theme and such into a destructured hook!!!! used already everywhere
  const { t } = useTranslation();

  const Icon = POI_CATEGORY_ICONS[poi.category];
  const removePoi = useLocationStore((state) => state.removePoi);

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => removePoi(poi.id)}>
      <TrashBinIcon color={theme.contrast} size={22} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.itemBorder}>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={[styles.item]}>
          <Icon size={22} />
          <Text style={styles.label} numberOfLines={1}>
            {poi.title ?? t(`poi.${poi.category}`)}
          </Text>
          <GrabIcon color={theme.poiList.grabIcon} size={20} />
        </View>
      </Swipeable>
    </View>
  );
}

export default function PoiList({ pois, onAddPoi }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('poi.list.title')}</Text>
      </View>
      <View style={styles.list}>
        {pois.map((poi) => (
          <PoiListItem key={poi.id} poi={poi} />
        ))}
        <TouchableOpacity style={styles.item} onPress={onAddPoi}>
          <AddPoiIcon size={22} />
          <Text style={styles.addLabel}>{t('poi.list.add')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      borderWidth: 1,

      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.defaultBackground,
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
    list: {
      overflow: 'hidden',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 8,
      paddingRight: 16,
      paddingVertical: 15,
      gap: 12,
      backgroundColor: theme.defaultBackground,
    },
    label: {
      ...typography.l2m,
      color: theme.defaultLabel,
      flex: 1,
    },
    addLabel: {
      ...typography.l2m,
      color: theme.defaultLabel,
    },
    deleteAction: {
      backgroundColor: theme.listModal.dangerZone,
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
    },
    emptyText: {
      ...typography.l2r,
      color: theme.delicateBorder,
      textAlign: 'center',
      paddingVertical: 24,
    },
    itemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.delicateBorder,
    },
  });
