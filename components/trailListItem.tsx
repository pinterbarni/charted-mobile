import { MoreTrailsIcon } from '@/assets/svgs/moreTrailsIcon';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { Trail } from '@/types/trail.types';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TrailMapPreview from './trailMapPreview';

type Props = {
  trail?: Trail;
  label?: string;
  isEndItem?: boolean;
  endItemCount?: number;
  endItemName?: string;
  onPress?: () => void;
  size?: 'square' | 'banner';
};

export default function TrailListItem({
  trail,
  label,
  isEndItem = false,
  endItemCount,
  endItemName,
  onPress,
  size = 'square',
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, size);
  const { t } = useTranslation();

  const endLabel = endItemName ? `More ${endItemName}` : t('trails.more');

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {isEndItem ? (
        <View style={styles.endItem}>
          <View style={styles.iconWrapper}>
            <MoreTrailsIcon color={theme.showMoreTrails.icon} size={20} />
          </View>
          <View style={styles.endLabelWrapper}>
            <Text style={styles.endItemText} textBreakStrategy="balanced">
              {endItemCount !== undefined ? `+${endItemCount} ` : ''}
              {endLabel}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <TrailMapPreview
            trackPoints={trail?.trackPoints ?? []}
            pois={[]}
            size={size}
            distanceM={trail?.distanceM ?? undefined}
            durationS={trail?.durationS ?? undefined}
            elevationGainM={trail?.elevationGainM ?? undefined}
          />
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme, size: 'square' | 'banner') =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      gap: 16,
      width: size === 'square' ? 180 : undefined,
      alignSelf: size === 'banner' ? 'stretch' : undefined,
    },
    endItem: {
      padding: 16,
      width: size === 'square' ? 180 : undefined,
      alignSelf: size === 'banner' ? 'stretch' : undefined,
      height: 180,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.delicateBorder,
      backgroundColor: theme.showMoreTrails.background,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      shadowColor: theme.defaultLabel,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    iconWrapper: {
      alignItems: 'center',
    },
    endLabelWrapper: {
      alignItems: 'center',
    },
    endItemText: {
      ...typography.l2m,
      color: theme.defaultLabel,
      textAlign: 'center',
    },
    label: {
      ...typography.h5,
      color: theme.defaultTitle,
    },
    shadowWrapper: {
      borderRadius: 12,
      shadowColor: theme.defaultLabel,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
  });
