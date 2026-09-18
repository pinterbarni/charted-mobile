import { MapReturnIcon } from '@/assets/svgs/mapReturnIcon';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NavigateBackToMapButton() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.dismissAll()}>
      <MapReturnIcon color={theme.contrast} size={16} />
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    button: {
      padding: 16,
      borderRadius: 20,
      backgroundColor: theme.button.tertiary.background,
      bottom: 80 + insets.bottom,
      right: 32,
      borderColor: theme.defaultBorder,
      shadowColor: theme.defaultBorder,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,

      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      position: 'absolute',
    },
  });
