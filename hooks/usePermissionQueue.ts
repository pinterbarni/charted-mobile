import { SECURE_STORAGE_KEYS } from '@/constants/storage.constants';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useNotificationPermission } from '@/hooks/useNotificationPermission';
import { markLocationAskedOnBoot, shouldReAskLocation } from '@/utils/boot.utils';
import { shouldShowNotificationModal } from '@/utils/notificationPermission.utils';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

type PermissionStep = 'idle' | 'location' | 'notification' | 'done';

type Props = {
  enabled?: boolean;
};

export const usePermissionQueue = ({ enabled = true }: Props = {}) => {
  const [step, setStep] = useState<PermissionStep>('idle');

  useEffect(() => {
    if (!enabled) return;
    const init = async () => {
      const completed = await SecureStore.getItemAsync(SECURE_STORAGE_KEYS.PERMISSION_QUEUE_COMPLETED);

      if (completed === 'true') {
        const reAskLocation = await shouldReAskLocation();
        if (reAskLocation) {
          await markLocationAskedOnBoot(2);
          setStep('location');
          return;
        }

        const reAskNotification = await shouldShowNotificationModal();
        if (reAskNotification) {
          setStep('notification');
          return;
        }

        setStep('done');
        return;
      }

      setStep('location');
    };
    init();
  }, [enabled]);

  const onLocationComplete = useCallback(() => setStep('notification'), []);

  const onNotificationComplete = useCallback(async () => {
    await SecureStore.setItemAsync(SECURE_STORAGE_KEYS.PERMISSION_QUEUE_COMPLETED, 'true');
    setStep('done');
  }, []);

  const location = useLocationPermission({
    enabled: step === 'location',
    onComplete: onLocationComplete,
  });

  const notification = useNotificationPermission({
    enabled: step === 'notification',
    onComplete: onNotificationComplete,
  });

  return { location, notification, step, isQueueDone: step === 'done' };
};
