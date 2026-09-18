export const ROUTE_GROUPS = {
  APP: '(app)',
  AUTH: '(auth)',
  TABS: '(tabs)',
} as const;

export const ROUTES = {
  MAP: '/(app)/map',
  LOGIN: '/(auth)/login',
  PROFILE: '/(app)/profile',
  CONNECTIONS: '/(app)/connections',
  HIKE_DETAILS: '/(app)/hikeDetails',
  TRAILS_LIST: '/(app)/trailsList',
  SAVED_TRAIL_DETAILS: '/(app)/savedTrailDetails',
} as const;

export const AUTH_TABS = {
  LOGIN: {
    name: 'login',
    title: 'Login',
  },
} as const;

export const STACK_SCREENS = {
  PROFILE: {
    name: 'profile',
    headerBackTitle: 'Map',
  },
  MAP: {
    name: 'map',
    title: 'Map',
  },
  CONNECTIONS: {
    name: 'connections',
  },
  TRAILS_LIST: {
    name: 'trailsList',
  },
  HIKE_DETAILS: {
    name: 'hikeDetails',
  },
  SAVED_TRAIL_DETAILS: {
    name: 'savedTrailDetails',
    options: { headerShown: true, title: '' },
  },
} as const;
