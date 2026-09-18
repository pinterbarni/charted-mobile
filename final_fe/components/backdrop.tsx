import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = {
  onDismiss: () => void;
  children?: React.ReactNode;
};

export default function Backdrop({ onDismiss, children }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      position: 'absolute',
      right: 0,
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: theme.backdrop,
      zIndex: 1001, //todo: change!
      justifyContent: 'center',
    },
    content: {
      paddingVertical: 48,
      paddingHorizontal: 16,
    },
  });
