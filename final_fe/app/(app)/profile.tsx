import { MapReturnIcon } from '@/assets/svgs/mapReturnIcon';
import Button from '@/components/button';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';

import EditOrLogoutModal from '@/components/editOrLogoutModal';
import HeaderShadowGradient from '@/components/headerShadowGradient';
import NavigateBackToMapButton from '@/components/navigateBackToMapButton';
import ReportOrBlockModal from '@/components/reportOrBlockModal';
import TrailList from '@/components/trailList';
import { listSavedRoutes } from '@/utils/gpxStorage.utils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import ChoiceModal from '@/components/choiceModal';
import PillRow from '@/components/pillRow';
import UserCard from '@/components/userCard';
import { ROUTES } from '@/constants/routes.constants';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import { getMyProfile, updateProfile } from '@/services/profile.service';
import {
  blockUser,
  followUser,
  getFollowers,
  getFollowing,
  getSocialProfile,
  reportUser,
  unblockUser,
  unfollowUser,
} from '@/services/social.service';
import { getRecentSharedTrails, getRecentTrails, getUserTrails } from '@/services/trail.service';
import { useAuthStore } from '@/stores/authStore';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useState } from 'react';

import { useLocationStore } from '@/stores/localStore';
import { Profile } from '@/types/profile.types';
import { Trail } from '@/types/trail.types';
import { cacheProfile, getCachedProfile } from '@/utils/profileCache.utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

type ProfileTab = 'all' | 'myHikes' | 'recentlyShared' | 'offline' /*| 'mostLiked'*/;
type SavedRoute = { name: string; path: string };

export default function ProfileScreen() {
  const { t } = useTranslation();

  const OWN_PILLS: { label: string; tab: ProfileTab }[] = [
    { label: t('profile.tabs.all'), tab: 'all' },
    { label: t('profile.tabs.myHikes'), tab: 'myHikes' },
    // { label: t('profile.tabs.mostLiked'), tab: 'mostLiked' },
    { label: t('profile.tabs.recentlyShared'), tab: 'recentlyShared' },
    { label: t('profile.tabs.offline'), tab: 'offline' },
  ];
  const BLOCKED_PILLS = [t('otherUserLabel')];

  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [isOffline, setIsOffline] = useState(false);

  const [showEditBio, setShowEditBio] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('all');
  const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const [showEditName, setShowEditName] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [recentSharedTrails, setRecentSharedTrails] = useState<Trail[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showEditOrLogout, setShowEditOrLogout] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [showReportOrBlock, setShowReportOrBlock] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const tokens = useAuthStore((state) => state.tokens);
  const currentUserId = tokens?.accessToken ? jwtDecode<{ sub: string }>(tokens.accessToken).sub : null;
  const isOwnProfile = !userId || userId === currentUserId;
  const targetId = userId ?? currentUserId;
  const { logout } = useKeycloakAuth();
  const [showLocationInfoModal, setShowLocationInfoModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!targetId) return;
      setLoadingTrails(true);
      const load = async () => {
        try {
          const profileData = await (isOwnProfile ? getMyProfile() : getSocialProfile(targetId)).catch(
            (e) => {
              const isNetwork = e instanceof TypeError && e.message === 'Network request failed';
              if (!isNetwork) console.error('PROFILE FAILED', e);
              throw e;
            }
          );
          const trailsData = await (isOwnProfile ? getRecentTrails() : getUserTrails(targetId)).catch((e) => {
            const isNetwork = e instanceof TypeError && e.message === 'Network request failed';
            if (!isNetwork) console.error('TRAILS FAILED', e);
            throw e;
          });
          const recentSharedData = await (isOwnProfile ? getRecentSharedTrails() : Promise.resolve([])).catch(
            (e) => {
              const isNetwork = e instanceof TypeError && e.message === 'Network request failed';
              if (!isNetwork) console.error('SHARED FAILED', e);
              throw e;
            }
          );
          const routes = await (isOwnProfile ? listSavedRoutes() : Promise.resolve([])).catch((e) => {
            const isNetwork = e instanceof TypeError && e.message === 'Network request failed';
            if (!isNetwork) console.error('ROUTES FAILED', e);
            throw e;
          });

          setProfile(profileData);
          setTrails(trailsData ?? []);

          setRecentSharedTrails(recentSharedData ?? []);
          setSavedRoutes(routes);

          setIsOffline(false);

          if (isOwnProfile) {
            await cacheProfile(profileData);
          }

          if (!isOwnProfile) {
            setIsFollowing((profileData as any).isFollowing ?? false);
            setIsBlocked((profileData as any).isBlocked ?? false);
          }

          try {
            const [followers, following] = await Promise.all([
              getFollowers(targetId),
              getFollowing(targetId),
            ]);
            setFollowersCount(followers.length);
            setFollowingCount(following.length);
          } catch {
            /** Silently ignoring when offline. */
          }
        } catch (e) {
          const isNetworkError = e instanceof TypeError && e.message === 'Network request failed';
          if (isOwnProfile && isNetworkError) {
            const cachedProfile = await getCachedProfile();
            if (cachedProfile) setProfile(cachedProfile);
            const routes = await listSavedRoutes();
            setSavedRoutes(routes);
            setActiveTab('offline');
            setIsOffline(true);
          } else {
            console.error('Failed to load profile:', e);
          }
        } finally {
          setLoadingTrails(false);
        }
      };
      load();
    }, [targetId, isOwnProfile])
  );

  const handleFollowPress = async () => {
    if (!targetId) return;
    if (isFollowing) {
      setShowUnfollowModal(true);
      return;
    }
    try {
      await followUser(targetId);
      setIsFollowing(true);
      setFollowersCount((c) => c + 1);
      Toast.show({ type: 'success', text1: t('social.followed'), position: 'top' });
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('social.followError'), position: 'top' });
    }
  };

  const handleUnfollowConfirm = async () => {
    if (!targetId) return;
    setShowUnfollowModal(false);
    try {
      await unfollowUser(targetId);
      setIsFollowing(false);
      setFollowersCount((c) => c - 1);
      Toast.show({ type: 'success', text1: t('social.unfollowed'), position: 'top' });
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('social.followError'), position: 'top' });
    }
  };

  const handleBlockConfirm = async () => {
    if (!targetId) return;
    setShowBlockConfirm(false);
    try {
      await blockUser(targetId);
      Toast.show({ type: 'warning', text1: t('social.blockSuccess'), position: 'top' });
      router.back();
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('social.followError'), position: 'top' });
    }
  };

  const handleReportConfirm = async (value?: string) => {
    if (!value?.trim()) {
      Toast.show({ type: 'error', text1: t('social.reportReasonRequired'), position: 'top' });
      return;
    }
    if (!targetId) return;
    setShowReportConfirm(false);
    try {
      await reportUser(targetId, value.trim());
      Toast.show({ type: 'warning', text1: t('social.reportSuccess'), position: 'top' });
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('social.followError'), position: 'top' });
    }
  };
  const handleUnblockConfirm = async () => {
    if (!targetId) return;
    setShowUnblockConfirm(false);
    try {
      await unblockUser(targetId);
      setIsBlocked(false);
      Toast.show({ type: 'success', text1: t('social.unblockSuccess'), position: 'top' });
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('social.followError'), position: 'top' });
    }
  };
  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };
  const handleEditName = async (value?: string) => {
    if (!value?.trim()) return;
    if (value.length > 16) {
      Toast.show({ type: 'error', text1: t('profile.nameTooLong'), position: 'top' });
      return;
    }
    setShowEditName(false);
    try {
      const updated = await updateProfile({ displayName: value.trim() });
      setProfile(updated);
      Toast.show({ type: 'success', text1: t('profile.nameUpdated'), position: 'top' });
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('profile.updateError'), position: 'top' });
    }
  };

  const handleEditBio = async (value?: string) => {
    if (value && value.length > 96) {
      Toast.show({ type: 'error', text1: t('profile.bioTooLong'), position: 'top' });
      return;
    }
    setShowEditBio(false);
    try {
      const updated = await updateProfile({ bio: value?.trim() });
      setProfile(updated);
      Toast.show({ type: 'success', text1: t('profile.bioUpdated'), position: 'top' });
    } catch (e) {
      console.warn(e);
      Toast.show({ type: 'error', text1: t('profile.updateError'), position: 'top' });
    }
  };

  const OFFLINE_LIMIT = 4;

  const offlineTrails: Trail[] = savedRoutes.map((r) => ({
    id: r.path,
    userId: currentUserId ?? '',
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

  const offlineList =
    offlineTrails.length > 0 ? (
      <TrailList
        title={t('profile.tabs.offline')}
        trails={offlineTrails.slice(0, OFFLINE_LIMIT)}
        onTrailPress={(trail) =>
          router.push({
            pathname: ROUTES.SAVED_TRAIL_DETAILS,
            params: { path: trail.id, name: trail.title },
          })
        }
        onEndItemPress={
          offlineTrails.length > OFFLINE_LIMIT
            ? () =>
                router.push({
                  pathname: ROUTES.TRAILS_LIST,
                  params: { title: t('profile.tabs.offline'), mode: 'offline' },
                })
            : undefined
        }
      />
    ) : null;

  const renderTrails = () => {
    if (isBlocked) {
      return (
        <View style={styles.blockedTrailsMessage}>
          <Text style={styles.blockedTrailsText}>
            {t('profile.unblockToSeeTrails', { name: profile?.displayName ?? 'this user' })}
          </Text>
        </View>
      );
    }

    if (!isOwnProfile) {
      if (loadingTrails) return null;
      if (trails.length === 0) {
        return (
          <View style={styles.noTrailsMessage}>
            <Text style={styles.noTrailsTitle}>{t('profile.noTrailsTitle')}</Text>
            <Text style={styles.noTrailsText}>
              {t('profile.noTrailsText', { name: profile?.displayName ?? 'This user' })}
            </Text>
          </View>
        );
      }
      return (
        <TrailList
          title={t('profile.hikes')}
          trails={trails.slice(0, 4)}
          onTrailPress={(trail) => router.push({ pathname: ROUTES.HIKE_DETAILS, params: { id: trail.id } })}
          onEndItemPress={
            trails.length > 4
              ? () =>
                  router.push({
                    pathname: ROUTES.TRAILS_LIST,
                    params: { title: t('profile.hikes'), userId: targetId },
                  })
              : undefined
          }
        />
      );
    }

    if (loadingTrails) return null;

    if (trails.length === 0 && activeTab !== 'recentlyShared' && activeTab !== 'offline') {
      return (
        <View style={styles.noTrailsMessage}>
          <Text style={styles.noTrailsTitle}>{t('profile.noOwnTrailsTitle')}</Text>
          <Text style={styles.noTrailsText}>{t('profile.noOwnTrailsText')}</Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                const { permissionStatus } = useLocationStore.getState();
                if (permissionStatus === 'granted') {
                  router.replace(ROUTES.MAP);
                } else {
                  setShowLocationInfoModal(true);
                }
              }}
              title={t('profile.goToMap')}
              iconSize={16}
              icon={MapReturnIcon}
              variant="cta"
              iconPosition="right"
            />
          </View>
        </View>
      );
    }

    const myHikesList =
      trails.length > 0 ? (
        <TrailList
          title={t('profile.myHikes')}
          trails={trails}
          onTrailPress={(trail) => router.push({ pathname: ROUTES.HIKE_DETAILS, params: { id: trail.id } })}
          onEndItemPress={() =>
            router.push({
              pathname: ROUTES.TRAILS_LIST,
              params: { title: t('profile.myHikes'), userId: targetId },
            })
          }
        />
      ) : null;

    const recentSharedList =
      recentSharedTrails.length > 0 ? (
        <TrailList
          title={t('profile.recentlyShared')}
          trails={recentSharedTrails}
          onTrailPress={(trail) => router.push({ pathname: ROUTES.HIKE_DETAILS, params: { id: trail.id } })}
        />
      ) : null;

    switch (activeTab) {
      case 'all':
        return (
          <>
            {myHikesList}
            {recentSharedList}
            {savedRoutes.length > 0 && offlineList}
          </>
        );
      case 'myHikes':
        return myHikesList;
      case 'recentlyShared':
        return (
          recentSharedList ?? (
            <View style={styles.noTrailsMessage}>
              <Text style={styles.noTrailsTitle}>{t('profile.noRecentSharedTitle')}</Text>
            </View>
          )
        );
      case 'offline':
        return (
          offlineList ?? (
            <View style={styles.noTrailsMessage}>
              <Text style={styles.noTrailsTitle}>{t('profile.noOfflineTitle')}</Text>
              <Text style={styles.noTrailsText}>{t('profile.noOfflineText')}</Text>
            </View>
          )
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.userCard}>
          <UserCard
            followersCount={followersCount}
            onMorePress={() => (isOwnProfile ? setShowEditOrLogout(true) : setShowReportOrBlock(true))}
            displayName={profile?.displayName ?? undefined}
            distanceKm={(profile?.totalDistanceM ?? 0) / 1000}
            followingCount={followingCount}
            onFollowersPress={
              !isOffline && followersCount > 0
                ? () =>
                    router.push({
                      pathname: ROUTES.CONNECTIONS,
                      params: { mode: 'followers', userId: targetId },
                    })
                : undefined
            }
            onFollowingPress={
              !isOffline && followingCount > 0
                ? () =>
                    router.push({
                      pathname: ROUTES.CONNECTIONS,
                      params: { mode: 'following', userId: targetId },
                    })
                : undefined
            }
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            username={profile?.username ?? 'Unknown'}
            onFollowPress={isBlocked ? () => setShowUnblockConfirm(true) : handleFollowPress}
            bio={profile?.bio ?? ''}
            level={profile?.level ?? 0}
            isBlocked={isBlocked}
          />
        </View>

        <View style={styles.pillRowWrapper}>
          <PillRow
            items={
              isOwnProfile
                ? OWN_PILLS.filter((pill) => !isOffline || pill.tab === 'offline').map((pill) => ({
                    label: pill.label,
                    isActive: activeTab === pill.tab,
                    onPress: () => setActiveTab(pill.tab),
                  }))
                : BLOCKED_PILLS.map((label, index) => ({
                    label,
                    isActive: index === 0,
                    onPress: () => {},
                  }))
            }
          />
        </View>

        <View style={styles.content}>{renderTrails()}</View>
      </ScrollView>

      <HeaderShadowGradient />
      {!isOwnProfile && <NavigateBackToMapButton />}

      {showReportOrBlock && (
        <ReportOrBlockModal
          onDismiss={() => setShowReportOrBlock(false)}
          onReportPress={() => {
            setShowReportOrBlock(false);
            setShowReportConfirm(true);
          }}
          visible={showReportOrBlock}
          onBlockPress={() => {
            setShowReportOrBlock(false);
            setShowBlockConfirm(true);
          }}
        />
      )}

      {showBlockConfirm && (
        <ChoiceModal
          primaryLabel={t('social.blockConfirm')}
          secondaryLabel={t('common.cancel')}
          onConfirm={handleBlockConfirm}
          onCancel={() => setShowBlockConfirm(false)}
          onDismiss={() => setShowBlockConfirm(false)}
          title={t('social.blockTitle')}
          description={t('social.blockDescription')}
        />
      )}

      {showReportConfirm && (
        <ChoiceModal
          title={t('social.reportTitle')}
          inputPlaceholder={t('social.reportPlaceholder')}
          inputMultiline
          inputValue=""
          onCancel={() => setShowReportConfirm(false)}
          inputMaxLength={500}
          onConfirm={handleReportConfirm}
          inputMode
          primaryLabel={t('social.reportConfirm')}
          secondaryLabel={t('common.cancel')}
          onDismiss={() => setShowReportConfirm(false)}
        />
      )}

      {showUnfollowModal && (
        <ChoiceModal
          onCancel={() => setShowUnfollowModal(false)}
          onDismiss={() => setShowUnfollowModal(false)}
          onConfirm={handleUnfollowConfirm}
          primaryLabel={t('social.unfollowConfirm')}
          secondaryLabel={t('common.cancel')}
          description={t('social.unfollowDescription')}
          title={t('social.unfollowTitle')}
        />
      )}

      {showUnblockConfirm && (
        <ChoiceModal
          description={t('social.unblockDescription')}
          onCancel={() => setShowUnblockConfirm(false)}
          onDismiss={() => setShowUnblockConfirm(false)}
          title={t('social.unblockTitle')}
          onConfirm={handleUnblockConfirm}
          primaryLabel={t('social.unblockConfirm')}
          secondaryLabel={t('common.cancel')}
        />
      )}
      {/* {showEditName && (
        <ChoiceModal
          title={t('profile.editName')}
          secondaryLabel={t('common.cancel')}
          inputMode
          onConfirm={handleEditName}
        />
      )} */}

      {showEditOrLogout && (
        <EditOrLogoutModal
          onDismiss={() => setShowEditOrLogout(false)}
          onEditNamePress={() => {
            setShowEditOrLogout(false);
            setShowEditName(true);
          }}
          onEditBioPress={() => {
            setShowEditOrLogout(false);
            setShowEditBio(true);
          }}
          onLogoutPress={() => {
            setShowEditOrLogout(false);
            setShowLogoutConfirm(true);
          }}
        />
      )}

      {showEditName && (
        <ChoiceModal
          onDismiss={() => setShowEditName(false)}
          inputValue={profile?.displayName ?? ''}
          onCancel={() => setShowEditName(false)}
          inputPlaceholder={t('profile.namePlaceholder')}
          inputMaxLength={16}
          primaryLabel={t('common.save')}
          title={t('profile.editName')}
          secondaryLabel={t('common.cancel')}
          inputMode
          onConfirm={handleEditName}
        />
      )}

      {showEditBio && (
        <ChoiceModal
          title={t('profile.editBio')}
          inputValue={profile?.bio ?? ''}
          inputPlaceholder={t('profile.bioPlaceholder')}
          onCancel={() => setShowEditBio(false)}
          inputMultiline
          inputMaxLength={96}
          disableNewlines
          inputMode
          onConfirm={handleEditBio}
          onDismiss={() => setShowEditBio(false)}
          primaryLabel={t('common.save')}
          secondaryLabel={t('common.cancel')}
        />
      )}

      {showLogoutConfirm && (
        <ChoiceModal
          primaryLabel={t('profile.logoutConfirm')}
          secondaryLabel={t('common.cancel')}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutConfirm(false)}
          title={t('profile.logoutTitle')}
          description={t('profile.logoutDescription')}
          onDismiss={() => setShowLogoutConfirm(false)}
        />
      )}

      {showLocationInfoModal && (
        <ChoiceModal
          title={t('permissions.locationRequired')}
          description={t('permissions.locationRequiredDescription')}
          primaryLabel={t('permissions.goToSettings')}
          secondaryLabel={t('common.cancel')}
          onConfirm={() => {
            setShowLocationInfoModal(false);
            Linking.openSettings();
          }}
          onCancel={() => setShowLocationInfoModal(false)}
          onDismiss={() => setShowLocationInfoModal(false)}
        />
      )}
    </SafeAreaView>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.header.background,
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.defaultBackground,
    },
    userCard: {
      paddingHorizontal: 16,
      paddingVertical: 15,
      justifyContent: 'center',
      backgroundColor: theme.header.background,
    },
    pillRowWrapper: {
      backgroundColor: theme.header.background,
      borderBottomColor: theme.header.borderBottom,
      borderBottomWidth: 2,
    },
    buttonContainer: {
      marginTop: 16,
      alignItems: 'flex-end',
    },
    shadow: {
      shadowColor: theme.button.tertiary.background,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Android
    },
    content: {
      paddingVertical: 16,
      gap: 16,
      justifyContent: 'flex-start',
    },
    blockedTrailsMessage: {
      paddingHorizontal: 16,
      alignItems: 'flex-start',
    },
    blockedTrailsText: {
      ...typography.p1m,
      color: theme.defaultLabel,
      textAlign: 'left',
    },
    noTrailsMessage: {
      paddingHorizontal: 16,
      gap: 8,
    },
    widenTemp: {
      flex: 1,
      backgroundColor: 'transparent', // or '#fff'-ish
    },
    noTrailsTitle: {
      ...typography.h3,
      color: theme.defaultTitle,
    },
    noTrailsText: {
      ...typography.p1r,
      color: theme.defaultLabel,
    },
  });
