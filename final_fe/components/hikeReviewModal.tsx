import { FinishIcon } from '@/assets/svgs/finishIcon';
import { LeftArrowIcon } from '@/assets/svgs/leftArrowIcon';
import { SavedIcon } from '@/assets/svgs/savedIcon';
import { StartIcon } from '@/assets/svgs/startIcon';
import Button from '@/components/button';
import HikeMetricGauge from '@/components/hikeMetricGauge';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { syncPendingHikes } from '@/services/trail.service';
import { useLocationStore } from '@/stores/localStore';
import { savePlannedRouteAsGpx } from '@/utils/gpxStorage.utils';
import { PendingHike, savePendingHike } from '@/utils/hikeStorage.utils';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { v4 as uuidv4 } from 'uuid';
import { toastConfig } from './toastMessage';
import TrailMapPreview from './trailMapPreview';

type Mode = 'tracking' | 'planning';

type Props = {
  visible: boolean;
  onResume: () => void;
  onFinish: () => void;
  onBack?: () => void;
  mode?: Mode;
};

export default function HikeReviewModal({ visible, onResume, onFinish, onBack, mode = 'tracking' }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const [trailName, setTrailName] = useState('');

  const trackPoints = useLocationStore((state) => state.metrics.trackPoints);
  const metrics = useLocationStore((state) => state.metrics);
  const pois = useLocationStore((state) => state.metrics.pois);

  const MAX_NAME_LENGTH = 32;
  const canSave = mode === 'tracking' || pois.length > 0;

  const handleFinish = async () => {
    if (!trailName.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Toast.show({ type: 'error', text1: t('hikeReview.nameRequired'), position: 'bottom' });
      return;
    }

    if (trailName.trim().length > MAX_NAME_LENGTH) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Toast.show({ type: 'error', text1: t('hikeReview.nameTooLong'), position: 'bottom' });
      return;
    }

    if (mode === 'planning') {
      try {
        const coordinates: [number, number][] = pois.map((p): [number, number] => [p.lon, p.lat]);
        await savePlannedRouteAsGpx(coordinates, trailName.trim(), pois);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({ type: 'success', text1: t('hikeReview.saveSuccess'), position: 'bottom' });
        setTimeout(() => onFinish(), 1500);
      } catch (e) {
        console.error('Failed to save GPX:', e);
        Toast.show({ type: 'error', text1: t('planning.routeSaveFailed'), position: 'bottom' });
      }
      return;
    }

    const hike: PendingHike = {
      id: uuidv4(),
      title: trailName.trim(),
      distanceM: metrics.distanceM,
      durationS: metrics.durationSeconds,
      elevationGainM: metrics.elevationGainM,
      trackPoints: metrics.trackPoints,
      pois: metrics.pois,
      startedAt: metrics.startedAt?.toISOString() ?? new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      synced: false,
    };

    await savePendingHike(hike);
    await syncPendingHikes();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({ type: 'success', text1: t('hikeReview.saveSuccess'), position: 'bottom' });
    useLocationStore.getState().clearRetrackRoute();
    setTimeout(() => onFinish(), 1500);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onResume}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder={t('hikeReview.namePlaceholder')}
            placeholderTextColor={theme.hikeReview.placeholder}
            value={trailName}
            onChangeText={setTrailName}
            maxLength={MAX_NAME_LENGTH}
          />
          <TrailMapPreview trackPoints={trackPoints} size="fullWidthSquare" pois={metrics.pois} />
          <HikeMetricGauge
            distanceKm={metrics.distanceM / 1000}
            timeSeconds={metrics.durationSeconds}
            paceKmh={
              metrics.durationSeconds > 0 ? metrics.distanceM / 1000 / (metrics.durationSeconds / 3600) : 0
            }
            elevationM={metrics.elevationGainM}
            variant="tracked"
          />
        </View>
        <View style={styles.footer}>
          {mode === 'tracking' ? (
            <Button
              variant="primary"
              title={t('tracking.resume')}
              hasBorder={true}
              onPress={onResume}
              icon={StartIcon}
            />
          ) : (
            <Button
              variant="tertiary"
              title={t('common.back')}
              hasBorder={true}
              onPress={onBack}
              icon={LeftArrowIcon}
              iconSize={10}
            />
          )}
          <Button
            variant="primary"
            title={mode === 'planning' ? t('common.save') : t('tracking.finish')}
            hasBorder={true}
            disabled={!canSave}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onLongPress={handleFinish}
            delayLongPress={600}
            iconSize={mode === 'planning' ? 14 : 10}
            icon={mode === 'planning' ? SavedIcon : FinishIcon}
          />
        </View>
        <Toast config={toastConfig} />
      </SafeAreaView>
    </Modal>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.defaultBackground,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      gap: 32,
    },
    titleInput: {
      ...typography.h2,
      color: theme.hikeReview.title,
      marginTop: 30,
    },
    footer: {
      flexDirection: 'row',
      gap: 24,
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
  });
