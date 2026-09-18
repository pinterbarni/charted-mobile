import { ClockIcon } from '@/assets/svgs/clockIcon';
import { MountainIcon } from '@/assets/svgs/mountainIcon';
import PoiMapAnnotations from '@/components/poiMapAnnotations';
import TagPill from '@/components/tagPill';
import { getMapStyle } from '@/constants/map.constants';
import { AppTheme, CHARTED_COLOR_PALETTE } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useSettingsStore } from '@/stores/settingsStore';
import { Poi } from '@/types/poi.types';
import { formatDistance, formatElevation } from '@/utils/unitsOfMeasurement.utils';
import { Camera, CameraRef, GeoJSONSource, Layer, Map } from '@maplibre/maplibre-react-native';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

//TODO: Separate as much as you can!!! good for prototype..

type TrackPoint = {
  lat: number;
  lon: number;
};

type Size = 'square' | 'banner' | 'fullWidthSquare';

type TrailMapProps = {
  size?: Size;
  pois?: Poi[];
  trackPoints: TrackPoint[];
  distanceM?: number;
  durationS?: number;
  elevationGainM?: number;
  overlayBackground?: string;
};

const getBounds = (coordinates: [number, number][]) => {
  const longitudes = coordinates.map((c) => c[0]);
  const latitudes = coordinates.map((c) => c[1]);
  return {
    ne: [Math.max(...longitudes), Math.max(...latitudes)] as [number, number],
    sw: [Math.min(...longitudes), Math.min(...latitudes)] as [number, number],
  };
};

const getContainerSize = (size: Size) => {
  switch (size) {
    case 'square':
      return { width: 180, height: 180 };
    case 'banner':
      return { alignSelf: 'stretch' as const, height: 180 };
    case 'fullWidthSquare':
      return { alignSelf: 'stretch' as const, aspectRatio: 1 };
  }
};

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export default function TrailMapPreview({
  trackPoints,
  size = 'square',
  pois = [],
  distanceM,
  durationS,
  elevationGainM,
  overlayBackground,
}: TrailMapProps) {
  const { i18n } = useTranslation();

  const theme = useAppTheme();
  const mapStyle = getMapStyle(theme);
  const cameraRef = useRef<CameraRef>(null);
  const styles = makeStyles(theme, size);
  const unitSystem = useSettingsStore((state) => state.unitOfMeasurementSystem);

  const showOverlay =
    (size === 'square' || size === 'banner') &&
    (distanceM !== undefined || durationS !== undefined || elevationGainM !== undefined);

  const trackGeoJSON = useMemo(
    (): GeoJSON.Feature<GeoJSON.LineString> => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: trackPoints.map((p) => [p.lon, p.lat]),
      },
      properties: {},
    }),
    [trackPoints]
  );

  const bounds = useMemo(() => {
    if (trackPoints.length < 2) return null;
    return getBounds(trackPoints.map((p) => [p.lon, p.lat]));
  }, [trackPoints]);

  const handleMapReady = () => {
    if (bounds) {
      cameraRef.current?.fitBounds([bounds.sw[0], bounds.sw[1], bounds.ne[0], bounds.ne[1]], {
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        duration: size === 'square' || size === 'banner' ? 0 : 500,
      });
      return;
    }

    if (pois.length === 1) {
      cameraRef.current?.easeTo({
        center: [pois[0].lon, pois[0].lat],
        zoom: 14,
        duration: 0,
      });
      return;
    }

    if (pois.length > 1) {
      const latitude = pois.map((p) => p.lat);
      const longitude = pois.map((p) => p.lon);
      const sw: [number, number] = [Math.min(...longitude), Math.min(...latitude)];
      const ne: [number, number] = [Math.max(...longitude), Math.max(...latitude)]; //todo: move to utils
      cameraRef.current?.fitBounds([sw[0], sw[1], ne[0], ne[1]], {
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        duration: 0,
      });
    }
  };

  return (
    <View style={[(size === 'square' || size === 'banner') && styles.shadowWrapper]}>
      <View style={styles.container}>
        <Map
          style={styles.map}
          mapStyle={mapStyle as any}
          compass={false}
          touchRotate={false}
          dragPan={false}
          touchZoom={false}
          attribution={false}
          logo={false}
          touchPitch={false}
          onDidFinishLoadingMap={handleMapReady}
        >
          <Camera ref={cameraRef} />
          {trackPoints.length > 1 && (
            <GeoJSONSource id="trail-preview" data={trackGeoJSON}>
              <Layer
                id="trail-preview-layer"
                type="line"
                paint={{
                  'line-color': CHARTED_COLOR_PALETTE.fullGreen[50],
                  'line-width': 4,
                }}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round',
                }}
              />
            </GeoJSONSource>
          )}
          <PoiMapAnnotations pois={pois} />
        </Map>
        {showOverlay && (
          <View style={styles.overlay} pointerEvents="none">
            {distanceM !== undefined && (
              <View style={styles.topLeft}>
                <TagPill
                  label={formatDistance(distanceM / 1000, unitSystem, i18n.language, 1, true)}
                  backgroundColor={overlayBackground}
                  borderColor={theme.defaultBorder}
                  fontWeight="medium"
                />
              </View>
            )}
            <View style={styles.bottomRow}>
              {elevationGainM !== undefined && (
                <TagPill
                  label={formatElevation(Math.round(elevationGainM), unitSystem, undefined, true)}
                  icon={MountainIcon}
                  backgroundColor={theme.absPillBottom}
                  borderColor={theme.defaultBorder}
                  fontWeight="medium"
                />
              )}
              {durationS !== undefined && (
                <TagPill
                  label={formatDuration(durationS)}
                  icon={ClockIcon}
                  backgroundColor={theme.absPillBottom}
                  borderColor={theme.defaultBorder}
                  fontWeight="medium"
                />
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme, size: Size) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.delicateBorder,
      ...getContainerSize(size),
    },
    map: {
      flex: 1,
    },
    shadowWrapper: {
      borderRadius: 12,
      shadowColor: theme.defaultLabel,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
      backgroundColor: theme.defaultBackground,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 9,
      justifyContent: 'space-between',
    },
    topLeft: {
      alignSelf: 'flex-start',
    },
    topRight: {
      alignSelf: 'flex-end',
    },
    bottomRow: {
      flexDirection: 'row',
      gap: 8,
      alignSelf: 'flex-start',
    },
    // bottomRowFull: { //del?
    //   flexDirection: 'row',
    //   gap: 8,
    //   alignSelf: 'stretch',
    //   justifyContent: 'space-between',
    // },
  });
