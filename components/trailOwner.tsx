import { UserIcon } from '@/assets/svgs/userIcon';
import { ROUTES } from '@/constants/routes.constants';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  username: string;
  userId: string;
};

export default function TrailOwner({ userId, username }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push({ pathname: ROUTES.PROFILE, params: { userId } })}
      >
        <View style={styles.svgContainer}>
          <UserIcon color={theme.userAvatar.svg} size={22} />
          {/*? <UserIcon color={theme.userAvatar.svg} size={16} /> */}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.username, { color: theme.defaultLabel }]}>{username}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.defaultBorder,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: theme.defaultBackground,
    },
    containerPressed: {
      backgroundColor: theme.delicateBorder,
      opacity: 0.8,
    },
    svgContainer: {
      borderLeftColor: theme.userAvatar.container.background,
      borderBottomColor: theme.userAvatar.container.background,

      height: 38,
      width: 38,
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: theme.userAvatar.container.background,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      backgroundColor: theme.userAvatar.container.background,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderRightColor: theme.defaultBorder,

      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      backgroundColor: theme.defaultBackground,

      padding: 8,
    },
    username: {
      ...typography.p1m,
      color: theme.defaultLabel,
    },
  });
