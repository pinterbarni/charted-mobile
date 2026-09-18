import {
  incrementAskCount,
  setDismissed,
  shouldShowNotificationModal,
} from '@/utils/notificationPermission.utils';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

type Props = {
  enabled?: boolean;
  onComplete?: () => void;
};

export const useNotificationPermission = ({ enabled = true, onComplete }: Props = {}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const check = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        onComplete?.();
        return;
      }
      if (await shouldShowNotificationModal()) setShowModal(true);
      else onComplete?.();
    };
    check();
  }, [enabled, onComplete]);

  const onConfirm = async () => {
    await incrementAskCount();
    setShowModal(false);
    await Notifications.requestPermissionsAsync();
    onComplete?.();
  };

  const onCancel = async () => {
    await incrementAskCount();
    await setDismissed();
    setShowModal(false);
    onComplete?.();
  };

  const onDismiss = () => {
    setShowModal(false);
    onComplete?.();
  };

  return { showModal, onConfirm, onCancel, onDismiss };
};
