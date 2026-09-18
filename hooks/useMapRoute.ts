import { getRoute } from '@/services/routing.service';
import { useLocationStore } from '@/stores/localStore';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

export const useMapRoute = (coordsRef: React.RefObject<{ longitude: number; latitude: number } | null>) => {
  const [showStartLocationPicker, setShowStartLocationPicker] = useState(false);
  const [showEndLocationPicker, setShowEndLocationPicker] = useState(false);
  const { setStartPin, setEndPin, setPlannedRoute } = useLocationStore();
  const planning = useLocationStore((state) => state.planning);
  const { t } = useTranslation();

  useEffect(() => {
    if (!planning.startPin || !planning.endPin) return;
    console.log('!!@!! fetch st:', planning.startPin, 'end:', planning.endPin);
    const fetchRoute = async () => {
      try {
        const route = await getRoute(planning.startPin!, planning.endPin!);
        console.log('!!@!! route pts:', route.length);
        setPlannedRoute(route);
      } catch (e) {
        console.error('Failed f. route:', e);
        Toast.show({ type: 'error', text1: t('planning.routeError'), position: 'bottom' });
      }
    };
    fetchRoute();
  }, [planning.startPin, planning.endPin, t, setPlannedRoute]);

  const handleUseCurrentLocationStart = () => {
    if (!coordsRef.current) return;
    setStartPin({ lat: coordsRef.current.latitude, lon: coordsRef.current.longitude });
    setShowStartLocationPicker(false);
  };

  const handleUseCurrentLocationEnd = () => {
    if (!coordsRef.current) return;
    setEndPin({ lat: coordsRef.current.latitude, lon: coordsRef.current.longitude });
    setShowEndLocationPicker(false);
  };

  return {
    showStartLocationPicker,
    showEndLocationPicker,
    setShowStartLocationPicker,
    setShowEndLocationPicker,
    handleUseCurrentLocationStart,
    handleUseCurrentLocationEnd,
    planning,
  };
};
