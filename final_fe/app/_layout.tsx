import { toastConfig } from '@/components/toastMessage';
import { ROUTE_GROUPS, ROUTES } from '@/constants/routes.constants';
import { ThemeProvider } from '@/contexts/themeContext';
import { useAppInit } from '@/hooks/useAppInit';
import '@/i18n';
import { hydrateAuth, useAuthStore } from '@/stores/authStore';
import { useErrorStore } from '@/stores/errorStore';
import '@/tasks/locationTask';
import { AuthStatus } from '@/types/auth.types';
import { router, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

// force remount on retry to reset all hook state
// const [mountKey, setMountKey] = useState(0);

// stomp nondeadly fetch errors from expo auth ses
const originalFetch = global.fetch;
global.fetch = async (...args) => {
  try {
    return await originalFetch(...args);
  } catch (err) {
    console.warn('FETCH stomped', err);
    throw err;
  }
};

const defaultHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  const isNetworkError = error?.message === 'Network request failed';

  if (!isFatal || isNetworkError) return;
  defaultHandler(error, isFatal);
});

function useAuthGuard() {
  const status = useAuthStore((state) => state.status);
  const segments = useSegments();

  useEffect(() => {
    if (status === AuthStatus.Loading) return;

    const inApp = segments[0] === ROUTE_GROUPS.APP;

    const inAuth = segments[0] === ROUTE_GROUPS.AUTH;

    console.log('AuthGard ', { status, segments, inApp, inAuth });

    if (status === AuthStatus.Authenticated && !inApp) {
      router.replace(ROUTES.MAP);
    } else if (status === AuthStatus.Unauthenticated && !inAuth) {
      router.replace(ROUTES.LOGIN);
    }
  }, [status, segments]);
}

function useSplashScreen() {
  const { ready } = useTranslation();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  return { ready };
}

export default function RootLayout() {
  useAppInit();
  useAuthGuard();

  useEffect(() => {
    console.log('RootLayoutFile hydrateAuth called');
    hydrateAuth();
  }, []);

  const { error, clearError } = useErrorStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!error) return;
    console.log('ErrorStore showing toast for error:', error);
    Toast.show({
      type: 'error',
      text1: t(`errors.${error}Error`),
      position: 'top',
    });
    clearError();
  }, [error, t, clearError]);

  const { ready } = useSplashScreen();

  if (!ready) return null;

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name={ROUTE_GROUPS.AUTH} />
          <Stack.Screen name={ROUTE_GROUPS.APP} />
        </Stack>

        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
