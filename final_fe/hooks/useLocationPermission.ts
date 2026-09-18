import { SECURE_STORAGE_KEYS } from '@/constants/storage.constants';
import { useLocationStore } from '@/stores/localStore';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';

type Props = {
  enabled?: boolean;
  onComplete: () => void;
};

export const useLocationPermission = ({ enabled = true, onComplete }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const isRequesting = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const check = async () => {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        onComplete();
        return;
      }

      const permanentlyDenied = await SecureStore.getItemAsync(
        SECURE_STORAGE_KEYS.LOCATION_PERMANENTLY_DENIED
      );
      if (permanentlyDenied === 'true') {
        onComplete();
        return;
      }

      if (!canAskAgain) {
        onComplete();
        return;
      }

      setShowModal(true);
    };
    check();
  }, [enabled, onComplete]);

  const onConfirm = async () => {
    if (isRequesting.current) return;
    isRequesting.current = true;
    setShowModal(false);
    const { canAskAgain } = await Location.requestForegroundPermissionsAsync();
    if (!canAskAgain) {
      await SecureStore.setItemAsync(SECURE_STORAGE_KEYS.LOCATION_PERMANENTLY_DENIED, 'true');
    }
    await useLocationStore.getState().checkPermission();
    isRequesting.current = false;
    onComplete();
  };

  const onCancel = () => {
    setShowModal(false);
    onComplete();
  };

  const onDismiss = () => {
    setShowModal(false);
    onComplete();
  };

  return { showModal, onConfirm, onCancel, onDismiss };
};
