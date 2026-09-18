import { create } from 'zustand';

export type ApiErrorType = 'network' | 'unauthorized' | 'server' | null;

type ErrorState = {
  error: ApiErrorType;

  setError: (error: ApiErrorType) => void;
  clearError: () => void;
};

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
