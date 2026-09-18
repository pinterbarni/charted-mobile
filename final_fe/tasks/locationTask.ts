import { LOCATION_TASK_NAME } from '@/constants/location.constants';
import { useLocationStore } from '@/stores/localStore';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const SPEED_WARNING_MS = 15;
let lastSpeedWarningTime = 0;
const SPEED_WARNING_COOL_DOWN_MS = 600000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data as any;
    const location = locations[0];

    if (location) {
      const store = useLocationStore.getState();
      const prevCoords = store.coords;
      const newCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: location.coords.heading,
        altitude: location.coords.altitude,
      };

      store.updateCoords(newCoords);

      if (store.isTracking && !store.isPaused) {
        const speed = location.coords.speed ?? 0;
        console.log(
          'loc',
          location.coords.latitude,
          location.coords.longitude,
          'spd',
          speed,
          'trackinG',
          store.isTracking,
          'psd?',
          store.isPaused
        );

        if (speed > SPEED_WARNING_MS) {
          const now = Date.now();
          if (now - lastSpeedWarningTime > SPEED_WARNING_COOL_DOWN_MS) {
            lastSpeedWarningTime = now;
            console.log('firing speed warning, speed:', speed);
            //TODO move this out of here, and try to localize on the layout screen! Always forgot where it is nd have to search for emojis...
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Speed Warning 🚨',
                body: 'You are moving too fast. Did you forget to stop tracking your hike? 👀',
              },
              trigger: null,
            });
            console.log('speed warning fired');
          }
        }

        store.addTrackPoint(
          {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            ele: location.coords.altitude,
            time: new Date(location.timestamp).toISOString(),
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
            heading: location.coords.heading,
          },
          prevCoords
        );
      }
    }
  }
});
