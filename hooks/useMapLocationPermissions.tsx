import { useLocationStore } from '@/stores/localStore';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

export const useMapLocationPermissions = ({ queueDone = false }: { queueDone?: boolean } = {}) => {
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [showForegroundModal, setShowForegroundModal] = useState(false);
  const [isForegroundDenied, setIsForegroundDenied] = useState(false);
  const [showCannotLeaveModal, setShowCannotLeaveModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const permissionStatus = useLocationStore((state) => state.permissionStatus);

  const { startTracking } = useLocationStore();

  useEffect(() => {
    const check = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setIsForegroundDenied(status === Location.PermissionStatus.DENIED);
    };
    check();
  }, [permissionStatus]);

  useEffect(() => {
    if (!queueDone) return;
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        await useLocationStore.getState().checkPermission();
      }
    });
    return () => sub.remove();
  }, [queueDone]);

  const proceedWithBackgroundCheck = async () => {
    const { status: bgStatus } = await Location.getBackgroundPermissionsAsync();
    if (bgStatus === Location.PermissionStatus.GRANTED) {
      startTracking();
      return;
    }
    if (bgStatus === Location.PermissionStatus.DENIED) {
      setShowCannotLeaveModal(true);
      return;
    }
    setShowModal(true);
  };

  const handleStartPress = async () => {
    console.log('start__ handleStartPress called');
    const isTracking = useLocationStore.getState().isTracking;
    const isPaused = useLocationStore.getState().isPaused;
    console.log('start__ isTracking:', isTracking, 'isPaused:', isPaused);
    if (isTracking || isPaused) return;
    const { status } = await Location.getForegroundPermissionsAsync();
    console.log('start__ permission status:', status);
    if (status === Location.PermissionStatus.DENIED) {
      setShowDeniedModal(true);
      return;
    }
    if (status !== Location.PermissionStatus.GRANTED) {
      setShowForegroundModal(true);
      return;
    }
    console.log('start__ proceeding with background check');
    await proceedWithBackgroundCheck();
  };

  const createModalHandlers = (
    setShow: (v: boolean) => void,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => ({
    onConfirm: () => {
      onConfirm?.();
      setShow(false);
    },
    onCancel: () => {
      setShow(false);
      onCancel?.();
    },
    onDismiss: () => setShow(false),
  });

  const backgroundModal = createModalHandlers(
    setShowModal,
    () => startTracking(() => setShowCannotLeaveModal(true)),
    () => startTracking(undefined, true)
  );

  const deniedModal = createModalHandlers(setShowDeniedModal, () => Linking.openSettings());

  const cannotLeaveModal = createModalHandlers(
    setShowCannotLeaveModal,
    () => Linking.openSettings(),
    () => startTracking(undefined, true)
  );

  const foregroundModal = createModalHandlers(setShowForegroundModal, async () => {
    await useLocationStore.getState().requestPermission();
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) return;
    await proceedWithBackgroundCheck();
  });

  const onConfirmBackground = async () => {
    setShowModal(false);
    await useLocationStore.getState().checkPermission();
    startTracking(() => setShowCannotLeaveModal(true));
  };

  return {
    showModal,
    showDeniedModal,
    showCannotLeaveModal,
    showForegroundModal,
    isForegroundDenied,

    handleStartPress,
    onConfirm: onConfirmBackground,
    onCancel: backgroundModal.onCancel,
    onDismiss: backgroundModal.onDismiss,

    onDeniedConfirm: deniedModal.onConfirm,
    onDeniedCancel: deniedModal.onCancel,
    onDeniedDismiss: deniedModal.onDismiss,

    onForegroundConfirm: foregroundModal.onConfirm,
    onForegroundCancel: foregroundModal.onCancel,
    onForegroundDismiss: foregroundModal.onDismiss,

    onCannotLeaveConfirm: cannotLeaveModal.onConfirm,
    onCannotLeaveCancel: cannotLeaveModal.onCancel,
    onCannotLeaveDismiss: cannotLeaveModal.onDismiss,
  };
};
