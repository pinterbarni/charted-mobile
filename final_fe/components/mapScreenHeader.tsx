import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from './button';

type Props = {
  onCreateTrailPress?: () => void;
  isHidden?: boolean;
  disabled?: boolean;
};

export default function MapScreenHeader({ disabled = false, onCreateTrailPress, isHidden = false }: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isHidden ? -222 : 0, //todo: arrange animations to a component maybe?
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isHidden, translateY]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.placeholder} />
      <Button
        variant="tertiary"
        title="Create Trail"
        onPress={onCreateTrailPress}
        hasBorder={true}
        disabled={disabled}
        typeface="h4"
      />
    </Animated.View>
  );
}

const makeStyles = (theme: AppTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 32 + insets.top,
      left: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 32,
    },
    placeholder: {
      flex: 1,
      backgroundColor: 'red',
      marginRight: '25%',
      zIndex: -4,
    },
  });
