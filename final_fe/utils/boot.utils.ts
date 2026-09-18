import { SECURE_STORAGE_KEYS } from '@/constants/storage.constants';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { getStoredInt } from './notificationPermission.utils';

export const incrementBootCount = async (): Promise<number> => {
  const raw = await SecureStore.getItemAsync(SECURE_STORAGE_KEYS.APP_BOOT_COUNT);
  let count = raw ? parseInt(raw) : 0;
  count++;
  await SecureStore.setItemAsync(SECURE_STORAGE_KEYS.APP_BOOT_COUNT, String(count));
  return count;
};

export const resetNotificationDismissed = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(SECURE_STORAGE_KEYS.NOTIFICATION_PERMISSION_DISMISSED);
};

export const resetPermissionQueueIfNeeded = async (): Promise<void> => {
  const bootCount = await getStoredInt(SECURE_STORAGE_KEYS.APP_BOOT_COUNT);
  if (bootCount === 5) {
    await SecureStore.deleteItemAsync(SECURE_STORAGE_KEYS.PERMISSION_QUEUE_COMPLETED);
  }
};

export const shouldReAskLocation = async (): Promise<boolean> => {
  const bootCount = await getStoredInt(SECURE_STORAGE_KEYS.APP_BOOT_COUNT);
  const askedOnBoot = await SecureStore.getItemAsync(SECURE_STORAGE_KEYS.LOCATION_PERMISSION_ASK_BOOT);

  if (bootCount !== 2) return false;
  if (askedOnBoot === '2') return false;

  const { status } = await Location.getForegroundPermissionsAsync();
  return status !== Location.PermissionStatus.GRANTED;
};

export const markLocationAskedOnBoot = async (bootCount: number): Promise<void> => {
  await SecureStore.setItemAsync(SECURE_STORAGE_KEYS.LOCATION_PERMISSION_ASK_BOOT, String(bootCount));
};
