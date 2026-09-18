import { LOCAL_STORAGE_KEYS } from '@/constants/storage.constants';
import { Poi } from '@/types/poi.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PendingHike = {
  id: string;
  title: string;
  distanceM: number;
  durationS: number;
  elevationGainM: number;
  trackPoints: object[];
  pois: Poi[];
  startedAt: string;
  finishedAt: string;
  synced: boolean;
};

export const savePendingHike = async (hike: PendingHike): Promise<void> => {
  console.log('#### savePendingHike fired', hike.id, hike.title);
  const existing = await getPendingHikes();
  console.log('#### hikes as is before save:', existing.length);
  await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_HIKES, JSON.stringify([...existing, hike]));
  console.log('#### hike saved, new max:', existing.length + 1);
};

export const getPendingHikes = async (): Promise<PendingHike[]> => {
  console.log('/ getPendingHikes called');
  const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.PENDING_HIKES);
  console.log('// raw value null?', raw === null);
  const result = raw ? JSON.parse(raw) : [];
  console.log('/// returning hikes count:', result.length);
  return result;
};

export const markHikeSynced = async (id: string): Promise<void> => {
  console.log('# markHikeSynced', id);
  const hikes = await getPendingHikes();
  console.log(
    '## hikes before:',
    hikes.map((h) => ({ id: h.id, synced: h.synced }))
  );
  const updated = hikes.map((h) => (h.id === id ? { ...h, synced: true } : h));
  console.log(
    '### hikes after:',
    updated.map((h) => ({ id: h.id, synced: h.synced }))
  );
  await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_HIKES, JSON.stringify(updated));
  console.log('#### markHikeSynced done --', id);
};

export const removeSyncedHikes = async (): Promise<void> => {
  console.log('/ removeSyncedHikes fired');
  const hikes = await getPendingHikes();
  console.log('// total before remove:', hikes.length);
  const pending = hikes.filter((h) => !h.synced);
  console.log('/// synced removed:', hikes.length - pending.length, ' remains:', pending.length);
  await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_HIKES, JSON.stringify(pending));
  console.log('/// + / removeSyncedHikes done');
};
