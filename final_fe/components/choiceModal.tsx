import Button, { ButtonVariant } from '@/components/button';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { todo } from '@/utils/todo.utils';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ChoiceModalProps = {
  onDismiss?: () => void;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;

  secondaryVariant?: ButtonVariant;
  headerBackgroundColor?: string;
  inputMode?: boolean;
  primaryLabel?: string;

  disableNewlines?: boolean;
  inputPlaceholder?: string;
  inputMultiline?: boolean;
  secondaryLabel?: string;
  inputMaxLength?: number;
  disableBackdrop?: boolean;
  inputValue?: string;
  primaryVariant?: ButtonVariant;

  onConfirmLongPress?: () => void;
  confirmDelayLongPress?: number;
};

export default function ChoiceModal({
  onDismiss = todo('onDismiss'),
  onConfirm = todo('onConfirm'),
  onCancel = todo('onCancel'),

  title = '{title}',
  secondaryVariant = 'secondary',
  headerBackgroundColor,
  onConfirmLongPress,
  confirmDelayLongPress = 600,
  inputMode = false,
  inputValue = '',
  inputPlaceholder,
  description = '{description}',
  primaryVariant = 'primary',

  inputMultiline = false,
  disableNewlines = true,

  primaryLabel = '{primaryLabel}',
  secondaryLabel = '{secondaryLabel}',

  inputMaxLength,
  disableBackdrop = false,
}: ChoiceModalProps) {
  const theme = useAppTheme();
  const styles = makeStyles(theme, headerBackgroundColor, disableBackdrop);

  const [value, setValue] = useState(inputValue);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const handleConfirm = () => {
    if (inputMode) {
      onConfirm(value);
    } else {
      onConfirm();
    }
  };

  return (
    <Modal transparent animationType="none" visible onRequestClose={onDismiss} statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoiding}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.body}>
              {inputMode ? (
                <TextInput
                  style={[styles.input, inputMultiline && styles.inputMultiline]}
                  placeholderTextColor={theme.searchBar.placeholder}
                  multiline={inputMultiline}
                  returnKeyType="done"
                  onSubmitEditing={handleConfirm}
                  placeholder={inputPlaceholder}
                  numberOfLines={inputMultiline ? 3 : 1}
                  value={value}
                  onChangeText={(text) => setValue(disableNewlines ? text.replace(/\n/g, ' ') : text)}
                  maxLength={inputMaxLength}
                  autoFocus
                />
              ) : (
                <Text style={styles.description}>{description}</Text>
              )}
              <View style={styles.buttons}>
                <Button
                  variant={primaryVariant}
                  title={primaryLabel}
                  onPress={handleConfirm}
                  onLongPress={onConfirmLongPress}
                  delayLongPress={confirmDelayLongPress}
                />

                <Button variant={secondaryVariant} title={secondaryLabel} onPress={onCancel} />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const makeStyles = (theme: AppTheme, headerBackgroundColor?: string, disableBackdrop?: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: disableBackdrop ? 'transparent' : theme.backdrop,
      justifyContent: 'center',
      pointerEvents: 'box-none',
    },
    keyboardAvoiding: {
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    container: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    header: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'flex-start',
      backgroundColor: headerBackgroundColor ?? theme.choiceModal.header.background,
    },
    title: {
      ...typography.h3,
      color: theme.choiceModal.header.title,
    },
    body: {
      padding: 16,
      gap: 40,
      backgroundColor: theme.choiceModal.body.background,
    },
    description: {
      ...typography.l1m,
      color: theme.choiceModal.body.description,
    },
    input: {
      ...typography.l1m,
      lineHeight: undefined, // maybe document: this is here because the text was jumping around.
      color: theme.defaultLabel,
      backgroundColor: theme.defaultBackground,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.delicateBorder,
      textAlignVertical: 'center',
      minHeight: 48,
    },
    inputMultiline: {
      height: 80,
      textAlignVertical: 'top',
    },
    containerBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    inputFocused: {
      borderColor: theme.button.primary.background,
      borderWidth: 1.5,
    },
    buttons: {
      flexDirection: 'row',
      gap: 12,
    },
  });
