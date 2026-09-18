import { CrosshairIcon } from '@/assets/svgs/crosshairIcon';
import { LeftArrowIcon } from '@/assets/svgs/leftArrowIcon';
import { PinIcon } from '@/assets/svgs/pinIcon';
import { getMapStyle } from '@/constants/map.constants';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useLocationStore } from '@/stores/localStore';
import { Camera, Map, MapRef, NativeUserLocation } from '@maplibre/maplibre-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  visible?: boolean;
  onDismiss?: () => void;
  onConfirm?: (lat: number, lon: number) => void;
  initialCenter?: { lat: number; lon: number };
};

export default function PoiLocationPickerModal({ onDismiss, visible, onConfirm, initialCenter }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const coords = useLocationStore((state) => state.coords);
  const mapStyle = getMapStyle(theme);

  const mapRef = useRef<MapRef>(null);

  const handlePlaceMarker = async () => {
    const center = await mapRef.current?.getCenter();
    if (!center) return;
    onConfirm?.(center[1], center[0]);
  };

  const getInitialViewState = () => {
    if (initialCenter)
      return { center: [initialCenter.lon, initialCenter.lat] as [number, number], zoom: 15 };
    if (coords) return { center: [coords.longitude, coords.latitude] as [number, number], zoom: 15 };
    return undefined;
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onDismiss}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.container}>
          <Map
            style={styles.map}
            mapStyle={mapStyle as any}
            attribution={false}
            logo={false}
            compass={false}
            ref={mapRef}
          >
            <Camera initialViewState={getInitialViewState()} />
            <NativeUserLocation mode="heading" />
          </Map>

          <View style={styles.crosshair}>
            <CrosshairIcon color={theme.defaultTitle} />
          </View>

          <View style={styles.overlay}>
            <LinearGradient colors={[theme.header.background, 'transparent']} style={styles.headerGradient}>
              <View style={styles.header}>
                <TouchableOpacity onPress={onDismiss}>
                  <LeftArrowIcon color={theme.defaultTitle} size={16} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('poi.picker.title')}</Text>
              </View>
              <Text style={styles.subtitle}>{t('poi.picker.subtitle')}</Text>
            </LinearGradient>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.footerButton} onPress={handlePlaceMarker}>
                <PinIcon color={theme.button.primary.label} size={16} />
                <Text style={styles.footerButtonText}>{t('poi.picker.placeMarker')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'box-none',
    },
    crosshair: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -16, //because the size is 32! If you have a better idea to center it, tell me!
      marginLeft: -16, //because the size is 32!
    },
    headerGradient: {
      paddingTop: 48,
      paddingHorizontal: 16,
      paddingBottom: 32,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    title: {
      ...typography.h3,
      color: theme.defaultTitle,
    },
    subtitle: {
      ...typography.p1m,
      color: theme.defaultLabel,
    },
    footer: {
      position: 'absolute',
      bottom: 40,
      left: 30,
      right: 30,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.button.primary.background,
      padding: 16,
      borderRadius: 12,
    },
    footerButtonText: {
      ...typography.l1m,
      color: theme.button.primary.label,
    },
  });
