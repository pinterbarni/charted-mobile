import { BlockIcon } from '@/assets/svgs/blockIcon';
import Divider from '@/components/divider';
import PoiList from '@/components/poiList';
import { ROUTES } from '@/constants/routes.constants';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useLocationStore } from '@/stores/localStore';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DarkModeSelector from './darkModeSelector';
import HikeMetrics from './hikeMetrics';
import SettingsRow from './settingsRow';
import UnitOfMeasurementSelector from './unitOfMeasurementSelector';

type Props = {
  bottomInset?: number;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints: (string | number)[];
  isForegroundDenied: boolean;
  onAddPoi?: () => void;
  onStartLocationPress?: () => void;
  onEndLocationPress?: () => void;
  onSnapIndexChange?: (index: number) => void;
  isPlanning?: boolean;
  onSetPinManually?: () => void;
};

export default function MapBottomSheet({
  bottomSheetRef,
  snapPoints,
  bottomInset,
  isForegroundDenied,
  onAddPoi,
  onSnapIndexChange,
  onStartLocationPress, // not used todo
  onEndLocationPress,
  onSetPinManually,
  isPlanning = false,
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { metrics, isTracking, isPaused, isRetracking } = useLocationStore();
  const isIdle = !isTracking && !isPaused && !isRetracking;
  const { t } = useTranslation();

  const isActiveSession = isTracking || isPaused;
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const insets = useSafeAreaInsets();

  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);

  return (
    <BottomSheet
      bottomInset={bottomInset}
      style={styles.bottomSheet}
      ref={bottomSheetRef}
      index={0}
      onChange={(index) => {
        setCurrentSnapIndex(index);
        onSnapIndexChange?.(index);
      }}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={{
        height: 4,
        width: 80,
        borderRadius: 10,
        backgroundColor: theme.bottomSheet.handle,
      }}
      handleStyle={{ paddingTop: 8 }}
    >
      <BottomSheetScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {isForegroundDenied && (
          <Text style={styles.permissionWarning}>{t('map.locationPermissionDenied')}</Text>
        )}
        {!isIdle && (
          <HikeMetrics
            distanceKm={metrics.distanceM / 1000}
            timeSeconds={metrics.durationSeconds}
            paceKmh={
              metrics.durationSeconds > 0 ? metrics.distanceM / 1000 / (metrics.durationSeconds / 3600) : 0
            }
            elevationM={metrics.elevationGainM}
          />
        )}
        {isIdle && currentSnapIndex === 1 && (
          <>
            <HikeMetrics
              distanceKm={metrics.distanceM / 1000}
              timeSeconds={metrics.durationSeconds}
              paceKmh={
                metrics.durationSeconds > 0 ? metrics.distanceM / 1000 / (metrics.durationSeconds / 3600) : 0
              }
              elevationM={metrics.elevationGainM}
            />
            <View style={{ height: 64 + insets.bottom }} />
          </>
        )}
        {isPlanning && (
          <>
            <HikeMetrics
              distanceKm={metrics.distanceM / 1000}
              timeSeconds={metrics.durationSeconds}
              paceKmh={
                metrics.durationSeconds > 0 ? metrics.distanceM / 1000 / (metrics.durationSeconds / 3600) : 0
              }
              elevationM={metrics.elevationGainM}
            />
            <PoiList pois={metrics.pois} onAddPoi={onAddPoi} />
            {currentSnapIndex === 2 && <View style={{ height: 64 + insets.bottom }} />}
            <Divider />
          </>
        )}
        {isIdle && currentSnapIndex === 0 && <View style={{ height: 64 + insets.bottom }} />}
        {isActiveSession && currentSnapIndex === 1 && <View style={{ height: 64 + insets.bottom }} />}
        {(isActiveSession || isRetracking) && (
          <>
            <PoiList pois={metrics.pois} onAddPoi={onAddPoi} />
            <Divider />
          </>
        )}

        {isRetracking && currentSnapIndex === 2 && (
          <>
            <View style={{ height: 64 + insets.bottom }} />
            <Divider />
          </>
        )}

        {isIdle && !isPlanning && <View style={{ height: 4 }} />}
        <DarkModeSelector />
        <UnitOfMeasurementSelector />
        <Divider />
        <SettingsRow
          label={t('settings.blockedUsers')}
          icon={BlockIcon}
          onPress={() =>
            router.push({
              pathname: ROUTES.CONNECTIONS,
              params: { mode: 'blocked' },
            })
          }
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    bottomSheet: {
      backgroundColor: theme.bottomSheet.background,
      borderRadius: 20,
      // borderWidth: 1,
      // borderColor: theme.defaultBorder,
    },
    content: {
      backgroundColor: theme.bottomSheet.background,
      alignItems: 'flex-start',
      paddingHorizontal: 16,
      flex: 1,
      gap: 32,
    },
    scrollView: {
      flex: 1,
    },
    permissionWarning: {
      ...typography.p1m,
    },
  });
