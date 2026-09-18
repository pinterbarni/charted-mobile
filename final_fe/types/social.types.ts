import { Profile } from './profile.types';

export type FollowResponse = {
  followerId: string;
  followingId: string;
  createdAt: string;
};

export type SocialProfile = Profile & {
  isFollowing: boolean;
  isFollowedBy: boolean;
};
