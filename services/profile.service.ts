import { Profile } from '@/types/profile.types';
import { apiClient } from '@/utils/apiClient.utils';

export const upsertProfile = (username?: string): Promise<Profile> =>
  apiClient.post('/profile/me', { username });

export const updateProfile = (data: {
  bio?: string;
  displayName?: string;
  avatarUrl?: string; // todo, implement or comment out till v2
}): Promise<Profile> => apiClient.patch('/profile/me', data);

export const getMyProfile = (): Promise<Profile> => apiClient.get('/profile/me', true);
export const getSocialProfile = (userId: string): Promise<Profile> =>
  apiClient.get(`/profile/${userId}`, true);

export const searchUsers = (q: string): Promise<Profile[]> =>
  apiClient.get(`/profile/search?q=${encodeURIComponent(q)}`);
