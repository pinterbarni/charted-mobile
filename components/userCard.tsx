import { BlockIcon } from '@/assets/svgs/blockIcon';
import { CheckmarkIcon } from '@/assets/svgs/checkmarkIcon';
import { PlusIcon } from '@/assets/svgs/plusIcon';
import UserAvatar from '@/components/userAvatar';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useSettingsStore } from '@/stores/settingsStore';
import { todo } from '@/utils/todo.utils';
import { formatDistance } from '@/utils/unitsOfMeasurement.utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  username: string;
  bio?: string;
  displayName?: string;
  distanceKm: number;
  level: number;
  followersCount: number;
  followingCount: number;
  isBlocked: boolean;
  isFollowing?: boolean;
  onMorePress?: () => void;
  onFollowPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onLevelPress?: () => void;
  avatarBase64?: string;
  isOwnProfile?: boolean;
};

const MoreIcon = ({ color }: { color: string }) => (
  <View style={{ gap: 4, alignItems: 'center' }}>
    {[0, 1, 2].map((i) => (
      <View key={i} style={{ width: 4, height: 4, borderRadius: 10, backgroundColor: color }} />
    ))}
  </View>
);

export default function UserCard({
  username,
  bio,
  distanceKm,
  isBlocked,
  level,
  followersCount,
  displayName,
  followingCount,
  isFollowing = false,
  onMorePress = todo('onMorePress'),
  onFollowPress = todo('onFollowPress'),
  onFollowersPress = todo('onFollowersPress'),
  onFollowingPress = todo('onFollowingPress'),
  onLevelPress = todo('onLevelPress'),
  avatarBase64,
  isOwnProfile,
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const unitSystem = useSettingsStore((state) => state.unitOfMeasurementSystem);
  const { i18n } = useTranslation();

  return (
    <LinearGradient
      colors={[theme.profileCard.grad.start, theme.profileCard.grad.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        {/* Left column */}
        <View style={[styles.leftColumn, isBlocked && styles.blockedOpacity]}>
          {/* Main user info */}
          <View style={styles.mainUserInfo}>
            <UserAvatar onPress={todo('avatar')} avatarBase64={avatarBase64} />
            <View style={styles.namesContainer}>
              <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                {username}
              </Text>
              <Text style={styles.displayName} numberOfLines={1} ellipsizeMode="tail">
                {displayName}
              </Text>
            </View>
          </View>

          {/* bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{bio}</Text>
          </View>
        </View>

        {/* Right column */}
        <View style={styles.rightColumn}>
          {/* More button */}
          <TouchableOpacity
            disabled={isBlocked}
            style={[styles.moreButton, isBlocked && styles.blockedOpacity]}
            onPress={onMorePress}
          >
            <MoreIcon color={theme.profileCard.moreIcon} />
          </TouchableOpacity>

          {/* Level details */}
          <TouchableOpacity
            disabled={true /**TODO: Disabled predefined for gamification.  */}
            style={styles.levelDetailsClickable}
            onPress={onLevelPress}
          >
            <View style={styles.distanceContainer}>
              <Text style={styles.pillText}>
                {isBlocked ? t('profile.blocked') : formatDistance(distanceKm, unitSystem, i18n.language, 0)}
              </Text>
            </View>

            <View style={styles.levelContainer}>
              <Text style={styles.pillText}>Lvl {level}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Bottom row */}
      <View style={styles.bottomRow}>
        {/* Social buttons */}
        <View style={styles.socialButtonContainer}>
          <TouchableOpacity disabled={isBlocked} style={styles.socialButton} onPress={onFollowingPress}>
            <Text style={styles.socialButtonText}>
              <Text style={styles.socialCount}>{followingCount} </Text>
              {t('connections.following.title')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity disabled={isBlocked} style={styles.socialButton} onPress={onFollowersPress}>
            <Text style={styles.socialButtonText}>
              <Text style={styles.socialCount}>{followersCount} </Text>
              {t('connections.followers.title')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Follow / Unfollow button */}
        {!isOwnProfile && (
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing && styles.followingButton,
              isBlocked && styles.unblockButton,
            ]}
            onPress={onFollowPress}
          >
            {isBlocked && <BlockIcon color={theme.button.secondary.label} size={10} />}
            {!isBlocked && !isFollowing && (
              <PlusIcon color={theme.profileCard.followButton.nonFollowedLabel} size={10} />
            )}
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
                isBlocked && styles.unblockButtonText,
              ]}
            >
              {isBlocked
                ? t('profile.unblockUser')
                : isFollowing
                  ? t('social.following')
                  : t('social.follow')}
            </Text>
            {!isBlocked && isFollowing && (
              <CheckmarkIcon color={theme.profileCard.followButton.followedLabel} size={10} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: 8,
      height: 200,
      paddingLeft: 16,
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    unblockButton: {
      backgroundColor: theme.button.secondary.background,
      borderColor: theme.button.secondary.border,
    },
    unblockButtonText: {
      color: theme.button.secondary.label,
    },
    gradientBackground: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingBottom: 10,
      flex: 1,
    },
    leftColumn: {
      flex: 1,
      flexDirection: 'column',
      gap: 8,
    },
    mainUserInfo: {
      flexDirection: 'row',
      // alignItems: 'flex-start',

      //alignItems: 'center',
      gap: 10,
      paddingTop: 16,
      paddingRight: 8,
    },
    username: {
      ...typography.l1m,
      color: theme.defaultLabel,
      paddingRight: 8,
    },
    bioContainer: {
      paddingRight: 8,
    },
    bio: {
      ...typography.l3r,
      color: theme.defaultLabel,
    },
    rightColumn: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    moreButton: {
      padding: 16,
    },
    levelDetailsClickable: {
      paddingRight: 16,
      gap: 8,
    },
    distanceContainer: {
      borderRadius: 100,
      backgroundColor: theme.profileCard.distancePill,
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    levelContainer: {
      borderRadius: 100,
      opacity: 0, //TODO Change
      alignItems: 'center',
      backgroundColor: '#ffaaff',
      paddingVertical: 3,
      paddingHorizontal: 8,
    },
    blockedOpacity: {
      opacity: 0.5,
    },
    followButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 4,
      backgroundColor: theme.profileCard.followButton.nonFollowedBackground,
    },
    followingButton: {
      backgroundColor: theme.profileCard.followButton.followedBackground,
    },
    followButtonText: {
      ...typography.l1m,
      color: theme.profileCard.followButton.nonFollowedLabel,
    },
    followingButtonText: {
      color: theme.profileCard.followButton.followedLabel,
    },

    pillText: {
      ...typography.l3m,
      color: theme.defaultLabel,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingBottom: 16,
      paddingRight: 16,
      justifyContent: 'space-between',
    },
    socialButtonContainer: {
      flexDirection: 'row',
      paddingRight: 16,
      gap: 16,
    },
    socialButton: {
      paddingVertical: 12,
      backgroundColor: theme.defaultBackground,

      paddingHorizontal: 12,
      borderRadius: 4,
    },
    socialButtonText: {
      ...typography.l3m,
      color: theme.defaultLabel,
    },
    socialCount: {
      ...typography.l3m,
      color: theme.defaultLabel,
    },
    // followButton: {
    //   flexDirection: 'row',
    //   backgroundColor: theme.profileCard.followButton.nonFollowedBackground,

    //   alignItems: 'center',
    //   gap: 8,
    //   paddingHorizontal: 16,
    //   paddingVertical: 12,
    //   borderRadius: 4,
    // },
    // followButtonText: {
    //   ...typography.l2m,
    //   color: theme.defaultLabel,
    // },
    displayName: {
      ...typography.l2m,
    },
    namesContainer: {
      gap: 4,
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
  });
