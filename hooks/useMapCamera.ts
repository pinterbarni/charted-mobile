import { useLocationStore } from '@/stores/localStore';
import { CameraRef, LocationManager, useCurrentPosition } from '@maplibre/maplibre-react-native';
import { useEffect, useRef, useState } from 'react';

export const useMapCamera = () => {
  const cameraRef = useRef<CameraRef>(null);
  const coordsRef = useRef<{ longitude: number; latitude: number } | null>(null);
  const hasInitializedCamera = useRef(false);
  const mapLoadedRef = useRef(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mapFullyLoaded, setMapFullyLoaded] = useState(false);

  const retrackRoute = useLocationStore((state) => state.retrackRoute);
  const isRetracking = useLocationStore((state) => state.isRetracking);

  useEffect(() => {
    LocationManager.start();
  }, []);

  const position = useCurrentPosition();
  useEffect(() => {
    if (!position) return;
    coordsRef.current = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    };
    useLocationStore.getState().updateCoords({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      heading: position.coords.heading ?? null,
      accuracy: position.coords.accuracy,
    });
    if (mapLoadedRef.current && !hasInitializedCamera.current) {
      hasInitializedCamera.current = true;
      cameraRef.current?.easeTo({
        center: [position.coords.longitude, position.coords.latitude],
        duration: 500,
      });
    }
    setCameraReady(true);
  }, [position]);

  useEffect(() => {
    if (!retrackRoute || retrackRoute.length < 1) return;
    if (!cameraReady) return;

    const longitudes = retrackRoute.map((c) => c[0]);
    const latitudes = retrackRoute.map((c) => c[1]);

    if (retrackRoute.length === 1) {
      cameraRef.current?.easeTo({
        center: [longitudes[0], latitudes[0]],
        zoom: 14,
        duration: 500,
      });
      return;
    }

    const ne: [number, number] = [Math.max(...longitudes), Math.max(...latitudes)];
    const sw: [number, number] = [Math.min(...longitudes), Math.min(...latitudes)];
    cameraRef.current?.fitBounds([sw[0], sw[1], ne[0], ne[1]], {
      padding: { top: 80, right: 80, bottom: 80, left: 80 },
      duration: 500,
    });
    console.log('@@@ fitB | ne:', ne, 'sw:', sw);
  }, [retrackRoute, cameraReady, isRetracking]);

  const handleMapLoaded = () => {
    console.log('# mapLoad ded c:', !!coordsRef.current, 'init:', hasInitializedCamera.current);
    mapLoadedRef.current = true;
    setMapFullyLoaded(true);
    if (coordsRef.current && !hasInitializedCamera.current) {
      hasInitializedCamera.current = true;
      cameraRef.current?.easeTo({
        center: [coordsRef.current.longitude, coordsRef.current.latitude],
        duration: 500,
      });
      setCameraReady(true);
    } else {
      setTimeout(() => setCameraReady(true), 3000);
    }
  };

  const handleRecenter = () => {
    if (!coordsRef.current) return;
    cameraRef.current?.easeTo({
      center: [coordsRef.current.longitude, coordsRef.current.latitude],
      bearing: 0,
      duration: 300,
    });
    setTimeout(() => {
      cameraRef.current?.easeTo({
        center: [coordsRef.current!.longitude, coordsRef.current!.latitude],
        bearing: 0,
        duration: 400,
      });
    }, 300);
  };
  return {
    cameraRef,
    coordsRef,
    mapLoadedRef,
    cameraReady,
    mapFullyLoaded,
    position,
    handleMapLoaded,
    handleRecenter,
  };
};
