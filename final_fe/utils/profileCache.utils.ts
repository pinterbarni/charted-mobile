import { LOCAL_STORAGE_KEYS } from '@/constants/storage.constants';
import { Profile } from '@/types/profile.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cacheProfile = async (profile: Profile): Promise<void> => {
  await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.CACHED_PROFILE, JSON.stringify(profile));
};

export const getCachedProfile = async (): Promise<Profile | null> => {
  const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.CACHED_PROFILE);
  return raw ? JSON.parse(raw) : null;
};
