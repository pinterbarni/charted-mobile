import { SECURE_STORAGE_KEYS } from '@/constants/storage.constants';
import * as SecureStore from 'expo-secure-store';

export const getStoredInt = async (key: string, fallback = 0): Promise<number> => {
  const raw = await SecureStore.getItemAsync(key);
  return raw ? parseInt(raw) : fallback;
};

export const getAskCount = () => getStoredInt(SECURE_STORAGE_KEYS.NOTIFICATION_PERMISSION_ASK_COUNT);
export const getBootCount = () => getStoredInt(SECURE_STORAGE_KEYS.APP_BOOT_COUNT, 1);

export const incrementAskCount = async (): Promise<number> => {
  const count = await getAskCount();
  const next = count + 1;
  await SecureStore.setItemAsync(SECURE_STORAGE_KEYS.NOTIFICATION_PERMISSION_ASK_COUNT, String(next));
  return next;
};

export const isDismissed = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(SECURE_STORAGE_KEYS.NOTIFICATION_PERMISSION_DISMISSED);
  return value === 'true';
};

export const setDismissed = () =>
  SecureStore.setItemAsync(SECURE_STORAGE_KEYS.NOTIFICATION_PERMISSION_DISMISSED, 'true');

export const shouldShowNotificationModal = async (): Promise<boolean> => {
  if (await isDismissed()) return false;
  const askCount = await getAskCount();
  if (askCount >= 2) return false;
  if (askCount === 1 && (await getBootCount()) < 5) return false;
  return true;
};
