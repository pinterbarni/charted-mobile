export type Trail = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  trackPoints: TrackPoint[];
  pois: object[];
  startedAt: string | null;
  distanceM: number | null;
  durationS: number | null;
  isShared: boolean;
  finishedAt: string | null;
  elevationGainM: number | null;
  createdAt: string;
  ownerUsername?: string;
  updatedAt: string;
};

export type TrackPoint = {
  lat: number;
  lon: number;
  ele: number | null;
  time: string;
  accuracy?: number | null;
  speed?: number | null;
  heading?: number | null;
};
