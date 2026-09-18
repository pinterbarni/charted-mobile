import HeaderShadowGradient from '@/components/headerShadowGradient';
import NavigateBackToMapButton from '@/components/navigateBackToMapButton';
import TrailListItem from '@/components/trailListItem';
import { ROUTES } from '@/constants/routes.constants';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { getMyTrails } from '@/services/trail.service';
import { Trail } from '@/types/trail.types';
import { listSavedRoutes } from '@/utils/gpxStorage.utils';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TrailsListScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const [trails, setTrails] = useState<Trail[]>([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 10;
  const { title, /*userId,*/ mode } = useLocalSearchParams<{
    title: string;
    userId?: string;
    mode?: string;
  }>();

  const navigation = useNavigation();

  useEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [title, navigation]);

  const loadTrails = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      if (mode === 'offline') {
        const routes = await listSavedRoutes();
        const mapped: Trail[] = routes.map((r) => ({
          id: r.path,
          userId: '',
          description: null,
          title: r.name,
          durationS: null,
          distanceM: null,
          elevationGainM: null,
          finishedAt: null,
          createdAt: '',
          isShared: false,
          trackPoints: [],
          pois: [],
          startedAt: null,
          updatedAt: '',
        }));
        setTrails(mapped);
        setHasMore(false);
      } else {
        const data = await getMyTrails();
        const paged = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
        setTrails((prev) => [...prev, ...paged]);
        setHasMore(paged.length === PAGE_SIZE);
        setPage((p) => p + 1);
      }
    } catch (e) {
      console.error('Failed to load trails:', e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, mode]);

  useEffect(() => {
    loadTrails();
  }, [loadTrails]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={trails}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onEndReached={loadTrails}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TrailListItem
            trail={item}
            label={item.title}
            size="banner"
            onPress={() =>
              mode === 'offline'
                ? router.push({
                    pathname: ROUTES.SAVED_TRAIL_DETAILS,
                    params: { path: item.id, name: item.title },
                  })
                : router.push({
                    pathname: ROUTES.HIKE_DETAILS,
                    params: { id: item.id },
                  })
            }
          />
        )}
      />
      <NavigateBackToMapButton />

      <HeaderShadowGradient />
    </SafeAreaView>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.defaultBackground,
    },
    list: {
      padding: 16,
      gap: 16,
    },
    row: {
      gap: 16,
    },
    headerShadow: {
      height: 16,
      width: '100%',
    },

    // mapBackSvg: {
    //     color:
    // }
  });
