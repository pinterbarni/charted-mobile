import BackgroundLocationModal from '@/components/backgroundLocationModal';
import CannotLeaveAppModal from '@/components/cannotLeaveAppModal';
import ChoiceModal from '@/components/choiceModal';
import LocationDeniedModal from '@/components/locationDeniedModal';
import LocationPermissionModal from '@/components/locationPermissionModal';
import NotificationPermissionModal from '@/components/notificationPermissionModal';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

type ModalHandlers = {
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
};

type Props = {
  locationPermission: ModalHandlers & { show: boolean };
  notificationPermission: ModalHandlers & { show: boolean };
  backgroundLocation: ModalHandlers & { show: boolean };
  locationDenied: ModalHandlers & { show: boolean };
  cannotLeave: ModalHandlers & { show: boolean };
  cancelPlanning: ModalHandlers & { show: boolean };
};

export default function MapModals({
  locationPermission,
  notificationPermission,
  backgroundLocation,
  locationDenied,
  cannotLeave,
  cancelPlanning,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      {locationPermission.show && (
        <LocationPermissionModal
          onDismiss={locationPermission.onDismiss}
          onCancel={locationPermission.onCancel}
          onConfirm={locationPermission.onConfirm}
        />
      )}
      {notificationPermission.show && (
        <NotificationPermissionModal
          onDismiss={notificationPermission.onDismiss}
          onCancel={notificationPermission.onCancel}
          onConfirm={notificationPermission.onConfirm}
        />
      )}
      {backgroundLocation.show && (
        <BackgroundLocationModal
          onDismiss={backgroundLocation.onDismiss}
          onCancel={backgroundLocation.onCancel}
          onConfirm={backgroundLocation.onConfirm}
        />
      )}
      {locationDenied.show && (
        <LocationDeniedModal
          onDismiss={locationDenied.onDismiss}
          onCancel={locationDenied.onCancel}
          onConfirm={locationDenied.onConfirm}
        />
      )}
      {cannotLeave.show && (
        <CannotLeaveAppModal
          onDismiss={cannotLeave.onDismiss}
          onCancel={cannotLeave.onCancel}
          onConfirm={cannotLeave.onConfirm}
        />
      )}
      {cancelPlanning.show && (
        <ChoiceModal
          onDismiss={cancelPlanning.onDismiss}
          onCancel={cancelPlanning.onCancel}
          onConfirmLongPress={cancelPlanning.onConfirm}
          confirmDelayLongPress={600}
          onConfirm={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          title={t('planning.cancelTitle')}
          description={t('planning.cancelDescription')}
          primaryLabel={t('planning.cancelProceed')}
          secondaryLabel={t('planning.cancelKeep')}
        />
      )}
    </>
  );
}
