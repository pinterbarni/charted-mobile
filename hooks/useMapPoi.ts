import { useLocationStore } from '@/stores/localStore';
import BottomSheet from '@gorhom/bottom-sheet';
import { MapRef } from '@maplibre/maplibre-react-native';
import { RefObject, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  mapRef: RefObject<MapRef | null>;
  bottomSheetRef: RefObject<BottomSheet | null>;
};

export const useMapPoi = ({ mapRef, bottomSheetRef }: Props) => {
  const [showPoiLocationPicker, setShowPoiLocationPicker] = useState(false);
  const [pendingPoiCoords, setPendingPoiCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [showPoiPicker, setShowPoiPicker] = useState(false);

  const handlePoiLocationConfirm = (lat: number, lon: number) => {
    setPendingPoiCoords({ lat, lon });
    setShowPoiLocationPicker(false);
    setShowPoiPicker(true);
  };

  const handlePoiSelect = (category: any) => {
    if (!pendingPoiCoords) return;
    useLocationStore.getState().addPoi({
      id: uuidv4(),
      lat: pendingPoiCoords.lat,
      lon: pendingPoiCoords.lon,
      category,
    });
    setShowPoiPicker(false);
    setShowPoiLocationPicker(false);
    setPendingPoiCoords(null);
    bottomSheetRef.current?.expand();
  };

  const handleAddPoi = async () => {
    const center = await mapRef.current?.getCenter();
    if (center) setPendingPoiCoords({ lat: center[1], lon: center[0] });
    bottomSheetRef.current?.collapse();
    setShowPoiLocationPicker(true);
  };

  const handlePoiPickerDismiss = () => {
    setShowPoiPicker(false);
    setShowPoiLocationPicker(false);
    setPendingPoiCoords(null);
    bottomSheetRef.current?.expand();
  };

  const handlePoiLocationDismiss = () => {
    setShowPoiLocationPicker(false);
    bottomSheetRef.current?.expand();
  };

  return {
    handleAddPoi,
    handlePoiLocationConfirm,
    handlePoiLocationDismiss,
    handlePoiPickerDismiss,
    handlePoiSelect,
    showPoiLocationPicker,
    showPoiPicker,
    pendingPoiCoords,
  };
};
