import Button from '@/components/button';
import ChoiceModal from '@/components/choiceModal';
import Divider from '@/components/divider';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useKeycloakAuth } from '@/hooks/useKeycloakAuth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, BackHandler, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function LoginScreenInner({ onRetry }: { onRetry: () => void }) {
  const { login, signUp, forgotPassword, isReady, discoveryError, retry } = useKeycloakAuth();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  //useTranslation! todo: check again!
  const { t } = useTranslation();

  const handleRetry = () => {
    retry();
    onRetry();
  };

  return (
    <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.hi}>{t('auth.header')}</Text>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/charted-logo-splash-no-text.png')} style={styles.logo} />
        </View>
        <Text style={styles.description}>{t('auth.description')}</Text>
      </View>

      <Divider />

      <View style={styles.bottomContainer}>
        <View style={styles.buttonsArea}>
          <View style={[styles.loadingRow, isReady && styles.hidden]}>
            <ActivityIndicator color={theme.auth.activityIndicator} size="small" />
            <Text style={styles.loadingText}>Connecting...</Text>
          </View>
          <View style={[styles.buttons, !isReady && styles.hidden]}>
            <Button variant="primary" title={t('auth.signIn')} onPress={login} />

            <Button variant="secondary" title={t('auth.signUp')} onPress={signUp} />

            <Button variant="quaternary" title={t('auth.forgotPassword')} onPress={forgotPassword} />
          </View>
        </View>
        <Text style={styles.disclaimer}>Secured by Keycloak SSO</Text>
      </View>

      {discoveryError && (
        <ChoiceModal
          title={t('auth.networkError.title')}
          onConfirm={handleRetry}
          description={t('auth.networkError.description')}
          onCancel={() => BackHandler.exitApp()}
          primaryLabel={t('auth.networkError.retry')}
          secondaryLabel={t('auth.networkError.exitApp')}
          onDismiss={() => {}}
        />
      )}
    </SafeAreaView>
  );
}

export default function LoginScreen() {
  const [mountKey, setMountKey] = useState(0);

  return <LoginScreenInner key={mountKey} onRetry={() => setMountKey((k) => k + 1)} />;
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.auth.background,
      paddingHorizontal: 16,
      paddingTop: 54,
    },
    buttonsArea: {
      gap: 12,
    },
    buttons: {
      gap: 12,
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 18,
    },
    hidden: {
      opacity: 0,
      position: 'absolute',
      pointerEvents: 'none',
    },
    topContainer: {
      gap: 16,
      flex: 1,
      marginBottom: 16,
    },
    logoContainer: {
      paddingTop: 16,
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: theme.defaultBorder,
      backgroundColor: theme.auth.logoContainerBackground,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    logo: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    hi: {
      ...typography.h1,
      color: theme.auth.title,
      paddingBottom: 16,
    },
    description: {
      ...typography.p1r,
      color: theme.auth.description,
      alignSelf: 'flex-end',
      maxWidth: 264,
      textAlign: 'right',
    },
    shadow: {
      shadowColor: theme.defaultBorder,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    bottomContainer: {
      gap: 12,
      marginTop: 32,
      marginBottom: 16,
    },
    // ios: {
    //   alignSelf: 'stretch',
    //   paddingBottom: Platform.OS === 'ios' ? 0 : 8,
    // },
    loadingText: {
      color: theme.defaultLabel,
      ...typography.l1m,
      fontSize: 14,
    },
    disclaimer: {
      ...typography.l3r,
      paddingTop: 32,
      color: theme.delicateBorder,
      textAlign: 'center',
    },
  });
