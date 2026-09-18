import { AddUserIcon } from '@/assets/svgs/addUserIcon';
import { LeftArrowIcon } from '@/assets/svgs/leftArrowIcon';
import { ROUTES, STACK_SCREENS } from '@/constants/routes.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { router, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function AppLayout() {
  const theme = useAppTheme();
  const styles = makeStyles();

  const sharedHeaderOptions = {
    headerShown: true,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: theme.header.background },
    headerTitleStyle: { ...typography.h2, color: theme.header.title },
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <LeftArrowIcon color={theme.header.icon} size={15} />
      </TouchableOpacity>
    ),
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={STACK_SCREENS.MAP.name} />

      <Stack.Screen
        name={STACK_SCREENS.PROFILE.name}
        options={({ route }) => {
          const params = route.params as { userId?: string } | undefined;

          const isOwnProfile = !params?.userId;

          return {
            ...sharedHeaderOptions,
            headerTitle: '',
            headerRight: isOwnProfile
              ? () => (
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: ROUTES.CONNECTIONS,
                        params: { mode: 'search' },
                      })
                    }
                  >
                    <AddUserIcon color={theme.header.icon} size={30} />
                  </TouchableOpacity>
                )
              : undefined,
          };
        }}
      />
      <Stack.Screen name={STACK_SCREENS.CONNECTIONS.name} options={sharedHeaderOptions} />
      <Stack.Screen name={STACK_SCREENS.TRAILS_LIST.name} options={sharedHeaderOptions} />
      <Stack.Screen
        name={STACK_SCREENS.HIKE_DETAILS.name}
        options={{
          ...sharedHeaderOptions,
          // headerShown or drawerLabel?
          //gestureEnabled,

          headerTitle: '',
        }}
      />
      <Stack.Screen
        name={STACK_SCREENS.SAVED_TRAIL_DETAILS.name}
        options={{
          ...sharedHeaderOptions,
          // headerShown or drawerLabel?
          //gestureEnabled,

          headerTitle: '',
        }}
      />
    </Stack>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    backButton: {
      paddingRight: 16,
    },
    flex: {
      flex: 1,
    },
    alignStyle: {
      alignSelf: 'center',
    },
  });
