export type Profile = {
  id: string;
  displayName: string | null;
  username: string | null;
  bio: string | null;
  totalDistanceM: number;

  createdAt: string;
  updatedAt: string;

  isFollowing?: boolean;
  isBlocked?: boolean;
  // todo implement.
  avatarUrl: string | null;
  //already in response
  level: number;
};
