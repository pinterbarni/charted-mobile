import { UnitOfMeasurementSystem } from '@/utils/unitsOfMeasurement.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ColorTheme = 'light' | 'dark';

type SettingsState = {
  unitOfMeasurementSystem: UnitOfMeasurementSystem;
  setUnitOfMeasurementSystem: (unit: UnitOfMeasurementSystem) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  automaticTheme: boolean;
  setAutomaticTheme: (automatic: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      unitOfMeasurementSystem: 'metric',
      setUnitOfMeasurementSystem: (unitOfMeasurementSystem) => set({ unitOfMeasurementSystem }),
      colorTheme: 'light',
      setColorTheme: (colorTheme) => set({ colorTheme }),
      automaticTheme: true,
      setAutomaticTheme: (automaticTheme) => set({ automaticTheme }),
    }),
    {
      name: 'charted-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
