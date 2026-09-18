import { CLIENT_ID, KEYCLOAK_ENDPOINTS, KEYCLOAK_HTTP } from '@/constants/keycloak.constants';
import { AuthTokens } from '@/types/auth.types';

export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<AuthTokens> {
  const res = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
    method: KEYCLOAK_HTTP.METHOD,
    headers: { [KEYCLOAK_HTTP.HEADER]: KEYCLOAK_HTTP.CONTENT_TYPE },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  });

  const data = await res.json();

  // 200 always!
  if (!data.access_token || !data.refresh_token) {
    throw new Error(data.error_description ?? 'Token exchange failed');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
  };
}

// kills the ses on kc-side
export async function revokeToken(refreshToken: string): Promise<void> {
  /*const res = */ await fetch(KEYCLOAK_ENDPOINTS.LOGOUT, {
    method: KEYCLOAK_HTTP.METHOD,
    headers: { [KEYCLOAK_HTTP.HEADER]: KEYCLOAK_HTTP.CONTENT_TYPE },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }).toString(),
  });
  // console.log('/revoke', res.ok, 'stat:', res.status);
}
// silent - on expire
export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const res = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
    method: KEYCLOAK_HTTP.METHOD,
    headers: { [KEYCLOAK_HTTP.HEADER]: KEYCLOAK_HTTP.CONTENT_TYPE },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }).toString(),
  });

  const data = await res.json();

  if (!data.access_token || !data.refresh_token) {
    throw new Error(data.error_description ?? 'Token refresh failed');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
  };
}

// forgot pw flow skips pkce. for login
export async function exchangeCodeWithoutPKCE(code: string, redirectUri: string): Promise<AuthTokens> {
  const res = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
    method: KEYCLOAK_HTTP.METHOD,
    headers: { [KEYCLOAK_HTTP.HEADER]: KEYCLOAK_HTTP.CONTENT_TYPE },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });

  const data = await res.json();

  if (!data.access_token || !data.refresh_token) {
    throw new Error(data.error_description ?? 'Token exchange failed');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
  };
}
