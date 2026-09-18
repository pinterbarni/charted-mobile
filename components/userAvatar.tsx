import { UserIcon } from '@/assets/svgs/userIcon';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  onPress?: () => void;
  isEditable?: boolean;
  avatarBase64?: string;
};

export default function UserAvatar({ onPress, isEditable, avatarBase64 }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {avatarBase64 ? (
        <Image source={{ uri: `data:image/jpeg;base64,${avatarBase64}` }} />
      ) : (
        <UserIcon color={theme.userAvatar.svg} size={40} />
      )}
      {isEditable ? (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Edit</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    label: {
      ...typography.l3r,
      color: theme.userAvatar.label,
    },

    container: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.userAvatar.container.border,

      width: 52,
      height: 52,

      backgroundColor: theme.userAvatar.container.background,

      alignItems: 'center',
      justifyContent: 'flex-end',
      //find alternative
      overflow: 'hidden',
    },
    labelContainer: {
      position: 'absolute',
      //here too
      bottom: -1,
      right: -1,
      backgroundColor: theme.userAvatar.labelContainer.background,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.userAvatar.labelContainer.border,
      padding: 8,
      borderTopLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    svg: {
      color: theme.userAvatar.svg,
      width: 40,
    },
  });
