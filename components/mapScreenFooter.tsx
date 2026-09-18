import { CheckmarkIcon } from '@/assets/svgs/checkmarkIcon';
import { FinishIcon } from '@/assets/svgs/finishIcon';
import { LeftArrowIcon } from '@/assets/svgs/leftArrowIcon';
import { PauseIcon } from '@/assets/svgs/pauseIcon';
import { StartIcon } from '@/assets/svgs/startIcon';
import Button from '@/components/button';
import { AppTheme } from '@/constants/theme.constants';
import { useAppTheme } from '@/contexts/themeContext';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import UserAvatar from './userAvatar';

//TODO: move out dor docs to be easier!
export type FooterState = 'idle' | 'tracking' | 'paused' | 'done' | 'retracking' | 'retracking_active';
type Props = {
  onAvatarPress?: () => void;
  onStartPress?: () => void;
  onPausePress?: () => void;
  onResumePress?: () => void;
  onFinishPress?: () => void;
  onCancelPress?: () => void;
  onDonePress?: () => void;
  footerState?: FooterState;
  startDisabled?: boolean;
};

export default function MapScreenFooter({
  onAvatarPress,
  onStartPress,
  onPausePress,
  onResumePress,
  onFinishPress,
  onCancelPress,
  onDonePress,
  footerState = 'idle',
  startDisabled = true,
}: Props) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {footerState === 'idle' && (
        <>
          <Button
            variant="primary"
            title={t('tracking.start')}
            hasBorder={true}
            onPress={onStartPress}
            disabled={startDisabled}
            icon={StartIcon}
          />
          <UserAvatar onPress={onAvatarPress} />
        </>
      )}

      {footerState === 'tracking' && (
        <Button
          variant="primary"
          title={t('tracking.pause')}
          hasBorder={true}
          icon={PauseIcon}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPausePress?.();
          }}
          delayLongPress={300}
        />
      )}

      {footerState === 'paused' && (
        <>
          <Button
            variant="primary"
            title={t('tracking.resume')}
            hasBorder={true}
            onPress={onResumePress}
            icon={StartIcon}
          />
          <Button
            variant="secondary"
            title={t('tracking.finish')}
            hasBorder={true}
            icon={FinishIcon}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onLongPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onFinishPress?.();
            }}
            delayLongPress={600}
          />
        </>
      )}

      {footerState === 'done' && (
        <>
          <Button
            variant="tertiary"
            title={t('tracking.cancel')}
            hasBorder={true}
            onPress={onCancelPress}
            icon={LeftArrowIcon}
          />
          <Button
            variant="primary"
            title={t('tracking.done')}
            hasBorder={true}
            onPress={onDonePress}
            icon={CheckmarkIcon}
          />
        </>
      )}

      {footerState === 'retracking' && (
        <>
          <Button
            variant="tertiary"
            title={t('common.cancel')}
            hasBorder={true}
            onPress={onCancelPress}
            icon={LeftArrowIcon}
          />
          <Button
            variant="primary"
            title={t('tracking.start')}
            hasBorder={true}
            onPress={onStartPress}
            disabled={startDisabled}
            icon={StartIcon}
          />
        </>
      )}

      {footerState === 'retracking_active' && (
        <Button
          variant="primary"
          title={t('tracking.pause')}
          hasBorder={true}
          icon={PauseIcon}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPausePress?.();
          }}
          delayLongPress={300}
        />
      )}
    </View>
  );
}

const makeStyles = (theme: AppTheme, insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 40 + insets.bottom,
      left: 16,
      right: 16,
      zIndex: 999,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24,
    },
    buttonWrapper: {
      flex: 1,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24,
    },
  });
