import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const TOGGLE_WIDTH = 44;
const TOGGLE_HEIGHT = 22;
const KNOB_SIZE = TOGGLE_HEIGHT - 2;
const KNOB_TRAVEL = TOGGLE_WIDTH - KNOB_SIZE - 2;

export default function Toggle({ value, onValueChange, disabled = false }: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, value, disabled);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(value ? KNOB_TRAVEL : 0, { duration: 200 }) }],
  }));

  return (
    <TouchableOpacity
      style={styles.track}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.knob, knobStyle]} />
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme, value: boolean, disabled: boolean) =>
  StyleSheet.create({
    track: {
      width: TOGGLE_WIDTH,
      height: TOGGLE_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: 1,
      opacity: disabled ? 0.4 : 1,
      backgroundColor: value ? theme.toggle.activeTrack : theme.toggle.inactiveTrack,
      borderRadius: TOGGLE_HEIGHT / 2,
    },
    knob: {
      width: KNOB_SIZE,
      height: KNOB_SIZE,
      backgroundColor: theme.toggle.knob,
      borderRadius: KNOB_SIZE / 2,
    },
  });
