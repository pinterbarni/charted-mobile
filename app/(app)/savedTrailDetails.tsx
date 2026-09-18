import { StartIcon } from '@/assets/svgs/startIcon';
import { TrashBinIcon } from '@/assets/svgs/trashBinIcon';
import Button from '@/components/button';
import ChoiceModal from '@/components/choiceModal';
import HeaderShadowGradient from '@/components/headerShadowGradient';
import NavigateBackToMapButton from '@/components/navigateBackToMapButton';
import TrailMapPreview from '@/components/trailMapPreview';
import { ROUTES } from '@/constants/routes.constants';
import { AppTheme } from '@/constants/theme.constants';
import { typography } from '@/constants/typography.constants';
import { useAppTheme } from '@/contexts/themeContext';
import { useLocationStore } from '@/stores/localStore';
import { Poi } from '@/types/poi.types';
import { deleteGpxFile, parseGpxFile } from '@/utils/gpxStorage.utils';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function SavedTrailDetailsScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const { path, name } = useLocalSearchParams<{ path: string; name: string }>();
  console.log('Params:', { path, name }); // undefined/null early netter
  const [pois, setPois] = useState<Poi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const parsed = await parseGpxFile(path);
        console.log('GPX parsed pois:', JSON.stringify(parsed.pois));
        setPois(parsed.pois);
      } catch (e) {
        console.error('Failed to parse GPX:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [path]);

  const handleDelete = async () => {
    console.log('Deleting file at:', path);
    setShowDeleteConfirm(false);
    try {
      await deleteGpxFile(path);
      Toast.show({ type: 'success', text1: t('savedTrail.deleteSuccess'), position: 'top' });
      router.back();
    } catch (e) {
      console.warn(e);

      Toast.show({ type: 'error', text1: t('savedTrail.deleteError'), position: 'top' });
    }
  };

  const handleLoadToMap = () => {
    const coords = pois.map((p): [number, number] => [p.lon, p.lat]);
    console.log('Retrack coords:', coords); // lon/lat swap-check
    useLocationStore.getState().setRetrackRoute(coords, pois);
    router.replace(ROUTES.MAP);
  };

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
        <Text style={styles.title}>{name}</Text>
        <TrailMapPreview trackPoints={[]} pois={pois} size="fullWidthSquare" />
        <View style={styles.buttonContainer}>
          <Button
            iconPosition="right"
            title={t('savedTrail.loadToMap')}
            iconSize={14}
            variant="primary"
            icon={StartIcon}
            stretch
            textAlign="left"
            onPress={handleLoadToMap}
          />
          <Button
            stretch
            variant="tertiary"
            textAlign="left"
            iconPosition="right"
            title={t('savedTrail.delete')}
            iconSize={16}
            icon={TrashBinIcon}
            onPress={() => setShowDeleteConfirm(true)}
          />
        </View>
      </ScrollView>

      {showDeleteConfirm && (
        <ChoiceModal
          description={t('savedTrail.deleteDescription')}
          primaryLabel={t('savedTrail.deleteConfirm')}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          title={t('savedTrail.deleteTitle')}
          secondaryLabel={t('common.cancel')}
          onDismiss={() => setShowDeleteConfirm(false)}
        />
      )}
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
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.header.background,
    },
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: 16,
      gap: 16,
      paddingBottom: 120,
    },
    title: {
      ...typography.h2,
      color: theme.defaultTitle,
    },
    flex: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      backgroundColor: theme.defaultBackground,
      padding: 16,
      gap: 16,
      borderWidth: 1,
      borderColor: theme.delicateBorder,
      borderRadius: 16,
    },
  });
