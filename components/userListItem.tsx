import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type UserListItemProps = {
  username: string;
  avatarBase64?: string;
  onPress: () => void;
  isLast?: boolean;
};

export default function UserListItem({ username, avatarBase64, onPress, isLast = false }: UserListItemProps) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <View style={[styles.border, isLast && styles.noBorder]}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.avatar}>
          {/* todo: uri move out as you used to! */}
          {avatarBase64 ? (
            <Image source={{ uri: `data:image/jpeg;base64,${avatarBase64}` }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
        <Text style={styles.username} numberOfLines={1}>
          {username}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    avatar: {
      marginRight: 8,
    },
    avatarImage: {
      borderRadius: 4,
      width: 32,
      height: 32,
    },
    avatarPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundColor: theme.skeleton,
    },
    username: {
      ...typography.l1m,
      color: theme.defaultLabel,
      flex: 1,
    },
    border: {
      borderBottomWidth: 1,
      borderBottomColor: theme.userList.divider,
    },
    noBorder: {
      borderBottomWidth: 0,
    },
  });
