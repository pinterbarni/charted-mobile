import {
  CLIENT_ID,
  KEYCLOAK_SCOPES,
  KEYCLOAK_URL,
  REDIRECT_PATH,
  REDIRECT_SCHEME,
} from '@/constants/keycloak.constants';
import { exchangeCodeForTokens, exchangeCodeWithoutPKCE, revokeToken } from '@/services/keycloakService';
import { useAuthStore } from '@/stores/authStore';
import { AuthStatus } from '@/types/auth.types';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import * as PKCE from 'expo-auth-session/src/PKCE';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useRef, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

const DISCOVERY_TIMEOUT_MS = 8000;

export function useKeycloakAuth() {
  const { signIn, signOut, status, tokens } = useAuthStore();
  const [discoveryError, setDiscoveryError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const discovery = useAutoDiscovery(KEYCLOAK_URL);

  const redirectUri = makeRedirectUri({
    scheme: REDIRECT_SCHEME,
    path: REDIRECT_PATH,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [...KEYCLOAK_SCOPES],
      redirectUri,
    },
    discovery
  );

  const hasExchanged = useRef(false);

  useEffect(() => {
    if (discovery) {
      setDiscoveryError(false);
      return;
    }
    const timer = setTimeout(() => {
      if (!discovery) {
        console.warn('#### discovery timeout hit after', DISCOVERY_TIMEOUT_MS, 'ms');
        setDiscoveryError(true);
      }
    }, DISCOVERY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [discovery, retryCount]);

  useEffect(() => {
    if (response?.type !== 'success') return;
    if (hasExchanged.current) {
      return;
    }
    hasExchanged.current = true;

    exchangeCodeForTokens(response.params.code, redirectUri, request!.codeVerifier!)
      .then((tokens) => {
        return signIn(tokens);
      })
      .catch((err) => console.error('AUTH Token exchange fld:', err));
  }, [response, signIn, redirectUri, request]);

  const login = async () => {
    if (!request) {
      console.warn('AUTH Not ready');
      return;
    }
    try {
      await promptAsync();
    } catch (err) {
      console.error('AUTH login fld:', err);
    }
  };

  const signUp = async () => {
    const { codeVerifier, codeChallenge } = await PKCE.buildCodeAsync(43);
    console.log('## PKCE built');

    const url = `${KEYCLOAK_URL}/protocol/openid-connect/registrations?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

    if (result.type === 'success') {
      const code = new URL(result.url).searchParams.get('code');
      if (code) {
        try {
          const tokens = await exchangeCodeForTokens(code, redirectUri, codeVerifier);
          await signIn(tokens);
        } catch (err) {
          console.error('AUTH signup token exc fld:', err);
        }
      }
    }
  };

  const forgotPassword = async () => {
    console.log('# forgotPw called');
    const url = `${KEYCLOAK_URL}/login-actions/reset-credentials?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
    console.log('## forgotPw browser result type:', result.type);

    if (result.type === 'success' && result.url) {
      const code = new URL(result.url).searchParams.get('code');
      console.log('### forgotPw got :', !!code);
      if (code) {
        try {
          const tokens = await exchangeCodeWithoutPKCE(code, redirectUri);
          console.log('#### forgotPw token exc suc s');
          await signIn(tokens);
        } catch (err) {
          console.error('AUTH Forgot pw token exchange fail:', err);
        }
      }
    }
  };

  const logout = async () => {
    try {
      await revokeToken(tokens?.refreshToken ?? '');
    } catch (err) {
      console.error('AUTH out failed:', err);
    } finally {
      await signOut();
    }
  };

  const retry = () => {
    console.log('/ retry called, retry cnt: ', retryCount);
    setDiscoveryError(false);
    setRetryCount((c) => c + 1);
  };

  return {
    login,
    signUp,
    forgotPassword,
    logout,
    isReady: !!request && !!discovery,
    isAuthenticated: status === AuthStatus.Authenticated,
    isLoading: status === AuthStatus.Loading,
    discoveryError,
    retry,
  };
}
