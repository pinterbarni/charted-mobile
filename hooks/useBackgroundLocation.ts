import { FooterState } from '@/components/mapScreenFooter';
import { useLocationStore } from '@/stores/localStore';
import { useMapLocationPermissions } from './useMapLocationPermissions';
import { usePlanningControls } from './usePlanningControls';
import { useTrackingControls } from './useTrackingControls';

type Props = {
  queueDone?: boolean;
};

export const useBackgroundLocation = ({ queueDone = false }: Props = {}) => {
  const permissions = useMapLocationPermissions({ queueDone });

  const tracking = useTrackingControls();
  const planning = usePlanningControls({
    onDone: () => tracking.setShowHikeReviewModal(true),
  });
  const isTracking = useLocationStore((state) => state.isTracking);
  const isPaused = useLocationStore((state) => state.isPaused);
  const isPlanning = useLocationStore((state) => state.isPlanning);
  const hasLocation = useLocationStore((state) => state.coords !== null);

  const footerState: FooterState = isPaused
    ? 'paused'
    : isTracking
      ? 'tracking'
      : isPlanning
        ? 'done'
        : 'idle';

  //TODO MOVE IT OUT OF HERE! FOOTER STATE IS CORE LOGIC. REFACTOR NEEDED
  console.log(
    '// footerState:',
    footerState,
    '| tracking:',
    isTracking,
    'paused:',
    isPaused,
    'planning:',
    isPlanning
  );

  return {
    // permissions
    showModal: permissions.showModal,
    showDeniedModal: permissions.showDeniedModal,
    showCannotLeaveModal: permissions.showCannotLeaveModal,
    showForegroundModal: permissions.showForegroundModal,
    isForegroundDenied: permissions.isForegroundDenied,
    handleStartPress: permissions.handleStartPress,
    onForegroundDismiss: permissions.onForegroundDismiss,
    onDeniedDismiss: permissions.onDeniedDismiss,
    onCannotLeaveConfirm: permissions.onCannotLeaveConfirm,
    onConfirm: permissions.onConfirm,
    onCancel: permissions.onCancel,
    onDismiss: permissions.onDismiss,
    onDeniedConfirm: permissions.onDeniedConfirm,
    onForegroundCancel: permissions.onForegroundCancel,
    onCannotLeaveCancel: permissions.onCannotLeaveCancel,
    onDeniedCancel: permissions.onDeniedCancel,
    onForegroundConfirm: permissions.onForegroundConfirm,
    onCannotLeaveDismiss: permissions.onCannotLeaveDismiss,

    // tracking
    showHikeReviewModal: tracking.showHikeReviewModal,
    handlePausePress: tracking.handlePausePress,
    handleResumePress: tracking.handleResumePress,
    handleFinishPress: tracking.handleFinishPress,
    stopTracking: tracking.stopTracking,
    setShowHikeReviewModal: tracking.setShowHikeReviewModal,

    // planning
    showCancelPlanningModal: planning.showCancelPlanningModal,
    handleCreateTrailPress: planning.handleCreateTrailPress,
    handlePlanningCancel: planning.handlePlanningCancel,
    handlePlanningCancelConfirm: planning.handlePlanningCancelConfirm,
    handlePlanningDone: planning.handlePlanningDone,
    dismissCancelPlanningModal: planning.dismissCancelPlanningModal,

    // derived
    footerState,
    hasLocation,
    isPlanning,
    isTracking,
    isPaused,
  };
};
