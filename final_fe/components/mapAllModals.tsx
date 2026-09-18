import ChoiceModal from '@/components/choiceModal';
import HikeReviewModal from '@/components/hikeReviewModal';
import MapModals from '@/components/mapModals';
import { useLocationStore } from '@/stores/localStore';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

//todo: rename, not all modals, OR DELETE or SEGMENT because it's confusing
type Props = {
  location: any;
  notification: any;
  showCancelPlanningModal: boolean;
  showCancelRetrackModal: boolean;
  showLocationModal: boolean;
  showDeniedModal: boolean;
  showCannotLeaveModal: boolean;
  showForegroundModal: boolean;
  showHikeReviewModal: boolean;
  stopTracking: () => void;
  isPlanning: boolean;
  onLocationConfirm: () => void;
  onDeniedCancel: () => void;
  onForegroundCancel: () => void;
  onForegroundDismiss: () => void;
  onDeniedConfirm: () => void;
  handlePlanningCancelConfirm: () => void;
  handleResumePress: () => void;
  onDeniedDismiss: () => void;
  onCannotLeaveConfirm: () => void;
  onCannotLeaveCancel: () => void;
  onCannotLeaveDismiss: () => void;
  dismissCancelPlanningModal: () => void;
  onLocationCancel: () => void;
  onLocationDismiss: () => void;
  onForegroundConfirm: () => void;
  handleFinishPress: () => void;
  setShowHikeReviewModal: (v: boolean) => void;
  setShowCancelRetrackModal: (v: boolean) => void;
  clearRetrackRoute: () => void;
};

export default function MapAllModals({
  location,
  notification,
  showLocationModal,
  showDeniedModal,
  showCannotLeaveModal,
  showForegroundModal,
  showHikeReviewModal,
  showCancelPlanningModal,
  showCancelRetrackModal,
  isPlanning,
  onLocationConfirm,
  stopTracking,
  handlePlanningCancelConfirm,
  onDeniedDismiss,
  setShowHikeReviewModal,
  setShowCancelRetrackModal,
  onLocationCancel,
  onCannotLeaveConfirm,
  onCannotLeaveCancel,
  handleResumePress,
  handleFinishPress,
  onDeniedConfirm,
  onDeniedCancel,
  onForegroundConfirm,
  onForegroundCancel,
  onForegroundDismiss,
  onCannotLeaveDismiss,
  dismissCancelPlanningModal,
  onLocationDismiss,
  clearRetrackRoute,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <MapModals
        locationPermission={{
          show: location.showModal || showForegroundModal,
          onDismiss: location.showModal ? location.onDismiss : onForegroundDismiss,
          onCancel: location.showModal ? location.onCancel : onForegroundCancel,
          onConfirm: location.showModal ? location.onConfirm : onForegroundConfirm,
        }}
        notificationPermission={{
          show: notification.showModal,
          onDismiss: notification.onDismiss,
          onCancel: notification.onCancel,
          onConfirm: notification.onConfirm,
        }}
        backgroundLocation={{
          show: showLocationModal,
          onDismiss: onLocationDismiss,
          onCancel: onLocationCancel,
          onConfirm: onLocationConfirm,
        }}
        locationDenied={{
          show: showDeniedModal,
          onDismiss: onDeniedDismiss,
          onCancel: onDeniedCancel,
          onConfirm: onDeniedConfirm,
        }}
        cannotLeave={{
          show: showCannotLeaveModal,
          onDismiss: onCannotLeaveDismiss,
          onCancel: onCannotLeaveCancel,
          onConfirm: onCannotLeaveConfirm,
        }}
        cancelPlanning={{
          show: showCancelPlanningModal,
          onDismiss: dismissCancelPlanningModal,
          onCancel: dismissCancelPlanningModal,
          onConfirm: handlePlanningCancelConfirm,
        }}
      />
      <HikeReviewModal
        visible={showHikeReviewModal}
        onFinish={() => {
          handleFinishPress();
          if (isPlanning) useLocationStore.getState().stopPlanning();
          Toast.show({
            type: 'success',
            text1: t('hikeReview.saveSuccess'),
            position: 'top',
          });
        }}
        onResume={handleResumePress}
        onBack={() => setShowHikeReviewModal(false)}
        mode={isPlanning ? 'planning' : 'tracking'}
      />
      {showCancelRetrackModal && (
        <ChoiceModal
          secondaryLabel={t('common.cancel')}
          onCancel={() => setShowCancelRetrackModal(false)}
          onDismiss={() => setShowCancelRetrackModal(false)}
          onConfirm={() => {
            setShowCancelRetrackModal(false);
            clearRetrackRoute();
            stopTracking();
          }}
          title={t('retrack.cancelTitle')}
          description={t('retrack.cancelDescription')}
          primaryLabel={t('retrack.cancelConfirm')}
        />
      )}
    </>
  );
}
