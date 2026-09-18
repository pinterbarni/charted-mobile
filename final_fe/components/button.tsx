import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { AppIcon } from '@/types/icon.types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// todo: constants to a special .const. file :D

type IconPosition = 'left' | 'right';
type TextAlign = 'left' | 'center';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'cta';

type Typeface = keyof typeof typography;

type Props = {
  onPress?: () => void;
  delayLongPress?: number;
  icon?: React.ComponentType<AppIcon>;
  iconPosition?: IconPosition;
  textAlign?: TextAlign;
  hasBorder?: boolean;
  typeface?: Typeface;
  stretch?: boolean;
  variant: ButtonVariant;
  title?: string;

  iconSize?: number; // todo set base
  disabled?: boolean;
  onLongPress?: () => void;
};

const VARIANT_HAS_BORDER: Record<ButtonVariant, boolean> = {
  primary: false,
  secondary: true,
  tertiary: false,
  quaternary: false,
  cta: true,
};

const isQuaternary = (variant: ButtonVariant): boolean => variant === 'quaternary';

const getBorderStyle = (variant: ButtonVariant, showBorder: boolean, theme: AppTheme) => {
  if (isQuaternary(variant)) return {};
  return {
    borderWidth: 1,
    borderColor: showBorder ? theme.button[variant].border : theme.button[variant].background,
  };
};

export default function Button({
  onPress,
  onLongPress,
  title,
  icon: Icon,
  iconPosition = 'left',
  textAlign = 'center',
  hasBorder,
  delayLongPress = 500,
  variant,
  iconSize, // t todo: set base = 16?
  stretch,
  typeface,
  disabled,
}: Props) {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const showBorder = hasBorder ?? VARIANT_HAS_BORDER[variant];
  const borderStyle = getBorderStyle(variant, showBorder, theme);

  const ICON_SIZE = iconSize ?? 12;

  const CONTAINER_STYLES = {
    primary: styles.primaryContainer,
    secondary: styles.secondaryContainer,
    tertiary: styles.tertiaryContainer,
    quaternary: styles.quaternaryContainer,
    cta: styles.ctaContainer,
  } as const;

  const TEXT_STYLES = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    tertiary: styles.tertiaryText,
    quaternary: styles.quaternaryText,
    cta: styles.ctaText,
  } as const;

  const iconColor = theme.button[variant]?.label ?? theme.button.primary.label;

  const renderContent = () => (
    <>
      {Icon && iconPosition === 'left' && <Icon color={iconColor} size={ICON_SIZE} />}
      <Text style={[TEXT_STYLES[variant], typeface ? typography[typeface] : null]}>{title}</Text>
      {Icon && iconPosition === 'right' && <Icon color={iconColor} size={ICON_SIZE} />}
    </>
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        CONTAINER_STYLES[variant],
        borderStyle,
        stretch && styles.stretch,
        disabled && styles.disabled,
      ]}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View style={[styles.content, stretch && styles.contentStretch]}>{renderContent()}</View>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
    },
    primaryContainer: {
      backgroundColor: theme.button.primary.background,
    },
    tertiaryText: {
      ...typography.l1m,
      color: theme.button.tertiary.label,
    },
    pressed: {
      transform: [{ scale: 0.97 }],
    },
    stretch: {
      alignSelf: 'stretch',
    },
    contentStretch: {
      flex: 1,
      justifyContent: 'space-between',
    },
    primaryText: {
      ...typography.l1m,
      color: theme.button.primary.label,
    },
    secondaryText: {
      ...typography.l1m,
      color: theme.button.secondary.label,
    },
    tertiaryContainer: {
      backgroundColor: theme.button.tertiary.background,
    },
    loading: {
      opacity: 0.6,
    },
    loadingIndicator: {
      position: 'absolute',
      right: 16,
    },
    quaternaryContainer: {},
    secondaryContainer: {
      backgroundColor: theme.button.secondary.background,
    },
    quaternaryText: {
      ...typography.l3u,
      color: theme.button.quaternary.label,
    },
    ctaContainer: {
      backgroundColor: theme.button.cta.background,
    },
    ctaText: {
      ...typography.l1m,
      color: theme.button.cta.label,
    },
    content: {
      gap: 8,

      flexDirection: 'row',
      alignItems: 'center',
    },
    disabled: {
      opacity: 0.4,
    },
  });
