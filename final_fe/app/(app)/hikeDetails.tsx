import { TrashBinIcon } from '@/assets/svgs/trashBinIcon';
import Button from '@/components/button';
import ChoiceModal from '@/components/choiceModal';
import HeaderShadowGradient from '@/components/headerShadowGradient';
import HikeMetricGauge from '@/components/hikeMetricGauge';
import NavigateBackToMapButton from '@/components/navigateBackToMapButton';
import { toastConfig } from '@/components/toastMessage';
import TrailMapPreview from '@/components/trailMapPreview';
import TrailOwner from '@/components/trailOwner';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { deleteTrail, getTrail } from '@/services/trail.service';
import { useAuthStore } from '@/stores/authStore';
import { Poi } from '@/types/poi.types';
import { Trail } from '@/types/trail.types';
import { router, useLocalSearchParams } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function HikeDetailsScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const tokens = useAuthStore((state) => state.tokens);
  const currentUserId = tokens?.accessToken ? jwtDecode<{ sub: string }>(tokens.accessToken).sub : null;
  const isOwnTrail = trail?.userId === currentUserId;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTrail(id);

        console.log('trail response:', JSON.stringify(data));

        setTrail(data);
      } catch (e) {
        console.error('Failed to load trail:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!id) return;
    setShowDeleteConfirm(false);
    try {
      await deleteTrail(id);

      Toast.show({ type: 'success', text1: t('trail.deleteSuccess'), position: 'top' });
      router.back();
    } catch (e) {
      console.log('Error: ' + e);
      Toast.show({ type: 'error', text1: t('trail.deleteError'), position: 'top' });
    }
  };

  // const handleRetrack = () => {
  //   if (!trail?.trackPoints || trail.trackPoints.length === 0) return;
  //   useLocationStore.getState().setRetrackRoute(
  //     trail.trackPoints.map((p): [number, number] => [p.lon, p.lat]),
  //     []
  //   );
  //   router.replace(ROUTES.MAP);
  // };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.map.loadingIndicator} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{trail?.title}</Text>
        <View style={styles.right}>
          {!isOwnTrail && <TrailOwner userId={trail?.userId ?? ''} username={trail?.ownerUsername ?? ''} />}
        </View>

        <View style={styles.gaugeContainer}>
          <HikeMetricGauge
            distanceKm={(trail?.distanceM ?? 0) / 1000}
            timeSeconds={trail?.durationS ?? 0}
            paceKmh={
              (trail?.durationS ?? 0) > 0
                ? (trail?.distanceM ?? 0) / 1000 / ((trail?.durationS ?? 0) / 3600)
                : 0
            }
            elevationM={trail?.elevationGainM ?? 0}
            variant="tracked"
          />
        </View>

        <TrailMapPreview
          trackPoints={trail?.trackPoints ?? []}
          pois={(trail?.pois ?? []) as Poi[]}
          size="banner"
        />
        {isOwnTrail && (
          <View style={styles.buttonContainer}>
            {/* <Button
              stretch
              variant="tertiary"
              textAlign="left"
              iconPosition="right"
              title={t('trail.retrack')}
              iconSize={16}
              icon={MapReturnIcon}
              onPress={handleRetrack}
            /> */}
            <Button
              stretch
              variant="tertiary"
              textAlign="left"
              iconPosition="right"
              title={t('trail.delete')}
              iconSize={16}
              icon={TrashBinIcon}
              onPress={() => setShowDeleteConfirm(true)}
            />
          </View>
        )}
      </ScrollView>
      {showDeleteConfirm && (
        <ChoiceModal
          title={t('trail.deleteTitle')}
          description={t('trail.deleteDescription')}
          primaryLabel={t('trail.deleteConfirm')}
          secondaryLabel={t('common.cancel')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
          onDismiss={() => setShowDeleteConfirm(false)}
        />
      )}
      <Toast config={toastConfig} />
      <NavigateBackToMapButton />
      <HeaderShadowGradient />
    </SafeAreaView>
  );
}

const makeStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 32,
      backgroundColor: theme.header.background,
    },
    buttonContainer: {
      backgroundColor: theme.defaultBackground,
      padding: 16,
      gap: 16,
      borderWidth: 1,
      borderColor: theme.delicateBorder,
      borderRadius: 16,
    },
    right: {
      alignItems: 'flex-end',
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.header.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      gap: 16,
      paddingBottom: 120,
    },
    title: {
      ...typography.h2,
      color: theme.defaultTitle,
    },
    gaugeContainer: {
      paddingVertical: 16,
    },
  });
