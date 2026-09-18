import UserListItem from '@/components/userListItem';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { FlatList, StyleSheet } from 'react-native';

type UserListItemData = {
  id: string;
  username: string;
  avatarBase64?: string;
};

type Props = {
  users: UserListItemData[];
  onUserPress: (userId: string) => void;
  headerHeight?: number;
};

export default function UserList({ users, onUserPress, headerHeight = 16 }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, headerHeight);

  return (
    <FlatList
      //!!
      keyExtractor={(item) => item.id}
      data={users}
      contentContainerStyle={styles.content}
      renderItem={({ item, index }) => (
        <UserListItem
          username={item.username}
          onPress={() => onUserPress(item.id)}
          isLast={index === users.length - 1}
          avatarBase64={item.avatarBase64} //todo implement irl.
        />
      )}
    />
  );
}

const makeStyles = (theme: AppTheme, headerHeight: number) =>
  StyleSheet.create({
    content: {
      paddingTop: headerHeight,
    },
  });
