import HeaderShadowGradient from '@/components/headerShadowGradient';
import NavigateBackToMapButton from '@/components/navigateBackToMapButton';
import SearchBar from '@/components/searchBar';
import UserList from '@/components/userList';
import { ROUTES } from '@/constants/routes.constants';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { getBlockedUsers, getFollowers, getFollowing, searchUsers } from '@/services/social.service';
import { useAuthStore } from '@/stores/authStore';
import { ConnectionsMode } from '@/types/connections.types';
import { Profile } from '@/types/profile.types';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectionsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const { mode, userId } = useLocalSearchParams<{ mode: ConnectionsMode; userId: string }>();

  const tokens = useAuthStore((state) => state.tokens);
  const currentUserId = tokens?.accessToken ? jwtDecode<{ sub: string }>(tokens.accessToken).sub : null;

  useEffect(() => {
    if (mode !== 'blocked') return;
    const load = async () => {
      try {
        const data = await getBlockedUsers();
        console.log('[Blocked] raw response:', data);
        setUsers(data ?? []);
      } catch (e) {
        console.error('Failed to load blocked users:', e);
        setUsers([]);
      }
    };
    load();
  }, [mode]);

  useEffect(() => {
    if (mode === 'search') {
      navigation.setOptions({
        headerTitle: () => (
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            placeholder={t('connections.search.placeholder')}
          />
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: t(`connections.${mode}.title`),
      });
    }
  }, [mode, navigation, t, query]);

  useEffect(() => {
    if (!userId || mode === 'search' || mode === 'blocked') return;
    const load = async () => {
      try {
        const data = mode === 'followers' ? await getFollowers(userId) : await getFollowing(userId);
        setUsers(data);
      } catch (e) {
        console.error('Failed to load connections:', e);
      }
    };
    load();
  }, [userId, mode]);

  useEffect(() => {
    if (mode !== 'search') return;
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchUsers(query);
        setUsers(results);
      } catch (e) {
        console.error('Search failed:', e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, mode]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HeaderShadowGradient />
      <View style={styles.content}>
        {mode === 'blocked' && users.length === 0 && (
          <Text style={styles.emptyText}>{t('connections.blocked.empty')}</Text>
        )}
        <UserList
          users={users.map((u) => ({
            id: u.id,
            username: u.username ?? u.displayName ?? 'Unknown',
            avatarBase64: u.avatarUrl ?? undefined,
          }))}
          onUserPress={(userId) => {
            if (userId === currentUserId) return;
            router.push({
              pathname: ROUTES.PROFILE,
              params: { userId },
            });
          }}
          headerHeight={16}
        />

        <NavigateBackToMapButton />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.header.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    emptyText: {
      ...typography.p1r,
      color: theme.defaultLabel,
      textAlign: 'auto',
      flex: 1,
      paddingTop: 32,
    },
  });
