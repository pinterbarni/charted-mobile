import { useLocationStore } from '@/stores/localStore';
import { useState } from 'react';

type Props = {
  onDone?: () => void;
};

export const usePlanningControls = ({ onDone }: Props = {}) => {
  const [showCancelPlanningModal, setShowCancelPlanningModal] = useState(false);

  const { startPlanning, stopPlanning } = useLocationStore();
  const isPlanning = useLocationStore((state) => state.isPlanning);

  const handlePlanningCancel = () => setShowCancelPlanningModal(true);
  const handleCreateTrailPress = () => startPlanning();

  const handlePlanningCancelConfirm = () => {
    setShowCancelPlanningModal(false);
    useLocationStore.setState((state) => ({
      metrics: { ...state.metrics, pois: [] },
    }));
    stopPlanning();
  };

  const handlePlanningDone = () => {
    const pois = useLocationStore.getState().metrics.pois;
    if (pois.length === 0) {
      stopPlanning();
      return;
    }
    onDone?.(); //call if not undefined or null! so it's optional
  };

  return {
    showCancelPlanningModal,
    isPlanning,
    handlePlanningCancelConfirm,
    handleCreateTrailPress,
    handlePlanningDone,
    handlePlanningCancel,

    dismissCancelPlanningModal: () => setShowCancelPlanningModal(false),
  };
};
