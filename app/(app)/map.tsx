import MapAllModals from '@/components/mapAllModals';
import MapBottomSheet from '@/components/mapBottomSheet';
import MapScreenFooter from '@/components/mapScreenFooter';
import MapScreenHeader from '@/components/mapScreenHeader';
import PoiLocationPickerModal from '@/components/poiLocationPickerModal';
import PoiMapAnnotations from '@/components/poiMapAnnotations';
import PoiPickerModal from '@/components/poiPickerModal';
import RecenterButton from '@/components/recenterButton';
import RouteLocationPickerModal from '@/components/routeLocationPickerModal';
import { toastConfig } from '@/components/toastMessage';
import { DEFAULT_CENTER, getMapStyle, MAP_ZOOM } from '@/constants/map.constants';
import { ROUTES } from '@/constants/routes.constants';
import { AppTheme, CHARTED_COLOR_PALETTE } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useBackgroundLocation } from '@/hooks/useBackgroundLocation';
import { useMapCamera } from '@/hooks/useMapCamera';
import { useMapPoi } from '@/hooks/useMapPoi';
import { useMapRoute } from '@/hooks/useMapRoute';
import { usePermissionQueue } from '@/hooks/usePermissionQueue';
import { upsertProfile } from '@/services/profile.service';
import { useAuthStore } from '@/stores/authStore';
import { useLocationStore } from '@/stores/localStore';
import { AuthStatus } from '@/types/auth.types';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  MapRef,
  NativeUserLocation,
} from '@maplibre/maplibre-react-native';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import ToastNotification from 'react-native-toast-message';

export default function MapScreen() {
  const [showCancelRetrackModal, setShowCancelRetrackModal] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapRef>(null);

  const { cameraRef, coordsRef, cameraReady, mapFullyLoaded, position, handleMapLoaded, handleRecenter } =
    useMapCamera();

  const {
    handlePoiLocationDismiss,
    handlePoiPickerDismiss,
    handlePoiLocationConfirm,
    handleAddPoi,
    showPoiLocationPicker,
    showPoiPicker,
    pendingPoiCoords,
    handlePoiSelect,
  } = useMapPoi({ mapRef, bottomSheetRef });

  const {
    setShowEndLocationPicker,
    handleUseCurrentLocationEnd,
    showStartLocationPicker,
    handleUseCurrentLocationStart,
    setShowStartLocationPicker,
    showEndLocationPicker,
  } = useMapRoute(coordsRef);

  const retrackRoute = useLocationStore((state) => state.retrackRoute);
  const retrackPois = useLocationStore((state) => state.retrackPois);
  const planning = useLocationStore((state) => state.planning);

  const pois = useLocationStore((state) => state.metrics.pois);
  const isRetracking = useLocationStore((state) => state.isRetracking);
  const isTracking = useLocationStore((state) => state.isTracking);
  const { clearRetrackRoute } = useLocationStore();
  const trackPoints = useLocationStore((state) => state.metrics.trackPoints);

  const trackGeoJSON = useMemo(
    (): GeoJSON.Feature<GeoJSON.LineString> => ({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: trackPoints.map((p) => [p.lon, p.lat]) },
      properties: {},
    }),
    [trackPoints]
  );

  const plannedRouteGeoJSON = useMemo(
    (): GeoJSON.Feature<GeoJSON.LineString> => ({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: planning.plannedRoute ?? [] },
      properties: {},
    }),
    [planning.plannedRoute]
  );

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);
  const [snapIndex, setSnapIndex] = useState(0);
  const mapStyle = getMapStyle(theme);
  const snapPoints = useMemo(
    () => [80 + insets.bottom, 164 + insets.bottom, 302 + insets.bottom, '60%', '100%'],
    [insets]
  );

  const status = useAuthStore((state) => state.status);
  const { location, notification, isQueueDone } = usePermissionQueue({
    enabled: status === AuthStatus.Authenticated,
  });

  useEffect(() => {
    if (status !== AuthStatus.Authenticated) return;
    const { tokens } = useAuthStore.getState();
    const username = tokens?.accessToken
      ? jwtDecode<{ preferred_username?: string }>(tokens.accessToken).preferred_username
      : undefined;
    upsertProfile(username).catch((err) => console.error('[Profile] Upsert failed:', err));
  }, [status]);

  const {
    showDeniedModal,
    showCannotLeaveModal,
    showHikeReviewModal,

    showModal: showLocationModal,
    showCancelPlanningModal,
    hasLocation,
    footerState,
    showForegroundModal,
    isPlanning,
    handleStartPress,
    handleCreateTrailPress,
    handlePlanningCancel,
    handlePlanningCancelConfirm,
    handlePlanningDone,
    handlePausePress,
    handleResumePress,
    handleFinishPress,
    stopTracking,
    isForegroundDenied,
    onConfirm: onLocationConfirm,
    onCancel: onLocationCancel,
    onDismiss: onLocationDismiss,
    onForegroundConfirm,
    onForegroundCancel,
    onForegroundDismiss,
    onDeniedConfirm,
    onDeniedCancel,
    onDeniedDismiss,
    onCannotLeaveConfirm,
    onCannotLeaveCancel,
    onCannotLeaveDismiss,
    dismissCancelPlanningModal,
    setShowHikeReviewModal,
  } = useBackgroundLocation({ queueDone: isQueueDone });

  const [effectiveState, setEffectiveState] = useState('idle');

  useEffect(() => {
    if (showHikeReviewModal) {
      setEffectiveState('review');
    } else if (isRetracking && isTracking) {
      setEffectiveState('retracking_active');
    } else if (isRetracking) {
      setEffectiveState('retracking');
    } else if (isPlanning) {
      setEffectiveState('planning');
    } else {
      setEffectiveState(footerState);
    }
  }, [showHikeReviewModal, isRetracking, isTracking, isPlanning, footerState]);

  const prevEffectiveState = useRef('');

  useEffect(() => {
    const snapIndex: Record<string, number> = {
      idle: 0,
      planning: 2,
      tracking: 1,
      paused: 1,
      done: 0,
      retracking: 2,
      retracking_active: 2,
      review: 1,
    };
    prevEffectiveState.current = effectiveState;
    bottomSheetRef.current?.snapToIndex(snapIndex[effectiveState] ?? 0);
  }, [effectiveState]);

  useEffect(() => {
    const snapIndex: Record<string, number> = {
      idle: 0,
      planning: 2,
      tracking: 1,
      paused: 1,
      done: 0,
      retracking: 2,
      retracking_active: 2,
      review: 1,
    };
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(snapIndex[effectiveState] ?? 0);
    }, 300);
  }, [effectiveState]);

  const recenterBottomOffset = (() => {
    const point = snapPoints[snapIndex];
    if (typeof point === 'number') return point + 32;
    return 190;
  })();

  console.log('snapIndex:', snapIndex, 'recenterBottomOffset:', recenterBottomOffset);

  // console.log(
  //   'isRetracking:',
  //   isRetracking,
  //   'isTracking:',
  //   isTracking,
  //   'footerState passed:',
  //   isRetracking && isTracking ? 'retracking_active' : isRetracking ? 'retracking' : footerState
  // );

  return (
    <View style={styles.container}>
      <MapAllModals
        location={location}
        handlePlanningCancelConfirm={handlePlanningCancelConfirm}
        handleResumePress={handleResumePress}
        handleFinishPress={handleFinishPress}
        showCancelPlanningModal={showCancelPlanningModal}
        onDeniedCancel={onDeniedCancel}
        onDeniedDismiss={onDeniedDismiss}
        showCancelRetrackModal={showCancelRetrackModal}
        setShowHikeReviewModal={setShowHikeReviewModal}
        showForegroundModal={showForegroundModal}
        onLocationDismiss={onLocationDismiss}
        onForegroundConfirm={onForegroundConfirm}
        onCannotLeaveConfirm={onCannotLeaveConfirm}
        onLocationConfirm={onLocationConfirm}
        onLocationCancel={onLocationCancel}
        onForegroundCancel={onForegroundCancel}
        notification={notification}
        showCannotLeaveModal={showCannotLeaveModal}
        onCannotLeaveCancel={onCannotLeaveCancel}
        onForegroundDismiss={onForegroundDismiss}
        onDeniedConfirm={onDeniedConfirm}
        onCannotLeaveDismiss={onCannotLeaveDismiss}
        showLocationModal={showLocationModal}
        showHikeReviewModal={showHikeReviewModal}
        stopTracking={stopTracking}
        clearRetrackRoute={clearRetrackRoute}
        isPlanning={isPlanning}
        showDeniedModal={showDeniedModal}
        dismissCancelPlanningModal={dismissCancelPlanningModal}
        setShowCancelRetrackModal={setShowCancelRetrackModal}
      />

      {!showHikeReviewModal && (
        <MapScreenFooter
          onPausePress={handlePausePress}
          onResumePress={handleResumePress}
          onCancelPress={isRetracking ? () => setShowCancelRetrackModal(true) : handlePlanningCancel}
          onDonePress={handlePlanningDone}
          footerState={
            isRetracking && isTracking ? 'retracking_active' : isRetracking ? 'retracking' : footerState
          }
          onStartPress={handleStartPress}
          onFinishPress={handleFinishPress}
          startDisabled={!hasLocation}
          onAvatarPress={() => router.push(ROUTES.PROFILE)}
        />
      )}

      <PoiLocationPickerModal
        initialCenter={pendingPoiCoords ?? undefined}
        visible={showPoiLocationPicker}
        onDismiss={handlePoiLocationDismiss}
        onConfirm={handlePoiLocationConfirm}
      />
      <PoiPickerModal visible={showPoiPicker} onDismiss={handlePoiPickerDismiss} onSelect={handlePoiSelect} />
      <RouteLocationPickerModal
        onUseCurrentLocation={handleUseCurrentLocationStart}
        onSetPinManually={() => setShowStartLocationPicker(false)}
        onDismiss={() => setShowStartLocationPicker(false)}
        visible={showStartLocationPicker}
      />
      <RouteLocationPickerModal
        onUseCurrentLocation={handleUseCurrentLocationEnd}
        onSetPinManually={() => setShowEndLocationPicker(false)}
        visible={showEndLocationPicker}
        onDismiss={() => setShowEndLocationPicker(false)}
      />

      <Map
        compass={true}
        compassPosition={{ top: 64, left: 16 }}
        touchRotate={true}
        ref={mapRef}
        touchPitch={true}
        attribution={true}
        logo={false}
        style={styles.map}
        mapStyle={mapStyle as any}
        onDidFinishLoadingMap={handleMapLoaded}
      >
        {isTracking && trackPoints.length > 1 && (
          <GeoJSONSource id="track-line" data={trackGeoJSON}>
            <Layer
              id="track-line-layer"
              paint={{ 'line-color': CHARTED_COLOR_PALETTE.fullGreen[50], 'line-width': 4 }}
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            />
          </GeoJSONSource>
        )}
        {isPlanning && planning.plannedRoute && planning.plannedRoute.length > 1 && (
          <GeoJSONSource id="planned-route" data={plannedRouteGeoJSON}>
            <Layer
              paint={{ 'line-color': CHARTED_COLOR_PALETTE.fullGreen[300], 'line-width': 4 }}
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
              id="planned-route-layer"
              type="line"
            />
          </GeoJSONSource>
        )}
        {mapFullyLoaded && isRetracking && retrackRoute && retrackRoute.length > 1 && (
          <GeoJSONSource
            id="retrack-route"
            data={{
              geometry: { type: 'LineString', coordinates: retrackRoute },
              type: 'Feature',

              properties: {},
            }}
          >
            <Layer
              paint={{
                'line-color': CHARTED_COLOR_PALETTE.neutralGreen[300],
                'line-width': 3,
                'line-dasharray': [2, 2],
              }}
              id="retrack-route-layer"
              type="line"
              layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            />
          </GeoJSONSource>
        )}
        {isRetracking && <PoiMapAnnotations pois={retrackPois} />}
        <Camera
          ref={cameraRef}
          maxZoom={MAP_ZOOM.MAX}
          trackUserLocation={isTracking ? 'default' : undefined}
          minZoom={MAP_ZOOM.MIN}
          initialViewState={{
            center: DEFAULT_CENTER,
            zoom: MAP_ZOOM.DEFAULT,
          }}
        />
        <PoiMapAnnotations pois={pois} />
        {position && <NativeUserLocation key="user-location" mode="heading" />}
      </Map>
      <MapScreenHeader
        isHidden={isPlanning || isTracking || isRetracking}
        onCreateTrailPress={handleCreateTrailPress}
        disabled={!hasLocation}
      />
      <RecenterButton onPress={handleRecenter} bottomOffset={recenterBottomOffset} />
      {!cameraReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.map.loadingIndicator} />
        </View>
      )}
      <MapBottomSheet
        bottomSheetRef={bottomSheetRef}
        onSnapIndexChange={setSnapIndex}
        snapPoints={snapPoints}
        isPlanning={isPlanning}
        onSetPinManually={() => setShowEndLocationPicker(true)}
        bottomInset={insets.bottom}
        isForegroundDenied={isForegroundDenied}
        onStartLocationPress={() => setShowStartLocationPicker(true)}
        onAddPoi={handleAddPoi}
        onEndLocationPress={() => setShowEndLocationPicker(true)}
      />
      <ToastNotification config={toastConfig} />
    </View>
  );
}

const makeStyles = (theme: AppTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.defaultBackground,
      flex: 1,
    },
    map: {
      flex: 1,
      bottom: insets.bottom,
    },
    loadingOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      top: 0,
      left: 0,
      justifyContent: 'center',

      backgroundColor: theme.backdrop,
      alignItems: 'center',
    },
    flex: {
      flex: 1,
    },
  });
