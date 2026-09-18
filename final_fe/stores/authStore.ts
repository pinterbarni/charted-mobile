import { SECURE_STORE_KEYS as KEYS } from '@/constants/auth.constants';
import { AuthStatus, AuthTokens } from '@/types/auth.types';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

interface AuthState {
  // Note: 'loading' = app just opened, checking SecureStore
  status: AuthStatus;
  tokens: AuthTokens | null;

  hydrate: () => Promise<void>;
  signIn: (tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: AuthStatus.Loading,
  tokens: null,

  hydrate: async () => {
    console.log('authST hydrate called');
    try {
      const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
      const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);

      const idToken = await SecureStore.getItemAsync(KEYS.ID_TOKEN);

      console.log('authST tokens:', {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        idToken: !!idToken,
      });

      // idToken is opt, only kc sends sometimes
      if (accessToken && refreshToken) {
        console.log('authST hydra -> Authenticated');
        set({
          status: AuthStatus.Authenticated,
          tokens: { accessToken, refreshToken, idToken: idToken ?? undefined },
        });
      } else {
        console.log('authST hydra --> Unauthenticated (missing tokens)');
        set({ status: AuthStatus.Unauthenticated, tokens: null });
      }
    } catch (e) {
      // sec store fails on emulator sometimes, not real issue
      console.warn('authST hydra err:', e);
      set({ status: AuthStatus.Unauthenticated, tokens: null });
    }
  },

  signIn: async (tokens: AuthTokens) => {
    console.log('#### signin cd');
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, tokens.accessToken);
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, tokens.refreshToken);
    if (tokens.idToken) {
      await SecureStore.setItemAsync(KEYS.ID_TOKEN, tokens.idToken);
    }
    console.log('#### signIn checked, Authenticated');
    set({ status: AuthStatus.Authenticated, tokens });
  },

  signOut: async () => {
    console.log('# signOut cd');
    await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(KEYS.ID_TOKEN);
    console.log('## tokens cleared, status is unauthed');
    set({ status: AuthStatus.Unauthenticated, tokens: null });
  },

  getAccessToken: () => {
    const token = get().tokens?.accessToken ?? null;
    console.log('authST getAccessTok:', token ? 'present' : 'null');
    return token;
  },
}));

export const hydrateAuth = () => {
  console.log('authST hydrateAuth trigger');
  return useAuthStore.getState().hydrate();
};
