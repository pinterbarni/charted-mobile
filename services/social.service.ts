import { Profile } from '@/types/profile.types';
import { FollowResponse } from '@/types/social.types';
import { apiClient } from '@/utils/apiClient.utils';

// #region followers/following basic
export const getFollowers = (userId: string): Promise<Profile[]> =>
  apiClient.get(`/social/${userId}/followers`);

export const getFollowing = (userId: string): Promise<Profile[]> =>
  apiClient.get(`/social/${userId}/following`);

// #endregion

// #region follow/unfollow basic

export const followUser = (userId: string): Promise<FollowResponse> =>
  apiClient.post(`/social/follow/${userId}`, {});

export const unfollowUser = (userId: string): Promise<void> => apiClient.delete(`/social/follow/${userId}`);

// #endregion

// #region blockOrUnb

export const blockUser = (userId: string): Promise<void> => apiClient.post(`/social/block/${userId}`, {});

export const unblockUser = (userId: string): Promise<void> => apiClient.delete(`/social/block/${userId}`);

export const reportUser = (userId: string, reason: string): Promise<void> =>
  apiClient.post('/reports', { targetType: 'user', targetId: userId, reason });

// #endregion

// todo: constants go out of here! ?

export const searchUsers = (q: string): Promise<Profile[]> =>
  apiClient.get(`/profile/search?q=${encodeURIComponent(q)}`);

export const getBlockedUsers = (): Promise<Profile[]> => apiClient.get('/social/blocked');

export const getSocialProfile = (userId: string): Promise<Profile> =>
  apiClient.get(`/social/profile/${userId}`);
