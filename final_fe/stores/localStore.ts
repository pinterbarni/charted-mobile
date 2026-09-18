import { LOCATION_TASK_NAME } from '@/constants/location.constants';
import { CHARTED_COLOR_PALETTE } from '@/constants/theme.constants';
import { Poi } from '@/types/poi.types';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { create } from 'zustand';

const ELEVATION_THRESHOLD_M = 3;
// const MIN_SPEED_MS = 0.25;

//#region types
type Coords = {
  latitude: number;
  longitude: number;
  heading: number | null;
  altitude?: number | null;
  accuracy?: number | null;
};

type TrackPoint = {
  lat: number;
  lon: number;
  ele: number | null;
  time: string;
  accuracy?: number | null;
  speed?: number | null;
  heading?: number | null;
};

type HikeMetrics = {
  distanceM: number;
  durationSeconds: number;
  elevationGainM: number;
  trackPoints: TrackPoint[];
  pois: Poi[];
  startedAt: Date | null;
};

type PlanningState = {
  startPin: { lat: number; lon: number } | null;
  endPin: { lat: number; lon: number } | null;
  plannedRoute: [number, number][] | null;
};
//#endregion

//#region init
const INITIAL_METRICS: HikeMetrics = {
  distanceM: 0,
  durationSeconds: 0,
  elevationGainM: 0,
  trackPoints: [],
  pois: [],
  startedAt: null,
};

const INITIAL_PLANNING: PlanningState = {
  startPin: null,
  endPin: null,
  plannedRoute: null,
};
//#endregion

//#region state type
type LocationState = {
  coords: Coords | null;
  permissionStatus: Location.PermissionStatus | null;
  isTracking: boolean;
  isPaused: boolean;
  isPlanning: boolean;
  isRetracking: boolean;
  isLoading: boolean;
  error: string | null;
  metrics: HikeMetrics;
  planning: PlanningState;
  retrackRoute: [number, number][] | null;
  timerInterval: ReturnType<typeof setInterval> | null;
  retrackPois: Poi[];

  checkPermission: () => Promise<void>;
  updateCoords: (coords: Coords) => void;
  requestPermission: () => Promise<void>;
  startTracking: (onBackgroundDenied?: () => void, foregroundOnly?: boolean) => Promise<void>;
  stopTracking: () => Promise<void>;
  pauseTracking: () => void;
  resumeTracking: () => void;
  resetMetrics: () => void;
  addPoi: (poi: Poi) => void;
  removePoi: (id: string) => void;
  addTrackPoint: (point: TrackPoint, prevCoords: Coords | null) => void;
  startPlanning: () => void;
  stopPlanning: () => void;
  setStartPin: (coords: { lat: number; lon: number }) => void;
  setEndPin: (coords: { lat: number; lon: number }) => void;
  setPlannedRoute: (route: [number, number][]) => void;
  setRetrackRoute: (route: [number, number][], pois?: Poi[]) => void;
  clearRetrackRoute: () => void;
};
//#endregion

//#region timer
const startTimer = (set: any) => {
  return setInterval(() => {
    set((state: LocationState) => ({
      metrics: {
        ...state.metrics,
        durationSeconds: state.metrics.durationSeconds + 1,
      },
    }));
  }, 1000);
};
//#endregion

export const useLocationStore = create<LocationState>((set, get) => ({
  //#region state
  coords: null,
  permissionStatus: null,
  isTracking: false,
  isPaused: false,
  isPlanning: false,
  isRetracking: false,
  isLoading: false,
  error: null,
  metrics: INITIAL_METRICS,
  planning: INITIAL_PLANNING,
  retrackRoute: null,
  timerInterval: null,
  retrackPois: [],
  //#endregion

  //#region coords & perms
  updateCoords: (coords) => set({ coords }),

  checkPermission: async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    set({ permissionStatus: status });
  },

  requestPermission: async () => {
    set({ isLoading: true, error: null });
    const { status } = await Location.requestForegroundPermissionsAsync();
    set({ permissionStatus: status, isLoading: false });
  },
  //#endregion

  //#region metrics
  resetMetrics: () => set({ metrics: INITIAL_METRICS }),

  addTrackPoint: (point, prevCoords) => {
    set((state: LocationState) => {
      let distanceDelta = 0;
      if (prevCoords) {
        distanceDelta = getDistance(
          { latitude: prevCoords.latitude, longitude: prevCoords.longitude },
          { latitude: point.lat, longitude: point.lon }
        );
      }

      const prevElevation =
        state.metrics.trackPoints.length > 0
          ? (state.metrics.trackPoints[state.metrics.trackPoints.length - 1].ele ?? null)
          : null;
      const currentElevation = point.ele ?? 0;
      const elevationDelta =
        prevElevation !== null && currentElevation - prevElevation > ELEVATION_THRESHOLD_M
          ? currentElevation - prevElevation
          : 0;

      return {
        metrics: {
          ...state.metrics,
          distanceM: state.metrics.distanceM + distanceDelta,
          elevationGainM: state.metrics.elevationGainM + elevationDelta,
          trackPoints: [...state.metrics.trackPoints, point],
        },
      };
    });
  },
  //#endregion

  //#region pois
  addPoi: (poi) => {
    set((state) => ({
      metrics: { ...state.metrics, pois: [...state.metrics.pois, poi] },
    }));
  },

  removePoi: (id) => {
    console.log('// removePoi:', id);
    set((state) => ({
      metrics: { ...state.metrics, pois: state.metrics.pois.filter((p) => p.id !== id) },
    }));
  },
  //#endregion

  //#region planning
  startPlanning: () => set({ isPlanning: true, planning: INITIAL_PLANNING }),
  stopPlanning: () => set({ isPlanning: false, planning: INITIAL_PLANNING }),
  setStartPin: (coords) => set((state) => ({ planning: { ...state.planning, startPin: coords } })),
  setEndPin: (coords) => set((state) => ({ planning: { ...state.planning, endPin: coords } })),
  setPlannedRoute: (route) => set((state) => ({ planning: { ...state.planning, plannedRoute: route } })),
  //#endregion

  //#region retrack
  setRetrackRoute: async (route, pois = []) => {
    try {
      await activateKeepAwakeAsync();
    } catch (e) {
      console.warn('KeepAwake not activating:', e);
    }
    set({ retrackRoute: route, isRetracking: true, retrackPois: pois });
  },

  clearRetrackRoute: () => {
    console.log('// clearRetrackRoute');
    deactivateKeepAwake();
    set({ retrackRoute: null, isRetracking: false, retrackPois: [] });
  },
  //#endregion

  //#region tracking
  pauseTracking: () => {
    console.log('# pauseTracking');
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({ timerInterval: null, isPaused: true });
  },

  resumeTracking: () => {
    console.log('# resumeTracking');
    const interval = startTimer(set);
    set({ timerInterval: interval, isPaused: false });
  },

  startTracking: async (onBackgroundDenied?: () => void, foregroundOnly = false) => {
    const { permissionStatus } = get();
    if (permissionStatus !== Location.PermissionStatus.GRANTED) return;

    if (!foregroundOnly) {
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      console.log('## bg perm result:', bgStatus);
      if (bgStatus !== Location.PermissionStatus.GRANTED) {
        deactivateKeepAwake();
        onBackgroundDenied?.();
        return;
      }
    }
    try {
      await activateKeepAwakeAsync();
    } catch (e) {
      console.warn('KeepAwake -- Could not activate:', e);
    }
    set({ metrics: { ...INITIAL_METRICS, startedAt: new Date() }, isPaused: false });

    const interval = startTimer(set);
    set({ timerInterval: interval });

    // TODO: move it with the other notification message user! thingy
    const startWithRetry = async (attempt = 1): Promise<void> => {
      try {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Charted is tracking your hike! 🥾🏞',
            notificationBody: 'Your route is being recorded.',
            notificationColor: CHARTED_COLOR_PALETTE.fullGreen[50],
          },
        });
        set({ isTracking: true });
      } catch (e) {
        if (attempt < 3) {
          console.warn(`### startLocation attempt ${attempt} failed, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 800));
          await startWithRetry(attempt + 1);
        } else {
          console.error('### startLocation failed after 3 attempts:', e);
        }
      }
    };

    await startWithRetry();
  },

  stopTracking: async () => {
    console.log('# stop track n');
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({ timerInterval: null });

    const isRegistered = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log('## task reg ged?:', isRegistered);
    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('task stopped');
    }
    deactivateKeepAwake();
    set({ isTracking: false, isPaused: false, metrics: INITIAL_METRICS });
  },
  //#endregion
}));
