import { useLocationStore } from '@/stores/localStore';
import { LocationManager } from '@maplibre/maplibre-react-native';
import { useState } from 'react';

export const useTrackingControls = () => {
  const [showHikeReviewModal, setShowHikeReviewModal] = useState(false);
  const { pauseTracking, resumeTracking, stopTracking } = useLocationStore();

  const isTracking = useLocationStore((state) => state.isTracking);
  const isPaused = useLocationStore((state) => state.isPaused);

  const handlePausePress = () => {
    pauseTracking();

    console.log('uTC paused');
    LocationManager.stop();
    setShowHikeReviewModal(true);
  };

  const handleResumePress = () => {
    LocationManager.start();
    resumeTracking();
    console.log('uTC resumed');

    setShowHikeReviewModal(false);
  };

  const handleFinishPress = () => {
    LocationManager.start();
    stopTracking();

    console.log('uTC stopped');
    setShowHikeReviewModal(false);
  };

  return {
    showHikeReviewModal,
    setShowHikeReviewModal,
    isTracking,
    isPaused,
    handlePausePress,
    handleResumePress,
    handleFinishPress,
    stopTracking,
  };
};

//todo: move here additional logic for hike tracking!
