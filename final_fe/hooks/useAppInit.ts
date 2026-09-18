import { syncPendingHikes } from '@/services/trail.service';
import { useLocationStore } from '@/stores/localStore';
import {
  incrementBootCount,
  resetNotificationDismissed,
  resetPermissionQueueIfNeeded,
} from '@/utils/boot.utils';
import { useEffect } from 'react';

export const useAppInit = () => {
  useEffect(() => {
    const initApp = async () => {
      await incrementBootCount();
      await resetNotificationDismissed();
      await resetPermissionQueueIfNeeded();
      await useLocationStore.getState().checkPermission();
      await syncPendingHikes();
    };
    initApp();

    return () => {
      useLocationStore.getState().stopTracking();
    };
  }, []);
};
