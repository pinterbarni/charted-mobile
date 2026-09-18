import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { StyleSheet, View } from 'react-native';

export default function Divider() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.leftLine} />
      <View style={styles.circle} />
      <View style={styles.rightLine} />
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    leftLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.bottomSheet.divider.leftLine,
    },
    rightLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.bottomSheet.divider.rightLine,
    },

    circle: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.bottomSheet.divider.circle,
      marginHorizontal: 8,
    },
  });
