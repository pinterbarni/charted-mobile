import { useAppTheme } from '@/contexts/themeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export default function HeaderShadowGradient() {
  const theme = useAppTheme();
  return (
    <LinearGradient
      colors={[theme.header.background, 'transparent']}
      style={styles.gradient}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 16,
    zIndex: 10, // chg?
  },
});
