import { Trail } from '@/types/trail.types';
import { apiClient } from '@/utils/apiClient.utils';
import { getPendingHikes, markHikeSynced, removeSyncedHikes } from '@/utils/hikeStorage.utils';

export const getTrail = (id: string): Promise<Trail> => apiClient.get(`/trails/${id}`);

export const getRecentTrails = (): Promise<Trail[]> => apiClient.get('/trails/me/recent', true);

export const getMyTrails = (): Promise<Trail[]> => apiClient.get('/trails/me');

export const deleteTrail = (id: string): Promise<void> => apiClient.delete(`/trails/${id}`);

export const updateTrail = (id: string, data: Partial<Trail>): Promise<Trail> =>
  apiClient.patch(`/trails/${id}`, data);

export const getPopularTrails = (): Promise<Trail[]> => apiClient.get('/trails/shared/popular');

export const getUserTrails = (userId: string): Promise<Trail[]> =>
  apiClient.get(`/trails/user/${userId}`, true);
export const getRecentSharedTrails = (): Promise<Trail[]> => apiClient.get('/trails/shared/recent', true);
export const syncPendingHikes = async (): Promise<void> => {
  const hikes = await getPendingHikes();
  const unsynced = hikes.filter((h) => !h.synced);

  for (const hike of unsynced) {
    try {
      await apiClient.post('/trails', {
        title: hike.title,
        distanceM: Math.round(hike.distanceM),
        durationS: hike.durationS,
        elevationGainM: Math.round(hike.elevationGainM),
        trackPoints: hike.trackPoints,
        pois: hike.pois,
        startedAt: hike.startedAt,
        finishedAt: hike.finishedAt,
        isShared: true,
      });
      await markHikeSynced(hike.id);
    } catch (e) {
      console.warn(`Failed to sync hike ${hike.id}:`, e);
    }
  }

  await removeSyncedHikes();
};
